# Flujo F02: Factura → Registro de pago → Estado de cobro

Objetivo
- Registrar pagos y reflejar saldo/estado en la factura.

Precondiciones
- Existe una factura en estado “emitida”.

Pasos
1. Abrir detalle de factura.
2. Registrar un pago (monto y fecha).
3. Ver recalculo de saldo y estado de cobro:
   - pendiente → parcial → pagada
4. (Opcional) Anular pago y verificar reversión.

Cambios esperados en BD
- Inserta en `pagos`.
- Actualiza campos derivados o calculados de la factura (saldo/estado_cobro).
- Inserta auditoría (registrar/anular pago).

Criterios de aceptación
- No se permiten pagos sobre facturas anuladas.
- No se permite que el saldo quede negativo (salvo que se defina crédito).
