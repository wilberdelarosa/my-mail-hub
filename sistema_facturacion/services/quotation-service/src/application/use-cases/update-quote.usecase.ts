
import { Inject, Injectable } from '@nestjs/common';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteItem } from '../../domain/entities/quote-item.entity';
import { QuoteRepositoryPort } from '../../domain/ports/outbound/quote-repository.port';
import { CreateQuoteDto } from '../../adapters/inbound/http/dtos/quote.dto';

@Injectable()
export class UpdateQuoteUseCase {
    constructor(
        @Inject(QuoteRepositoryPort)
        private readonly repository: QuoteRepositoryPort,
    ) { }

    async execute(id: string, dto: CreateQuoteDto): Promise<Quote> {
        const existingQuote = await this.repository.findById(id);
        if (!existingQuote) throw new Error('Cotización no encontrada');

        // ... inside execute ...
        const updatedItems = dto.items.map(i => new QuoteItem(
            crypto.randomUUID(), // New ID for updated items (simple approach)
            i.serviceItemId,
            i.description,
            i.quantity,
            i.unitPrice,
            i.taxRate,
            i.unit || 'UD'
        ));

        // Create a new instance BUT we need to preserve ID and Number
        // Ideally we should have setters or methods on the entity, but re-instantiating works for this POC
        const updatedQuote = new Quote(
            id,
            existingQuote.number,
            dto.customerId,
            updatedItems,
            existingQuote.status,
            existingQuote.createdAt,
            existingQuote.expirationDate, // Preserve or update expiration logic? Preserving for now
            0, 0, 0, 0, 0, // Zeros, will be calculated
            dto.notes || existingQuote.notes
        );

        updatedQuote.calculateTotals();

        await this.repository.save(updatedQuote);
        return updatedQuote;
    }
}
