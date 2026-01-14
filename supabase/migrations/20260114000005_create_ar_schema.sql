-- Migration: Create AR Schema
-- Description: Tablas para Cuentas por Cobrar (Pagos)
-- Date: 2026-01-14

-- ============================================
-- PAYMENTS Table (Recibos de Ingreso)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    unapplied_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    method VARCHAR(50) NOT NULL, -- CASH, CREDIT_CARD, TRANSFER
    reference VARCHAR(100), -- Nro autorización/cheque
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'POSTED',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- ============================================
-- PAYMENT_APPLICATIONS Table (Detalle de cobro)
-- ============================================
CREATE TABLE IF NOT EXISTS payment_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    applied_amount DECIMAL(12,2) NOT NULL CHECK (applied_amount > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_applications_invoice ON payment_applications(invoice_id);

-- ============================================
-- TRIGGER: Update Updated_At
-- ============================================
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Apply Payment (Lógica transaccional)
-- ============================================
CREATE OR REPLACE FUNCTION apply_payment(
    p_payment_id UUID, 
    p_invoice_id UUID, 
    p_amount DECIMAL
) RETURNS VOID AS $$
DECLARE
    v_payment_unapplied DECIMAL;
    v_invoice_balance DECIMAL;
BEGIN
    -- 1. Verificar saldo disponible en recibo
    SELECT unapplied_amount INTO v_payment_unapplied 
    FROM payments WHERE id = p_payment_id FOR UPDATE;

    IF v_payment_unapplied < p_amount THEN
        RAISE EXCEPTION 'Saldo insuficiente en recibo';
    END IF;

    -- 2. Verificar saldo pendiente en factura
    SELECT balance INTO v_invoice_balance 
    FROM invoices WHERE id = p_invoice_id FOR UPDATE;

    IF v_invoice_balance < p_amount THEN
        RAISE EXCEPTION 'Monto excede balance de factura';
    END IF;

    -- 3. Crear aplicación
    INSERT INTO payment_applications (payment_id, invoice_id, applied_amount)
    VALUES (p_payment_id, p_invoice_id, p_amount);

    -- 4. Actualizar recibo
    UPDATE payments 
    SET unapplied_amount = unapplied_amount - p_amount 
    WHERE id = p_payment_id;

    -- 5. Actualizar factura
    UPDATE invoices 
    SET balance = balance - p_amount,
        status = CASE WHEN (balance - p_amount) <= 0 THEN 'PAID' ELSE 'PARTIALLY_PAID' END
    WHERE id = p_invoice_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE payments IS 'Recibos de ingreso (cobros a clientes)';
COMMENT ON FUNCTION apply_payment IS 'Aplica un pago a una factura actualizando saldos atómicamente';
