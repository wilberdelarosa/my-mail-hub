import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuoteController } from './adapters/inbound/http/quote.controller';
import { ManualQuotationController } from './adapters/inbound/http/manual-quotation.controller';
import { CreateQuoteUseCase } from './application/use-cases/create-quote.usecase';
import { QuoteRepositoryPort } from './domain/ports/outbound/quote-repository.port';
import { SupabaseQuoteRepository } from './adapters/outbound/persistence/supabase-quote.repository';

import { ApproveQuoteUseCase } from './application/use-cases/approve-quote.usecase';
import { UpdateQuoteUseCase } from './application/use-cases/update-quote.usecase';
import { EventPublisherPort } from './domain/ports/outbound/event-publisher.port';
import { RabbitMQPublisher } from './adapters/outbound/events/rabbitmq-publisher';

import { ProformaController } from './adapters/inbound/http/proforma.controller';
import { GetProformasUseCase } from './application/use-cases/get-proformas.usecase';
import { CompleteProformaUseCase } from './application/use-cases/complete-proforma.usecase';

import { HttpDocumentsServiceAdapter } from './adapters/outbound/http/http-documents-service.adapter';
import { DocumentsServicePort } from './domain/ports/outbound/documents-service.port';

import { GetProformaPdfUseCase } from './application/use-cases/get-proforma-pdf.usecase';
import { ProcessWhatsAppMessageUseCase } from './application/use-cases/process-whatsapp-message.usecase';
import { ProcessQuoteRequestUseCase } from './application/use-cases/process-quote-request.usecase';

import { WhatsAppWebhookController } from './adapters/inbound/http/whatsapp-webhook.controller';
import { QuoteRequestConsumers } from './adapters/inbound/events/quote-request.consumers';
import { QuoteRequestPublisher } from './adapters/outbound/events/quote-request.publisher';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [QuoteController, ManualQuotationController, ProformaController, WhatsAppWebhookController],
    providers: [
        CreateQuoteUseCase,
        ApproveQuoteUseCase,
        UpdateQuoteUseCase,
        GetProformasUseCase,
        CompleteProformaUseCase,
        GetProformaPdfUseCase,
        {
            provide: QuoteRepositoryPort,
            useClass: SupabaseQuoteRepository,
        },
        {
            provide: EventPublisherPort,
            useClass: RabbitMQPublisher,
        },
        {
            provide: DocumentsServicePort,
            useClass: HttpDocumentsServiceAdapter,
        },
        ProcessWhatsAppMessageUseCase,
        ProcessQuoteRequestUseCase,
        QuoteRequestPublisher,
        QuoteRequestConsumers,
    ],
})
export class AppModule { }
