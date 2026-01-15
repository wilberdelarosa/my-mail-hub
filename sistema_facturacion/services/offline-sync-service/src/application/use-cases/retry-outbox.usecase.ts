import { Injectable, Inject } from '@nestjs/common';
import { OutboxRepositoryPort } from '../../domain/ports/outbound/outbox-repository.port';
import { EventPublisherPort } from '../../domain/ports/outbound/event-publisher.port';

@Injectable()
export class RetryOutboxUseCase {
    constructor(
        @Inject(OutboxRepositoryPort)
        private readonly outboxRepo: OutboxRepositoryPort,
        @Inject(EventPublisherPort)
        private readonly eventPublisher: EventPublisherPort,
    ) { }

    async execute() {
        const limit = Number(process.env.OFFLINE_SYNC_OUTBOX_LIMIT || 50);
        const pending = await this.outboxRepo.getPending(limit);

        let sent = 0;
        let failed = 0;

        for (const event of pending) {
            try {
                await this.eventPublisher.publish(event.eventName, event.payload);
                await this.outboxRepo.markSuccess(event.id);
                sent++;
            } catch (error: any) {
                await this.outboxRepo.markFailed(event.id, error?.message || 'publish_error');
                failed++;
            }
        }

        return { pending: pending.length, sent, failed };
    }
}
