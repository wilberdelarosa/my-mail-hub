# Módulo: Auditoría y logs

## 1) Objetivo
- Trazabilidad de acciones críticas y soporte a depuración.

## 2) Entidades (propuesta base)

### auditoria_eventos
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| entidad | text | Sí | factura/cotizacion/cliente/etc |
| entidad_id | text | Sí | id de la entidad |
| accion | text | Sí | crear/editar/cambiar_estado/anular |
| actor_usuario_id | fk | No | null si sistema |
| payload | json/text | No | before/after o diff |
| creado_en | datetime | Sí | |

## 3) Reglas
- Registrar eventos críticos siempre.
- Evitar guardar datos sensibles en payload sin necesidad.

## 4) UI
- Historial en detalle de documentos
- Vista admin (opcional)

## 5) Preguntas obligatorias
- ¿Qué acciones exactas se deben auditar?
- ¿Cuánto tiempo retener auditoría?
