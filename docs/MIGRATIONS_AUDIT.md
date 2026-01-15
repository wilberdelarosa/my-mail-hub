# Auditoría de migraciones (análisis estático)

Fecha: 2026-01-15

Objetivo: revisar coherencia de `supabase/migrations/` **sin ejecutar migraciones**; detectar versiones duplicadas, objetos duplicados (tablas/funciones) y choques de modelo. Incluye contraste con el esquema **actual** observado en la DB local.

## 1) Versiones de migración

- Estado: **OK**. No hay prefijos/versiones duplicadas en `supabase/migrations/*.sql`.

> Nota: existe otra carpeta de migraciones en `sistema_facturacion/supabase/migrations/` (parece un esquema legado). Si el CLI de Supabase está apuntando al `supabase/` raíz (lo normal), esas no se ejecutan, pero sí generan confusión.

## 2) Duplicación y choques de objetos

### 2.1 NCF: doble tabla + doble función

- Modelo A (e-NCF “E + tipo + correlativo”):
  - Tabla: `public.encf_sequences`
  - Función: `public.get_next_ncf(p_type varchar) returns varchar`
  - Definido en: `supabase/migrations/20260114000004_create_billing_schema.sql`

- Modelo B (prefijos B01/B02 simplificado):
  - Tabla: `public.ncf_sequences`
  - Función: `public.get_next_ncf(p_type text) returns text`
  - Definido en: `supabase/migrations/20260114000030_billing_schema.sql`

Impacto:
- En la DB local se observan **ambas tablas** y **ambas funciones** (sobrecarga por firma distinta). Esto crea ambigüedad funcional y hace más difícil razonar sobre la generación de NCF.

Recomendación:
- Elegir **un solo** modelo NCF como canónico.
  - Si se mantiene el Modelo A: eliminar/retirar el Modelo B (tabla `ncf_sequences` + función `get_next_ncf(text)`), y dejar una sola firma de `get_next_ncf`.
  - Si se mantiene el Modelo B: migrar `invoices`/flujos para alinearse y retirar `encf_sequences`.

### 2.2 `invoices`: dos definiciones incompatibles en migraciones

- Definición “UUID + FK customers/quotes” en `20260114000004_create_billing_schema.sql`.
- Otra definición “customer_id text + columnas reducidas” en `20260114000030_billing_schema.sql`.

Impacto:
- Si ambas se ejecutaran en un entorno desde cero, el orden y el `IF NOT EXISTS` determinan cuál queda; eso puede dejar un esquema inconsistente respecto al código.
- En la DB local, `public.invoices.customer_id` es `uuid` (o sea, **ganó** el modelo de `20260114000004`).

Recomendación:
- Mantener una única fuente de verdad para `invoices` (idealmente la de `20260114000004`) y convertir `20260114000030_billing_schema.sql` en una migración de **ALTER/patch** o desactivarla si fue un “experimento”.

### 2.3 `price_lists`/`price_list_items`: conflicto fuerte (servicios vs inventario)

- Modelo “servicios” (canónico actual en DB):
  - `price_lists(id,name,description,is_active,created_at,updated_at)`
  - `price_list_items(price_list_id, service_item_id, special_price, ...)`
  - Definido en: `supabase/migrations/20260114000002_create_master_data_schema.sql`

- Modelo “inventario/ventas” (no aplicado por `IF NOT EXISTS`, pero sí referenciado por seeds/expectativas):
  - `price_lists(code, valid_from, valid_to, priority, active, is_default, ...)`
  - `price_list_items(product_id, price, discount_percent, ...)`
  - Definido en: `supabase/migrations/20260115000035_inventory_prices_vendors_workflow.sql`

Impacto:
- En DB local existe el modelo de servicios, por lo que cualquier seed/código que asuma `price_lists.code` o `price_list_items.product_id` va a fallar (tal como ocurrió con el seed de inventario/email).

Recomendación:
- Elegir estrategia:
  1) Separar por dominio: renombrar el modelo de inventario a `inventory_price_lists`/`inventory_price_list_items` (sin tocar el actual), o
  2) Unificar: extender el modelo actual con columnas extra y soportar ambos (`service_item_id` y `product_id`), con constraints para evitar mezcla inválida.

### 2.4 Duplicación conceptual: `customers` vs `clients`, `quotes/proformas/invoices` vs `documents`

- `customers/quotes/proformas/invoices/payments` vive en migraciones 20260114 (facturación “clásica”).
- `clients/documents/document_items` vive en `20260115031147_ba07c098-a3fb-4f11-bd53-650aa2f8a919.sql` (modelo alterno “documentos”).

Impacto:
- Ambas líneas conviven en la DB local, pero representan entidades solapadas. Esto complica integridad referencial, reporting y la capa API.

Recomendación:
- Declarar un modelo canónico para el backend:
  - Si el core del sistema es facturación DGII: priorizar `customers/quotes/invoices/payments` y considerar mover `documents` a un schema separado o deprecarlas.
  - Si el core es “documentos” genéricos: migrar/canonizar hacia `documents` y mapear `quotes/proformas/invoices` como vistas o especializaciones.

## 3) Estado observado en DB local (referencia)

En la DB local se observaron (entre otras):
- `public.encf_sequences` y `public.ncf_sequences` (ambas)
- `public.customers` y `public.clients` (ambas)
- `public.quotes`, `public.proformas`, `public.invoices` (clásico)
- `public.documents`, `public.document_items` (alterno)
- `public.price_lists` con estructura de “servicios”
- `public.get_next_ncf` existe 2 veces (sobrecargada)

## 4) Próximo paso sugerido (sin migrar)

- Decidir oficialmente:
  1) Modelo canónico de documentos (clásico vs alterno)
  2) Modelo canónico de listas de precios (servicios vs inventario vs unificado)
  3) Modelo canónico de NCF (encf_sequences vs ncf_sequences)

Con esas decisiones, se puede redactar una migración de consolidación (ALTER/renames/drops) y un plan de compatibilidad para el código.
