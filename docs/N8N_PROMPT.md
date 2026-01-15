# Prompt para Integrar Flujo n8n (Telegram + Supabase)

Copia y pega este prompt en **Lovable AI** o **Grok** para que genere el flujo completo en n8n.

---

## Prompt

Necesito generar un flujo completo en n8n para Telegram que alimente mi sistema de cotizaciones. Contexto técnico:

Base de datos Supabase (Postgres) con tablas:
- `clients` (id, name, rnc, address, city, contact_name, contact_email, contact_phone, notes, is_active)
- `equipment` (id, code, name, description, default_unit, default_price, is_taxable, category, is_active)
- `documents` (id, document_type: cotizacion/proforma/factura, document_number, ncf, client_id, issue_date, status: borrador/enviado/aprobado/rechazado/pagado/cancelado, payment_terms, subtotal_exempt, subtotal_taxable, subtotal, itbis_amount, total, notes, prepared_by, created_by)
- `document_items` (document_id, equipment_id, equipment_name, description, quantity, unit, unit_price, is_taxable, total, sort_order)

Necesito:
1) Trigger de Telegram (mensaje entrante).
2) Extraer intención y datos de cotización con IA (usar Lovable AI o Grok vía HTTP).
3) Si el cliente no existe, crearlo en `clients`.
4) Resolver items: buscar `equipment` por nombre o code; si no existe, crear item “manual”.
5) Crear `documents` tipo `cotizacion` con estado `borrador`.
6) Crear `document_items` y calcular subtotal, ITBIS (18%) y total.
7) Responder en Telegram con resumen y número de cotización.
8) Si luego el documento pasa a `aprobado`, notificar al cliente en Telegram con el resumen y link (placeholder).

Usa Supabase REST (PostgREST) con Service Role Key para evitar problemas de RLS en automatización. Genera el JSON de n8n con nodos sugeridos (Telegram Trigger, HTTP Request, Function/Code, Supabase via HTTP, Wait/Loop, Webhook para update o polling).

Incluye variables de entorno:
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- TELEGRAM_BOT_TOKEN
- LOVABLE_AI_API_KEY o GROK_API_KEY

Entrega: flujo en JSON + explicación breve de cada nodo.

---

Si quieres, puedo generar el JSON n8n completo listo para importar.
