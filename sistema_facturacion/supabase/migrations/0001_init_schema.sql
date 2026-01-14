-- 0001_init_schema.sql
-- Esquema inicial para Supabase/Postgres

BEGIN;

-- Tabla usuarios (básico para RBAC)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text,
  password_hash text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tabla roles
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY(user_id, role_id)
);

-- Clientes
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_id text, -- RNC / Cedula
  name text NOT NULL,
  commercial_name text,
  email text,
  phone text,
  address text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tax_id)
);

-- Productos / Servicios
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text,
  name text NOT NULL,
  description text,
  type text NOT NULL, -- product/service
  price numeric(14,2) NOT NULL DEFAULT 0,
  taxable boolean DEFAULT true,
  tax_percentage numeric(5,2) DEFAULT 18.00,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Series de documentos
CREATE TABLE IF NOT EXISTS document_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_type text NOT NULL, -- cotizacion, factura
  series text NOT NULL,
  next_number bigint NOT NULL DEFAULT 1,
  active boolean DEFAULT true,
  UNIQUE(doc_type, series)
);

-- Cotizaciones
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series text,
  number bigint,
  code text UNIQUE,
  client_id uuid REFERENCES clients(id),
  issued_at date DEFAULT CURRENT_DATE,
  valid_days int DEFAULT 30,
  expires_at date,
  currency text DEFAULT 'DOP',
  subtotal numeric(14,2) DEFAULT 0,
  discount_total numeric(14,2) DEFAULT 0,
  tax_total numeric(14,2) DEFAULT 0,
  total numeric(14,2) DEFAULT 0,
  status text DEFAULT 'draft', -- draft, sent, approved, rejected, expired
  notes text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotations_client ON quotations(client_id);

-- Cotizacion items
CREATE TABLE IF NOT EXISTS quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  description text,
  quantity numeric(14,4) DEFAULT 1,
  unit_price numeric(14,4) DEFAULT 0,
  discount numeric(14,2) DEFAULT 0,
  tax_percentage numeric(5,2) DEFAULT 18.00,
  line_subtotal numeric(14,2) DEFAULT 0,
  line_tax numeric(14,2) DEFAULT 0,
  line_total numeric(14,2) DEFAULT 0
);

-- Proformas
CREATE TABLE IF NOT EXISTS proformas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES quotations(id),
  status text DEFAULT 'open', -- open, partial, closed
  created_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

CREATE TABLE IF NOT EXISTS proforma_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proforma_id uuid REFERENCES proformas(id) ON DELETE CASCADE,
  description text,
  delivered_quantity numeric(14,4) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Facturas
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series text,
  number bigint,
  code text UNIQUE,
  client_id uuid REFERENCES clients(id),
  quotation_id uuid REFERENCES quotations(id),
  issued_at date DEFAULT CURRENT_DATE,
  currency text DEFAULT 'DOP',
  subtotal numeric(14,2) DEFAULT 0,
  discount_total numeric(14,2) DEFAULT 0,
  tax_total numeric(14,2) DEFAULT 0,
  total numeric(14,2) DEFAULT 0,
  status text DEFAULT 'draft', -- draft, issued, voided
  ncf text, -- Número de Comprobante Fiscal (NCF)
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Items factura
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  description text,
  quantity numeric(14,4) DEFAULT 1,
  unit_price numeric(14,4) DEFAULT 0,
  discount numeric(14,2) DEFAULT 0,
  tax_percentage numeric(5,2) DEFAULT 18.00,
  line_subtotal numeric(14,2) DEFAULT 0,
  line_tax numeric(14,2) DEFAULT 0,
  line_total numeric(14,2) DEFAULT 0
);

-- Pagos
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  paid_at date DEFAULT CURRENT_DATE,
  amount numeric(14,2) DEFAULT 0,
  method text,
  reference text,
  status text DEFAULT 'registered', -- registered, voided
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Tax catalog
CREATE TABLE IF NOT EXISTS taxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  percentage numeric(5,2),
  active boolean DEFAULT true
);

-- Auditoría de eventos
CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity text,
  entity_id text,
  action text,
  actor_id uuid,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

COMMIT;
