export type SyncBatchStatus = 'RECEIVED' | 'PROCESSED' | 'PARTIAL' | 'FAILED';
export type SyncEntityStatus = 'ACCEPTED' | 'PUBLISHED' | 'PENDING' | 'CONFLICT' | 'SKIPPED' | 'REJECTED';
export type IdempotencyStatus = 'SUCCESS' | 'CONFLICT' | 'PENDING' | 'SKIPPED';

export class SyncBatch {
    constructor(
        public readonly id: string,
        public readonly deviceId: string,
        public readonly clientId: string | null,
        public readonly timestamp: Date,
        public readonly status: SyncBatchStatus
    ) { }
}

export class SyncEntity {
    constructor(
        public readonly id: string,
        public readonly type: string,
        public readonly payload: Record<string, any>,
        public readonly checksum: string,
        public readonly status: SyncEntityStatus
    ) { }
}

export class IdempotencyRecord {
    constructor(
        public readonly key: string,
        public readonly checksum: string,
        public readonly processedAt: Date,
        public readonly status: IdempotencyStatus
    ) { }
}
