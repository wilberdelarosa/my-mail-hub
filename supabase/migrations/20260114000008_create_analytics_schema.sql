-- Migration: Create Analytics Schema
-- Description: Data Mart para KPIs y Dashboards
-- Date: 2026-01-14

-- ============================================
-- KPI_DAILY_SNAPSHOTS Table
-- ============================================
CREATE TABLE IF NOT EXISTS kpi_daily_snapshots (
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
CREATE TABLE IF NOT EXISTS sales_by_category (
    category VARCHAR(100),
    month DATE, -- Primer día del mes
    total_amount DECIMAL(15,2),
    
    PRIMARY KEY (category, month)
);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE kpi_daily_snapshots IS 'Tabla desnormalizada para dashboard rápido';
