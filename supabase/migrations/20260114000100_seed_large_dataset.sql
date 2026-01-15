-- Migration: Seed Large Dataset
-- Description: Genera dataset amplio para demo en Supabase
-- Date: 2026-01-14

-- ============================================
-- SERVICE ITEMS (Productos/Servicios)
-- ============================================
INSERT INTO service_items (code, name, description, unit_price, tax_rate, category, is_active)
SELECT
  'SRV-' || lpad(gs::text, 3, '0') AS code,
  'Servicio ' || gs AS name,
  'Servicio generado automáticamente #' || gs AS description,
  round((random() * 9000 + 500)::numeric, 2) AS unit_price,
  CASE WHEN random() < 0.15 THEN 0 ELSE 0.18 END AS tax_rate,
  (ARRAY['ALQUILER', 'SERVICIO', 'TRANSPORTE', 'TRAMITE', 'PRODUCTO'])[1 + floor(random() * 5)] AS category,
  TRUE
FROM generate_series(100, 400) gs
ON CONFLICT (code) DO NOTHING;

INSERT INTO service_items (code, name, description, unit_price, tax_rate, category, is_active)
SELECT
  'PRD-' || lpad(gs::text, 3, '0') AS code,
  'Producto ' || gs AS name,
  'Producto generado automáticamente #' || gs AS description,
  round((random() * 15000 + 800)::numeric, 2) AS unit_price,
  CASE WHEN random() < 0.10 THEN 0 ELSE 0.18 END AS tax_rate,
  (ARRAY['PRODUCTO', 'INSUMO', 'LICENCIA'])[1 + floor(random() * 3)] AS category,
  TRUE
FROM generate_series(100, 250) gs
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- CUSTOMERS (Clientes)
-- ============================================
INSERT INTO customers (rnc, name, email, phone, address, fiscal_type, credit_limit, is_active)
SELECT
  lpad((500000000 + gs)::text, 9, '0') AS rnc,
  'Cliente Demo ' || gs AS name,
  'cliente' || gs || '@demo.local' AS email,
  '809-555-' || lpad(gs::text, 4, '0') AS phone,
  'Calle #' || gs || ', Santo Domingo' AS address,
  (ARRAY['CREDITO_FISCAL', 'CONSUMIDOR', 'GUBERNAMENTAL', 'ESPECIAL'])[1 + floor(random() * 4)] AS fiscal_type,
  round((random() * 250000)::numeric, 2) AS credit_limit,
  TRUE
FROM generate_series(1, 800) gs
ON CONFLICT (rnc) DO NOTHING;

-- ============================================
-- PRICE LISTS + ITEMS
-- ============================================
INSERT INTO price_lists (name, description, is_active)
VALUES
  ('Lista VIP', 'Descuentos para clientes VIP', TRUE),
  ('Lista Gobierno', 'Tarifas especiales para entidades gubernamentales', TRUE),
  ('Lista Mayorista', 'Precios por volumen', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO price_list_items (price_list_id, service_item_id, special_price)
SELECT
  pl.id,
  si.id,
  round((si.unit_price * (1 - (random() * 0.25)))::numeric, 2) AS special_price
FROM price_lists pl
JOIN LATERAL (
  SELECT id, unit_price
  FROM service_items
  ORDER BY random()
  LIMIT 60
) si ON true
ON CONFLICT (price_list_id, service_item_id) DO NOTHING;

INSERT INTO customer_price_lists (customer_id, price_list_id)
SELECT
  c.id,
  pl.id
FROM (
  SELECT id FROM customers ORDER BY random() LIMIT 120
) c
JOIN LATERAL (
  SELECT id FROM price_lists ORDER BY random() LIMIT 1
) pl ON true
ON CONFLICT DO NOTHING;

-- ============================================
-- QUOTES + QUOTE ITEMS
-- ============================================
INSERT INTO quotes (
  number, customer_id, status, created_at, expiration_date,
  subtotal, tax_amount, total, total_exempt, total_taxable, notes
)
SELECT
  'COT-2026-' || lpad(gs::text, 5, '0') AS number,
  (SELECT id FROM customers ORDER BY random() LIMIT 1) AS customer_id,
  (ARRAY['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED', 'INVOICED'])[1 + floor(random() * 6)] AS status,
  NOW() - (random() * 45) * interval '1 day' AS created_at,
  NOW() + (random() * 30) * interval '1 day' AS expiration_date,
  0, 0, 0, 0, 0,
  'Cotización generada automáticamente'
FROM generate_series(1, 1500) gs
ON CONFLICT (number) DO NOTHING;

INSERT INTO quote_items (
  quote_id, service_item_id, description, quantity, unit_price,
  tax_rate, unit, tax_amount, total
)
SELECT
  q.id AS quote_id,
  si.id AS service_item_id,
  si.name AS description,
  qty.quantity,
  si.unit_price,
  si.tax_rate,
  (ARRAY['UD', 'HR', 'PA', 'KG'])[1 + floor(random() * 4)] AS unit,
  round(qty.quantity * si.unit_price * si.tax_rate, 2) AS tax_amount,
  round(qty.quantity * si.unit_price * (1 + si.tax_rate), 2) AS total
FROM (
  SELECT id FROM quotes ORDER BY created_at DESC LIMIT 1500
) q
JOIN LATERAL generate_series(1, (1 + floor(random() * 4))::int) g(n) ON true
JOIN LATERAL (
  SELECT id, name, unit_price, tax_rate
  FROM service_items
  ORDER BY random()
  LIMIT 1
) si ON true
JOIN LATERAL (
  SELECT round((random() * 4 + 1)::numeric, 2) AS quantity
) qty ON true;

UPDATE quotes q
SET
  subtotal = s.subtotal,
  tax_amount = s.tax_amount,
  total = s.total,
  total_exempt = s.total_exempt,
  total_taxable = s.total_taxable,
  updated_at = NOW()
FROM (
  SELECT
    quote_id,
    round(sum(total - tax_amount), 2) AS subtotal,
    round(sum(tax_amount), 2) AS tax_amount,
    round(sum(total), 2) AS total,
    round(sum(CASE WHEN tax_rate = 0 THEN (total - tax_amount) ELSE 0 END), 2) AS total_exempt,
    round(sum(CASE WHEN tax_rate > 0 THEN (total - tax_amount) ELSE 0 END), 2) AS total_taxable
  FROM quote_items
  GROUP BY quote_id
) s
WHERE q.id = s.quote_id;

-- ============================================
-- INVOICES + ITEMS
-- ============================================
INSERT INTO invoices (
  customer_id, quote_id, status, issue_date, due_date,
  subtotal, tax_amount, total, balance, ncf_type
)
SELECT
  (SELECT id FROM customers ORDER BY random() LIMIT 1) AS customer_id,
  (SELECT id FROM quotes ORDER BY random() LIMIT 1) AS quote_id,
  (ARRAY['DRAFT', 'ISSUED', 'PAID', 'PARTIALLY_PAID'])[1 + floor(random() * 4)] AS status,
  NOW() - (random() * 30) * interval '1 day' AS issue_date,
  NOW() + (random() * 30) * interval '1 day' AS due_date,
  0, 0, 0, 0,
  (ARRAY['31', '32'])[1 + floor(random() * 2)] AS ncf_type
FROM generate_series(1, 900)
ON CONFLICT DO NOTHING;

INSERT INTO invoice_items (
  invoice_id, service_item_id, description, quantity, unit_price, tax_rate
)
SELECT
  i.id AS invoice_id,
  si.id AS service_item_id,
  si.name AS description,
  qty.quantity,
  si.unit_price,
  si.tax_rate
FROM (
  SELECT id FROM invoices ORDER BY issue_date DESC LIMIT 900
) i
JOIN LATERAL generate_series(1, (1 + floor(random() * 3))::int) g(n) ON true
JOIN LATERAL (
  SELECT id, name, unit_price, tax_rate
  FROM service_items
  ORDER BY random()
  LIMIT 1
) si ON true
JOIN LATERAL (
  SELECT round((random() * 6 + 1)::numeric, 2) AS quantity
) qty ON true;

UPDATE invoices i
SET
  subtotal = s.subtotal,
  tax_amount = s.tax_amount,
  total = s.total,
  balance = s.total,
  updated_at = NOW()
FROM (
  SELECT
    invoice_id,
    round(sum(quantity * unit_price), 2) AS subtotal,
    round(sum(quantity * unit_price * tax_rate), 2) AS tax_amount,
    round(sum(quantity * unit_price * (1 + tax_rate)), 2) AS total
  FROM invoice_items
  GROUP BY invoice_id
) s
WHERE i.id = s.invoice_id;

-- ============================================
-- PAYMENTS + APPLICATIONS
-- ============================================
INSERT INTO payments (customer_id, amount, unapplied_amount, method, reference, payment_date, status, notes)
SELECT
  i.customer_id,
  amt.amount,
  amt.amount,
  (ARRAY['CASH', 'CREDIT_CARD', 'TRANSFER'])[1 + floor(random() * 3)] AS method,
  'PAY-' || lpad(gs::text, 6, '0') AS reference,
  CURRENT_DATE - (random() * 20)::int AS payment_date,
  'POSTED',
  'Pago generado automáticamente'
FROM (
  SELECT id, customer_id, total
  FROM invoices
  WHERE total > 0
  ORDER BY random()
  LIMIT 600
) i
JOIN generate_series(1, 600) gs ON true
JOIN LATERAL (
  SELECT GREATEST(round((i.total * (0.3 + random() * 0.7))::numeric, 2), 0.01) AS amount
) amt ON true;

-- Aplicar pagos a facturas usando la función transaccional
DO $$
DECLARE
  pay RECORD;
  inv RECORD;
  apply_amount NUMERIC;
BEGIN
  FOR pay IN SELECT id, customer_id, amount FROM payments LOOP
    SELECT id, balance INTO inv
    FROM invoices
    WHERE customer_id = pay.customer_id AND balance > 0
    ORDER BY random()
    LIMIT 1;

    IF inv.id IS NOT NULL THEN
      apply_amount := LEAST(pay.amount, inv.balance);
      PERFORM apply_payment(pay.id, inv.id, apply_amount);
    END IF;
  END LOOP;
END $$;

-- ============================================
-- PROFORMAS + DELIVERY RECORDS
-- ============================================
INSERT INTO proformas (quote_id, customer_id, status)
SELECT
  q.id,
  q.customer_id,
  (ARRAY['OPEN', 'PARTIALLY_DELIVERED', 'CLOSED'])[1 + floor(random() * 3)]
FROM (
  SELECT id, customer_id FROM quotes ORDER BY random() LIMIT 400
) q
ON CONFLICT DO NOTHING;

INSERT INTO proforma_items (proforma_id, service_item_id, quantity, delivered_quantity)
SELECT
  p.id,
  si.id,
  qty.quantity,
  round((qty.quantity * random())::numeric, 2) AS delivered_quantity
FROM (
  SELECT id FROM proformas ORDER BY created_at DESC LIMIT 400
) p
JOIN LATERAL generate_series(1, (1 + floor(random() * 3))::int) g(n) ON true
JOIN LATERAL (
  SELECT id FROM service_items ORDER BY random() LIMIT 1
) si ON true
JOIN LATERAL (
  SELECT round((random() * 5 + 1)::numeric, 2) AS quantity
) qty ON true;

INSERT INTO delivery_records (proforma_id, delivery_date, driver_name, vehicle_plate, notes)
SELECT
  p.id,
  NOW() - (random() * 10) * interval '1 day',
  'Chofer ' || lpad(gs::text, 3, '0'),
  'A' || lpad(gs::text, 3, '0') || 'B' || lpad(gs::text, 2, '0'),
  'Entrega generada automáticamente'
FROM (
  SELECT id FROM proformas ORDER BY random() LIMIT 300
) p
JOIN generate_series(1, 300) gs ON true;

-- ============================================
-- AUDIT LOGS
-- ============================================
INSERT INTO audit_logs (service, entity, action, entity_id, user_id, ip_address, payload)
SELECT
  (ARRAY['billing-service', 'quotation-service', 'master-data-service', 'identity-service'])[1 + floor(random() * 4)],
  (ARRAY['quote', 'invoice', 'customer', 'payment'])[1 + floor(random() * 4)],
  (ARRAY['create', 'update', 'approve', 'cancel'])[1 + floor(random() * 4)],
  md5(random()::text),
  (SELECT id FROM users ORDER BY random() LIMIT 1),
  '192.168.1.' || (10 + floor(random() * 200))::int,
  jsonb_build_object('auto', true, 'source', 'seed')
FROM generate_series(1, 1200);

-- ============================================
-- ANALYTICS (KPIs)
-- ============================================
-- Nota: Seeding de analytics deshabilitado intencionalmente.
-- Si lo necesitas luego, crea una migración/seed aparte para analytics.
