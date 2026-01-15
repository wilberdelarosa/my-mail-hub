import { Injectable, Inject } from '@nestjs/common';
import { AnalyticsRepositoryPort } from '../../domain/ports/outbound/analytics-repository.port';
import { KPISummary } from '../../domain/types/metrics.types';

@Injectable()
export class GetKPISummaryUseCase {
    constructor(
        @Inject(AnalyticsRepositoryPort)
        private readonly analyticsRepository: AnalyticsRepositoryPort
    ) { }

    async execute(periodType: string, periodKey: string): Promise<KPISummary | null> {
        return await this.analyticsRepository.getKPISummary(periodType, periodKey);
    }
}
