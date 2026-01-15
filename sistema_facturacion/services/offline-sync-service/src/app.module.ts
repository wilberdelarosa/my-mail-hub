import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SyncController } from './adapters/inbound/http/sync.controller';
import { ProcessSyncBatchUseCase } from './application/use-cases/process-sync.usecase';
import { RetryOutboxUseCase } from './application/use-cases/retry-outbox.usecase';
import { SyncBatchRepositoryPort } from './domain/ports/outbound/sync-batch-repository.port';
import { SyncEntityRepositoryPort } from './domain/ports/outbound/sync-entity-repository.port';
import { IdempotencyRepositoryPort } from './domain/ports/outbound/idempotency-repository.port';
import { ConflictRepositoryPort } from './domain/ports/outbound/conflict-repository.port';
import { OutboxRepositoryPort } from './domain/ports/outbound/outbox-repository.port';
import { EventPublisherPort } from './domain/ports/outbound/event-publisher.port';
import { SupabaseSyncBatchRepository } from './adapters/outbound/persistence/supabase-sync-batch.repository';
import { SupabaseSyncEntityRepository } from './adapters/outbound/persistence/supabase-sync-entity.repository';
import { SupabaseIdempotencyRepository } from './adapters/outbound/persistence/supabase-idempotency.repository';
import { SupabaseConflictRepository } from './adapters/outbound/persistence/supabase-conflict.repository';
import { SupabaseOutboxRepository } from './adapters/outbound/persistence/supabase-outbox.repository';
import { RabbitMQEventPublisher } from './adapters/outbound/events/rabbitmq-event.publisher';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [SyncController],
    providers: [
        ProcessSyncBatchUseCase,
        RetryOutboxUseCase,
        {
            provide: SyncBatchRepositoryPort,
            useClass: SupabaseSyncBatchRepository,
        },
        {
            provide: SyncEntityRepositoryPort,
            useClass: SupabaseSyncEntityRepository,
        },
        {
            provide: IdempotencyRepositoryPort,
            useClass: SupabaseIdempotencyRepository,
        },
        {
            provide: ConflictRepositoryPort,
            useClass: SupabaseConflictRepository,
        },
        {
            provide: OutboxRepositoryPort,
            useClass: SupabaseOutboxRepository,
        },
        {
            provide: EventPublisherPort,
            useClass: RabbitMQEventPublisher,
        }
    ],
})
export class AppModule { }
