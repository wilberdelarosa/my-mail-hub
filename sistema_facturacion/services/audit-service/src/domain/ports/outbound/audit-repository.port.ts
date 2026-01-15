import { AuditLog } from '../../entities/audit-log.entity';

export interface AuditRepositoryPort {
    save(log: AuditLog): Promise<void>;
    findAll(): Promise<AuditLog[]>;
    findByService(service: string): Promise<AuditLog[]>;
}

export const AuditRepositoryPort = Symbol('AuditRepositoryPort');
