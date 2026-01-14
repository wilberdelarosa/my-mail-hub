import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArController } from './adapters/inbound/http/ar.controller';
import { SupabasePaymentRepository } from './adapters/outbound/persistence/supabase-payment.repository';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [ArController],
    providers: [SupabasePaymentRepository],
})
export class AppModule { }
