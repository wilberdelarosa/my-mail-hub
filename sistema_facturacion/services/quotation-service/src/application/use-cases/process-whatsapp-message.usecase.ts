import { Injectable, Inject } from '@nestjs/common';
import { QuoteRepositoryPort } from '../../domain/ports/outbound/quote-repository.port';
import { Quote, QuoteStatus } from '../../domain/entities/quote.entity';
import { randomUUID } from 'crypto';

export interface ProcessWhatsAppMessageCommand {
    from: string;
    text: string;
    timestamp: string;
}

@Injectable()
export class ProcessWhatsAppMessageUseCase {
    constructor(
        @Inject(QuoteRepositoryPort)
        private readonly quoteRepository: QuoteRepositoryPort,
        // In the future: @Inject(CustomerRepositoryPort) to link phone to customer
        // In the future: @Inject(AIServicePort) to parse text
    ) { }

    async execute(command: ProcessWhatsAppMessageCommand): Promise<void> {
        console.log(`🧠 Processing WhatsApp Message from ${command.from}: "${command.text}"`);

        // 1. Logic to identify customer from phone number (Placeholder)
        const customerId = 'cust-placeholder-whatsapp';

        // 2. Logic to parse text and find Service Items (Placeholder)
        // For now, we assume a generic request if it contains "cotizacion"
        if (command.text.toLowerCase().includes('cotizar') || command.text.toLowerCase().includes('precio')) {
            await this.createDraftQuote(customerId, command.text);
        } else {
            console.log('ℹ️ Message does not appear to be a quote request. Ignoring for now.');
        }
    }

    private async createDraftQuote(customerId: string, text: string) {
        // Create a basic Draft Quote
        const quote = new Quote(
            randomUUID(),
            'WHATSAPP-DRAFT', // Placeholder number
            customerId,
            [], // items
            QuoteStatus.DRAFT,
            new Date(),
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // validUntil (30 days)
            0, // subtotal
            0, // taxAmount
            0, // total
            0, // totalExempt
            0, // totalTaxable
            `WhatsApp Request: ${text}` // notes
        );

        await this.quoteRepository.save(quote);
        console.log(`✅ Draft Quote created from WhatsApp: ${quote.id}`);

        // TODO: Send confirmation message back to WhatsApp
    }
}
