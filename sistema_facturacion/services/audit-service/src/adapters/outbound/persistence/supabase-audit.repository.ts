import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuditLog } from '../../../domain/entities/audit-log.entity';
import { AuditRepositoryPort } from '../../../domain/ports/outbound/audit-repository.port';

@Injectable()
export class SupabaseAuditRepository implements AuditRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async save(log: AuditLog): Promise<void> {
        const { error } = await this.supabase
            .from('audit_logs')
            .insert({
                service: log.service,
                entity: log.entity,
                action: log.action,
                entity_id: log.entityId,
                user_id: log.userId,
                ip_address: log.ipAddress,
                payload: log.payload
            });

        if (error) throw new Error(`Error saving audit log: ${error.message}`);
    }

    async findAll(): Promise<AuditLog[]> {
        const { data, error } = await this.supabase
            .from('audit_logs')
            .select('*')
            .order('timestamp', { ascending: false });

        if (error) throw new Error(`Error fetching audit logs: ${error.message}`);
        return (data || []).map(this.mapToEntity);
    }

    async findByService(service: string): Promise<AuditLog[]> {
        const { data, error } = await this.supabase
            .from('audit_logs')
            .select('*')
            .eq('service', service)
            .order('timestamp', { ascending: false });

        if (error) throw new Error(`Error fetching audit logs for service: ${error.message}`);
        return (data || []).map(this.mapToEntity);
    }

    private mapToEntity(data: any): AuditLog {
        return new AuditLog(
            data.id,
            data.service,
            data.entity,
            data.action,
            data.entity_id,
            data.user_id,
            data.ip_address,
            data.payload,
            new Date(data.timestamp)
        );
    }
}
