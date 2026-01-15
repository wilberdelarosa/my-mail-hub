import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SyncPayload {
  table: string;
  operation: 'upsert' | 'delete' | 'fetch_all';
  data?: Record<string, unknown>[];
  ids?: string[];
  last_sync?: string;
}

interface SyncResponse {
  success: boolean;
  synced_count?: number;
  data?: Record<string, unknown>[];
  error?: string;
  timestamp: string;
}

interface SyncStatus {
  isLoading: boolean;
  lastSync: string | null;
  error: string | null;
}

const SYNC_TABLES = [
  'clients',
  'documents',
  'document_items',
  'equipment',
  'company_settings',
] as const;

type SyncTable = typeof SYNC_TABLES[number];

/**
 * Hook para sincronizar datos entre BD local y Lovable Cloud
 * 
 * Uso:
 * - fetchFromCloud: Obtener datos de la nube para actualizar local
 * - pushToCloud: Enviar datos locales a la nube
 * - syncTable: Sincronización bidireccional de una tabla
 */
export function useDbSync() {
  const [status, setStatus] = useState<SyncStatus>({
    isLoading: false,
    lastSync: localStorage.getItem('lastDbSync'),
    error: null,
  });

  const getAuthToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  /**
   * Obtener datos de la nube
   */
  const fetchFromCloud = useCallback(async (
    table: SyncTable,
    lastSync?: string
  ): Promise<SyncResponse> => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authenticated');
      }

      const payload: SyncPayload = {
        table,
        operation: 'fetch_all',
        last_sync: lastSync,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/db-sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result: SyncResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Sync failed');
      }

      setStatus(prev => ({
        ...prev,
        isLoading: false,
        lastSync: result.timestamp,
      }));

      localStorage.setItem('lastDbSync', result.timestamp);
      return result;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      return {
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  /**
   * Enviar datos locales a la nube
   */
  const pushToCloud = useCallback(async (
    table: SyncTable,
    data: Record<string, unknown>[]
  ): Promise<SyncResponse> => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authenticated');
      }

      const payload: SyncPayload = {
        table,
        operation: 'upsert',
        data,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/db-sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result: SyncResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Push failed');
      }

      setStatus(prev => ({
        ...prev,
        isLoading: false,
        lastSync: result.timestamp,
      }));

      localStorage.setItem('lastDbSync', result.timestamp);
      return result;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      return {
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  /**
   * Eliminar registros de la nube
   */
  const deleteFromCloud = useCallback(async (
    table: SyncTable,
    ids: string[]
  ): Promise<SyncResponse> => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authenticated');
      }

      const payload: SyncPayload = {
        table,
        operation: 'delete',
        ids,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/db-sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result: SyncResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Delete failed');
      }

      setStatus(prev => ({
        ...prev,
        isLoading: false,
        lastSync: result.timestamp,
      }));

      return result;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      return {
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  /**
   * Sincronización completa de todas las tablas
   */
  const syncAllTables = useCallback(async (): Promise<{
    success: boolean;
    results: Record<string, SyncResponse>;
  }> => {
    const results: Record<string, SyncResponse> = {};
    let allSuccess = true;

    for (const table of SYNC_TABLES) {
      const result = await fetchFromCloud(table, status.lastSync || undefined);
      results[table] = result;
      if (!result.success) {
        allSuccess = false;
      }
    }

    return { success: allSuccess, results };
  }, [fetchFromCloud, status.lastSync]);

  return {
    status,
    fetchFromCloud,
    pushToCloud,
    deleteFromCloud,
    syncAllTables,
    SYNC_TABLES,
  };
}