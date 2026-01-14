# Fase 00 — Visión y Alcance

Objetivo
- Definir qué se construye (y qué NO), para evitar retrabajo.

Contexto (debe quedar explícito)
- País/norma: República Dominicana (DGII / NCF / ITBIS).
- Problemas actuales: manualidad (Excel), errores NCF/ITBIS, falta de trazabilidad y dispersión de datos.

Entregables
- Objetivo del sistema y público.
- Alcance MVP vs. “sistema completo” (capabilities).
- Canales de entrada/salida:
	- Web app (cliente + operación interna)
	- WhatsApp (bot/ingreso asistido) (si se incluye en MVP)
	- Documentos por enlace (Drive/S3) y notificaciones (WhatsApp/email)
- Roles (actor) y permisos a alto nivel (RBAC): admin, operación, contabilidad, lectura.
- Lista de módulos y prioridad (P0/P1/P2) alineada al flujo:
	- P0: clientes + catálogo/tarifas + cotización + proforma + facturación fiscal (NCF/ITBIS) + CxC + documentos PDF/enlace + auditoría.
	- P1: notificaciones (n8n), BI (dashboards), offline básico.
	- P2: IA (anomalías/extracción), mejoras offline, hardening, integraciones extra.
- Principios de factibilidad:
	- Arquitectura objetivo en microservicios.
	- Implementación inicial recomendada: monolito modular con hexagonal (evolutivo).
- Métricas de éxito y línea base (tomadas del anexo de indicadores):
	- reducción de errores NCF/ITBIS
	- tiempo “solicitud → cotización” y “proforma → factura”
	- % expedientes auditables
	- adopción (usuarios activos) y satisfacción

Decisiones que se deben cerrar aquí (bloqueantes)
- Tipos de NCF que se usarán (consumidor final, crédito fiscal, etc.) y reglas de secuencia/vigencia.
- Reglas fiscales mínimas: ITBIS (18%) y casos exentos (si existen).
- Regla operativa clave: factura fiscal solo tras proforma cerrada y pago validado (si aplica).
- Vigencia de cotizaciones: 15–30 días + regeneración con precios actualizados.
- Documento “proforma” es obligatorio o opcional.
- Offline-first: requerido (sí/no) y alcance (captura, sincronización, resolución de conflictos).
- Almacenamiento de PDFs: Drive/S3 por enlace (sí/no) y política de retención.

Checklist de salida
- MVP definido en 1–2 páginas (P0).
- Matriz P0/P1/P2 con dependencias.
- Flujos end-to-end acordados (cotización→proforma→factura→CxC).
- Criterios de éxito (KPIs) con cómo se medirán.
- Aprobación del cliente/usuario final.
