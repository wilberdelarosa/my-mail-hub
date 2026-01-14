-- Migration: Create Audit Schema
-- Description: Tablas para Auditoría Centralizada
-- Date: 2026-01-14

-- ============================================
-- AUDIT_LOGS Table
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    user_id UUID, -- Puede ser null si es sistema
    ip_address VARCHAR(50),
    payload JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para búsquedas rápidas (PARTITIONING recomendado en Prod)
CREATE INDEX idx_audit_logs_service ON audit_logs(service);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE audit_logs IS 'Registro inmutable de acciones del sistema';
