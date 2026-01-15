import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IdempotencyRepositoryPort } from '../../../domain/ports/outbound/idempotency-repository.port';
import { IdempotencyStatus } from '../../../domain/entities/sync.entity';

@Injectable()
export class SupabaseIdempotencyRepository implements IdempotencyRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async findByKey(key: string): Promise<{ key: string; checksum: string; status: IdempotencyStatus } | null> {
        const { data, error } = await this.supabase
            .from('offline_idempotency_keys')
            .select('key,checksum,status')
            .eq('key', key)
            .single();

        if (error || !data) return null;
        return {
            key: data.key,
            checksum: data.checksum,
            status: data.status as IdempotencyStatus,
        };
    }

    async upsert(payload: {
        key: string;
        entityType: string;
        entityId: string;
        checksum: string;
        status: IdempotencyStatus;
        batchId: string;
    }): Promise<void> {
        const { error } = await this.supabase
            .from('offline_idempotency_keys')
            .upsert({
                key: payload.key,
                entity_type: payload.entityType,
                entity_id: payload.entityId,
                checksum: payload.checksum,
                status: payload.status,
                last_batch_id: payload.batchId,
                processed_at: new Date(),
            });

        if (error) throw new Error(`Error upserting idempotency key: ${error.message}`);
    }
}
