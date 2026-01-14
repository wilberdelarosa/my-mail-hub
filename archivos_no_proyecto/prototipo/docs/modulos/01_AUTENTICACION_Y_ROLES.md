# Módulo: Autenticación y roles

## 1) Objetivo
- Controlar acceso al sistema y permisos por rol.

## 2) Alcance
- Login/logout
- Sesión/token
- Roles y permisos mínimos

## 3) Entidades y campos (propuesta base)

### usuarios
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| email | text | Sí | Único |
| password_hash | text | Sí | Nunca guardar contraseña plana |
| nombre | text | Sí | |
| activo | bool | Sí | |
| creado_en | datetime | Sí | |

### roles
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| id | uuid/int | Sí | PK |
| nombre | text | Sí | Único (admin, vendedor, contador, lector) |

### usuarios_roles
| Campo | Tipo | Req | Notas |
|---|---|---:|---|
| usuario_id | fk | Sí | |
| rol_id | fk | Sí | |

## 4) Reglas de negocio
- Bloquear usuarios inactivos.
- Auditar accesos y cambios de rol.

## 5) API (mínimo)
- POST /auth/login
- POST /auth/logout
- GET /me
- CRUD /usuarios (solo admin)
- CRUD /roles (opcional, o fijo)

## 6) UI
- Pantalla login
- Gestión de usuarios (admin)

## 7) Preguntas obligatorias
- ¿Se usará email+password o también 2FA?
- ¿Cuáles roles exactos y qué permisos por módulo?
- ¿Se requiere multiempresa? (impacta permisos y partición de datos)
