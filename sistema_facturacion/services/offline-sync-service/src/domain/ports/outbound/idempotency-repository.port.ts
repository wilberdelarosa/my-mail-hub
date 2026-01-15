import { IdempotencyStatus } from '../../entities/sync.entity';

export abstract class IdempotencyRepositoryPort {
    abstract findByKey(key: string): Promise<{
        key: string;
        checksum: string;
        status: IdempotencyStatus;
    } | null>;

    abstract upsert(payload: {
        key: string;
        entityType: string;
        entityId: string;
        checksum: string;
        status: IdempotencyStatus;
        batchId: string;
    }): Promise<void>;
}
