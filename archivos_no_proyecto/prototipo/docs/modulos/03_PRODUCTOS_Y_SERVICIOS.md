# Módulo: Productos y servicios

## 1) Objetivo
- Catálogo reutilizable para items en cotizaciones/facturas.

## 2) Entidades y campos (propuesta base)

### productos
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| sku | text | No | Único si se usa |
| nombre | text | Sí | |
| descripcion | text | No | |
| tipo | text | Sí | producto/servicio |
| precio_unitario | decimal | Sí | |
| aplica_impuesto | bool | Sí | |
| impuesto_porcentaje | decimal | No | si aplica_impuesto=true |
| activo | bool | Sí | |

## 3) Reglas
- Precio por defecto, editable al cotizar.

## 4) API
- CRUD /productos

## 5) UI
- Lista productos
- Formulario producto

## 6) Preguntas obligatorias
- ¿Se maneja inventario (stock) o solo catálogo?
- ¿Impuestos por producto o global por documento?
