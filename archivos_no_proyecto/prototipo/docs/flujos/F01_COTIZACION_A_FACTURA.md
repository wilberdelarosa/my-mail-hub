# Flujo F01: Cotización → Factura

Objetivo
- Recorrido completo desde crear una cotización hasta emitir la factura generada.

Precondiciones
- Existe al menos 1 usuario con rol permitido.
- Existe 1 cliente.
- Existe 1 producto/servicio.
- Existe serie activa para cotización y factura.

Pasos
1. Crear cotización (borrador) con 1..n items.
2. Recalcular totales automáticamente.
3. Cambiar estado a “enviada” (opcional) y luego “aprobada”.
4. Convertir a factura.
5. Emitir factura.

Cambios esperados en BD (tablas)
- Inserta en `cotizaciones` y `cotizacion_items`.
- Actualiza `cotizaciones.estado` según transición.
- Inserta en `facturas` y `factura_items`.
- Enlaza `facturas.cotizacion_origen_id` (si aplica).
- Incrementa `series_documento.siguiente_numero` para cotización/factura.
- Inserta eventos en `auditoria_eventos` (crear/editar/cambiar_estado/convertir/emitir).

Criterios de aceptación
- La factura resultante refleja exactamente items y totales.
- La numeración no se repite.
- El historial muestra quién aprobó, convirtió y emitió.
