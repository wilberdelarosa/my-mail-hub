-- Migration: Add logistics fields to quote items
-- Description: Adds Conduce and service date columns for industrial quotations
-- Date: 2026-01-15

ALTER TABLE quote_items
    ADD COLUMN IF NOT EXISTS conduce VARCHAR(50),
    ADD COLUMN IF NOT EXISTS service_date DATE,
    ADD COLUMN IF NOT EXISTS line_order INTEGER;

CREATE INDEX IF NOT EXISTS idx_quote_items_line_order ON quote_items(quote_id, line_order);
CREATE INDEX IF NOT EXISTS idx_quote_items_service_date ON quote_items(service_date);
