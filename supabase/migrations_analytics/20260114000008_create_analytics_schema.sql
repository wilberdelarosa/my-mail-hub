-- Migration: Create Analytics Schema
-- Description: Data Mart para KPIs y Dashboards
-- Date: 2026-01-14

-- ============================================
-- CREATE ANALYTICS SCHEMA
-- ============================================
CREATE SCHEMA IF NOT EXISTS analytics;

-- ============================================
-- KPI_DAILY_SNAPSHOTS Table
-- ============================================
CREATE TABLE IF NOT EXISTS analytics.kpi_daily_snapshots (
    date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_collected DECIMAL(15,2) DEFAULT 0,
    total_invoiced_count INT DEFAULT 0,
    dso_days DECIMAL(5,2) DEFAULT 0, -- Days Sales Outstanding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SALES_BY_CATEGORY Table
-- ============================================
CREATE TABLE IF NOT EXISTS analytics.sales_by_category (
    category VARCHAR(100),
    month DATE, -- Primer día del mes
    total_amount DECIMAL(15,2),
    
    PRIMARY KEY (category, month)
);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON SCHEMA analytics IS 'Data Mart para Business Intelligence y Analytics';
COMMENT ON TABLE analytics.kpi_daily_snapshots IS 'Tabla desnormalizada para dashboard rápido';
COMMENT ON TABLE analytics.sales_by_category IS 'Ventas agregadas por categoría y mes';
