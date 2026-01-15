import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArController } from './adapters/inbound/http/ar.controller';
import { SupabasePaymentRepository } from './adapters/outbound/persistence/supabase-payment.repository';
import { PaymentRepositoryPort } from './domain/ports/outbound/payment-repository.port';
import { InvoiceIssuedConsumer } from './adapters/inbound/events/invoice-issued.consumer';
import { RegisterPaymentUseCase } from './application/use-cases/register-payment.usecase';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [ArController],
    providers: [
        InvoiceIssuedConsumer,
        RegisterPaymentUseCase,
        {
            provide: PaymentRepositoryPort,
            useClass: SupabasePaymentRepository,
        },
    ],
})
export class AppModule { }
