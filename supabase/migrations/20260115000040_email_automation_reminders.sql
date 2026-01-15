-- =====================================================
-- EMAIL AUTOMATION & REMINDERS
-- =====================================================

-- Templates de Email
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Asunto y cuerpo
    subject VARCHAR(500) NOT NULL,
    html_body TEXT NOT NULL,
    plain_body TEXT,
    
    -- Variables disponibles
    variables JSONB, -- ["{{customerName}}", "{{invoiceNumber}}", etc.]
    
    -- Adjuntos
    include_pdf BOOLEAN DEFAULT FALSE,
    pdf_type VARCHAR(50), -- 'INVOICE', 'QUOTE', 'RECEIPT'
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Email Queue / Historial de envíos
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Template usado
    template_id UUID REFERENCES email_templates(id),
    
    -- Destinatario
    to_email VARCHAR(200) NOT NULL,
    to_name VARCHAR(200),
    cc_emails TEXT[], -- Array de emails
    bcc_emails TEXT[],
    
    -- Contenido (ya procesado)
    subject VARCHAR(500) NOT NULL,
    html_body TEXT NOT NULL,
    plain_body TEXT,
    
    -- Adjuntos
    attachments JSONB, -- [{"filename": "invoice.pdf", "url": "..."}]
    
    -- Referencia
    reference_type VARCHAR(50), -- 'INVOICE', 'QUOTE', 'PAYMENT'
    reference_id UUID,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENDING', 'SENT', 'FAILED', 'BOUNCED')),
    
    -- Intentos
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    
    -- Resultado
    sent_at TIMESTAMP,
    failed_at TIMESTAMP,
    error_message TEXT,
    
    -- Provider response
    provider VARCHAR(50), -- 'SendGrid', 'SES', 'SMTP'
    provider_message_id VARCHAR(200),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Configuración de Email Automático
CREATE TABLE IF NOT EXISTS email_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    
    -- Trigger
    trigger_event VARCHAR(50) NOT NULL, -- 'INVOICE_CREATED', 'PAYMENT_RECEIVED', etc.
    
    -- Condiciones
    conditions JSONB, -- {"invoice.total": {">": 1000}}
    
    -- Template a usar
    template_id UUID REFERENCES email_templates(id),
    
    -- Destinatarios
    send_to VARCHAR(50) DEFAULT 'CUSTOMER' CHECK (send_to IN ('CUSTOMER', 'SALESPERSON', 'CUSTOM', 'ALL')),
    custom_emails TEXT[],
    
    -- Delay
    delay_minutes INTEGER DEFAULT 0,
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============ RECORDATORIOS ============

CREATE TABLE IF NOT EXISTS reminder_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    
    -- Tipo de recordatorio
    reminder_type VARCHAR(50) NOT NULL CHECK (reminder_type IN (
        'PAYMENT_DUE_SOON',
        'PAYMENT_OVERDUE',
        'NCF_EXPIRING',
        'LOW_STOCK',
        'QUOTE_EXPIRING',
        'APPROVAL_PENDING'
    )),
    
    -- Configuración
    days_before INTEGER, -- Para recordatorios "antes de"
    days_after INTEGER,  -- Para recordatorios "después de"
    
    -- Template de email
    template_id UUID REFERENCES email_templates(id),
    
    -- Canales
    send_email BOOLEAN DEFAULT TRUE,
    send_whatsapp BOOLEAN DEFAULT FALSE,
    send_notification BOOLEAN DEFAULT TRUE,
    
    -- Frecuencia
    frequency VARCHAR(20) DEFAULT 'ONCE' CHECK (frequency IN ('ONCE', 'DAILY', 'WEEKLY')),
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Recordatorios enviados (log)
CREATE TABLE IF NOT EXISTS reminders_sent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES reminder_schedules(id),
    
    -- Referencia
    reference_type VARCHAR(50),
    reference_id UUID,
    
    -- Destinatario
    sent_to VARCHAR(200),
    
    -- Canal usado
    channel VARCHAR(20) CHECK (channel IN ('EMAIL', 'WHATSAPP', 'NOTIFICATION')),
    
    -- Resultado
    status VARCHAR(20) DEFAULT 'SENT' CHECK (status IN ('SENT', 'FAILED')),
    error_message TEXT,
    
    sent_at TIMESTAMP DEFAULT NOW()
);

-- ============ NOTIFICACIONES IN-APP ============

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Usuario destinatario
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Contenido
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(50), -- 'invoice', 'payment', 'alert', etc.
    
    -- Tipo
    notification_type VARCHAR(50) NOT NULL,
    
    -- Referencia
    reference_type VARCHAR(50),
    reference_id UUID,
    
    -- Estado
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Acción
    action_url TEXT,
    action_label VARCHAR(100),
    
    -- Prioridad
    priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============ ÍNDICES ============

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_reference ON email_queue(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_reminders_sent_reference ON reminders_sent(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read, created_at);

-- ============ FUNCIONES ============

-- Función: Crear email automático al emitir factura
CREATE OR REPLACE FUNCTION queue_invoice_email()
RETURNS TRIGGER AS $$
DECLARE
    template_record RECORD;
    customer_record RECORD;
    email_body TEXT;
    email_subject TEXT;
BEGIN
    -- Solo si la factura fue emitida
    IF NEW.status = 'ISSUED' AND OLD.status != 'ISSUED' THEN
        
        -- Obtener template de factura
        SELECT * INTO template_record
        FROM email_templates
        WHERE code = 'INVOICE_ISSUED' AND active = TRUE
        LIMIT 1;
        
        IF template_record.id IS NOT NULL THEN
            -- Obtener datos del cliente
            SELECT * INTO customer_record
            FROM customers
            WHERE id = NEW.customer_id;
            
            -- Reemplazar variables (simplificado)
            email_subject := REPLACE(template_record.subject, '{{invoiceNumber}}', NEW.invoice_number);
            email_subject := REPLACE(email_subject, '{{customerName}}', customer_record.name);
            
            email_body := REPLACE(template_record.html_body, '{{invoiceNumber}}', NEW.invoice_number);
            email_body := REPLACE(email_body, '{{customerName}}', customer_record.name);
            email_body := REPLACE(email_body, '{{total}}', NEW.total::TEXT);
            email_body := REPLACE(email_body, '{{dueDate}}', NEW.due_date::TEXT);
            
            -- Encolar email
            INSERT INTO email_queue (
                template_id,
                to_email,
                to_name,
                subject,
                html_body,
                reference_type,
                reference_id,
                attachments
            ) VALUES (
                template_record.id,
                customer_record.email,
                customer_record.name,
                email_subject,
                email_body,
                'INVOICE',
                NEW.id,
                jsonb_build_array(
                    jsonb_build_object(
                        'type', 'PDF',
                        'filename', NEW.invoice_number || '.pdf'
                    )
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invoice_email
    AFTER UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION queue_invoice_email();

-- Función: Verificar facturas próximas a vencer
CREATE OR REPLACE FUNCTION check_upcoming_invoice_due_dates()
RETURNS INTEGER AS $$
DECLARE
    invoice_record RECORD;
    reminder_record RECORD;
    count INTEGER := 0;
BEGIN
    -- Obtener configuración de recordatorios
    FOR reminder_record IN
        SELECT * FROM reminder_schedules
        WHERE reminder_type = 'PAYMENT_DUE_SOON'
          AND active = TRUE
    LOOP
        -- Buscar facturas que vencen en X días
        FOR invoice_record IN
            SELECT i.*, c.email, c.name as customer_name
            FROM invoices i
            JOIN customers c ON c.id = i.customer_id
            WHERE i.status = 'ISSUED'
              AND i.balance > 0
              AND i.due_date = CURRENT_DATE + reminder_record.days_before
              AND NOT EXISTS (
                  SELECT 1 FROM reminders_sent rs
                  WHERE rs.reference_id = i.id
                    AND rs.schedule_id = reminder_record.id
                    AND rs.sent_at::DATE = CURRENT_DATE
              )
        LOOP
            -- Encolar email de recordatorio
            IF reminder_record.send_email THEN
                INSERT INTO email_queue (
                    template_id,
                    to_email,
                    to_name,
                    subject,
                    html_body,
                    reference_type,
                    reference_id
                )
                SELECT
                    reminder_record.template_id,
                    invoice_record.email,
                    invoice_record.customer_name,
                    REPLACE(et.subject, '{{invoiceNumber}}', invoice_record.invoice_number),
                    REPLACE(REPLACE(et.html_body, '{{invoiceNumber}}', invoice_record.invoice_number), '{{dueDate}}', invoice_record.due_date::TEXT),
                    'INVOICE',
                    invoice_record.id
                FROM email_templates et
                WHERE et.id = reminder_record.template_id;
                
                -- Registrar recordatorio enviado
                INSERT INTO reminders_sent (schedule_id, reference_type, reference_id, sent_to, channel)
                VALUES (reminder_record.id, 'INVOICE', invoice_record.id, invoice_record.email, 'EMAIL');
                
                count := count + 1;
            END IF;
        END LOOP;
    END LOOP;
    
    RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Función: Procesar cola de emails (llamar desde cron/n8n)
CREATE OR REPLACE FUNCTION process_email_queue(batch_size INTEGER DEFAULT 50)
RETURNS INTEGER AS $$
DECLARE
    email_record RECORD;
    processed INTEGER := 0;
BEGIN
    FOR email_record IN
        SELECT *
        FROM email_queue
        WHERE status = 'PENDING'
          AND attempts < max_attempts
        ORDER BY created_at ASC
        LIMIT batch_size
        FOR UPDATE SKIP LOCKED
    LOOP
        BEGIN
            -- Marcar como enviando
            UPDATE email_queue
            SET status = 'SENDING',
                attempts = attempts + 1,
                updated_at = NOW()
            WHERE id = email_record.id;
            
            -- TODO: Aquí integrar con SendGrid/SES/SMTP
            -- Por ahora simular envío exitoso
            
            UPDATE email_queue
            SET status = 'SENT',
                sent_at = NOW(),
                updated_at = NOW()
            WHERE id = email_record.id;
            
            processed := processed + 1;
            
        EXCEPTION WHEN OTHERS THEN
            UPDATE email_queue
            SET status = CASE 
                    WHEN attempts >= max_attempts THEN 'FAILED'
                    ELSE 'PENDING'
                END,
                error_message = SQLERRM,
                failed_at = CASE 
                    WHEN attempts >= max_attempts THEN NOW()
                    ELSE failed_at
                END,
                updated_at = NOW()
            WHERE id = email_record.id;
        END;
    END LOOP;
    
    RETURN processed;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE email_templates IS 'Plantillas de email reutilizables con variables';
COMMENT ON TABLE email_queue IS 'Cola de emails a enviar con reintentos automáticos';
COMMENT ON TABLE reminder_schedules IS 'Configuración de recordatorios automáticos';
COMMENT ON TABLE notifications IS 'Notificaciones in-app para usuarios';
