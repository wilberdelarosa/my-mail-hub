import { Injectable } from '@nestjs/common';
import { CreateQuoteUseCase } from './create-quote.usecase';
import { ProcessWhatsAppMessageUseCase } from './process-whatsapp-message.usecase';
import { QuoteRequestCommand } from '../dto/quote-request.dto';

@Injectable()
export class ProcessQuoteRequestUseCase {
    constructor(
        private readonly createQuote: CreateQuoteUseCase,
        private readonly processWhatsApp: ProcessWhatsAppMessageUseCase,
    ) { }

    async execute(command: QuoteRequestCommand) {
        if (command.source === 'WHATSAPP') {
            const { from, text, timestamp } = command.payload;
            if (!from || !text) {
                throw new Error('WHATSAPP payload incompleto');
            }
            await this.processWhatsApp.execute({
                from,
                text,
                timestamp: timestamp || new Date().toISOString(),
            });
            return { status: 'accepted', source: 'WHATSAPP' };
        }

        const { customerId, items, notes, expirationDays } = command.payload;
        if (!customerId || !items || items.length === 0) {
            throw new Error('Payload incompleto para crear cotizacion');
        }

        const quote = await this.createQuote.execute({
            customerId,
            items,
            notes,
            expirationDays,
        });

        return { status: 'created', quoteId: quote.id, number: quote.number };
    }
}
