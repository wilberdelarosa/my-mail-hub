# Flujo F03: Anulación de factura

Objetivo
- Anular una factura emitida, registrando motivo y trazabilidad.

Precondiciones
- Factura en estado “emitida”.

Pasos
1. Usuario con permiso selecciona “Anular”.
2. Ingresa motivo de anulación.
3. Sistema cambia estado a “anulada”.
4. Bloquea nuevos pagos sobre la factura.

Cambios esperados en BD
- Actualiza `facturas.estado` a “anulada”.
- Guarda `motivo_anulacion` si el modelo lo incluye.
- Inserta evento en `auditoria_eventos`.

Criterios de aceptación
- Queda registro de quién y cuándo anuló.
- La factura anulada no permite registrar pagos.
