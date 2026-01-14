# Fases del proyecto (alineadas a anteproyecto + arquitectura)

Este directorio organiza el trabajo por fases, con entregables verificables, basadas en:
- Anteproyecto y problema: `anteproyecto/archivo final/anteproyecto_final_limpio.md` y `anteproyecto/archivo final/planteamiento_problema.md`
- Arquitectura objetivo (microservicios + hexagonal, con alternativa monolito modular): `tesis/arquitectura/arquitectura_microservicios_hexagonal.md`
- Propuesta técnica y operación offline/Drive/n8n/WhatsApp: `tesis/info/informe03.md`
- Métricas/indicadores: `anteproyecto/archivo final/anexo3_variables_indicadores.md`

## Orden recomendado (incremental)

1. 00_vision_alcance
2. 01_requisitos_y_modelado
3. 02_diseno_ux_ui
4. 03_backend_api
5. 04_frontend_app
6. 05_integraciones_y_firma
7. 06_pruebas_y_calidad
8. 07_despliegue_y_operacion
9. 08_seguridad_y_auditoria

## Qué cubre el “sistema completo” (para no perder el rumbo)

Flujo end-to-end mínimo (según arquitectura):
1) solicitud cotización (web/WhatsApp) → 2) cotización (vigencia + aprobación) → 3) proforma (parcialidades/avance) → 4) factura fiscal (NCF + ITBIS, validación) → 5) cuentas por cobrar (saldos, vencimientos, estados de cuenta) → 6) BI/KPI.

Módulos/capabilities clave:
- Identity & Access (auth/RBAC)
- Datos maestros (clientes, catálogo de servicios/equipos, tarifas)
- Cotizaciones (vigencia, aprobación, regeneración)
- Proformas/Delivery (parcialidades, cierre)
- Billing & Tax (factura fiscal, NCF, ITBIS, notas)
- Accounts Receivable (pagos, saldos, mora, estados de cuenta)
- Documents (PDF, plantillas, enlaces; Drive/S3)
- Notifications/Automation (n8n, WhatsApp/email)
- Analytics/BI (KPI/dashboards)
- AI Assist (validaciones, detección anomalías; extracción WhatsApp si aplica)
- Offline Sync (captura local, idempotencia, reconciliación)

## Regla práctica (Definition of Done por fase)

- No se avanza de fase sin criterios de salida mínimos.
- Cada fase debe dejar artefactos verificables: documentos/diagramas, modelo de datos, endpoints, pantallas, pruebas, y (cuando aplica) scripts de despliegue.
- Prioridad de viabilidad: arquitectura objetivo documentada como microservicios, pero implementación inicial recomendada como **monolito modular con hexagonal** (evolutivo a microservicios) si el equipo es pequeño.
