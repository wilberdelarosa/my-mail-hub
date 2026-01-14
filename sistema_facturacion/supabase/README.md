# Supabase local — en `sistema_facturacion/supabase`

Objetivo
- Instrucciones rápidas para inicializar Supabase local desde esta carpeta.

Requisitos previos
- Docker Desktop instalado y corriendo (Windows).
- Supabase CLI instalado (`npm i -g supabase` o descargar release).

Pasos rápidos
1. Abrir PowerShell en la raíz del proyecto (`C:\Users\wilbe\Downloads\TESISFACTURACION`).
2. Inicializar supabase dentro de esta carpeta (si no se ha hecho):

```powershell
cd sistema_facturacion/supabase
supabase init
```

3. Levantar Supabase local:

```powershell
supabase start
```

4. Abrir Supabase Studio: la CLI mostrará la URL.

Notas
- Para el proyecto hemos documentado la guía amplia en `prototipo/docs/SUPABASE_LOCAL.md`.
- Si prefieres usar `docker-compose`, ver `sistema_facturacion/docker/docker-compose.yml`.
