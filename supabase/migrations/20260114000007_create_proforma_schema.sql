-- Migration: Create Proforma Schema
-- Description: Tablas para gestión de entregas (Conduces)
-- Date: 2026-01-14

-- ============================================
-- PROFORMAS Table
-- ============================================
CREATE TABLE IF NOT EXISTS proformas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id),
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, PARTIALLY_DELIVERED, CLOSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PROFORMA_ITEMS Table
-- ============================================
CREATE TABLE IF NOT EXISTS proforma_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proforma_id UUID NOT NULL REFERENCES proformas(id) ON DELETE CASCADE,
    service_item_id UUID REFERENCES service_items(id),
    quantity DECIMAL(10,2) NOT NULL,
    delivered_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    CONSTRAINT valid_delivery CHECK (delivered_quantity <= quantity)
);

-- ============================================
-- DELIVERY_RECORDS Table (Conduces)
-- ============================================
CREATE TABLE IF NOT EXISTS delivery_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proforma_id UUID NOT NULL REFERENCES proformas(id),
    delivery_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    driver_name VARCHAR(100),
    vehicle_plate VARCHAR(20),
    notes TEXT
);

-- ============================================
-- ACTIVITY LOG TRIGGER
-- ============================================
CREATE TRIGGER update_proformas_updated_at
    BEFORE UPDATE ON proformas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
