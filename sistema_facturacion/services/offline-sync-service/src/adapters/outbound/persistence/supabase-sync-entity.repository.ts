import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SyncEntityRepositoryPort } from '../../../domain/ports/outbound/sync-entity-repository.port';
import { SyncEntityStatus } from '../../../domain/entities/sync.entity';

@Injectable()
export class SupabaseSyncEntityRepository implements SyncEntityRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async saveEntity(payload: {
        batchId: string;
        entityId: string;
        entityType: string;
        checksum: string;
        status: SyncEntityStatus;
        payload: Record<string, any>;
        error?: string | null;
    }): Promise<void> {
        const { error } = await this.supabase
            .from('offline_sync_entities')
            .insert({
                batch_id: payload.batchId,
                entity_id: payload.entityId,
                entity_type: payload.entityType,
                checksum: payload.checksum,
                status: payload.status,
                payload: payload.payload,
                error: payload.error ?? null,
            });

        if (error) throw new Error(`Error saving sync entity: ${error.message}`);
    }
}
