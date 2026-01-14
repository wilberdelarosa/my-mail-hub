# Fase 07 — Despliegue y Operación

Objetivo
- Preparar ejecución en local y/o nube con observabilidad.

Entregables
- Scripts de arranque local y piloto:
	- entorno local (dev)
	- entorno piloto (VPS/Docker o equivalente)
- Variables de entorno documentadas (secrets, llaves, endpoints).
- Backups y restauración:
	- frecuencia
	- pruebas de restore
	- retención
- Observabilidad mínima:
	- logs estructurados
	- healthchecks
	- métricas básicas (latencia API, errores)
	- auditoría accesible
- Operación con conectividad inestable:
	- timeouts
	- reintentos
	- (si offline) sincronización programada y monitoreada
- Procedimientos operativos:
	- creación de usuarios
	- rotación de credenciales
	- procedimientos ante incidentes

Checklist de salida
- Runbook de despliegue y operación (arranque, rollback, incidentes).
- Backups automáticos + restauración probada.
- Checklist de piloto listo (usuarios, permisos, datos seed, monitoreo).
