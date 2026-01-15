-- Migration: Update Quotation Schema with unit and summary fields
-- Description: Agrega campos necesarios para el formato premium de cotización
-- Date: 2026-01-14

-- Modificar tabla quotes
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS total_exempt DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_taxable DECIMAL(12,2) NOT NULL DEFAULT 0;

-- Modificar tabla quote_items
ALTER TABLE quote_items
ADD COLUMN IF NOT EXISTS unit VARCHAR(10) DEFAULT 'PA',
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total DECIMAL(12,2) NOT NULL DEFAULT 0;

-- Actualizar comentarios
COMMENT ON COLUMN quotes.total_exempt IS 'Total de items exentos (itbis 0%)';
COMMENT ON COLUMN quotes.total_taxable IS 'Total de items gravados (itbis > 0%)';
COMMENT ON COLUMN quote_items.unit IS 'Unidad de medida (Ud, PA, etc)';
