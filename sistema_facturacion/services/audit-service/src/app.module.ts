import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditRepositoryPort } from './domain/ports/outbound/audit-repository.port';
import { SupabaseAuditRepository } from './adapters/outbound/persistence/supabase-audit.repository';
import { CentralAuditConsumer } from './adapters/inbound/events/central-audit.consumer';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [],
    providers: [
        CentralAuditConsumer,
        {
            provide: AuditRepositoryPort,
            useClass: SupabaseAuditRepository,
        },
    ],
})
export class AppModule { }
