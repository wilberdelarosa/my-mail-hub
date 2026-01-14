# Módulo: Clientes

## 1) Objetivo
- Mantener catálogo de clientes para cotizaciones/facturas.

## 2) Entidades y campos (propuesta base)

### clientes
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| tipo_identificacion | text | Sí | (CI/RUC/Pasaporte/Otro) |
| identificacion | text | Sí | Único (según tipo) |
| razon_social | text | Sí | |
| nombre_comercial | text | No | |
| email | text | No | |
| telefono | text | No | |
| direccion | text | No | |
| activo | bool | Sí | |
| creado_en | datetime | Sí | |

## 3) Reglas
- Validar unicidad de identificación.
- Normalizar formato (trim, mayúsculas opcional).

## 4) API
- CRUD /clientes

## 5) UI
- Lista clientes
- Formulario cliente

## 6) Preguntas obligatorias
- ¿Campos obligatorios para facturar? (dirección, email, etc.)
- ¿Se maneja multi-sucursal o múltiples direcciones por cliente?
