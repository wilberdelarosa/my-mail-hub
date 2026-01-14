# Fase 06 — Pruebas y Calidad

Objetivo
- Asegurar calidad: pruebas, datos de prueba, y regresión.

Entregables
- Pruebas unitarias y de integración por módulos.
- Casos E2E del flujo principal:
	- cotización → aprobación → proforma (parcialidades) → factura fiscal → pago → estado de cuenta
- Dataset semilla (seed) controlado:
	- clientes duplicados (para probar limpieza/validación)
	- tarifas vigentes vs vencidas
	- casos NCF (secuencia, vencimiento, tipo incorrecto)
	- casos ITBIS (exento/no exento, redondeo)
- Pruebas de reglas críticas (riesgo DGII):
	- no duplicidad de NCF
	- no saltos no justificados (si aplica)
	- trazabilidad completa de expedientes
- Pruebas de resiliencia:
	- reintentos idempotentes
	- (si offline) sincronización con reconexión y deduplicación
- Plan de UAT/Piloto con criterios medibles (variables/indicadores del anexo).

Checklist de salida
- Casos críticos cubiertos (NCF, ITBIS, estados, auditoría, CxC).
- Evidencia de no-regresión en cálculos.
- UAT/piloto ejecutado (o listo para ejecutar) con checklist y métricas.
