-- Seed Data for Master Data
-- Service Items (Industrial)
-- Note: 'now()' will be replaced by specific timestamps or default value handlers if run in Supabase SQL editor directly.

INSERT INTO public.service_items (code, name, description, unit_price, tax_rate, category, is_active, created_at, updated_at) VALUES
('ALQ-GRUA-020', 'Alquiler Grúa 20 Ton', 'Servicio de alquiler de grúa hidráulica de 20 toneladas por hora. Incluye operador.', 3500.00, 0.18, 'ALQUILER', true, NOW(), NOW()),
('ALQ-MONT-005', 'Alquiler Montacargas 5 Ton', 'Servicio de montacargas de 5 toneladas para carga y descarga.', 2200.00, 0.18, 'ALQUILER', true, NOW(), NOW()),
('MANIOBRA-EQ', 'Maniobra de Equipos', 'Coordinación y ejecución de maniobras especializadas para movimiento de planta eléctrica.', 15000.00, 0.18, 'SERVICIO', true, NOW(), NOW()),
('TRANSP-LOWBOY', 'Transporte Lowboy - Local', 'Movilización de equipos pesados en plataforma Lowboy dentro de la zona urbana.', 12000.00, 0.18, 'TRANSPORTE', true, NOW(), NOW()),
('PERMISO-TRANS', 'Permiso de Tránsito (DIGESETT)', 'Tramitación de permisos para transporte de carga sobredimensionada. Exento de ITBIS.', 2500.00, 0.00, 'TRAMITE', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Customers
-- Using generic UUIDs for consistent testing if needed, or real generated ones.
-- For this seed, we use explicit IDs to match quotes.

INSERT INTO public.customers (rnc, name, email, phone, address, fiscal_type, credit_limit, is_active, created_at, updated_at) VALUES
('101002223', 'Constructora Del Este SRL', 'compras@construdeste.do', '809-555-1020', 'Av. 27 de Febrero esq. Tiradentes', 'CREDITO_FISCAL', 500000.00, true, NOW(), NOW()),
('123456789', 'Industrias San Miguel', 'logistica@ism.com.do', '809-555-4040', 'Santiago Rodriguez, RD', 'CREDITO_FISCAL', 1000000.00, true, NOW(), NOW()),
('402112233', 'Juan Pérez (Consumidor Final)', 'juan.perez@email.com', '809-555-9988', 'Calle El Sol #4, Santo Domingo', 'CONSUMIDOR', 0.00, true, NOW(), NOW())
ON CONFLICT (rnc) DO NOTHING;

-- Quotations
INSERT INTO public.quotes (number, customer_id, status, created_at, expiration_date, subtotal, tax_amount, total, total_exempt, total_taxable, notes)
SELECT
	'COT-2026-0001',
	(SELECT id FROM public.customers WHERE rnc = '101002223'),
	'APPROVED',
	NOW(),
	NOW() + interval '15 days',
	16500.00,
	2520.00,
	19020.00,
	2500.00,
	14000.00,
	'Cotización de prueba para alquiler de grúa.'
ON CONFLICT (number) DO UPDATE SET
	customer_id = EXCLUDED.customer_id,
	status = EXCLUDED.status,
	expiration_date = EXCLUDED.expiration_date,
	subtotal = EXCLUDED.subtotal,
	tax_amount = EXCLUDED.tax_amount,
	total = EXCLUDED.total,
	total_exempt = EXCLUDED.total_exempt,
	total_taxable = EXCLUDED.total_taxable,
	notes = EXCLUDED.notes,
	updated_at = NOW();

DELETE FROM public.quote_items
WHERE quote_id = (SELECT id FROM public.quotes WHERE number = 'COT-2026-0001');

INSERT INTO public.quote_items (quote_id, service_item_id, description, quantity, unit_price, tax_rate, unit, tax_amount, total)
SELECT
	q.id,
	si.id,
	'Alquiler Grúa 20 Ton',
	4,
	3500.00,
	0.18,
	'HR',
	2520.00,
	16520.00
FROM public.quotes q
JOIN public.service_items si ON si.code = 'ALQ-GRUA-020'
WHERE q.number = 'COT-2026-0001';

INSERT INTO public.quote_items (quote_id, service_item_id, description, quantity, unit_price, tax_rate, unit, tax_amount, total)
SELECT
	q.id,
	si.id,
	'Permiso de Tránsito',
	1,
	2500.00,
	0.00,
	'UD',
	0.00,
	2500.00
FROM public.quotes q
JOIN public.service_items si ON si.code = 'PERMISO-TRANS'
WHERE q.number = 'COT-2026-0001';

-- Proformas (Delivery)
DO $$
DECLARE
	v_quote_id UUID;
	v_customer_id UUID;
BEGIN
	SELECT id, customer_id INTO v_quote_id, v_customer_id
	FROM public.quotes
	WHERE number = 'COT-2026-0001';

	IF v_quote_id IS NOT NULL THEN
		IF NOT EXISTS (SELECT 1 FROM public.proformas WHERE quote_id = v_quote_id) THEN
			INSERT INTO public.proformas (quote_id, customer_id, status)
			VALUES (v_quote_id, v_customer_id, 'OPEN');
		END IF;
	END IF;
END $$;

-- Invoices (Billing)
DO $$
DECLARE
	v_quote_id UUID;
	v_customer_id UUID;
BEGIN
	SELECT id, customer_id INTO v_quote_id, v_customer_id
	FROM public.quotes
	WHERE number = 'COT-2026-0001';

	IF v_customer_id IS NOT NULL THEN
		IF NOT EXISTS (SELECT 1 FROM public.invoices WHERE ncf_sequence = 'E310000000001') THEN
			INSERT INTO public.invoices (
				customer_id,
				quote_id,
				ncf_type,
				ncf_sequence,
				status,
				issue_date,
				due_date,
				subtotal,
				tax_amount,
				total,
				balance
			) VALUES (
				v_customer_id,
				v_quote_id,
				'31',
				'E310000000001',
				'ISSUED',
				NOW(),
				NOW() + interval '15 days',
				16500.00,
				2520.00,
				19020.00,
				19020.00
			);
		END IF;
	END IF;
END $$;

-- Payments (AR)
DO $$
DECLARE
	v_customer_id UUID;
BEGIN
	SELECT id INTO v_customer_id
	FROM public.customers
	WHERE rnc = '101002223';

	IF v_customer_id IS NOT NULL THEN
		IF NOT EXISTS (
			SELECT 1 FROM public.payments
			WHERE customer_id = v_customer_id AND reference = 'REC-2026-0001'
		) THEN
			INSERT INTO public.payments (
				customer_id,
				amount,
				unapplied_amount,
				method,
				reference,
				payment_date,
				status,
				notes
			) VALUES (
				v_customer_id,
				7500.00,
				7500.00,
				'TRANSFER',
				'REC-2026-0001',
				CURRENT_DATE,
				'POSTED',
				'Pago inicial de cliente demo'
			);
		END IF;
	END IF;
END $$;
