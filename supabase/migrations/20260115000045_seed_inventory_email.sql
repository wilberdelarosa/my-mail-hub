-- =====================================================
-- SEED DATA - Inventory, Price Lists, Vendors, Email
-- =====================================================

-- ============ CATEGORÍAS DE PRODUCTOS ============

INSERT INTO product_categories (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Equipo Pesado', 'Maquinaria y equipo pesado'),
('22222222-2222-2222-2222-222222222222', 'Transporte', 'Servicios de transporte'),
('33333333-3333-3333-3333-333333333333', 'Materiales', 'Materiales de construcción'),
('44444444-4444-4444-4444-444444444444', 'Servicios', 'Servicios profesionales')
ON CONFLICT (id) DO NOTHING;

-- ============ PRODUCTOS Y SERVICIOS ============

INSERT INTO products (id, sku, name, description, category_id, cost, price, unit, track_inventory, current_stock, min_stock, reorder_point) VALUES
-- Servicios (no track inventory)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SRV-001', 'Transporte de Material', 'Transporte de material de construcción por viaje', '22222222-2222-2222-2222-222222222222', 2500, 3500, 'VIAJE', FALSE, 0, 0, 0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SRV-002', 'Alquiler Grúa 20 Ton', 'Alquiler de grúa 20 toneladas por hora', '11111111-1111-1111-1111-111111111111', 1800, 2500, 'HR', FALSE, 0, 0, 0),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'SRV-003', 'Alquiler Excavadora', 'Alquiler de excavadora por día', '11111111-1111-1111-1111-111111111111', 3500, 5000, 'DIA', FALSE, 0, 0, 0),

-- Productos (track inventory)
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'PROD-001', 'Cemento Portland 50kg', 'Saco de cemento portland de 50kg', '33333333-3333-3333-3333-333333333333', 350, 500, 'SACO', TRUE, 500, 100, 150),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'PROD-002', 'Varilla 3/8 x 6m', 'Varilla corrugada 3/8 pulgadas x 6 metros', '33333333-3333-3333-3333-333333333333', 180, 250, 'UND', TRUE, 300, 50, 75),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'PROD-003', 'Bloque 15x20x40', 'Bloque de concreto 15x20x40cm', '33333333-3333-3333-3333-333333333333', 28, 40, 'UND', TRUE, 2000, 500, 600)
ON CONFLICT (id) DO NOTHING;

-- ============ ALMACENES ============

INSERT INTO warehouses (id, code, name, address, manager) VALUES
('aaaaaaaa-0000-0000-0000-000000000001', 'ALM-01', 'Almacén Central', 'Av. Independencia #123, Santo Domingo', 'Juan Pérez'),
('aaaaaaaa-0000-0000-0000-000000000002', 'ALM-02', 'Almacén Norte', 'Autopista Duarte KM 12, Santiago', 'María González')
ON CONFLICT (id) DO NOTHING;

-- ============ STOCK POR ALMACÉN ============

INSERT INTO inventory_stock (product_id, warehouse_id, quantity) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-0000-0000-0000-000000000001', 300),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-0000-0000-0000-000000000002', 200),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-0000-0000-0000-000000000001', 200),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-0000-0000-0000-000000000002', 100),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-0000-0000-0000-000000000001', 1500),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-0000-0000-0000-000000000002', 500)
ON CONFLICT (product_id, warehouse_id) DO NOTHING;

-- ============ LISTAS DE PRECIOS ============

INSERT INTO price_lists (id, code, name, description, is_default) VALUES
('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'RETAIL', 'Precio al Detalle', 'Precio para clientes retail', TRUE),
('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'WHOLESALE', 'Precio al Mayor', 'Precio para clientes mayoristas con descuento', FALSE),
('33333333-cccc-cccc-cccc-cccccccccccc', 'VIP', 'Precio VIP', 'Precio especial para clientes VIP', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============ PRECIOS POR LISTA ============

-- Lista RETAIL (precios normales)
INSERT INTO price_list_items (price_list_id, product_id, price) VALUES
('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3500),
('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2500),
('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 5000),
('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 500),

-- Lista WHOLESALE (10% descuento)
('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3150),
('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2250),
('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 4500),
('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 450),

-- Lista VIP (15% descuento)
('33333333-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2975),
('33333333-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2125),
('33333333-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 4250),
('33333333-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 425)
ON CONFLICT (price_list_id, product_id, min_quantity) DO NOTHING;

-- ============ VENDEDORES ============

INSERT INTO salespersons (id, code, name, email, phone, default_commission_rate, monthly_goal) VALUES
('11111111-vend-vend-vend-111111111111', 'VEND-001', 'Carlos Martínez', 'carlos.martinez@alitogroup.com', '809-555-0101', 5.00, 100000),
('22222222-vend-vend-vend-222222222222', 'VEND-002', 'Ana López', 'ana.lopez@alitogroup.com', '809-555-0102', 5.00, 150000),
('33333333-vend-vend-vend-333333333333', 'VEND-003', 'Roberto Sánchez', 'roberto.sanchez@alitogroup.com', '809-555-0103', 4.50, 80000)
ON CONFLICT (id) DO NOTHING;

-- ============ PROVEEDORES ============

INSERT INTO suppliers (id, code, name, rnc, contact_name, email, phone, payment_terms) VALUES
('11111111-supp-supp-supp-111111111111', 'SUP-001', 'CEMEX DOMINICANA', '101-11111-1', 'Pedro Jiménez', 'ventas@cemex.do', '809-566-1111', 'NET_30'),
('22222222-supp-supp-supp-222222222222', 'SUP-002', 'METALDOM', '101-22222-2', 'Laura Fernández', 'compras@metaldom.do', '809-566-2222', 'NET_45'),
('33333333-supp-supp-supp-333333333333', 'SUP-003', 'BLOQUES DEL CARIBE', '101-33333-3', 'Miguel Torres', 'miguel@bloquescaribe.do', '809-566-3333', 'NET_30')
ON CONFLICT (id) DO NOTHING;

-- ============ EMAIL TEMPLATES ============

INSERT INTO email_templates (code, name, subject, html_body, include_pdf, pdf_type) VALUES
('INVOICE_ISSUED', 'Factura Emitida', 
 'Factura {{invoiceNumber}} - ALITO GROUP',
 '<html><body><h1>Estimado/a {{customerName}},</h1><p>Adjunto encontrará la factura <strong>{{invoiceNumber}}</strong> por un monto de <strong>RD$ {{total}}</strong>.</p><p>Fecha de vencimiento: <strong>{{dueDate}}</strong></p><p>Gracias por su preferencia.</p><p>ALITO GROUP SRL</p></body></html>',
 TRUE,
 'INVOICE'),

('PAYMENT_RECEIVED', 'Pago Recibido',
 'Confirmación de Pago - Recibo {{receiptNumber}}',
 '<html><body><h1>Estimado/a {{customerName}},</h1><p>Hemos recibido su pago de <strong>RD$ {{amount}}</strong>.</p><p>Recibo No: <strong>{{receiptNumber}}</strong></p><p>Gracias por su pago puntual.</p><p>ALITO GROUP SRL</p></body></html>',
 TRUE,
 'RECEIPT'),

('PAYMENT_REMINDER_3DAYS', 'Recordatorio 3 Días',
 'Recordatorio: Factura {{invoiceNumber}} vence en 3 días',
 '<html><body><h1>Estimado/a {{customerName}},</h1><p>Le recordamos que la factura <strong>{{invoiceNumber}}</strong> vence en <strong>3 días</strong> ({{dueDate}}).</p><p>Monto pendiente: <strong>RD$ {{balance}}</strong></p><p>Por favor, procese el pago a tiempo.</p><p>ALITO GROUP SRL</p></body></html>',
 FALSE,
 NULL),

('PAYMENT_OVERDUE', 'Factura Vencida',
 'URGENTE: Factura {{invoiceNumber}} vencida',
 '<html><body><h1>Estimado/a {{customerName}},</h1><p>Notamos que la factura <strong>{{invoiceNumber}}</strong> está <strong>vencida</strong> desde {{dueDate}}.</p><p>Monto pendiente: <strong>RD$ {{balance}}</strong></p><p>Le solicitamos regularizar su pago a la brevedad.</p><p>ALITO GROUP SRL</p></body></html>',
 TRUE,
 'INVOICE')
ON CONFLICT (code) DO NOTHING;

-- ============ RECORDATORIOS AUTOMÁTICOS ============

INSERT INTO reminder_schedules (name, reminder_type, days_before, template_id, frequency) 
SELECT 
    'Recordatorio 3 días antes de vencer',
    'PAYMENT_DUE_SOON',
    3,
    id,
    'ONCE'
FROM email_templates WHERE code = 'PAYMENT_REMINDER_3DAYS'
ON CONFLICT DO NOTHING;

INSERT INTO reminder_schedules (name, reminder_type, days_after, template_id, frequency)
SELECT
    'Factura vencida - diario',
    'PAYMENT_OVERDUE',
    0,
    id,
    'DAILY'
FROM email_templates WHERE code = 'PAYMENT_OVERDUE'
ON CONFLICT DO NOTHING;

-- ============ WORKFLOW DE APROBACIONES ============

INSERT INTO approval_workflows (name, entity_type, condition, approval_levels) VALUES
('Aprobar Cotizaciones > RD$ 50,000', 'QUOTE',
 '{"field": "total", "operator": ">", "value": 50000}'::jsonb,
 '[{"level": 1, "role": "SUPERVISOR"}, {"level": 2, "role": "MANAGER"}]'::jsonb),

('Aprobar Descuentos > 15%', 'DISCOUNT',
 '{"field": "discount_percent", "operator": ">", "value": 15}'::jsonb,
 '[{"level": 1, "role": "SUPERVISOR"}]'::jsonb),

('Aprobar Notas de Crédito > RD$ 10,000', 'CREDIT_NOTE',
 '{"field": "total", "operator": ">", "value": 10000}'::jsonb,
 '[{"level": 1, "role": "SUPERVISOR"}, {"level": 2, "role": "MANAGER"}]'::jsonb)
ON CONFLICT DO NOTHING;

COMMENT ON SCHEMA public IS 'Schema completo con seed data para Inventario, Precios, Vendedores, Email y Recordatorios';
