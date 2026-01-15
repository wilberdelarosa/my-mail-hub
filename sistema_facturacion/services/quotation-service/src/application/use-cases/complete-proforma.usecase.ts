import { Inject, Injectable } from '@nestjs/common';
import { QuoteStatus } from '../../domain/entities/quote.entity';
import { QuoteRepositoryPort } from '../../domain/ports/outbound/quote-repository.port';
import { EventPublisherPort } from '../../domain/ports/outbound/event-publisher.port';

@Injectable()
export class CompleteProformaUseCase {
    constructor(
        @Inject(QuoteRepositoryPort)
        private readonly quoteRepository: QuoteRepositoryPort,
        @Inject(EventPublisherPort)
        private readonly eventPublisher: EventPublisherPort
    ) { }

    async execute(quoteId: string): Promise<void> {
        const quote = await this.quoteRepository.findById(quoteId);
        if (!quote) throw new Error('Quote not found');

        if (quote.status !== QuoteStatus.APPROVED) {
            throw new Error('Solo las cotizaciones aprobadas (Proformas) pueden completarse.');
        }

        quote.status = QuoteStatus.COMPLETED;
        await this.quoteRepository.save(quote);

        // Publicar evento para disparar la facturación en Billing Service
        await this.eventPublisher.publish('proforma', 'proforma.completed', {
            proformaId: quote.id,
            customerId: quote.customerId,
            items: quote.items.map(item => ({
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                total: item.total
            })),
            total: quote.total
        });

        console.log(`✅ Proforma/Quote ${quote.number} COMPLETED and event published.`);
    }
}
