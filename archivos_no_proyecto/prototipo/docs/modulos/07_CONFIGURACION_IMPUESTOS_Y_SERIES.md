# Módulo: Configuración (impuestos, series, moneda)

## 1) Objetivo
- Centralizar parámetros que afectan cálculos y numeración.

## 2) Entidades (propuesta base)

### series_documento
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| tipo_documento | text | Sí | cotizacion/factura |
| serie | text | Sí | ej. FAC-001 |
| siguiente_numero | int | Sí | |
| activo | bool | Sí | |

### impuestos
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| nombre | text | Sí | IVA |
| porcentaje | decimal | Sí | |
| activo | bool | Sí | |

### configuracion
- clave/valor (solo si hace falta flexibilidad)

## 3) Reglas
- Numeración atómica (evitar duplicados).
- Cambios auditados.

## 4) UI
- Pantalla de configuración (solo admin)

## 5) Preguntas obligatorias
- ¿Se permiten múltiples series por tipo de documento?
- ¿Impuestos por producto, por cliente, o global?
