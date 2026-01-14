# Módulo: Pagos y estado de cobro

## 1) Objetivo
- Registrar pagos y calcular saldo de facturas.

## 2) Entidades (propuesta base)

### pagos
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| factura_id | fk | Sí | |
| fecha | date | Sí | |
| monto | decimal | Sí | |
| metodo | text | No | efectivo/transferencia/tarjeta |
| referencia | text | No | nro transacción |
| estado | text | Sí | registrado/anulado |
| creado_por | fk | Sí | |
| creado_en | datetime | Sí | |

### facturas (campos derivados o calculados)
- saldo
- estado_cobro: pendiente/parcial/pagada

## 3) Reglas
- No permitir pagos si factura está anulada.
- No permitir saldo negativo (salvo crédito, si se define).

## 4) API
- POST /facturas/{id}/pagos
- GET /facturas/{id}/pagos
- POST /pagos/{id}/anular

## 5) UI
- En detalle de factura: tabla pagos + botón registrar pago

## 6) Preguntas obligatorias
- ¿Permitir pagos parciales?
- ¿Se maneja moneda única o multi-moneda?
- ¿Se requiere conciliación bancaria?
