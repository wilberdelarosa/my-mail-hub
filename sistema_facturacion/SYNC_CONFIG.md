# 🔄 Configuración de Sincronización de Bases de Datos

## Arquitectura

```
┌─────────────────────┐         ┌─────────────────────┐
│   BD LOCAL          │ ◄─────► │   LOVABLE CLOUD     │
│   (Supabase Local)  │   SYNC  │   (Supabase Cloud)  │
│   Puerto: 54321     │         │   aezitjujnfndkzwgeyhk │
└─────────────────────┘         └─────────────────────┘
         │                               │
         ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   Microservicios    │         │   Frontend Lovable  │
│   (Docker Compose)  │         │   (src/)            │
└─────────────────────┘         └─────────────────────┘
```

## Tablas Sincronizables

| Tabla | Descripción | Sincronización |
|-------|-------------|----------------|
| `clients` | Clientes | Bidireccional |
| `documents` | Cotizaciones, Proformas, Facturas | Bidireccional |
| `document_items` | Líneas de documentos | Bidireccional |
| `equipment` | Catálogo de servicios/equipos | Bidireccional |
| `company_settings` | Configuración empresa | Cloud → Local |
| `profiles` | Perfiles de usuario | Cloud → Local |

## Configuración Local

### 1. Archivo `.env.local` (crear en raíz)

```env
# BD Cloud (Lovable)
VITE_SUPABASE_URL=https://aezitjujnfndkzwgeyhk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# BD Local (Supabase Local)
VITE_LOCAL_SUPABASE_URL=http://127.0.0.1:54321
VITE_LOCAL_SUPABASE_ANON_KEY=<tu_anon_key_local>
VITE_LOCAL_SUPABASE_SERVICE_KEY=<tu_service_key_local>
```

### 2. Iniciar Supabase Local

```bash
cd sistema_facturacion
supabase start
```

### 3. Aplicar Migraciones a BD Local

```bash
# Copiar migraciones de Cloud a local
cp -r ../supabase/migrations/* supabase/migrations/

# Aplicar
supabase db push
```

## Uso del Sistema de Sincronización

### Desde el Frontend (React)

```typescript
import { useDbSync } from '@/hooks/useDbSync';

function MyComponent() {
  const { fetchFromCloud, pushToCloud, syncAllTables, status } = useDbSync();

  // Sincronizar todas las tablas
  const handleFullSync = async () => {
    const { success, results } = await syncAllTables();
    console.log('Sync results:', results);
  };

  // Obtener clientes de la nube
  const getCloudClients = async () => {
    const result = await fetchFromCloud('clients');
    if (result.success) {
      console.log('Clientes:', result.data);
    }
  };

  // Subir clientes locales a la nube
  const uploadClients = async (clients: any[]) => {
    const result = await pushToCloud('clients', clients);
    console.log(`Subidos: ${result.synced_count}`);
  };
}
```

### Desde Microservicios (Node.js)

```typescript
// En services/master-data-service/
import { createClient } from '@supabase/supabase-js';

const cloudClient = createClient(
  process.env.SUPABASE_CLOUD_URL,
  process.env.SUPABASE_CLOUD_SERVICE_KEY
);

const localClient = createClient(
  'http://127.0.0.1:54321',
  process.env.SUPABASE_LOCAL_SERVICE_KEY
);

// Sync bidireccional
async function syncClients() {
  // 1. Obtener de cloud
  const { data: cloudClients } = await cloudClient
    .from('clients')
    .select('*');
  
  // 2. Upsert en local
  await localClient
    .from('clients')
    .upsert(cloudClients, { onConflict: 'id' });
}
```

## Edge Function: db-sync

La edge function `db-sync` permite sincronización autenticada:

**Endpoint:** `POST /functions/v1/db-sync`

**Payload:**
```json
{
  "table": "clients",
  "operation": "fetch_all" | "upsert" | "delete",
  "data": [...],        // Para upsert
  "ids": [...],         // Para delete
  "last_sync": "ISO"    // Filtrar por fecha
}
```

**Respuesta:**
```json
{
  "success": true,
  "synced_count": 10,
  "data": [...],
  "timestamp": "2026-01-15T..."
}
```

## Estrategias de Resolución de Conflictos

| Estrategia | Descripción | Cuándo usar |
|------------|-------------|-------------|
| `cloud_wins` | La nube siempre gana | Datos maestros |
| `local_wins` | Local siempre gana | Modo offline |
| `newer_wins` | El más reciente gana | Edición colaborativa |

## Scripts de Sincronización

### Sync Manual (PowerShell)

```powershell
# En scripts/sync-databases.ps1
$CloudUrl = "https://aezitjujnfndkzwgeyhk.supabase.co"
$LocalUrl = "http://127.0.0.1:54321"

# Exportar de cloud
Invoke-RestMethod -Uri "$CloudUrl/rest/v1/clients" `
  -Headers @{ "apikey" = $env:CLOUD_KEY } `
  -OutFile "clients_backup.json"

# Importar a local
# ... (lógica de import)
```

## Notas Importantes

1. **Autenticación**: La sincronización requiere un usuario autenticado en Lovable Cloud
2. **RLS**: Las políticas RLS aplican a ambas BD
3. **Orden de Sync**: Primero `equipment` y `clients`, luego `documents`, finalmente `document_items`
4. **Backup**: Siempre hacer backup antes de sync masivo

## Troubleshooting

| Problema | Solución |
|----------|----------|
| "No authenticated" | Iniciar sesión en la app |
| "Table not allowed" | Agregar tabla a ALLOWED_TABLES en edge function |
| Conflictos de FK | Sincronizar tablas padre primero |
| Datos duplicados | Verificar que `id` sea UUID único |
