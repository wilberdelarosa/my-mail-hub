import { Injectable, Inject } from '@nestjs/common';
import { sha256 } from '../../common/hash.util';
import { SyncBatchRepositoryPort } from '../../domain/ports/outbound/sync-batch-repository.port';
import { SyncEntityRepositoryPort } from '../../domain/ports/outbound/sync-entity-repository.port';
import { IdempotencyRepositoryPort } from '../../domain/ports/outbound/idempotency-repository.port';
import { ConflictRepositoryPort } from '../../domain/ports/outbound/conflict-repository.port';
import { OutboxRepositoryPort } from '../../domain/ports/outbound/outbox-repository.port';
import { EventPublisherPort } from '../../domain/ports/outbound/event-publisher.port';
import { IdempotencyStatus, SyncBatchStatus, SyncEntityStatus } from '../../domain/entities/sync.entity';
import { SyncBatchDto } from '../dto/sync-batch.dto';

const ROUTING_MAP: Record<string, string> = {
    CUSTOMER: 'masterdata.customer.offline.upsert',
    SERVICE_ITEM: 'masterdata.service-item.offline.upsert',
    QUOTE: 'quotation.quote.offline.upsert',
    PROFORMA: 'proforma.proforma.offline.upsert',
    INVOICE: 'billing.invoice.offline.upsert',
    PAYMENT: 'ar.payment.offline.upsert',
};

@Injectable()
export class ProcessSyncBatchUseCase {
    constructor(
        @Inject(SyncBatchRepositoryPort)
        private readonly batchRepo: SyncBatchRepositoryPort,
        @Inject(SyncEntityRepositoryPort)
        private readonly entityRepo: SyncEntityRepositoryPort,
        @Inject(IdempotencyRepositoryPort)
        private readonly idempotencyRepo: IdempotencyRepositoryPort,
        @Inject(ConflictRepositoryPort)
        private readonly conflictRepo: ConflictRepositoryPort,
        @Inject(OutboxRepositoryPort)
        private readonly outboxRepo: OutboxRepositoryPort,
        @Inject(EventPublisherPort)
        private readonly eventPublisher: EventPublisherPort,
    ) { }

    async execute(batch: SyncBatchDto) {
        const maxBatch = Number(process.env.OFFLINE_SYNC_MAX_BATCH || 200);
        const strategy = batch.conflictStrategy || (process.env.OFFLINE_SYNC_STRATEGY as any) || 'MANUAL';

        if (batch.entities.length > maxBatch) {
            return {
                error: `Batch excede el maximo permitido (${maxBatch}).`,
            };
        }

        const duplicateIds = new Set<string>();
        const seen = new Set<string>();
        for (const entity of batch.entities) {
            if (seen.has(entity.id)) duplicateIds.add(entity.id);
            seen.add(entity.id);
        }

        const batchId = await this.batchRepo.createBatch({
            deviceId: batch.deviceId,
            clientId: batch.clientId ?? null,
            timestamp: new Date(batch.timestamp),
            totalEntities: batch.entities.length,
            status: 'RECEIVED',
            metadata: { strategy },
        });

        let processed = 0;
        let conflicts = 0;
        let skipped = 0;
        let pending = 0;
        const details: Array<any> = [];

        for (const entity of batch.entities) {
            const key = `${entity.type}:${entity.id}`;
            const checksum = entity.checksum || sha256(entity.payload);

            if (duplicateIds.has(entity.id)) {
                conflicts++;
                await this.conflictRepo.createConflict({
                    entityType: entity.type,
                    entityId: entity.id,
                    reason: 'DUPLICATE_IN_BATCH',
                    incomingChecksum: checksum,
                    strategy,
                    payload: entity.payload,
                });
                await this.entityRepo.saveEntity({
                    batchId,
                    entityId: entity.id,
                    entityType: entity.type,
                    checksum,
                    status: 'CONFLICT',
                    payload: entity.payload,
                    error: 'DUPLICATE_IN_BATCH',
                });
                details.push({ id: entity.id, status: 'CONFLICT', reason: 'DUPLICATE_IN_BATCH' });
                continue;
            }

            if (!ROUTING_MAP[entity.type]) {
                await this.entityRepo.saveEntity({
                    batchId,
                    entityId: entity.id,
                    entityType: entity.type,
                    checksum,
                    status: 'REJECTED',
                    payload: entity.payload,
                    error: 'UNSUPPORTED_TYPE',
                });
                details.push({ id: entity.id, status: 'REJECTED', reason: 'UNSUPPORTED_TYPE' });
                continue;
            }

            const existing = await this.idempotencyRepo.findByKey(key);
            if (existing) {
                if (existing.checksum === checksum && existing.status === 'SUCCESS') {
                    skipped++;
                    await this.entityRepo.saveEntity({
                        batchId,
                        entityId: entity.id,
                        entityType: entity.type,
                        checksum,
                        status: 'SKIPPED',
                        payload: entity.payload,
                        error: 'ALREADY_PROCESSED',
                    });
                    details.push({ id: entity.id, status: 'SKIPPED' });
                    continue;
                }

                if (existing.checksum !== checksum && strategy !== 'CLIENT_WINS') {
                    conflicts++;
                    await this.conflictRepo.createConflict({
                        entityType: entity.type,
                        entityId: entity.id,
                        reason: 'CHECKSUM_MISMATCH',
                        existingChecksum: existing.checksum,
                        incomingChecksum: checksum,
                        strategy,
                        payload: entity.payload,
                    });
                    await this.entityRepo.saveEntity({
                        batchId,
                        entityId: entity.id,
                        entityType: entity.type,
                        checksum,
                        status: 'CONFLICT',
                        payload: entity.payload,
                        error: 'CHECKSUM_MISMATCH',
                    });
                    details.push({ id: entity.id, status: 'CONFLICT', reason: 'CHECKSUM_MISMATCH' });
                    continue;
                }
            }

            try {
                const eventName = ROUTING_MAP[entity.type];
                await this.eventPublisher.publish(eventName, {
                    id: entity.id,
                    type: entity.type,
                    payload: entity.payload,
                    deviceId: batch.deviceId,
                    clientId: batch.clientId ?? null,
                    timestamp: batch.timestamp,
                });

                await this.idempotencyRepo.upsert({
                    key,
                    entityType: entity.type,
                    entityId: entity.id,
                    checksum,
                    status: 'SUCCESS',
                    batchId,
                });

                await this.entityRepo.saveEntity({
                    batchId,
                    entityId: entity.id,
                    entityType: entity.type,
                    checksum,
                    status: 'PUBLISHED',
                    payload: entity.payload,
                });

                processed++;
                details.push({ id: entity.id, status: 'PUBLISHED' });
            } catch (error: any) {
                pending++;
                await this.outboxRepo.enqueue({
                    eventName: ROUTING_MAP[entity.type],
                    payload: {
                        id: entity.id,
                        type: entity.type,
                        payload: entity.payload,
                        deviceId: batch.deviceId,
                        clientId: batch.clientId ?? null,
                        timestamp: batch.timestamp,
                    },
                });

                await this.idempotencyRepo.upsert({
                    key,
                    entityType: entity.type,
                    entityId: entity.id,
                    checksum,
                    status: 'PENDING',
                    batchId,
                });

                await this.entityRepo.saveEntity({
                    batchId,
                    entityId: entity.id,
                    entityType: entity.type,
                    checksum,
                    status: 'PENDING',
                    payload: entity.payload,
                    error: error?.message || 'PUBLISH_FAILED',
                });
                details.push({ id: entity.id, status: 'PENDING', reason: 'PUBLISH_FAILED' });
            }
        }

        const status: SyncBatchStatus = pending > 0 || conflicts > 0 ? 'PARTIAL' : 'PROCESSED';
        await this.batchRepo.updateBatchStatus(batchId, { status, processed, conflicts, skipped, pending });

        return {
            batchId,
            status,
            processed,
            conflicts,
            skipped,
            pending,
            details,
        };
    }
}
