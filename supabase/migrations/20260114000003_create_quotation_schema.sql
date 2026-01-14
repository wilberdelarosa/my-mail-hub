-- Migration: Create Quotation Schema
-- Description: Tablas para gestión de cotizaciones
-- Date: 2026-01-14

-- ============================================
-- QUOTES Table
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(20) UNIQUE NOT NULL, -- COT-2026-0001
    customer_id UUID NOT NULL REFERENCES customers(id),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SENT, APPROVED, REJECTED, EXPIRED, INVOICED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiration_date TIMESTAMP WITH TIME ZONE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED', 'INVOICED'))
);

CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);

-- ============================================
-- QUOTE_ITEMS Table
-- ============================================
CREATE TABLE IF NOT EXISTS quote_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    service_item_id UUID REFERENCES service_items(id), -- Puede ser null si es item libre? Por ahora opcional
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
    tax_rate DECIMAL(5,4) DEFAULT 0.18,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);

-- ============================================
-- TRIGGER: Update Updated_At
-- ============================================
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: Example Quote
-- ============================================
-- Insertar una cotización de ejemplo para el cliente 'Empresa Demo SRL'
DO $$
DECLARE
    custId UUID;
    srvId1 UUID;
    srvId2 UUID;
    quoteId UUID;
BEGIN
    SELECT id INTO custId FROM customers WHERE rnc = '101-12345-6';
    SELECT id INTO srvId1 FROM service_items WHERE code = 'SRV-001';
    SELECT id INTO srvId2 FROM service_items WHERE code = 'PRD-001';

    IF custId IS NOT NULL AND srvId1 IS NOT NULL THEN
        INSERT INTO quotes (number, customer_id, status, expiration_date, subtotal, tax_amount, total)
        VALUES ('COT-2026-0001', custId, 'SENT', NOW() + INTERVAL '15 days', 20000, 3600, 23600)
        RETURNING id INTO quoteId;

        INSERT INTO quote_items (quote_id, service_item_id, description, quantity, unit_price, tax_rate)
        VALUES 
        (quoteId, srvId1, 'Consultoría IT - Hora', 2, 2500, 0.18),
        (quoteId, srvId2, 'Licencia Software Anual', 1, 15000, 0.18);
    END IF;
END $$;
