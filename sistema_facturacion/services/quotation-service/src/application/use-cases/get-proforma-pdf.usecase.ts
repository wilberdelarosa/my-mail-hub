import { Inject, Injectable } from '@nestjs/common';
import { QuoteRepositoryPort } from '../../domain/ports/outbound/quote-repository.port';
import { DocumentsServicePort } from '../../domain/ports/outbound/documents-service.port';
import { QuoteStatus } from '../../domain/entities/quote.entity';

@Injectable()
export class GetProformaPdfUseCase {
    constructor(
        @Inject(QuoteRepositoryPort)
        private readonly quoteRepository: QuoteRepositoryPort,
        @Inject(DocumentsServicePort)
        private readonly documentsService: DocumentsServicePort
    ) { }

    async execute(proformaId: string): Promise<string> {
        const quote = await this.quoteRepository.findById(proformaId);
        if (!quote) throw new Error('Proforma no encontrada');

        // Prepare data for the template
        const proformaData = {
            proformaId: quote.id,
            proformaNumber: quote.number, // Or generate a specific Proforma Number logic here
            date: quote.createdAt.toLocaleDateString(),
            quoteNumber: quote.number,
            customerName: 'Cliente Temporal', // In real app, fetch Customer Name (or store in quote)
            customerRnc: '000-0000000-0', // Should be in Quote or fetched from Customer Service
            customerAddress: 'Dirección del cliente...',
            items: quote.items.map(item => ({
                quantity: item.quantity,
                code: 'SERV-00X', // Should be in Item
                description: item.description,
                location: 'SD' // Should be in Item or Quote
            })),
            notes: quote.notes || '',
            subtotal: quote.subtotal,
            taxAmount: quote.taxAmount,
            total: quote.total
        };

        // Call Document Service
        const pdfUrl = await this.documentsService.generateProformaPdf(proformaData);
        return pdfUrl;
    }
}
