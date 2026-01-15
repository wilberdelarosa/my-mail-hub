# Sync de solicitudes: Supabase Cloud → Supabase Local (sin tocar el frontend)

## Comparación rápida: “lo adicional” de Lovable vs tu core

**Lovable/Supabase (lo que viene en `src/` + Edge Functions):**
- `src/integrations/supabase/client.ts`: cliente Supabase para el navegador (usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`).
- `src/hooks/useDbSync.ts` + Edge Function `db-sync`: sincronización pensada para tablas `clients/documents/...` y requiere sesión de usuario (token).
- Edge Function `telegram-bot`: recibe mensajes, usa IA (Lovable gateway) para extraer items y escribe directo en tablas `documents/document_items`.
- Edge Function `notifications`: envía notificaciones (Telegram/Email) y opcionalmente llama un webhook de n8n.

**Tu core (microservicios + RabbitMQ):**
- `quotation-service`: ya tiene el caso de uso `process-quote-request` y consumidores RabbitMQ (`quotation.requests.*`).
- Ideal para centralizar validaciones, estados y reglas, sin que Telegram/n8n escriban directo en la BD.

**Conclusión práctica:**
- Lovable “resuelve rápido” escribiendo directo a BD (bien para prototipo), pero se te mezcla el modelo `documents` con el modelo `quotes/invoices`.
- Tu arquitectura de microservicios es la mejor base para producción: entrada → cola/evento → procesamiento → notificaciones.

## Qué ya existe (en este repo)

1) **Tabla de bandeja de entrada**
- `public.queue_requests` (ya existe en tu Supabase local por migración `20260115043000_create_queue_requests.sql`).
- Campos clave: `source`, `status`, `payload` (jsonb), `error`, timestamps.

2) **Pipeline local ya armado (microservicios)**
- `quotation-service` ya consume solicitudes por RabbitMQ (`quotation.requests.*`).
- Soporta fuentes `MANUAL | WHATSAPP | WEB | AI`.

3) **Lovable/Supabase en `src/` (frontend)**
- `src/integrations/supabase/*` y `src/hooks/useDbSync.ts` están pensados para el modelo `documents/clients` y un sync “cliente ↔ nube” vía Edge Function `db-sync`.
- Eso no resuelve el caso “Cloud intake → Local core” de forma segura (porque depende de sesión de usuario).

## Recomendación concreta para “solicitud de cotización”

Usa `queue_requests` como la “bandeja de entrada” común:

1) **Entrada (Cloud):** insertar una fila en `queue_requests` con `source` y `payload`.
2) **Sync (Cloud → Local):** copiar esas filas a `queue_requests` en Local.
3) **Procesamiento (Local):** n8n o un worker publica el evento a RabbitMQ (`quotation.requests.web|whatsapp|ai|...`) o llama `POST /api/quotation/v1/quotes`.
4) **Estado (Local → Cloud, opcional):** actualizar la fila Cloud (mismo `id`) para auditoría/seguimiento y para disparar notificaciones.

## Objetivo

- **Supabase Cloud**: entrada pública (web/telegram/whatsapp) guarda solicitudes en `queue_requests`.
- **Supabase Local**: recibe una copia de esas solicitudes para procesarlas con tus microservicios.
- **n8n local**: (opcional) toma `queue_requests` locales en estado `RECEIVED` y publica a RabbitMQ o llama al `quotation-service`.

## Cómo sincronizar Cloud → Local

### Opción A (recomendada): Pull desde local (sin exponer tu PC)

1) Corres un worker/script local cada X segundos/minutos.
2) El worker lee filas nuevas en Cloud (`queue_requests` status `RECEIVED/PENDING`).
3) Hace `upsert` en Local en la misma tabla `queue_requests` preservando el `id`.

Ventajas:
- No necesitas abrir puertos ni exponer el Supabase local.
- Controlas el rate-limit y reintentos.

Script incluido:
- `scripts/sync-cloud-queue-requests.mjs`

Env vars requeridas:
- `CLOUD_SUPABASE_URL`
- `CLOUD_SUPABASE_SERVICE_ROLE_KEY`
- `LOCAL_SUPABASE_URL`
- `LOCAL_SUPABASE_SERVICE_ROLE_KEY`

Ejemplo de ejecución:
- `node scripts/sync-cloud-queue-requests.mjs`

## API mínima para ingresar solicitudes (Edge Function)

Incluí una Edge Function simple que escribe en `queue_requests`:
- `supabase/functions/intake-quote-request/index.ts`

Cómo llamarla:
- URL: `${SUPABASE_URL}/functions/v1/intake-quote-request`
- Body JSON: `{ "source": "WEB", "payload": { ... } }`

Autenticación soportada:
- **Server-to-server**: configura `INTAKE_SECRET` como env var en el proyecto Supabase (cloud o local) y envía header `x-intake-secret`.
- **Desde frontend con login** (menos ideal para intake público): si NO hay `INTAKE_SECRET`, exige `Authorization: Bearer <access_token>`.

### Opción B: Push (cloud llama a local)

Solo si tienes tu local accesible desde internet (reverse proxy / túnel).
No recomendada como primer paso.

## Procesamiento (Local)

Una vez que `queue_requests` esté en Local, tienes 2 caminos:

1) **n8n → RabbitMQ**
- Cron cada 30-60s.
- Query a Local Postgres: `select * from queue_requests where status='RECEIVED' order by created_at limit N`.
- Por cada fila:
  - publicar a exchange `quotation.requests` con routing key `quotation.requests.${source.toLowerCase()}`
  - update `queue_requests.status='PROCESSED'` / `FAILED` con `error`.

2) **Servicio dedicado**
- Un pequeño worker Node/Nest que hace lo mismo, sin depender de n8n.

## Sync de estado “de vuelta” a Cloud (para notificar)

Tienes dos estrategias válidas:

- Estrategia 1 (más simple): **n8n escucha eventos locales** (RabbitMQ) y envía notificaciones directo (Telegram/WhatsApp/email). No necesitas escribir estados a Cloud.

- Estrategia 2 (lo que pediste): **Local actualiza Cloud**
  - Cuando un request se procesa / cambia estado (p.ej. quote creada), actualizas la fila Cloud correspondiente (mismo `id`) con `status` y `processed_at`.
  - n8n (o Edge Function Cloud) se dispara por ese cambio y notifica.

Para evitar loops:
- Agrega en payload un campo `origin` ("cloud" o "local") y/o timestamps `cloud_updated_at/local_updated_at`.

## Sobre “eliminar src”

- Hoy el `src/` de la raíz es **tu frontend principal** (`npm run dev` corre Vite en la raíz).
- Lo que sí puedes (y recomiendo) es **eliminar el acoplamiento del frontend a tablas Supabase** para core (cotizaciones/facturas) y moverlo a llamadas a tus microservicios.
- Si tu objetivo real es abandonar ese frontend y usar `sistema_facturacion/web-app`, hay que cambiar scripts/rutas y validar rutas/páginas; eso es un cambio más grande.
