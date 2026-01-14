-- Migration: Create Master Data Schema
-- Description: Tablas para clientes, servicios y precios
-- Date: 2026-01-14

-- ============================================
-- CUSTOMERS Table
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rnc VARCHAR(20) UNIQUE NOT NULL, -- RNC (9 dígitos) o Cédula (11 dígitos)
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    fiscal_type VARCHAR(50) NOT NULL DEFAULT 'CONSUMIDOR',
    credit_limit DECIMAL(12,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Validación RNC/Cédula (9 u 11 dígitos)
    CONSTRAINT valid_rnc CHECK (length(regexp_replace(rnc, '[^0-9]', '', 'g')) IN (9, 11)),
    CONSTRAINT valid_fiscal_type CHECK (fiscal_type IN ('CREDITO_FISCAL', 'CONSUMIDOR', 'GUBERNAMENTAL', 'ESPECIAL'))
);

CREATE INDEX idx_customers_rnc ON customers(rnc);
CREATE INDEX idx_customers_active ON customers(is_active);
CREATE INDEX idx_customers_fiscal_type ON customers(fiscal_type);

-- ============================================
-- SERVICE_ITEMS Table
-- ============================================
CREATE TABLE IF NOT EXISTS service_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- SKU
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0.18, -- ITBIS 18%
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT positive_price CHECK (unit_price >= 0),
    CONSTRAINT valid_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 1)
);

CREATE INDEX idx_service_items_code ON service_items(code);
CREATE INDEX idx_service_items_active ON service_items(is_active);
CREATE INDEX idx_service_items_category ON service_items(category);

-- ============================================
-- PRICE_LISTS Table (para precios especiales por cliente)
-- ============================================
CREATE TABLE IF NOT EXISTS price_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRICE_LIST_ITEMS Table (relación precios especiales)
-- ============================================
CREATE TABLE IF NOT EXISTS price_list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    price_list_id UUID NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
    service_item_id UUID NOT NULL REFERENCES service_items(id) ON DELETE CASCADE,
    special_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_price_list_item UNIQUE (price_list_id, service_item_id),
    CONSTRAINT positive_special_price CHECK (special_price >= 0)
);

CREATE INDEX idx_price_list_items_list ON price_list_items(price_list_id);
CREATE INDEX idx_price_list_items_service ON price_list_items(service_item_id);

-- ============================================
-- CUSTOMER_PRICE_LISTS Table (asignar lista a cliente)
-- ============================================
CREATE TABLE IF NOT EXISTS customer_price_lists (
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    price_list_id UUID NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (customer_id, price_list_id)
);

-- ============================================
-- TRIGGERS - updated_at automático
-- ============================================
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_items_updated_at
    BEFORE UPDATE ON service_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_lists_updated_at
    BEFORE UPDATE ON price_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SE ED DATA: Customers de ejemplo
-- ============================================
INSERT INTO customers (rnc, name, email, phone, address, fiscal_type, credit_limit) VALUES
('101-12345-6', 'Empresa Demo SRL', 'demo@empresa.com', '809-555-0001', 'Av. Principal #123, Santo Domingo', 'CREDITO_FISCAL', 50000.00),
('402-1234567-8', 'Juan Pérez', 'juan.perez@email.com', '809-555-0002', 'Calle Secundaria #45, Santiago', 'CONSUMIDOR', 5000.00),
('131-23456-7', 'Gobierno Municipal', 'compras@ayuntamiento.gob.do', '809-555-0003', 'Plaza Municipal, Santo Domingo', 'GUBERNAMENTAL', 0.00)
ON CONFLICT (rnc) DO NOTHING;

-- ============================================
-- SEED DATA: Service Items de ejemplo
-- ============================================
INSERT INTO service_items (code, name, description, unit_price, tax_rate, category) VALUES
('SRV-001', 'Consultoría IT - Hora', 'Consultoría técnica especializada', 2500.00, 0.18, 'Servicios'),
('SRV-002', 'Desarrollo Software - Hora', 'Desarrollo de software a medida', 3000.00, 0.18, 'Servicios'),
('PRD-001', 'Licencia Software Anual', 'Licencia de uso de software por 12 meses', 15000.00, 0.18, 'Productos'),
('SRV-003', 'Soporte Técnico - Mes', 'Soporte técnico mensual 8x5', 5000.00, 0.18, 'Servicios'),
('PRD-002', 'Hosting Cloud - Mes', 'Alojamiento en la nube (10GB)', 1200.00, 0.18, 'Productos')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- SEED DATA: Price List de ejemplo
-- ============================================
INSERT INTO price_lists (name, description) VALUES
('Clientes VIP', 'Precios especiales para clientes VIP con descuento 10%'),
('Gobierno', 'Precios especiales para entidades gubernamentales')
ON CONFLICT DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE customers IS 'Clientes del sistema (RNC o Cédula)';
COMMENT ON TABLE service_items IS 'Servicios y productos facturables';
COMMENT ON TABLE price_lists IS 'Listas de precios especiales';
COMMENT ON COLUMN customers.rnc IS 'RNC (9 dígitos) o Cédula (11 dígitos)';
COMMENT ON COLUMN customers.fiscal_type IS 'Tipo fiscal para e-NCF: CREDITO_FISCAL (31), CONSUMIDOR (32), etc.';
COMMENT ON COLUMN service_items.tax_rate IS 'Tasa de impuesto ITBIS (0.18 = 18%)';
