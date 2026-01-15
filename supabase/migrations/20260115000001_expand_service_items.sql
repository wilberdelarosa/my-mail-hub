-- Migration: Expand Service Items into a complete Product Catalog
-- Description: Adds flexible fields to support products, services, equipment, and materials
-- Date: 2026-01-15

-- ============================================
-- SERVICE_ITEMS (Product Catalog Extension)
-- ============================================
ALTER TABLE service_items
    ADD COLUMN IF NOT EXISTS item_type VARCHAR(20) NOT NULL DEFAULT 'SERVICE',
    ADD COLUMN IF NOT EXISTS sku VARCHAR(80),
    ADD COLUMN IF NOT EXISTS barcode VARCHAR(80),
    ADD COLUMN IF NOT EXISTS unit VARCHAR(10) NOT NULL DEFAULT 'UD',
    ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'DOP',
    ADD COLUMN IF NOT EXISTS cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_taxable BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS tax_code VARCHAR(30),
    ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS stock_on_hand DECIMAL(12,3) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS stock_reserved DECIMAL(12,3) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS stock_min DECIMAL(12,3) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS stock_max DECIMAL(12,3),
    ADD COLUMN IF NOT EXISTS brand VARCHAR(100),
    ADD COLUMN IF NOT EXISTS model VARCHAR(100),
    ADD COLUMN IF NOT EXISTS weight DECIMAL(12,3),
    ADD COLUMN IF NOT EXISTS length DECIMAL(12,3),
    ADD COLUMN IF NOT EXISTS width DECIMAL(12,3),
    ADD COLUMN IF NOT EXISTS height DECIMAL(12,3),
    ADD COLUMN IF NOT EXISTS attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'service_items_item_type_check'
    ) THEN
        ALTER TABLE service_items
            ADD CONSTRAINT service_items_item_type_check
            CHECK (item_type IN ('PRODUCT', 'SERVICE', 'EQUIPMENT', 'MATERIAL'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'service_items_currency_check'
    ) THEN
        ALTER TABLE service_items
            ADD CONSTRAINT service_items_currency_check
            CHECK (length(currency) = 3);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'service_items_stock_check'
    ) THEN
        ALTER TABLE service_items
            ADD CONSTRAINT service_items_stock_check
            CHECK (stock_on_hand >= 0 AND stock_reserved >= 0);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_service_items_sku ON service_items(sku);
CREATE INDEX IF NOT EXISTS idx_service_items_barcode ON service_items(barcode);
CREATE INDEX IF NOT EXISTS idx_service_items_item_type ON service_items(item_type);
CREATE INDEX IF NOT EXISTS idx_service_items_attributes ON service_items USING GIN (attributes);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON COLUMN service_items.item_type IS 'PRODUCT, SERVICE, EQUIPMENT, MATERIAL';
COMMENT ON COLUMN service_items.unit IS 'Default unit of measure for quoting (UD, PA, M3, HR, etc.)';
COMMENT ON COLUMN service_items.attributes IS 'Flexible custom attributes (JSON)';
COMMENT ON COLUMN service_items.metadata IS 'Extra metadata (JSON)';
