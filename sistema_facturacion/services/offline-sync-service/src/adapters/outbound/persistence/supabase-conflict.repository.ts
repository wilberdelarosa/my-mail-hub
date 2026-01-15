import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConflictRepositoryPort } from '../../../domain/ports/outbound/conflict-repository.port';

@Injectable()
export class SupabaseConflictRepository implements ConflictRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async createConflict(payload: {
        entityType: string;
        entityId: string;
        reason: string;
        existingChecksum?: string | null;
        incomingChecksum?: string | null;
        strategy?: string | null;
        payload?: Record<string, any> | null;
    }): Promise<void> {
        const { error } = await this.supabase
            .from('offline_sync_conflicts')
            .insert({
                entity_type: payload.entityType,
                entity_id: payload.entityId,
                reason: payload.reason,
                existing_checksum: payload.existingChecksum ?? null,
                incoming_checksum: payload.incomingChecksum ?? null,
                strategy: payload.strategy ?? null,
                payload: payload.payload ?? null,
            });

        if (error) throw new Error(`Error creating conflict: ${error.message}`);
    }
}
