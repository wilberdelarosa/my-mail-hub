import { Inject, Injectable } from '@nestjs/common';
import { Quote, QuoteStatus } from '../../domain/entities/quote.entity';
import { QuoteRepositoryPort } from '../../domain/ports/outbound/quote-repository.port';

@Injectable()
export class GetProformasUseCase {
    constructor(
        @Inject(QuoteRepositoryPort)
        private readonly quoteRepository: QuoteRepositoryPort
    ) { }

    async execute(): Promise<Quote[]> {
        const allQuotes = await this.quoteRepository.findAll();
        // Filtrar las que son consideradas Proformas (Aprobadas en adelante)
        return allQuotes.filter(q =>
            q.status === QuoteStatus.APPROVED ||
            q.status === QuoteStatus.COMPLETED ||
            q.status === QuoteStatus.INVOICED
        );
    }
}
