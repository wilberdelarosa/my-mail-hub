import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SyncBatchRepositoryPort } from '../../../domain/ports/outbound/sync-batch-repository.port';
import { SyncBatchStatus } from '../../../domain/entities/sync.entity';

@Injectable()
export class SupabaseSyncBatchRepository implements SyncBatchRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async createBatch(payload: {
        deviceId: string;
        clientId?: string | null;
        timestamp: Date;
        totalEntities: number;
        status: SyncBatchStatus;
        metadata?: Record<string, any>;
    }): Promise<string> {
        const { data, error } = await this.supabase
            .from('offline_sync_batches')
            .insert({
                device_id: payload.deviceId,
                client_id: payload.clientId ?? null,
                batch_timestamp: payload.timestamp,
                status: payload.status,
                total_entities: payload.totalEntities,
                metadata: payload.metadata ?? null,
            })
            .select('id')
            .single();

        if (error) throw new Error(`Error creating batch: ${error.message}`);
        return data.id as string;
    }

    async updateBatchStatus(batchId: string, payload: {
        status: SyncBatchStatus;
        processed: number;
        conflicts: number;
        skipped: number;
        pending: number;
    }): Promise<void> {
        const { error } = await this.supabase
            .from('offline_sync_batches')
            .update({
                status: payload.status,
                processed: payload.processed,
                conflicts: payload.conflicts,
                skipped: payload.skipped,
                pending: payload.pending,
                updated_at: new Date(),
            })
            .eq('id', batchId);

        if (error) throw new Error(`Error updating batch: ${error.message}`);
    }
}
