import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsController } from './adapters/inbound/http/analytics.controller';
import { GetKPISummaryUseCase } from './application/use-cases/get-kpi-summary.usecase';
import { GetDashboardDataUseCase } from './application/use-cases/get-dashboard-data.usecase';
import { UpdateKPIsUseCase } from './application/use-cases/update-kpis.usecase';
import { AnalyticsRepositoryPort } from './domain/ports/outbound/analytics-repository.port';
import { SupabaseAnalyticsRepository } from './adapters/outbound/persistence/supabase-analytics.repository';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [AnalyticsController],
    providers: [
        GetKPISummaryUseCase,
        GetDashboardDataUseCase,
        UpdateKPIsUseCase,
        {
            provide: AnalyticsRepositoryPort,
            useClass: SupabaseAnalyticsRepository,
        },
    ],
})
export class AppModule { }
