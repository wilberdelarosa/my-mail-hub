# Fase 08 — Seguridad y Auditoría

Objetivo
- Endurecer el sistema para datos sensibles (facturación).

Entregables
- Matriz de permisos (RBAC) por módulo y acción.
- Auditoría de acciones críticas (eventos) con trazabilidad:
	- quién (usuario/rol)
	- cuándo
	- desde dónde (opcional: IP/dispositivo)
	- qué cambió (before/after o diff)
- Inmutabilidad lógica para documentos fiscales:
	- una factura emitida no se “edita”: se anula o se emite nota (según regla)
	- registro de motivo y evidencia
- Controles fiscales (riesgo DGII):
	- secuencias NCF protegidas
	- bloqueo de emisión sin validaciones
- Políticas de retención:
	- datos transaccionales
	- auditoría
	- documentos (PDF) y enlaces
- Seguridad técnica mínima:
	- cifrado en tránsito (TLS)
	- gestión de secretos
	- hardening básico

Checklist de salida
- Acciones auditadas: crear/editar (cuando aplica)/aprobar/regenerar, cerrar proforma, emitir/anular factura, registrar/anular pago, cambios de tarifas/NCF.
- Control de acceso verificado (pruebas negativas por rol).
- Evidencia de trazabilidad “expediente completo” por cliente/documento.
