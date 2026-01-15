import { KPISummary, SalesMetrics, PaymentMetrics, CustomerMetrics, NCFMetrics, TopPerformers } from '../types/metrics.types';

export abstract class AnalyticsRepositoryPort {
    // KPIs Summary
    abstract getKPISummary(periodType: string, periodKey: string): Promise<KPISummary | null>;
    abstract updateMonthlyKPIs(year: number, month: number): Promise<void>;

    // Sales Metrics
    abstract getSalesMetrics(startDate: string, endDate: string): Promise<SalesMetrics[]>;
    abstract getSalesMetricsByCustomer(customerId: string, startDate: string, endDate: string): Promise<SalesMetrics>;

    // Payment Metrics
    abstract getPaymentMetrics(startDate: string, endDate: string): Promise<PaymentMetrics[]>;
    abstract calculateDSO(startDate: string, endDate: string): Promise<number>;

    // Customer Metrics
    abstract getCustomerMetrics(limit?: number): Promise<CustomerMetrics[]>;
    abstract getCustomerMetricsById(customerId: string): Promise<CustomerMetrics | null>;

    // NCF Metrics
    abstract getNCFMetrics(startDate: string, endDate: string): Promise<NCFMetrics[]>;
    abstract getNCFSequenceUsage(): Promise<{ type: string; current: number; max: number; percentage: number }[]>;

    // Top Performers
    abstract getTopPerformers(period: string): Promise<TopPerformers>;

    // Event Processing
    abstract logEvent(eventType: string, eventData: any, sourceService: string): Promise<void>;
    abstract processUnprocessedEvents(): Promise<number>;
}

export const AnalyticsRepositoryPort = Symbol('AnalyticsRepositoryPort');
