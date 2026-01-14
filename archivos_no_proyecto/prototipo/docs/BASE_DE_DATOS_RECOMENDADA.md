# Base de datos recomendada (local + previsualización)

## Recomendación principal (prototipo/MVP): SQLite

Por qué
- Se instala “sin servidor”: un archivo `.db`.
- Muy buena para prototipos y desktop/local.
- Fácil de respaldar, versionar seeds y mover entre máquinas.
- Se puede previsualizar tablas, relaciones y datos con herramientas gráficas.

Cómo ver estructuras y datos
- Opción 1 (GUI): **DB Browser for SQLite**
  - Permite ver tablas, schema, ejecutar consultas y exportar.
- Opción 2 (VS Code): extensión de SQLite (para explorar y correr queries desde el editor).
- Opción 3 (CLI): `sqlite3` para inspección rápida.

JSON vs tablas
- Recomendado: **modelo relacional** para lo core (documentos, items, clientes, productos).
- Usar JSON solo para:
  - metadata opcional
  - configuración flexible
  - payloads de integraciones

Notas
- SQLite soporta el módulo **JSON1** (consultas sobre JSON) en la mayoría de builds modernas.

Ubicación sugerida del archivo
- `data/app.db` (local)
- `data/seed.sql` (datos de ejemplo)

## Alternativa cuando crezca (multiusuario/concurrencia): PostgreSQL

Cuándo cambiar
- Concurrencia alta
- Necesidad de roles complejos a nivel BD
- Reportería pesada

Previsualización
- pgAdmin, DBeaver o extensiones VS Code.

## Opción “mejor de ambos mundos” en local: Supabase local (PostgreSQL + Studio)

Cuándo conviene
- Quieres **PostgreSQL real** desde el día 1 (más cercano a producción).
- Quieres **previsualizar tablas/datos** fácil con **Supabase Studio** (web).
- Te interesa habilitar luego **Auth/Storage** (opcional) sin armarlo desde cero.

Ventajas
- Base fuerte para multiusuario, concurrencia, constraints y reportes.
- Studio facilita ver:
  - schema/DDL
  - tablas y filas
  - queries
  - roles/RLS (si lo usas)

Costos / trade-offs
- Requiere Docker + Supabase CLI (más pesado que SQLite).
- Para offline-first en el cliente, **igual** puede convenir una BD local (ej. SQLite) + sincronización.

Cómo previsualizar
- Supabase Studio (UI web) incluido al levantar Supabase local.

Guía paso a paso
- Ver: `prototipo/docs/SUPABASE_LOCAL.md`

## Qué se debe poder visualizar siempre

- Tablas + columnas (tipos y constraints)
- Relaciones (FK)
- Estados de documentos
- Auditoría de eventos
- Datos seed para reproducir flujos
