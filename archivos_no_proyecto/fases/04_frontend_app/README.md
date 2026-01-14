# Fase 04 — Frontend/App

Objetivo
- Construir la interfaz y conectar con la API.

Entregables
- Pantallas por módulo con estados (loading/error/vacío) y acciones por rol:
	- Login + sesión
	- Clientes (catálogo + búsqueda)
	- Catálogo de servicios/equipos + tarifas vigentes
	- Cotizaciones (crear, editar, enviar, aprobar, regenerar, expirar)
	- Proformas (crear desde cotización, registrar entregas/parcialidades, cerrar)
	- Facturas (previsualizar/validar 3 pasos, emitir, anular)
	- Cuentas por cobrar (pagos, saldos, vencimientos, estado de cuenta)
	- Auditoría visible por documento (mínimo: timeline)
	- Dashboards BI básicos (si se incluyen en el frontend)
- Formularios con validación (incluye validaciones fiscales visibles: NCF/ITBIS).
- Gestión documental:
	- vista/descarga por enlace
	- reenvío (si aplica)
- (Si offline) UX de conectividad:
	- indicador offline
	- cola local de operaciones
	- reintento/sincronización

Checklist de salida
- Flujo end-to-end del MVP funcionando:
	- solicitud/creación cotización → aprobación → proforma → factura fiscal → registro pago → estado de cuenta
- Human-in-loop implementado (aprobaciones internas donde aplique).
- Manejo de sesiones y permisos verificado (acciones no visibles/no ejecutables sin rol).
- Errores de validación fiscal presentados de forma entendible.
