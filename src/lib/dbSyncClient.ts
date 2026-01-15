/**
 * Cliente de sincronización para BD local (SQLite/PostgreSQL) con Lovable Cloud
 * 
 * Este archivo proporciona utilidades para sincronizar datos entre:
 * - BD Local (Supabase Local o SQLite) en sistema_facturacion/
 * - BD Cloud (Lovable Cloud/Supabase)
 * 
 * Uso en entorno local:
 * 1. Configurar VITE_LOCAL_SUPABASE_URL en .env.local
 * 2. Usar las funciones de este módulo para sync bidireccional
 */

interface SyncConfig {
  cloudUrl: string;
  cloudKey: string;
  localUrl?: string;
  localKey?: string;
}

interface ConflictResolution {
  strategy: 'cloud_wins' | 'local_wins' | 'newer_wins';
}

interface SyncResult {
  table: string;
  uploaded: number;
  downloaded: number;
  conflicts: number;
  resolved: number;
}

/**
 * Configuración por defecto para la sincronización
 */
export function getDefaultSyncConfig(): SyncConfig {
  return {
    cloudUrl: import.meta.env.VITE_SUPABASE_URL || '',
    cloudKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
    localUrl: import.meta.env.VITE_LOCAL_SUPABASE_URL || 'http://127.0.0.1:54321',
    localKey: import.meta.env.VITE_LOCAL_SUPABASE_ANON_KEY || '',
  };
}

/**
 * Detectar qué ambiente estamos usando
 */
export function detectEnvironment(): 'cloud' | 'local' | 'hybrid' {
  const hasCloud = !!import.meta.env.VITE_SUPABASE_URL;
  const hasLocal = !!import.meta.env.VITE_LOCAL_SUPABASE_URL;
  
  if (hasCloud && hasLocal) return 'hybrid';
  if (hasLocal) return 'local';
  return 'cloud';
}

/**
 * Comparar timestamps para resolver conflictos
 */
export function resolveConflict<T extends { updated_at?: string }>(
  cloudRecord: T,
  localRecord: T,
  resolution: ConflictResolution
): T {
  switch (resolution.strategy) {
    case 'cloud_wins':
      return cloudRecord;
    case 'local_wins':
      return localRecord;
    case 'newer_wins':
      const cloudTime = new Date(cloudRecord.updated_at || 0).getTime();
      const localTime = new Date(localRecord.updated_at || 0).getTime();
      return cloudTime >= localTime ? cloudRecord : localRecord;
    default:
      return cloudRecord;
  }
}

/**
 * Generar reporte de sincronización
 */
export function generateSyncReport(results: SyncResult[]): string {
  const totalUploaded = results.reduce((sum, r) => sum + r.uploaded, 0);
  const totalDownloaded = results.reduce((sum, r) => sum + r.downloaded, 0);
  const totalConflicts = results.reduce((sum, r) => sum + r.conflicts, 0);
  
  const lines = [
    '=== Reporte de Sincronización ===',
    `Fecha: ${new Date().toLocaleString('es-DO')}`,
    '',
    'Por tabla:',
    ...results.map(r => 
      `  ${r.table}: ↑${r.uploaded} ↓${r.downloaded} ⚠${r.conflicts}`
    ),
    '',
    `Total: ${totalUploaded} subidos, ${totalDownloaded} descargados, ${totalConflicts} conflictos`,
  ];
  
  return lines.join('\n');
}

/**
 * Tablas soportadas para sincronización
 */
export const SYNCABLE_TABLES = [
  'clients',
  'documents', 
  'document_items',
  'equipment',
  'company_settings',
  'profiles',
] as const;

/**
 * Campos que se excluyen de la sincronización (generados automáticamente)
 */
export const EXCLUDED_SYNC_FIELDS = [
  'created_at',
] as const;

/**
 * Crear hash único para un registro (para detectar cambios)
 */
export function createRecordHash(record: Record<string, unknown>): string {
  const sortedKeys = Object.keys(record).sort();
  const values = sortedKeys
    .filter(k => !EXCLUDED_SYNC_FIELDS.includes(k as typeof EXCLUDED_SYNC_FIELDS[number]))
    .map(k => `${k}:${JSON.stringify(record[k])}`)
    .join('|');
  
  // Simple hash (en producción usar crypto.subtle)
  let hash = 0;
  for (let i = 0; i < values.length; i++) {
    const char = values.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}