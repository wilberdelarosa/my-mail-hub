-- Seed: Additional dataset for previously empty business tables (non-analytics)

DO $$
DECLARE
  v_user_id uuid;
  v_customer_id uuid;
  v_invoice_id uuid;
  v_payment_id uuid;
  v_payment_amount numeric;
  v_payment_method text;
  v_equipment_id uuid;
  v_supplier_id uuid;
  v_warehouse_id uuid;
  v_category_id uuid;
  v_product_id uuid;
  v_template_id uuid;
  v_workflow_id uuid;
  v_request_id uuid;
  v_salesperson_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM public.users LIMIT 1;
  SELECT id INTO v_customer_id FROM public.customers LIMIT 1;
  SELECT id INTO v_invoice_id FROM public.invoices LIMIT 1;
  SELECT id, customer_id, amount INTO v_payment_id, v_customer_id, v_payment_amount
  FROM public.payments
  LIMIT 1;
  SELECT id INTO v_equipment_id FROM public.equipment LIMIT 1;

  -- Warehouses
  IF NOT EXISTS (SELECT 1 FROM public.warehouses) THEN
    INSERT INTO public.warehouses(code, name, address, phone, manager)
    VALUES
      ('WH-01', 'Almacén Principal', 'Santo Domingo', '+1 809-555-0101', 'Operaciones'),
      ('WH-02', 'Almacén Norte', 'Santiago', '+1 809-555-0102', 'Logística');
  END IF;

  -- Product categories
  IF NOT EXISTS (SELECT 1 FROM public.product_categories) THEN
    INSERT INTO public.product_categories(name, description)
    VALUES
      ('Materiales', 'Materiales de construcción y consumibles'),
      ('Repuestos', 'Repuestos y piezas de equipos'),
      ('Herramientas', 'Herramientas y accesorios');
  END IF;

  -- Products
  IF NOT EXISTS (SELECT 1 FROM public.products) THEN
    SELECT id INTO v_category_id FROM public.product_categories WHERE name = 'Materiales' LIMIT 1;
    INSERT INTO public.products(sku, name, description, category_id, product_type, cost, price, tax_rate, unit, track_inventory, current_stock)
    VALUES
      ('MAT-CEM-001', 'Cemento Portland', 'Saco 42.5kg', v_category_id, 'PRODUCT', 330, 450, 18.00, 'UND', true, 0),
      ('MAT-ARE-001', 'Arena lavada', 'Metro cúbico', v_category_id, 'PRODUCT', 900, 1200, 18.00, 'M3', true, 0),
      ('MAT-GRA-001', 'Grava', 'Metro cúbico', v_category_id, 'PRODUCT', 1100, 1450, 18.00, 'M3', true, 0);

    SELECT id INTO v_category_id FROM public.product_categories WHERE name = 'Repuestos' LIMIT 1;
    INSERT INTO public.products(sku, name, description, category_id, product_type, cost, price, tax_rate, unit, track_inventory, current_stock)
    VALUES
      ('REP-FIL-001', 'Filtro hidráulico', 'Filtro estándar', v_category_id, 'PRODUCT', 650, 950, 18.00, 'UND', true, 0),
      ('REP-ACE-001', 'Aceite hidráulico', 'Cubeta 5 galones', v_category_id, 'PRODUCT', 2200, 2950, 18.00, 'LT', true, 0);

    SELECT id INTO v_category_id FROM public.product_categories WHERE name = 'Herramientas' LIMIT 1;
    INSERT INTO public.products(sku, name, description, category_id, product_type, cost, price, tax_rate, unit, track_inventory, current_stock)
    VALUES
      ('HER-GUA-001', 'Guantes de seguridad', 'Par talla estándar', v_category_id, 'PRODUCT', 120, 200, 18.00, 'UN', true, 0),
      ('HER-CAS-001', 'Casco de seguridad', 'Color amarillo', v_category_id, 'PRODUCT', 380, 600, 18.00, 'UN', true, 0);
  END IF;

  -- Inventory stock
  IF NOT EXISTS (SELECT 1 FROM public.inventory_stock) THEN
    SELECT id INTO v_warehouse_id FROM public.warehouses ORDER BY code LIMIT 1;
    INSERT INTO public.inventory_stock(product_id, warehouse_id, quantity, reserved_quantity, last_count_date)
    SELECT p.id, v_warehouse_id,
           (10 + (random() * 90))::int,
           0,
           CURRENT_DATE
    FROM public.products p;

    -- Write initial movement entries
    IF v_user_id IS NOT NULL THEN
      INSERT INTO public.inventory_movements(product_id, warehouse_id, movement_type, quantity, unit_cost, reference_type, reference_id, notes, created_by)
      SELECT s.product_id, s.warehouse_id, 'IN', s.quantity, p.cost, 'PURCHASE_ORDER', NULL, 'Seed: inventario inicial', v_user_id
      FROM public.inventory_stock s
      JOIN public.products p ON p.id = s.product_id;
    END IF;
  END IF;

  -- Suppliers
  IF NOT EXISTS (SELECT 1 FROM public.suppliers) THEN
    INSERT INTO public.suppliers(code, name, rnc, contact_name, email, phone, address, payment_terms, category)
    VALUES
      ('SUP-001', 'Proveedora Central SRL', '101010101', 'Compras', 'compras@proveedoracentral.test', '+1 809-555-0201', 'Santo Domingo', '30 DIAS', 'Materiales'),
      ('SUP-002', 'Repuestos y Más', '202020202', 'Ventas', 'ventas@repuestosymas.test', '+1 809-555-0202', 'Santiago', '15 DIAS', 'Repuestos');
  END IF;

  -- Purchase orders
  IF NOT EXISTS (SELECT 1 FROM public.purchase_orders) AND v_user_id IS NOT NULL THEN
    SELECT id INTO v_supplier_id FROM public.suppliers ORDER BY code LIMIT 1;

    INSERT INTO public.purchase_orders(po_number, supplier_id, subtotal, tax_amount, total, status, items, notes, created_by)
    VALUES (
      'PO-0001',
      v_supplier_id,
      5000,
      900,
      5900,
      'CONFIRMED',
      jsonb_build_array(
        jsonb_build_object('sku','MAT-CEM-001','name','Cemento Portland','qty',5,'unit_cost',330,'total',1650),
        jsonb_build_object('sku','REP-FIL-001','name','Filtro hidráulico','qty',2,'unit_cost',650,'total',1300),
        jsonb_build_object('sku','HER-CAS-001','name','Casco de seguridad','qty',5,'unit_cost',380,'total',1900)
      ),
      'Seed: orden de compra de ejemplo',
      v_user_id
    );
  END IF;

  -- Discounts
  IF NOT EXISTS (SELECT 1 FROM public.discounts) THEN
    INSERT INTO public.discounts(code, name, description, discount_type, discount_value, applies_to, valid_from, valid_to)
    VALUES
      ('WELCOME10', 'Bienvenida 10%', 'Descuento de bienvenida', 'PERCENTAGE', 10, 'ALL', now(), now() + interval '60 days');
  END IF;

  -- Salespersons
  IF NOT EXISTS (SELECT 1 FROM public.salespersons) THEN
    INSERT INTO public.salespersons(code, name, email, phone, default_commission_rate)
    VALUES
      ('V-001', 'María Pérez', 'maria.perez@alito.test', '+1 809-555-0301', 3.5),
      ('V-002', 'Juan Rodríguez', 'juan.rodriguez@alito.test', '+1 809-555-0302', 2.5);
  END IF;

  -- Commission rules
  IF NOT EXISTS (SELECT 1 FROM public.commission_rules) THEN
    INSERT INTO public.commission_rules(name, applies_to, commission_type, commission_value, based_on, priority)
    VALUES
      ('Comisión estándar', 'ALL', 'PERCENTAGE', 3.0, 'SALE', 0);
  END IF;

  -- Salesperson commissions (one example referencing an invoice)
  IF NOT EXISTS (SELECT 1 FROM public.salesperson_commissions) AND v_invoice_id IS NOT NULL THEN
    SELECT id INTO v_salesperson_id FROM public.salespersons ORDER BY code LIMIT 1;
    INSERT INTO public.salesperson_commissions(salesperson_id, reference_type, reference_id, base_amount, commission_rate, commission_amount, status)
    VALUES
      (v_salesperson_id, 'INVOICE', v_invoice_id, 10000, 3.0, 300, 'APPROVED');
  END IF;

  -- Email templates
  IF NOT EXISTS (SELECT 1 FROM public.email_templates) THEN
    INSERT INTO public.email_templates(code, name, description, subject, html_body, plain_body, variables)
    VALUES
      (
        'PAYMENT_REMINDER',
        'Recordatorio de Pago',
        'Template para recordar pagos pendientes',
        'Recordatorio de pago - {{customer_name}}',
        '<h2>Hola {{customer_name}}</h2><p>Te recordamos un pago pendiente de {{amount}}.</p>',
        'Hola {{customer_name}}. Pago pendiente: {{amount}}.',
        jsonb_build_array('customer_name','amount','invoice_number')
      );
  END IF;

  SELECT id INTO v_template_id FROM public.email_templates WHERE code = 'PAYMENT_REMINDER' LIMIT 1;

  -- Email automation rules
  IF NOT EXISTS (SELECT 1 FROM public.email_automation_rules) THEN
    INSERT INTO public.email_automation_rules(name, trigger_event, conditions, template_id, send_to, delay_minutes)
    VALUES
      ('Pago vence pronto', 'PAYMENT_DUE_SOON', jsonb_build_object('days_before', 3), v_template_id, 'CUSTOMER', 0);
  END IF;

  -- Reminder schedules
  IF NOT EXISTS (SELECT 1 FROM public.reminder_schedules) THEN
    INSERT INTO public.reminder_schedules(name, reminder_type, days_before, template_id, send_email, send_notification, frequency)
    VALUES
      ('Recordatorio 3 días antes', 'PAYMENT_DUE_SOON', 3, v_template_id, true, true, 'DAILY');
  END IF;

  -- Email queue (one example)
  IF NOT EXISTS (SELECT 1 FROM public.email_queue) THEN
    INSERT INTO public.email_queue(template_id, to_email, to_name, subject, html_body, plain_body, reference_type, reference_id, status)
    VALUES
      (v_template_id, 'cliente@example.test', 'Cliente Demo', 'Recordatorio de pago', '<p>Pago pendiente: RD$ 1,000</p>', 'Pago pendiente: RD$ 1,000', 'INVOICE', v_invoice_id, 'PENDING');
  END IF;

  -- Reminders sent (one example)
  IF NOT EXISTS (SELECT 1 FROM public.reminders_sent) THEN
    INSERT INTO public.reminders_sent(schedule_id, reference_type, reference_id, sent_to, channel, status)
    SELECT id, 'INVOICE', v_invoice_id, 'cliente@example.test', 'EMAIL', 'SENT'
    FROM public.reminder_schedules
    ORDER BY created_at
    LIMIT 1;
  END IF;

  -- Clients + Documents + Document items
  IF NOT EXISTS (SELECT 1 FROM public.clients) THEN
    INSERT INTO public.clients(name, rnc, address, city, contact_name, contact_email, contact_phone, notes)
    VALUES
      ('Cliente Sync Demo', '131313131', 'Av. Principal 123', 'Santo Domingo', 'Contacto', 'contacto@cliente-sync.test', '+1 809-555-0401', 'Seed para pruebas de db-sync');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.documents) THEN
    INSERT INTO public.documents(document_type, document_number, ncf, client_id, issue_date, status, notes, subtotal_taxable, itbis_amount, total)
    SELECT
      'cotizacion'::document_type,
      'DOC-0001',
      NULL,
      c.id,
      CURRENT_DATE,
      'aprobado'::document_status,
      'Documento de ejemplo para sincronización',
      10000,
      1800,
      11800
    FROM public.clients c
    ORDER BY created_at
    LIMIT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.document_items) THEN
    INSERT INTO public.document_items(document_id, equipment_id, equipment_name, description, quantity, unit, unit_price, is_taxable, total, sort_order)
    SELECT
      d.id,
      v_equipment_id,
      COALESCE(e.name, 'Equipo'),
      'Servicio/Item de ejemplo',
      1,
      'UN'::unit_type,
      10000,
      true,
      10000,
      1
    FROM public.documents d
    LEFT JOIN public.equipment e ON e.id = v_equipment_id
    ORDER BY d.created_at
    LIMIT 1;
  END IF;

  -- NCF sequences
  IF NOT EXISTS (SELECT 1 FROM public.ncf_sequences) THEN
    INSERT INTO public.ncf_sequences(type, current_value, prefix)
    VALUES
      ('31', 100, 'B01'),
      ('02', 200, 'B02')
    ON CONFLICT (type) DO NOTHING;
  END IF;

  -- Queue requests (intake)
  IF NOT EXISTS (SELECT 1 FROM public.queue_requests) THEN
    INSERT INTO public.queue_requests(source, status, payload)
    VALUES
      ('WEB', 'RECEIVED', jsonb_build_object('customer', 'Demo', 'items', jsonb_build_array(jsonb_build_object('name','Servicio','qty',1)))) ,
      ('TELEGRAM', 'RECEIVED', jsonb_build_object('message', 'Necesito una cotización', 'chat_id', 123456789));
  END IF;

  -- Telegram sessions
  IF NOT EXISTS (SELECT 1 FROM public.telegram_sessions) THEN
    INSERT INTO public.telegram_sessions(chat_id, state, data)
    VALUES
      (123456789, 'idle', '{}'::jsonb);
  END IF;

  -- Notifications
  IF NOT EXISTS (SELECT 1 FROM public.notifications) AND v_user_id IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, title, message, notification_type, reference_type, reference_id, priority, action_url, action_label)
    VALUES
      (v_user_id, 'Sistema listo', 'Dataset extra cargado correctamente.', 'SYSTEM', 'INVOICE', v_invoice_id, 'NORMAL', '/dashboard', 'Ver dashboard');
  END IF;

  -- Credit/Debit notes
  IF NOT EXISTS (SELECT 1 FROM public.credit_debit_notes) AND v_customer_id IS NOT NULL THEN
    INSERT INTO public.credit_debit_notes(note_type, note_number, invoice_id, customer_id, ncf_type, ncf_sequence, subtotal, tax_amount, total, reason, status)
    VALUES
      ('CREDIT', 'NC-0001', v_invoice_id, v_customer_id, '34', 'B0400000001', 1000, 180, 1180, 'Ajuste por devolución', 'ISSUED');
  END IF;

  -- Payment receipts
  IF NOT EXISTS (SELECT 1 FROM public.payment_receipts) AND v_payment_id IS NOT NULL AND v_customer_id IS NOT NULL THEN
    INSERT INTO public.payment_receipts(receipt_number, payment_id, customer_id, amount, payment_method, reference, status, notes)
    VALUES
      ('RC-0001', v_payment_id, v_customer_id, COALESCE(v_payment_amount, 1000), 'TRANSFER', 'TRX-SEED-001', 'ISSUED', 'Recibo generado por seed');
  END IF;

  -- Delivery notes
  IF NOT EXISTS (SELECT 1 FROM public.delivery_notes) AND v_customer_id IS NOT NULL THEN
    INSERT INTO public.delivery_notes(conduce_number, invoice_id, customer_id, delivery_address, delivery_contact, delivery_phone, items, status, notes)
    VALUES
      (
        'CD-0001',
        v_invoice_id,
        v_customer_id,
        'Av. Principal 123, Santo Domingo',
        'Recepción',
        '+1 809-555-0501',
        jsonb_build_array(
          jsonb_build_object('description','Entrega de materiales','qty',1,'unit','UN'),
          jsonb_build_object('description','Entrega de repuestos','qty',2,'unit','UN')
        ),
        'IN_TRANSIT',
        'Conduce de ejemplo'
      );
  END IF;

  -- Approval workflows + requests
  IF NOT EXISTS (SELECT 1 FROM public.approval_workflows) AND v_user_id IS NOT NULL THEN
    INSERT INTO public.approval_workflows(name, entity_type, condition, approval_levels, require_all_levels, allow_self_approval, active)
    VALUES
      (
        'Aprobación de facturas',
        'INVOICE',
        '{}'::jsonb,
        jsonb_build_array(jsonb_build_object('level',1,'role','ADMIN')),
        true,
        false,
        true
      )
    RETURNING id INTO v_workflow_id;
  ELSE
    SELECT id INTO v_workflow_id FROM public.approval_workflows WHERE entity_type = 'INVOICE' ORDER BY created_at LIMIT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.approval_requests) AND v_workflow_id IS NOT NULL AND v_invoice_id IS NOT NULL AND v_user_id IS NOT NULL THEN
    INSERT INTO public.approval_requests(workflow_id, entity_type, entity_id, requested_by, status, current_level, notes)
    VALUES
      (v_workflow_id, 'INVOICE', v_invoice_id, v_user_id, 'PENDING', 1, 'Solicitud de aprobación de ejemplo')
    RETURNING id INTO v_request_id;

    INSERT INTO public.approval_request_levels(request_id, level, approver_role, approver_user_id, status)
    VALUES
      (v_request_id, 1, 'ADMIN', v_user_id, 'PENDING');
  END IF;

END $$;
