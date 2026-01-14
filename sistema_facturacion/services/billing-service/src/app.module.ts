import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './adapters/inbound/http/billing.controller';
import { SupabaseInvoiceRepository } from './adapters/outbound/persistence/supabase-invoice.repository';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [BillingController],
    providers: [
        SupabaseInvoiceRepository // Provider real ya implementado
    ],
})
export class AppModule { }
