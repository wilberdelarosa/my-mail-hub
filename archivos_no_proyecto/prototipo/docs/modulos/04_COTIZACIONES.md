# Módulo: Cotizaciones

## 1) Objetivo
- Crear propuestas comerciales con items, totales y validez, y convertir a factura.

## 2) Entidades y campos (propuesta base)

### cotizaciones
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| serie | text | Sí | ej. COT-001 |
| numero | int | Sí | consecutivo por serie |
| codigo | text | Sí | serie-numero (único) |
| cliente_id | fk | Sí | |
| fecha_emision | date | Sí | |
| validez_dias | int | No | |
| fecha_vencimiento | date | No | derivado |
| moneda | text | Sí | |
| subtotal | decimal | Sí | |
| descuento_total | decimal | Sí | |
| impuesto_total | decimal | Sí | |
| total | decimal | Sí | |
| estado | text | Sí | borrador/enviada/aprobada/rechazada/expirada |
| notas | text | No | |
| creado_por | fk | Sí | usuario |
| creado_en | datetime | Sí | |

### cotizacion_items
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| cotizacion_id | fk | Sí | |
| producto_id | fk | No | permite item libre |
| descripcion | text | Sí | |
| cantidad | decimal | Sí | |
| precio_unitario | decimal | Sí | |
| descuento | decimal | Sí | por línea |
| impuesto_porcentaje | decimal | Sí | |
| subtotal_linea | decimal | Sí | |
| impuesto_linea | decimal | Sí | |
| total_linea | decimal | Sí | |

## 3) Estados y transiciones
- borrador → enviada
- enviada → aprobada | rechazada
- borrador → anulada (opcional)
- enviada → expirada (por fecha)

## 4) Reglas de negocio
- Recalcular totales al cambiar items.
- Si está aprobada, definir si se bloquea edición.
- Convertir a factura: copiar items y totales, y enlazar origen.

## 5) API (mínimo)
- CRUD /cotizaciones
- POST /cotizaciones/{id}/enviar
- POST /cotizaciones/{id}/aprobar
- POST /cotizaciones/{id}/rechazar
- POST /cotizaciones/{id}/convertir-a-factura

## 6) UI
- Lista cotizaciones
- Editor (cabecera + tabla de items)
- Acciones por estado

## 7) Preguntas obligatorias
- ¿Qué campos exactos necesita la cabecera?
- ¿Cómo se calcula descuento (por línea y/o global)?
- ¿Se requiere aprobación por rol?
- ¿La conversión a factura crea una nueva numeración distinta?
