import { SyncEntityStatus } from '../../entities/sync.entity';

export abstract class SyncEntityRepositoryPort {
    abstract saveEntity(payload: {
        batchId: string;
        entityId: string;
        entityType: string;
        checksum: string;
        status: SyncEntityStatus;
        payload: Record<string, any>;
        error?: string | null;
    }): Promise<void>;
}
