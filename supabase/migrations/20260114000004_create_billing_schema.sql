-- Migration: Create Billing Schema
-- Description: Tablas para Facturación y e-NCF
-- Date: 2026-01-14

-- ============================================
-- ENCF_SEQUENCES Table (Control de secuencias)
-- ============================================
CREATE TABLE IF NOT EXISTS encf_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ncf_type VARCHAR(2) NOT NULL, -- 31, 32, 33, etc.
    serie VARCHAR(1) NOT NULL DEFAULT 'E',
    current_sequence BIGINT NOT NULL DEFAULT 0,
    end_sequence BIGINT NOT NULL,
    expiration_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT unique_active_sequence UNIQUE (ncf_type, is_active)
);

-- ============================================
-- INVOICES Table
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    quote_id UUID REFERENCES quotes(id), -- Opcional
    
    -- Datos NCF
    ncf_type VARCHAR(2),
    ncf_sequence VARCHAR(13) UNIQUE, -- E310000000001
    ncf_security_code VARCHAR(6), -- Código seguridad DGII
    ncf_expiration_date DATE,
    
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Montos
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    
    -- Datos XML/Firma
    xml_content TEXT, -- XML firmado
    dgii_track_id VARCHAR(50), -- ID respuesta DGII
    dgii_status VARCHAR(20), -- ACEPTADO, RECHAZADO
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_ncf ON invoices(ncf_sequence);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_track_id ON invoices(dgii_track_id);

-- ============================================
-- INVOICE_ITEMS Table
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    service_item_id UUID REFERENCES service_items(id),
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0.18,
    total DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price * (1 + tax_rate)) STORED
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);

-- ============================================
-- TRIGGER: Update Updated_At
-- ============================================
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Get Next NCF
-- ============================================
CREATE OR REPLACE FUNCTION get_next_ncf(p_type VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    seq_record RECORD;
    next_seq BIGINT;
    formatted_ncf VARCHAR;
BEGIN
    -- Bloquear fila para atomicidad
    SELECT * INTO seq_record 
    FROM encf_sequences 
    WHERE ncf_type = p_type AND is_active = TRUE 
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No active sequence found for NCF type %', p_type;
    END IF;
    
    next_seq := seq_record.current_sequence + 1;
    
    IF next_seq > seq_record.end_sequence THEN
        RAISE EXCEPTION 'Sequence exhausted for NCF type %', p_type;
    END IF;
    
    -- Actualizar secuencia
    UPDATE encf_sequences 
    SET current_sequence = next_seq 
    WHERE id = seq_record.id;
    
    -- Formatear E + Tipo + 10 dígitos (padding 0)
    -- Ejemplo: E + 31 + 0000000001
    formatted_ncf := seq_record.serie || p_type || lpad(next_seq::text, 10, '0');
    
    RETURN formatted_ncf;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA: Secuencias de prueba
-- ============================================
INSERT INTO encf_sequences (ncf_type, current_sequence, end_sequence, expiration_date) VALUES
('31', 0, 1000, '2026-12-31'), -- Crédito Fiscal
('32', 0, 5000, '2026-12-31')  -- Consumo
ON CONFLICT DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE encf_sequences IS 'Control de secuencias NCF autorizadas por DGII';
COMMENT ON FUNCTION get_next_ncf IS 'Genera el siguiente NCF de forma atómica';
