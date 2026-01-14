# Prototipo (0 → 100): guía paso a paso

Objetivo
- Documentar y ejecutar el prototipo de facturación desde cero hasta un sistema completo, por módulos, con flujos verificables y datos inspeccionables.

Principios
- Primero preguntas, luego diseño, luego código.
- Un módulo se considera “hecho” solo si tiene: datos + reglas + UI + API + pruebas mínimas + flujo demostrable.
- Todo lo crítico debe poder auditarse y visualizarse (tablas, estados, relaciones y eventos).

## 0. Decisiones iniciales (bloqueantes)

Antes de escribir código, confirmar:
1. País/norma de facturación (si aplica) y requisitos legales mínimos.
2. Moneda(s), impuestos, y si hay retenciones/ICE/IVA/otros.
3. Numeración: series, secuencias, reinicios por año, etc.
4. Documentos objetivo: cotización, factura, nota de crédito/débito, recibo/pago.
5. Roles y permisos mínimos (admin, vendedor, contador, lectura).
6. Alcance del prototipo: MVP (P0) vs. completo.

Entregables
- Lista P0/P1/P2 de módulos.
- Diccionario de datos preliminar.

## 1. Estructura mínima del sistema (MVP)

Módulos P0 recomendados
- Autenticación + usuarios/roles
- Clientes
- Productos/servicios
- Cotizaciones
- Facturas
- Pagos/estado de cobro (mínimo: pendiente/pagada/parcial)
- Configuración (impuestos, series, moneda)
- Auditoría básica (quién hizo qué y cuándo)

Flujos P0
- F01: Crear cotización → aprobar → convertir a factura
- F02: Emitir factura → registrar pago → ver estado

## 2. Ruta de implementación (incremental)

### Paso A — Modelo de datos (base)

Checklist
- Definir entidades y relaciones (ERD):
  - usuarios, roles
  - clientes
  - productos
  - cotizaciones + items
  - facturas + items
  - pagos
  - configuracion (impuestos, series)
  - auditoria_eventos
- Definir estados y transiciones:
  - cotización: borrador → enviada → aprobada → rechazada → expirada
  - factura: borrador → emitida → anulada
  - pago: registrado → anulado (si aplica)

Criterio de salida
- Se puede abrir la BD local y ver todas las tablas, claves y campos.

### Paso B — Reglas de negocio (cálculos)

Checklist
- Cálculo de totales por línea y documento:
  - subtotal, descuentos, impuestos, total
- Redondeos (2 decimales, reglas contables)
- Validez de cotización (días) y expiración
- Numeración (serie + secuencia) sin colisiones

Criterio de salida
- Casos de prueba con ejemplos numéricos y resultados esperados.

### Paso C — API (contratos por módulo)

Checklist
- CRUD de clientes/productos
- Cotizaciones: crear/editar/enviar/aprobar/convertir
- Facturas: emitir/listar/detalle/anular
- Pagos: registrar/listar/anular

Criterio de salida
- Endpoints documentados por módulo (mínimo: lista + detalle + crear + cambiar estado).

### Paso D — UI (pantallas esenciales)

Checklist
- Login
- Listas + formularios (clientes, productos)
- Cotizaciones: lista + editor con items
- Facturas: lista + detalle
- Pagos: registrar sobre factura

Criterio de salida
- Flujo F01 y F02 ejecutable de punta a punta.

### Paso E — Auditoría y trazabilidad

Checklist
- Registrar eventos críticos:
  - creación/edición/anulación
  - cambios de estado
  - cambios de configuración
- Mostrar en UI (por documento) el historial mínimo

Criterio de salida
- Se puede inspeccionar auditoría en tabla y en UI.

### Paso F — Calidad y pruebas

Checklist
- Pruebas unitarias de cálculos
- Pruebas de integración de estados (transiciones válidas)
- Dataset seed

Criterio de salida
- Pruebas corren sin depender de datos manuales.

## 3. Documentación por módulo

Ver carpeta:
- docs/modulos/

Convención
- Cada módulo debe cubrir: Objetivo → Campos → Reglas → API → UI → Validaciones → Auditoría → Pruebas → Datos seed.

## 4. Flujos end-to-end

Ver carpeta:
- docs/flujos/

Convención
- Cada flujo debe especificar: precondiciones → pasos → cambios en BD (tablas) → endpoints/pantallas → criterios de aceptación.
