# Módulo: Facturas

## 1) Objetivo
- Emitir facturas desde cotización o directamente, con numeración y estados.

## 2) Entidades y campos (propuesta base)

### facturas
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| serie | text | Sí | ej. FAC-001 |
| numero | int | Sí | consecutivo |
| codigo | text | Sí | serie-numero (único) |
| cliente_id | fk | Sí | |
| cotizacion_origen_id | fk | No | si proviene de cotización |
| fecha_emision | date | Sí | |
| moneda | text | Sí | |
| subtotal | decimal | Sí | |
| descuento_total | decimal | Sí | |
| impuesto_total | decimal | Sí | |
| total | decimal | Sí | |
| estado | text | Sí | borrador/emitida/anulada |
| creado_por | fk | Sí | usuario |
| creado_en | datetime | Sí | |

### factura_items
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| factura_id | fk | Sí | |
| producto_id | fk | No | |
| descripcion | text | Sí | |
| cantidad | decimal | Sí | |
| precio_unitario | decimal | Sí | |
| descuento | decimal | Sí | |
| impuesto_porcentaje | decimal | Sí | |
| subtotal_linea | decimal | Sí | |
| impuesto_linea | decimal | Sí | |
| total_linea | decimal | Sí | |

## 3) Reglas
- Una vez “emitida”, definir si se bloquea edición.
- Anulación: registro de motivo y auditoría.

## 4) API (mínimo)
- CRUD /facturas
- POST /facturas/{id}/emitir
- POST /facturas/{id}/anular

## 5) UI
- Lista facturas
- Detalle factura
- Botón emitir/anular según estado

## 6) Preguntas obligatorias
- ¿Se permite factura directa sin cotización?
- ¿Qué motivo y evidencias requiere una anulación?
- ¿Se necesita exportar PDF o solo vista web?
