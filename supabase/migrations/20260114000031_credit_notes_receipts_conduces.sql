-- =====================================================
-- CREDIT/DEBIT NOTES, RECEIPTS & DELIVERY NOTES
-- =====================================================

-- Notas de Crédito y Débito
CREATE TABLE IF NOT EXISTS credit_debit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_type VARCHAR(10) NOT NULL CHECK (note_type IN ('CREDIT', 'DEBIT')),
    note_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Reference to original invoice
    invoice_id UUID REFERENCES invoices(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    
    -- NCF Information
    ncf_type VARCHAR(2), -- '33' for debit, '34' for credit
    ncf_sequence VARCHAR(20),
    
    -- Amounts
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    
    -- Details
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'ISSUED' CHECK (status IN ('DRAFT', 'ISSUED', 'VOID')),
    
    -- Dates
    issue_date DATE DEFAULT CURRENT_DATE,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('spanish', coalesce(note_number, '') || ' ' || coalesce(reason, ''))
    ) STORED
);

-- Recibos de Cobro/Payment Receipts
CREATE TABLE IF NOT EXISTS payment_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Payment reference
    payment_id UUID NOT NULL REFERENCES payments(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    
    -- Amount
    amount DECIMAL(12,2) NOT NULL,
    
    -- Payment method detail
    payment_method VARCHAR(20) NOT NULL,
    reference VARCHAR(100), -- Check #, transfer ref, etc.
    
    -- Dates
    receipt_date DATE DEFAULT CURRENT_DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'VOID')),
    
    -- PDF storage
    pdf_url TEXT,
    
    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Conduces/Delivery Notes
CREATE TABLE IF NOT EXISTS delivery_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conduce_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- References
    invoice_id UUID REFERENCES invoices(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    
    -- Delivery details
    delivery_address TEXT NOT NULL,
    delivery_contact VARCHAR(200),
    delivery_phone VARCHAR(20),
    
    -- Vehicle/Driver info
    vehicle_plate VARCHAR(20),
    driver_name VARCHAR(200),
    driver_license VARCHAR(50),
    
    -- Items (denormalized for quick access)
    items JSONB NOT NULL,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    
    -- Dates
    scheduled_date DATE,
    delivery_date DATE,
    delivered_at TIMESTAMP,
    
    -- Signature/Photo proof
    signature_url TEXT,
    photo_url TEXT,
    
    -- Notes
    notes TEXT,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer Statements (vista materializada para performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS customer_statements AS
SELECT 
    c.id as customer_id,
    c.name as customer_name,
    c.rnc,
    
    -- Totals
    COALESCE(SUM(i.total), 0) as total_invoiced,
    COALESCE(SUM(p.amount), 0) as total_paid,
    COALESCE(SUM(i.balance), 0) as current_balance,
    
    -- Counts
    COUNT(DISTINCT i.id) as invoice_count,
    COUNT(DISTINCT p.id) as payment_count,
    
    -- Aging
    COALESCE(SUM(CASE WHEN i.due_date >= CURRENT_DATE THEN i.balance ELSE 0 END), 0) as current_due,
    COALESCE(SUM(CASE WHEN i.due_date < CURRENT_DATE AND i.due_date >= CURRENT_DATE - 30 THEN i.balance ELSE 0 END), 0) as aged_1_30,
    COALESCE(SUM(CASE WHEN i.due_date < CURRENT_DATE - 30 AND i.due_date >= CURRENT_DATE - 60 THEN i.balance ELSE 0 END), 0) as aged_31_60,
    COALESCE(SUM(CASE WHEN i.due_date < CURRENT_DATE - 60 AND i.due_date >= CURRENT_DATE - 90 THEN i.balance ELSE 0 END), 0) as aged_61_90,
    COALESCE(SUM(CASE WHEN i.due_date < CURRENT_DATE - 90 THEN i.balance ELSE 0 END), 0) as aged_over_90,
    
    -- Last activity
    MAX(i.issue_date) as last_invoice_date,
    MAX(p.payment_date) as last_payment_date
    
FROM customers c
LEFT JOIN invoices i ON i.customer_id = c.id AND i.status != 'VOID'
LEFT JOIN payments p ON p.customer_id = c.id AND p.status = 'POSTED'
GROUP BY c.id, c.name, c.rnc;

-- Sequence generators
CREATE SEQUENCE IF NOT EXISTS credit_note_seq START 1;
CREATE SEQUENCE IF NOT EXISTS debit_note_seq START 1;
CREATE SEQUENCE IF NOT EXISTS receipt_seq START 1;
CREATE SEQUENCE IF NOT EXISTS conduce_seq START 1;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_credit_debit_notes_invoice ON credit_debit_notes(invoice_id);
CREATE INDEX IF NOT EXISTS idx_credit_debit_notes_customer ON credit_debit_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_debit_notes_type ON credit_debit_notes(note_type);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_payment ON payment_receipts(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_customer ON payment_receipts(customer_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_invoice ON delivery_notes(invoice_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_customer ON delivery_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_status ON delivery_notes(status);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_credit_debit_notes_search ON credit_debit_notes USING GIN(search_vector);

-- Trigger para actualizar balance de factura cuando se crea nota de crédito
CREATE OR REPLACE FUNCTION apply_credit_note_to_invoice()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.note_type = 'CREDIT' AND NEW.invoice_id IS NOT NULL THEN
        UPDATE invoices
        SET balance = balance - NEW.total,
            updated_at = NOW()
        WHERE id = NEW.invoice_id;
    END IF;
    
    IF NEW.note_type = 'DEBIT' AND NEW.invoice_id IS NOT NULL THEN
        UPDATE invoices
        SET balance = balance + NEW.total,
            updated_at = NOW()
        WHERE id = NEW.invoice_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_apply_credit_note
    AFTER INSERT ON credit_debit_notes
    FOR EACH ROW
    EXECUTE FUNCTION apply_credit_note_to_invoice();

-- Función para generar número de nota de crédito
CREATE OR REPLACE FUNCTION generate_credit_note_number()
RETURNS VARCHAR AS $$
DECLARE
    next_seq INTEGER;
    note_number VARCHAR(50);
BEGIN
    next_seq := nextval('credit_note_seq');
    note_number := 'NC-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_seq::TEXT, 5, '0');
    RETURN note_number;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de recibo
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS VARCHAR AS $$
DECLARE
    next_seq INTEGER;
    receipt_number VARCHAR(50);
BEGIN
    next_seq := nextval('receipt_seq');
    receipt_number := 'REC-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_seq::TEXT, 5, '0');
    RETURN receipt_number;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de conduce
CREATE OR REPLACE FUNCTION generate_conduce_number()
RETURNS VARCHAR AS $$
DECLARE
    next_seq INTEGER;
    conduce_number VARCHAR(50);
BEGIN
    next_seq := nextval('conduce_seq');
    conduce_number := 'COND-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_seq::TEXT, 5, '0');
    RETURN conduce_number;
END;
$$ LANGUAGE plpgsql;

-- View para estados de cuenta detallados
CREATE OR REPLACE VIEW customer_statement_details AS
SELECT 
    c.id as customer_id,
    c.name as customer_name,
    'INVOICE' as transaction_type,
    i.ncf_sequence as document_number,
    i.issue_date as transaction_date,
    i.due_date,
    i.total as debit,
    0 as credit,
    i.balance,
    i.status
FROM customers c
JOIN invoices i ON i.customer_id = c.id
WHERE i.status != 'VOID'

UNION ALL

SELECT 
    c.id as customer_id,
    c.name as customer_name,
    'PAYMENT' as transaction_type,
    p.reference as document_number,
    p.payment_date as transaction_date,
    NULL as due_date,
    0 as debit,
    p.amount as credit,
    NULL as balance,
    p.status
FROM customers c
JOIN payments p ON p.customer_id = c.id
WHERE p.status = 'POSTED'

UNION ALL

SELECT 
    c.id as customer_id,
    c.name as customer_name,
    CASE WHEN cn.note_type = 'CREDIT' THEN 'CREDIT_NOTE' ELSE 'DEBIT_NOTE' END as transaction_type,
    cn.note_number as document_number,
    cn.issue_date as transaction_date,
    NULL as due_date,
    CASE WHEN cn.note_type = 'DEBIT' THEN cn.total ELSE 0 END as debit,
    CASE WHEN cn.note_type = 'CREDIT' THEN cn.total ELSE 0 END as credit,
    NULL as balance,
    cn.status
FROM customers c
JOIN credit_debit_notes cn ON cn.customer_id = c.id
WHERE cn.status != 'VOID'

ORDER BY customer_id, transaction_date;

COMMENT ON TABLE credit_debit_notes IS 'Notas de crédito y débito para ajustes de facturas';
COMMENT ON TABLE payment_receipts IS 'Recibos de cobro emitidos a clientes';
COMMENT ON TABLE delivery_notes IS 'Conduces/Delivery notes para tracking de entregas';
COMMENT ON MATERIALIZED VIEW customer_statements IS 'Estados de cuenta consolidados por cliente (materializada para performance)';
