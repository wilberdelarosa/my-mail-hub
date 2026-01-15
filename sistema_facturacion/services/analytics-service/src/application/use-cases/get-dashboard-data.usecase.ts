import { Injectable, Inject } from '@nestjs/common';
import { AnalyticsRepositoryPort } from '../../domain/ports/outbound/analytics-repository.port';
import { KPISummary, SalesMetrics, PaymentMetrics, CustomerMetrics, NCFMetrics, TopPerformers } from '../../domain/types/metrics.types';

export interface DashboardData {
    kpiSummary: KPISummary | null;
    salesMetrics: SalesMetrics[];
    paymentMetrics: PaymentMetrics[];
    customerMetrics: CustomerMetrics[];
    ncfMetrics: NCFMetrics[];
    topPerformers: TopPerformers;
    dso: number;
}

@Injectable()
export class GetDashboardDataUseCase {
    constructor(
        @Inject(AnalyticsRepositoryPort)
        private readonly analyticsRepository: AnalyticsRepositoryPort
    ) { }

    async execute(startDate: string, endDate: string): Promise<DashboardData> {
        // Ejecutar todas las consultas en paralelo
        const [
            salesMetrics,
            paymentMetrics,
            customerMetrics,
            ncfMetrics,
            topPerformers,
            dso
        ] = await Promise.all([
            this.analyticsRepository.getSalesMetrics(startDate, endDate),
            this.analyticsRepository.getPaymentMetrics(startDate, endDate),
            this.analyticsRepository.getCustomerMetrics(10),
            this.analyticsRepository.getNCFMetrics(startDate, endDate),
            this.analyticsRepository.getTopPerformers('monthly'),
            this.analyticsRepository.calculateDSO(startDate, endDate)
        ]);

        // KPI Summary del mes actual
        const now = new Date();
        const periodKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const kpiSummary = await this.analyticsRepository.getKPISummary('monthly', periodKey);

        return {
            kpiSummary,
            salesMetrics,
            paymentMetrics,
            customerMetrics,
            ncfMetrics,
            topPerformers,
            dso
        };
    }
}
