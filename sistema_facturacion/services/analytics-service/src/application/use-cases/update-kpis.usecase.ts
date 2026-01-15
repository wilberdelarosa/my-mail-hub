import { Injectable, Inject } from '@nestjs/common';
import { AnalyticsRepositoryPort } from '../../domain/ports/outbound/analytics-repository.port';

@Injectable()
export class UpdateKPIsUseCase {
    constructor(
        @Inject(AnalyticsRepositoryPort)
        private readonly analyticsRepository: AnalyticsRepositoryPort
    ) { }

    async execute(year: number, month: number): Promise<void> {
        await this.analyticsRepository.updateMonthlyKPIs(year, month);
    }
}
