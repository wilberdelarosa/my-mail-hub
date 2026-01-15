-- Migration: Offline Sync Schema
-- Description: Tablas para sincronizacion offline, idempotencia, conflictos y outbox
-- Date: 2026-01-14

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Batches
CREATE TABLE IF NOT EXISTS offline_sync_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) NOT NULL,
    client_id VARCHAR(100),
    batch_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'RECEIVED',
    total_entities INTEGER NOT NULL DEFAULT 0,
    processed INTEGER NOT NULL DEFAULT 0,
    conflicts INTEGER NOT NULL DEFAULT 0,
    skipped INTEGER NOT NULL DEFAULT 0,
    pending INTEGER NOT NULL DEFAULT 0,
    metadata JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offline_batches_device ON offline_sync_batches(device_id);
CREATE INDEX IF NOT EXISTS idx_offline_batches_status ON offline_sync_batches(status);

-- Entities
CREATE TABLE IF NOT EXISTS offline_sync_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES offline_sync_batches(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL,
    payload JSONB NOT NULL,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offline_entities_batch ON offline_sync_entities(batch_id);
CREATE INDEX IF NOT EXISTS idx_offline_entities_type ON offline_sync_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_offline_entities_status ON offline_sync_entities(status);
CREATE UNIQUE INDEX IF NOT EXISTS uq_offline_entities_batch_entity ON offline_sync_entities(batch_id, entity_id);

-- Idempotency
CREATE TABLE IF NOT EXISTS offline_idempotency_keys (
    key TEXT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL,
    last_batch_id UUID REFERENCES offline_sync_batches(id) ON DELETE SET NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offline_idempotency_entity ON offline_idempotency_keys(entity_type, entity_id);

-- Conflicts
CREATE TABLE IF NOT EXISTS offline_sync_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    reason VARCHAR(100) NOT NULL,
    existing_checksum VARCHAR(64),
    incoming_checksum VARCHAR(64),
    strategy VARCHAR(20),
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offline_conflicts_entity ON offline_sync_conflicts(entity_type, entity_id);

-- Outbox
CREATE TABLE IF NOT EXISTS offline_outbox_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offline_outbox_status ON offline_outbox_events(status);

-- Trigger updated_at
CREATE TRIGGER update_offline_sync_batches_updated_at
    BEFORE UPDATE ON offline_sync_batches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offline_outbox_updated_at
    BEFORE UPDATE ON offline_outbox_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
