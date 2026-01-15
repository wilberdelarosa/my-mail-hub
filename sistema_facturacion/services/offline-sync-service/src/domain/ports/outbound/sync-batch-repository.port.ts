import { SyncBatchStatus } from '../../entities/sync.entity';

export abstract class SyncBatchRepositoryPort {
    abstract createBatch(payload: {
        deviceId: string;
        clientId?: string | null;
        timestamp: Date;
        totalEntities: number;
        status: SyncBatchStatus;
        metadata?: Record<string, any>;
    }): Promise<string>;

    abstract updateBatchStatus(batchId: string, payload: {
        status: SyncBatchStatus;
        processed: number;
        conflicts: number;
        skipped: number;
        pending: number;
    }): Promise<void>;
}
