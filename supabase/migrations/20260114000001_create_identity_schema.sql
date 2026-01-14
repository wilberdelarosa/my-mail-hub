-- Migration: Create Identity Schema
-- Description: Tablas para autenticación y autorización (Users, Roles, Permissions)
-- Date: 2026-01-14

-- ============================================
-- ENABLE UUID Extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PERMISSIONS Table
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL, -- 'quote', 'invoice', 'user', etc.
    action VARCHAR(20) NOT NULL,   -- 'create', 'read', 'update', 'delete'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: formato canónico resource:action
    CONSTRAINT permission_canonical UNIQUE (resource, action)
);

-- Index para búsquedas rápidas
CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE INDEX idx_permissions_action ON permissions(action);

-- ============================================
-- ROLES Table
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROLE_PERMISSIONS Table (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- ============================================
-- USERS Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Validación de email
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index para búsquedas por email
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================
-- USER_ROLES Table (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- ============================================
-- SEED DATA: Permissions
-- ============================================
INSERT INTO permissions (name, description, resource, action) VALUES
-- Quote permissions
('quote:create', 'Crear cotizaciones', 'quote', 'create'),
('quote:read', 'Ver cotizaciones', 'quote', 'read'),
('quote:update', 'Modificar cotizaciones', 'quote', 'update'),
('quote:delete', 'Eliminar cotizaciones', 'quote', 'delete'),
('quote:approve', 'Aprobar cotizaciones', 'quote', 'approve'),

-- Invoice permissions
('invoice:create', 'Crear facturas', 'invoice', 'create'),
('invoice:read', 'Ver facturas', 'invoice', 'read'),
('invoice:update', 'Modificar facturas', 'invoice', 'update'),
('invoice:delete', 'Anular facturas', 'invoice', 'delete'),
('invoice: issue', 'Emitir facturas (e-NCF)', 'invoice', 'issue'),

-- User permissions
('user:create', 'Crear usuarios', 'user', 'create'),
('user:read', 'Ver usuarios', 'user', 'read'),
('user:update', 'Modificar usuarios', 'user', 'update'),
('user:delete', 'Eliminar usuarios', 'user', 'delete'),

-- Customer permissions
('customer:create', 'Crear clientes', 'customer', 'create'),
('customer:read', 'Ver clientes', 'customer', 'read'),
('customer:update', 'Modificar clientes', 'customer', 'update'),
('customer:delete', 'Eliminar clientes', 'customer', 'delete')

ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SEED DATA: Roles
-- ============================================
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador del sistema - Acceso total'),
('operator', 'Operador - Crear/editar cotizaciones y facturas'),
('viewer', 'Visualizador - Solo lectura'),
('billing', 'Facturación - Solo emitir facturas')

ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SEED DATA: Role Permissions
-- ============================================

-- Admin: Todos los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    id
FROM permissions
ON CONFLICT DO NOTHING;

-- Operator: Quote + Invoice (sin delete/issue)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'operator'),
    id
FROM permissions
WHERE name IN (
    'quote:create', 'quote:read', 'quote:update', 'quote:approve',
    'invoice:create', 'invoice:read', 'invoice:update',
    'customer:create', 'customer:read', 'customer:update'
)
ON CONFLICT DO NOTHING;

-- Viewer: Solo lectura
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'viewer'),
    id
FROM permissions
WHERE action = 'read'
ON CONFLICT DO NOTHING;

-- Billing: Solo emitir facturas
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'billing'),
    id
FROM permissions
WHERE name IN (
    'invoice:issue', 'invoice:read',
    'quote:read', 'customer:read'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: Admin User
-- ============================================
-- Password: admin123 (hash bcrypt con salt rounds=10)
INSERT INTO users (email, name, password_hash, is_active) VALUES
(
    'admin@alitogroup.com',
    'Administrador ALITO GROUP',
    '$2b$10$rOE8YZJz.x7VHgxKqX3G0.kB8W7d1l8YhG4vUzQkY5gU1Y5L.K6pq',
    TRUE
)
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- Asignar rol admin al usuario admin
INSERT INTO user_roles (user_id, role_id)
SELECT 
    (SELECT id FROM users WHERE email = 'admin@alitogroup.com'),
    (SELECT id FROM roles WHERE name = 'admin')
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Función: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at
    BEFORE UPDATE ON permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security) - Opcional
-- ============================================
-- Por ahora deshabilitado, se puede habilitar cuando haya auth completo

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE users IS 'Usuarios del sistema con autenticación';
COMMENT ON TABLE roles IS 'Roles del sistema (RBAC)';
COMMENT ON TABLE permissions IS 'Permisos granulares (resource:action)';
COMMENT ON TABLE user_roles IS 'Relación Many-to-Many entre usuarios y roles';
COMMENT ON TABLE role_permissions IS 'Relación Many-to-Many entre roles y permisos';

COMMENT ON COLUMN permissions.resource IS 'Recurso: quote, invoice, user, customer, etc.';
COMMENT ON COLUMN permissions.action IS 'Acción: create, read, update, delete, approve, issue';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt de la contraseña';
COMMENT ON COLUMN users.is_active IS 'Usuario activo (solo activos pueden autenticarse)';
