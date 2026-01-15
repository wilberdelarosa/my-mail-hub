import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './adapters/inbound/http/billing.controller';
import { SupabaseInvoiceRepository } from './adapters/outbound/persistence/supabase-invoice.repository';
import { InvoiceRepositoryPort } from './domain/ports/outbound/invoice-repository.port';
import { IssueInvoiceUseCase } from './application/use-cases/issue-invoice.usecase';
import { EventPublisherPort } from './domain/ports/outbound/event-publisher.port';
import { RabbitMQPublisher } from './adapters/outbound/events/rabbitmq-publisher';
import { ProformaCompletedConsumer } from './adapters/inbound/events/proforma-completed.consumer';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [BillingController],
    providers: [
        IssueInvoiceUseCase,
        ProformaCompletedConsumer,
        {
            provide: InvoiceRepositoryPort,
            useClass: SupabaseInvoiceRepository,
        },
        {
            provide: EventPublisherPort,
            useClass: RabbitMQPublisher,
        }
    ],
})
export class AppModule { }
