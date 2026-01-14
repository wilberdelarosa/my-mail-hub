# Fase 03 — Backend/API

Objetivo
- Implementar API, persistencia, reglas de negocio y seguridad.

Entregables
- Decisión de arquitectura de implementación (pragmática):
	- **Monolito modular con arquitectura hexagonal** (Ports & Adapters), preparado para extraer microservicios.
	- Módulos como bounded contexts (aunque compartan runtime).
- Especificación OpenAPI (o tabla de endpoints) por módulo.
- Migraciones/DDL de BD (incluye constraints de unicidad, secuencias, FK, índices).
- Servicios por módulo (dominio) + validaciones:
	- Identity & Access (auth, RBAC)
	- Master Data (clientes, catálogo, tarifas vigentes)
	- Quotation (vigencia, aprobación, expiración, regeneración)
	- Proforma/Delivery (parcialidades, cierre)
	- Billing & Tax (factura fiscal, NCF, ITBIS, validación 3 pasos)
	- Accounts Receivable (pagos, saldos, mora, estados de cuenta)
	- Documents (render PDF, enlaces Drive/S3)
	- Notifications/Automation (webhook/cola para n8n)
	- Analytics/BI (vistas/materializaciones para KPIs)
	- Offline Sync (si aplica): batch ingest, idempotencia, reconciliación
- Mecanismo de auditoría (evento/bitácora) transversal.
- Autenticación/autorización + políticas de permisos por endpoint.

Checklist de salida
- CRUDs base funcionando (clientes, catálogo, cotizaciones, proformas, facturas, pagos).
- Validaciones críticas implementadas:
	- NCF: tipo, secuencia, vigencia, no duplicidad
	- ITBIS: cálculo y redondeo consistente
	- transiciones de estados (cotización/proforma/factura)
	- hard-gates del negocio (si se decide): pago validado para emitir factura fiscal
- Auditoría de acciones críticas registrada.
- Manejo de errores consistente (códigos, mensajes, trazas).
- (Si offline) idempotencia demostrable con casos de duplicado.
