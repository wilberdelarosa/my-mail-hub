import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OutboxRepositoryPort } from '../../../domain/ports/outbound/outbox-repository.port';

@Injectable()
export class SupabaseOutboxRepository implements OutboxRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async enqueue(payload: { eventName: string; payload: Record<string, any> }): Promise<void> {
        const { error } = await this.supabase
            .from('offline_outbox_events')
            .insert({
                event_name: payload.eventName,
                payload: payload.payload,
                status: 'PENDING',
                attempts: 0,
            });

        if (error) throw new Error(`Error enqueuing outbox: ${error.message}`);
    }

    async getPending(limit: number): Promise<Array<{ id: string; eventName: string; payload: Record<string, any>; attempts: number }>> {
        const { data, error } = await this.supabase
            .from('offline_outbox_events')
            .select('id,event_name,payload,attempts')
            .eq('status', 'PENDING')
            .order('created_at', { ascending: true })
            .limit(limit);

        if (error) throw new Error(`Error fetching outbox: ${error.message}`);
        return (data ?? []).map((row: any) => ({
            id: row.id,
            eventName: row.event_name,
            payload: row.payload,
            attempts: row.attempts ?? 0,
        }));
    }

    async markSuccess(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('offline_outbox_events')
            .update({ status: 'SENT', updated_at: new Date() })
            .eq('id', id);

        if (error) throw new Error(`Error marking outbox success: ${error.message}`);
    }

    async markFailed(id: string, errorMessage: string): Promise<void> {
        const { data, error: readError } = await this.supabase
            .from('offline_outbox_events')
            .select('attempts')
            .eq('id', id)
            .single();

        if (readError) throw new Error(`Error reading outbox attempts: ${readError.message}`);

        const attempts = Number(data?.attempts ?? 0) + 1;

        const { error } = await this.supabase
            .from('offline_outbox_events')
            .update({
                status: 'PENDING',
                attempts,
                last_error: errorMessage,
                updated_at: new Date(),
            })
            .eq('id', id);

        if (error) throw new Error(`Error marking outbox failed: ${error.message}`);
    }
}
