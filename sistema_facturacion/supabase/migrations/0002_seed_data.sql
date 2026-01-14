-- 0002_seed_data.sql
-- Datos de ejemplo para probar flujos F01/F02/F03

BEGIN;

-- Roles
INSERT INTO roles (id, name, description)
VALUES
  (gen_random_uuid(), 'admin', 'Administrador'),
  (gen_random_uuid(), 'operator', 'Operador'),
  (gen_random_uuid(), 'accountant', 'Contabilidad')
ON CONFLICT DO NOTHING;

-- Clientes
INSERT INTO clients (id, tax_id, name, commercial_name, email, phone, address)
VALUES
  (gen_random_uuid(), '13123123', 'Constructora Demo SRL', 'Constructora Demo', 'ventas@demo.com', '809-555-0101', 'Av Principal 123'),
  (gen_random_uuid(), '40201010', 'Obras y Proyectos SRL', 'ObrasPro', 'contacto@obras.com', '809-555-0202', 'Calle Secundaria 45')
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO products (id, sku, name, description, type, price, taxable, tax_percentage)
VALUES
  (gen_random_uuid(), 'EQ-001', 'Alquiler Excavadora', 'Excavadora por día', 'service', 12000.00, true, 18.00),
  (gen_random_uuid(), 'EQ-002', 'Camión Volteo', 'Transporte por viaje', 'service', 4500.00, true, 18.00)
ON CONFLICT DO NOTHING;

-- Series
INSERT INTO document_series (id, doc_type, series, next_number)
VALUES
  (gen_random_uuid(), 'quotation', 'COT-2026', 1),
  (gen_random_uuid(), 'invoice', 'FAC-2026', 1)
ON CONFLICT DO NOTHING;

COMMIT;
