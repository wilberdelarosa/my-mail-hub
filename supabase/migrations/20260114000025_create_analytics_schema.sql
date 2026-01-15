-- =====================================================
-- ANALYTICS SCHEMA - Data Mart para BI
-- =====================================================

-- Tabla de Hechos: Fact Sales (Ventas)
CREATE TABLE IF NOT EXISTS analytics.fact_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_key INTEGER NOT NULL, -- YYYYMMDD
    customer_id UUID REFERENCES customers(id),
    quote_id UUID REFERENCES quotes(id),
    invoice_id UUID REFERENCES invoices(id),
    
    -- Métricas
    quote_amount DECIMAL(12,2),
    invoice_amount DECIMAL(12,2),
    tax_amount DECIMAL(12,2),
    exempt_amount DECIMAL(12,2),
    taxable_amount DECIMAL(12,2),
    
    -- NCF
    ncf_type VARCHAR(2),
    ncf_sequence VARCHAR(20),
    
    -- Estado
    quote_status VARCHAR(20),
    invoice_status VARCHAR(20),
    
    -- Tiempos
    quote_to_invoice_days INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Hechos: Fact Payments (Cobros)
CREATE TABLE IF NOT EXISTS analytics.fact_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_key INTEGER NOT NULL,
    customer_id UUID REFERENCES customers(id),
    invoice_id UUID REFERENCES invoices(id),
    payment_id UUID REFERENCES payments(id),
    
    -- Métricas
    payment_amount DECIMAL(12,2),
    applied_amount DECIMAL(12,2),
    unapplied_amount DECIMAL(12,2),
    
    -- Método
    payment_method VARCHAR(20),
    
    -- Tiempos (DSO calculation)
    invoice_date DATE,
    payment_date DATE,
    days_to_pay INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dimensión: Tiempo
CREATE TABLE IF NOT EXISTS analytics.dim_date (
    date_key INTEGER PRIMARY KEY, -- YYYYMMDD
    full_date DATE NOT NULL,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL,
    month INTEGER NOT NULL,
    month_name VARCHAR(20),
    week INTEGER NOT NULL,
    day_of_month INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_name VARCHAR(20),
    is_weekend BOOLEAN DEFAULT FALSE,
    is_holiday BOOLEAN DEFAULT FALSE
);

-- Dimensión: Clientes (denormalizada para analytics)
CREATE TABLE IF NOT EXISTS analytics.dim_customers (
    customer_key UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    rnc VARCHAR(20),
    name VARCHAR(200),
    fiscal_type VARCHAR(50),
    segment VARCHAR(50),
    created_at TIMESTAMP,
    
    -- Snapshots
    snapshot_date DATE DEFAULT CURRENT_DATE,
    is_current BOOLEAN DEFAULT TRUE
);

-- KPIs Agregados (Tabla de Caché)
CREATE TABLE IF NOT EXISTS analytics.kpi_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_type VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'yearly'
    period_key VARCHAR(20), -- '2026-01', '2026-W03', '2026'
    
    -- KPIs Financieros
    total_quotes DECIMAL(12,2),
    total_invoices DECIMAL(12,2),
    total_payments DECIMAL(12,2),
    total_tax DECIMAL(12,2),
    
    -- KPIs NCF
    ncf_31_count INTEGER, -- Crédito Fiscal
    ncf_32_count INTEGER, -- Consumo
    ncf_33_count INTEGER, -- Nota Débito
    ncf_34_count INTEGER, -- Nota Crédito
    
    -- KPIs Operativos
    avg_quote_to_invoice_days DECIMAL(10,2),
    avg_days_sales_outstanding DECIMAL(10,2), -- DSO
    conversion_rate DECIMAL(5,2), -- Quote → Invoice %
    
    -- KPIs Calidad
    error_rate DECIMAL(5,2),
    avg_response_time_ms INTEGER,
    
    -- Timestamps
    calculated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(period_type, period_key)
);

-- Eventos de Auditoría (para ingesta)
CREATE TABLE IF NOT EXISTS analytics.event_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    source_service VARCHAR(50),
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_fact_sales_date ON analytics.fact_sales(date_key);
CREATE INDEX IF NOT EXISTS idx_fact_sales_customer ON analytics.fact_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_fact_payments_date ON analytics.fact_payments(date_key);
CREATE INDEX IF NOT EXISTS idx_fact_payments_customer ON analytics.fact_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_log_processed ON analytics.event_log(processed, created_at);
CREATE INDEX IF NOT EXISTS idx_kpi_summary_period ON analytics.kpi_summary(period_type, period_key);

-- Función: Poblar dimensión de fechas
CREATE OR REPLACE FUNCTION analytics.populate_dim_date(start_date DATE, end_date DATE)
RETURNS VOID AS $$
DECLARE
    current_date DATE := start_date;
BEGIN
    WHILE current_date <= end_date LOOP
        INSERT INTO analytics.dim_date (
            date_key,
            full_date,
            year,
            quarter,
            month,
            month_name,
            week,
            day_of_month,
            day_of_week,
            day_name,
            is_weekend
        ) VALUES (
            TO_CHAR(current_date, 'YYYYMMDD')::INTEGER,
            current_date,
            EXTRACT(YEAR FROM current_date)::INTEGER,
            EXTRACT(QUARTER FROM current_date)::INTEGER,
            EXTRACT(MONTH FROM current_date)::INTEGER,
            TO_CHAR(current_date, 'Month'),
            EXTRACT(WEEK FROM current_date)::INTEGER,
            EXTRACT(DAY FROM current_date)::INTEGER,
            EXTRACT(DOW FROM current_date)::INTEGER,
            TO_CHAR(current_date, 'Day'),
            EXTRACT(DOW FROM current_date) IN (0, 6)
        )
        ON CONFLICT (date_key) DO NOTHING;
        
        current_date := current_date + INTERVAL '1 day';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Poblar 3 años de fechas (2025-2028)
SELECT analytics.populate_dim_date('2025-01-01'::DATE, '2028-12-31'::DATE);

-- Función: Calcular DSO (Days Sales Outstanding)
CREATE OR REPLACE FUNCTION analytics.calculate_dso(period_start DATE, period_end DATE)
RETURNS DECIMAL AS $$
DECLARE
    avg_receivables DECIMAL;
    total_credit_sales DECIMAL;
    days_in_period INTEGER;
    dso DECIMAL;
BEGIN
    -- Promedio de cuentas por cobrar
    SELECT AVG(balance) INTO avg_receivables
    FROM invoices
    WHERE issue_date BETWEEN period_start AND period_end
    AND status = 'ISSUED';
    
    -- Total de ventas a crédito
    SELECT SUM(total) INTO total_credit_sales
    FROM invoices
    WHERE issue_date BETWEEN period_start AND period_end;
    
    days_in_period := period_end - period_start;
    
    IF total_credit_sales > 0 THEN
        dso := (avg_receivables / total_credit_sales) * days_in_period;
    ELSE
        dso := 0;
    END IF;
    
    RETURN dso;
END;
$$ LANGUAGE plpgsql;

-- Función: Actualizar KPIs del mes
CREATE OR REPLACE FUNCTION analytics.update_monthly_kpis(p_year INTEGER, p_month INTEGER)
RETURNS VOID AS $$
DECLARE
    period_key VARCHAR(20);
    period_start DATE;
    period_end DATE;
BEGIN
    period_key := p_year || '-' || LPAD(p_month::TEXT, 2, '0');
    period_start := (p_year || '-' || p_month || '-01')::DATE;
    period_end := (period_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
    INSERT INTO analytics.kpi_summary (
        period_type,
        period_key,
        total_quotes,
        total_invoices,
        total_payments,
        total_tax,
        ncf_31_count,
        ncf_32_count,
        ncf_33_count,
        ncf_34_count,
        avg_days_sales_outstanding,
        conversion_rate
    )
    SELECT
        'monthly',
        period_key,
        COALESCE(SUM(q.total), 0) as total_quotes,
        COALESCE(SUM(i.total), 0) as total_invoices,
        COALESCE(SUM(p.amount), 0) as total_payments,
        COALESCE(SUM(i.tax_amount), 0) as total_tax,
        COUNT(CASE WHEN i.ncf_type = '31' THEN 1 END) as ncf_31_count,
        COUNT(CASE WHEN i.ncf_type = '32' THEN 1 END) as ncf_32_count,
        COUNT(CASE WHEN i.ncf_type = '33' THEN 1 END) as ncf_33_count,
        COUNT(CASE WHEN i.ncf_type = '34' THEN 1 END) as ncf_34_count,
        analytics.calculate_dso(period_start, period_end) as avg_dso,
        CASE 
            WHEN COUNT(q.id) > 0 THEN (COUNT(i.id)::DECIMAL / COUNT(q.id) * 100)
            ELSE 0 
        END as conversion_rate
    FROM quotes q
    LEFT JOIN invoices i ON i.quote_id = q.id AND i.issue_date BETWEEN period_start AND period_end
    LEFT JOIN payments p ON p.payment_date BETWEEN period_start AND period_end
    WHERE q.created_at BETWEEN period_start AND period_end
    ON CONFLICT (period_type, period_key) DO UPDATE SET
        total_quotes = EXCLUDED.total_quotes,
        total_invoices = EXCLUDED.total_invoices,
        total_payments = EXCLUDED.total_payments,
        total_tax = EXCLUDED.total_tax,
        ncf_31_count = EXCLUDED.ncf_31_count,
        ncf_32_count = EXCLUDED.ncf_32_count,
        ncf_33_count = EXCLUDED.ncf_33_count,
        ncf_34_count = EXCLUDED.ncf_34_count,
        avg_days_sales_outstanding = EXCLUDED.avg_days_sales_outstanding,
        conversion_rate = EXCLUDED.conversion_rate,
        calculated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Seed: Calcular KPIs del mes actual
SELECT analytics.update_monthly_kpis(
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER
);

COMMENT ON SCHEMA analytics IS 'Data Mart para Business Intelligence y Analytics';
COMMENT ON TABLE analytics.fact_sales IS 'Tabla de hechos con todas las ventas (quotes + invoices)';
COMMENT ON TABLE analytics.fact_payments IS 'Tabla de hechos con todos los cobros';
COMMENT ON TABLE analytics.kpi_summary IS 'KPIs precalculados por período para dashboards';
COMMENT ON FUNCTION analytics.calculate_dso IS 'Calcula Days Sales Outstanding (promedio de días para cobrar)';
