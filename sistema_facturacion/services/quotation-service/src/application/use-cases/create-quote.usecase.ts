import { Inject, Injectable } from '@nestjs/common';
import { Quote, QuoteStatus } from '../../domain/entities/quote.entity';
import { QuoteItem } from '../../domain/entities/quote-item.entity';
import { QuoteRepositoryPort } from '../../domain/ports/outbound/quote-repository.port';

export interface CreateQuoteCommand {
    customerId: string;
    items: {
        serviceItemId: string;
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        unit?: string;
    }[];
    notes?: string;
    expirationDays?: number;
}

@Injectable()
export class CreateQuoteUseCase {
    constructor(
        @Inject(QuoteRepositoryPort)
        private readonly quoteRepository: QuoteRepositoryPort
    ) { }

    async execute(command: CreateQuoteCommand): Promise<Quote> {
        const sequence = await this.quoteRepository.getNextSequence();
        const number = `COT-${new Date().getFullYear()}-${sequence.toString().padStart(4, '0')}`;

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + (command.expirationDays || 30));

        const quoteItems = command.items.map(item => new QuoteItem(
            crypto.randomUUID(),
            item.serviceItemId,
            item.description,
            item.quantity,
            item.unitPrice,
            item.taxRate,
            item.unit || 'PA'
        ));

        const quote = new Quote(
            crypto.randomUUID(),
            number,
            command.customerId,
            quoteItems,
            QuoteStatus.DRAFT,
            new Date(),
            expirationDate,
            0, 0, 0, 0, 0, // Calculated below (Sub, Tax, Total, Exempt, Taxable)
            command.notes
        );

        quote.calculateTotals();

        return this.quoteRepository.save(quote);
    }
}
