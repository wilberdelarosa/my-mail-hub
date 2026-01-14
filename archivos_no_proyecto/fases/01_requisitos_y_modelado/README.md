# Fase 01 — Requisitos y Modelado

Objetivo
- Aterrizar requisitos funcionales/no funcionales y diseñar el modelo de datos.

Entregables
- Historias de usuario por módulo (P0/P1/P2) alineadas al flujo end-to-end.
- Reglas de negocio (mínimo):
	- cotizaciones: vigencia 15–30 días, expiración, regeneración
	- proformas: parcialidades/avance, cierre
	- facturación fiscal: NCF (tipos, secuencia, vigencia), ITBIS (18%), redondeos
	- CxC: saldos, vencimientos, estados de cuenta, antigüedad
- Requisitos no funcionales (NFR) listos para diseño:
	- trazabilidad/auditabilidad (DGII)
	- seguridad (RBAC, cifrado en tránsito)
	- resiliencia offline (si aplica) y prevención de duplicados
	- disponibilidad, backups, recuperación
	- mantenibilidad (hexagonal/clean)
- Diccionario de datos (campos, tipos, obligatoriedad) por entidad:
	- clientes (RNC/cédula, perfil fiscal)
	- catálogo servicios/equipos y tarifas (versionado/vigencias)
	- cotizaciones + líneas
	- proformas + entregas/parcialidades
	- facturas + líneas + NCF + impuestos
	- pagos + conciliación
	- auditoría de eventos (actor/fecha/before-after)
- Modelo entidad-relación (ERD) y modelos de estado (state machines).
- Diseño de “ownership” de datos por módulo (bounded contexts), aunque sea monolito modular.
- Especificación de eventos (si se usa event bus) y auditoría mínima.
- Modelo de sincronización offline (si aplica):
	- idempotency keys
	- batch/cola local
	- reconciliación y resolución de conflictos

Checklist de salida
- Campos confirmados para: clientes, catálogo/tarifas, cotización, proforma, factura, pagos.
- Estados y transiciones definidos (incluye expiración/regeneración y cierre de proforma).
- Identificadores/numeración definidos:
	- series y secuencias de documentos
	- secuencias NCF (por tipo) + reglas de vigencia
- Reglas fiscales mínimas escritas como “tests de negocio” (ejemplos numéricos).
- Reglas de auditoría: qué se registra, retención y visibilidad.
