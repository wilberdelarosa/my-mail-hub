# Fase 05 — Integraciones y Firma/Emisión (si aplica)

Objetivo
- Integrar servicios externos (ej. firma, envío, proveedor de correo, pasarela de pago).

Entregables
- Adaptadores por integración (aislados del dominio, compatibles con hexagonal):
	- WhatsApp/email (proveedor) y/o webhook para canal conversacional
	- n8n para automatizaciones (recordatorios, envíos, notificaciones)
	- Drive/S3 para almacenamiento de PDFs (enlaces de previsualización/descarga)
	- BI (Metabase o Power BI): dataset/vistas y refresh
- Integración de generación de documentos:
	- plantillas
	- render PDF
	- política de retención (ej. purga de PDFs temporales, conservar datos)
- Manejo de reintentos, idempotencia y deduplicación:
	- claves idempotentes por operación crítica (emitir factura, registrar pago, sincronizar offline)
	- tolerancia a reenvíos (webhooks duplicados)
- Configuración por ambiente (local/piloto/producción): secretos, llaves, endpoints.
- (Opcional) IA “económica”:
	- validaciones y alertas (NCF/ITBIS/duplicados/valores atípicos)
	- extracción de datos desde WhatsApp (si se decide)

Checklist de salida
- Integraciones estables y probadas (incluye fallos controlados y reintentos).
- Evidencia de idempotencia en operaciones críticas.
- Auditoría de eventos críticos (envíos, emisiones, anulaciones, sincronización).
