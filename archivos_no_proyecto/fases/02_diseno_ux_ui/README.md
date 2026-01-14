# Fase 02 — Diseño UX/UI

Objetivo
- Diseñar la experiencia y pantallas principales antes de programar.

Entregables
- Mapa de navegación por roles (operación/contabilidad/admin).
- Wireframes (baja fidelidad) + checklist por pantalla.
- Componentes UI reusables (tablas, formularios, modales, stepper).
- Flujos UX end-to-end (mínimo):
	- Solicitud cotización (web) / ingreso por WhatsApp (si aplica)
	- Revisión/aprobación interna (human-in-loop)
	- Proforma: registro de parcialidades/avances y cierre
	- Factura fiscal: **validación 3 pasos** (previsualizar → warnings → confirmar)
	- CxC: registrar pago, ver saldo, vencimientos, estado de cuenta
- Estados y mensajes:
	- expiración cotización + regeneración
	- errores fiscal/NCF (secuencia, vencido, tipo incorrecto)
	- manejo de conectividad (offline/online) si aplica
- UX de documentos:
	- vista/descarga por enlace (Drive/S3)
	- reenvío por WhatsApp/email
- UX de BI:
	- dashboards iniciales (2–3) y KPIs (5–8) para piloto

Checklist de salida
- Flujo completo: cotización → proforma (parcialidades) → factura fiscal → CxC.
- Pantallas mínimas listas para implementar (listas + detalle + acciones por estado).
- Estados vacíos, loading, errores y confirmaciones definidos.
- Diseño de permisos visible en UI (acciones habilitadas por rol).
