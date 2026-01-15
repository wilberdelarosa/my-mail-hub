import { Inject, Injectable } from '@nestjs/common';
import { QuoteStatus } from '../../domain/entities/quote.entity';
import { QuoteRepositoryPort } from '../../domain/ports/outbound/quote-repository.port';
import { EventPublisherPort } from '../../domain/ports/outbound/event-publisher.port';

@Injectable()
export class ApproveQuoteUseCase {
    constructor(
        @Inject(QuoteRepositoryPort)
        private readonly quoteRepository: QuoteRepositoryPort,
        @Inject(EventPublisherPort)
        private readonly eventPublisher: EventPublisherPort
    ) { }

    async execute(quoteId: string): Promise<void> {
        const quote = await this.quoteRepository.findById(quoteId);
        if (!quote) throw new Error('Quote not found');

        quote.status = QuoteStatus.APPROVED;
        await this.quoteRepository.save(quote);

        // Publicar evento para disparar la Saga (Creación de Proforma)
        await this.eventPublisher.publish('quotation', 'quote.approved', {
            quoteId: quote.id,
            customerId: quote.customerId,
            items: quote.items.map(item => ({
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate
            })),
            total: quote.total
        });

        console.log(`✅ Quote ${quote.number} APPROVED and event published.`);
    }
}
