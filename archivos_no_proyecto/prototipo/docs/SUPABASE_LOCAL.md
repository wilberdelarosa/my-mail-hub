# Supabase local (PostgreSQL + Studio) — Guía práctica

Objetivo
- Levantar Supabase local para desarrollo y poder **ver tablas, datos y flujos** con una UI (Supabase Studio) + PostgreSQL real.

## 1) Requisitos

- Docker Desktop (Windows)
- Node.js (para instalar la CLI) o un método equivalente
- Supabase CLI

## 2) Inicializar Supabase en el repo

Desde la raíz del workspace:
- `supabase init`

Esto crea la carpeta `supabase/` con configuración local.

## 3) Levantar Supabase local

- `supabase start`

Qué obtienes
- PostgreSQL local (en contenedor)
- Supabase Studio (web)
- Servicios opcionales de Supabase (Auth/Storage, según stack)

## 4) Abrir Supabase Studio (previsualización)

Al ejecutar `supabase start`, la CLI imprime URLs.
- Abre la URL de **Studio** en el navegador.

En Studio puedes:
- ver tablas y columnas
- explorar filas
- ejecutar SQL
- revisar políticas (si usas RLS)

## 5) Modelo de datos (migraciones)

En Supabase local, lo más ordenado es usar migraciones SQL:
- Crear migración: `supabase migration new init_schema`
- Editar el SQL generado en `supabase/migrations/..._init_schema.sql`
- Aplicar cambios: normalmente `supabase db reset` (en local) o `supabase migration up` según tu flujo

Buenas prácticas para este proyecto
- Constraints fuertes para evitar errores fiscales:
  - unicidad de NCF
  - secuencias controladas
  - estados válidos
- Tablas de auditoría (eventos) desde el inicio.

## 6) Conexión desde tu backend

Opciones típicas
- Conectar directamente a PostgreSQL del stack local.
- Usar el SDK de Supabase (si decides usar Auth/Storage).

Recomendación práctica (según la arquitectura del repo)
- Usar Postgres como BD principal.
- Mantener Auth/RLS como decisión explícita (no obligatoria para el MVP).

## 7) ¿Y el offline-first?

Importante
- Supabase local no reemplaza el modo offline del cliente.

Si el sistema debe operar sin internet:
- Mantén una BD local en el cliente (SQLite) para “cola de commits”.
- Luego sincroniza a PostgreSQL/Supabase con:
  - idempotency keys
  - batch de operaciones
  - reconciliación

## 8) Qué conviene para “ver estructuras y datos almacenados y flujos”

- Studio: inspección de tablas y datos.
- SQL views:
  - vistas para saldos de CxC
  - vistas para antigüedad de cartera
  - vistas para auditoría por entidad
- Seeds reproducibles:
  - datos de ejemplo para ejecutar F01/F02/F03.

## 9) Sugerencias de operación local

- Backups: al ser contenedor, asegúrate de persistencia/volúmenes.
- Dataset seed: usa scripts SQL versionados.
- BI: si quieres dashboards rápidos, Metabase contra Postgres local.

## 10) Nota sobre seguridad (cuando pases a nube)

- Revisa si usarás RLS (Row Level Security).
- Define roles y permisos (RBAC) a nivel app, y opcionalmente a nivel BD.

