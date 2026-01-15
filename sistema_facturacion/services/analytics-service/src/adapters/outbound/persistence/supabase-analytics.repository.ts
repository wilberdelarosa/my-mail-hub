import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AnalyticsRepositoryPort } from '../../../domain/ports/outbound/analytics-repository.port';
import {
    KPISummary,
    SalesMetrics,
    PaymentMetrics,
    CustomerMetrics,
    NCFMetrics,
    TopPerformers
} from '../../../domain/types/metrics.types';

@Injectable()
export class SupabaseAnalyticsRepository implements AnalyticsRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );
    }

    async getKPISummary(periodType: string, periodKey: string): Promise<KPISummary | null> {
        const { data, error } = await this.supabase
            .from('kpi_summary')
            .select('*')
            .eq('period_type', periodType)
            .eq('period_key', periodKey)
            .single();

        if (error || !data) return null;

        return {
            periodType: data.period_type,
            periodKey: data.period_key,
            totalQuotes: parseFloat(data.total_quotes || 0),
            totalInvoices: parseFloat(data.total_invoices || 0),
            totalPayments: parseFloat(data.total_payments || 0),
            totalTax: parseFloat(data.total_tax || 0),
            ncf31Count: data.ncf_31_count || 0,
            ncf32Count: data.ncf_32_count || 0,
            ncf33Count: data.ncf_33_count || 0,
            ncf34Count: data.ncf_34_count || 0,
            avgQuoteToInvoiceDays: parseFloat(data.avg_quote_to_invoice_days || 0),
            avgDaysSalesOutstanding: parseFloat(data.avg_days_sales_outstanding || 0),
            conversionRate: parseFloat(data.conversion_rate || 0),
            errorRate: parseFloat(data.error_rate || 0),
            avgResponseTimeMs: data.avg_response_time_ms || 0,
            calculatedAt: new Date(data.calculated_at)
        };
    }

    async updateMonthlyKPIs(year: number, month: number): Promise<void> {
        const { error } = await this.supabase.rpc('update_monthly_kpis', {
            p_year: year,
            p_month: month
        });

        if (error) {
            console.error('Error updating monthly KPIs:', error);
            throw new Error('Failed to update monthly KPIs');
        }
    }

    async getSalesMetrics(startDate: string, endDate: string): Promise<SalesMetrics[]> {
        const { data, error } = await this.supabase
            .from('invoices')
            .select('issue_date, total, tax_amount')
            .gte('issue_date', startDate)
            .lte('issue_date', endDate);

        if (error) throw error;

        // Agrupar por fecha
        const grouped = data.reduce((acc: any, row: any) => {
            const dateKey = row.issue_date;
            if (!acc[dateKey]) {
                acc[dateKey] = {
                    dateKey,
                    totalSales: 0,
                    totalTax: 0,
                    totalExempt: 0,
                    totalTaxable: 0,
                    invoiceCount: 0,
                    avgTicketSize: 0
                };
            }
            acc[dateKey].totalSales += parseFloat(row.total || 0);
            acc[dateKey].totalTax += parseFloat(row.tax_amount || 0);
            acc[dateKey].invoiceCount += 1;
            return acc;
        }, {});

        return Object.values(grouped).map((item: any) => ({
            ...item,
            avgTicketSize: item.totalSales / item.invoiceCount,
            totalTaxable: item.totalSales - item.totalExempt
        }));
    }

    async getSalesMetricsByCustomer(customerId: string, startDate: string, endDate: string): Promise<SalesMetrics> {
        const { data, error } = await this.supabase
            .from('invoices')
            .select('total, tax_amount')
            .eq('customer_id', customerId)
            .gte('issue_date', startDate)
            .lte('issue_date', endDate);

        if (error) throw error;

        const totalSales = data.reduce((sum, row) => sum + parseFloat(row.total || 0), 0);
        const totalTax = data.reduce((sum, row) => sum + parseFloat(row.tax_amount || 0), 0);

        return {
            dateKey: `${startDate}_${endDate}`,
            totalSales,
            totalTax,
            totalExempt: 0,
            totalTaxable: totalSales - totalTax,
            invoiceCount: data.length,
            avgTicketSize: data.length > 0 ? totalSales / data.length : 0
        };
    }

    async getPaymentMetrics(startDate: string, endDate: string): Promise<PaymentMetrics[]> {
        const { data, error } = await this.supabase
            .from('payments')
            .select('payment_date, amount, unapplied_amount')
            .gte('payment_date', startDate)
            .lte('payment_date', endDate);

        if (error) throw error;

        const grouped = data.reduce((acc: any, row: any) => {
            const dateKey = row.payment_date;
            if (!acc[dateKey]) {
                acc[dateKey] = {
                    dateKey,
                    totalPayments: 0,
                    totalApplied: 0,
                    totalUnapplied: 0,
                    paymentCount: 0,
                    avgPaymentSize: 0,
                    avgDaysToPay: 0
                };
            }
            acc[dateKey].totalPayments += parseFloat(row.amount || 0);
            acc[dateKey].totalUnapplied += parseFloat(row.unapplied_amount || 0);
            acc[dateKey].paymentCount += 1;
            return acc;
        }, {});

        return Object.values(grouped).map((item: any) => ({
            ...item,
            totalApplied: item.totalPayments - item.totalUnapplied,
            avgPaymentSize: item.totalPayments / item.paymentCount
        }));
    }

    async calculateDSO(startDate: string, endDate: string): Promise<number> {
        const { data, error } = await this.supabase.rpc('calculate_dso', {
            period_start: startDate,
            period_end: endDate
        });

        if (error) {
            console.error('Error calculating DSO:', error);
            return 0;
        }

        return parseFloat(data || 0);
    }

    async getCustomerMetrics(limit: number = 10): Promise<CustomerMetrics[]> {
        const { data, error } = await this.supabase
            .from('invoices')
            .select(`
        customer_id,
        customer:customers(name),
        total,
        issue_date
      `)
            .order('total', { ascending: false })
            .limit(limit);

        if (error) throw error;

        const grouped = data.reduce((acc: any, row: any) => {
            const customerId = row.customer_id;
            if (!acc[customerId]) {
                acc[customerId] = {
                    customerId,
                    customerName: row.customer?.name || 'Unknown',
                    totalRevenue: 0,
                    invoiceCount: 0,
                    avgDSO: 0,
                    creditUtilization: 0
                };
            }
            acc[customerId].totalRevenue += parseFloat(row.total || 0);
            acc[customerId].invoiceCount += 1;
            return acc;
        }, {});

        return Object.values(grouped);
    }

    async getCustomerMetricsById(customerId: string): Promise<CustomerMetrics | null> {
        const metrics = await this.getCustomerMetrics(100);
        return metrics.find(m => m.customerId === customerId) || null;
    }

    async getNCFMetrics(startDate: string, endDate: string): Promise<NCFMetrics[]> {
        const { data, error } = await this.supabase
            .from('invoices')
            .select('ncf_type, total')
            .gte('issue_date', startDate)
            .lte('issue_date', endDate);

        if (error) throw error;

        const grouped = data.reduce((acc: any, row: any) => {
            const type = row.ncf_type;
            if (!acc[type]) {
                acc[type] = {
                    ncfType: type,
                    count: 0,
                    totalAmount: 0,
                    avgAmount: 0
                };
            }
            acc[type].count += 1;
            acc[type].totalAmount += parseFloat(row.total || 0);
            return acc;
        }, {});

        return Object.values(grouped).map((item: any) => ({
            ...item,
            avgAmount: item.totalAmount / item.count
        }));
    }

    async getNCFSequenceUsage(): Promise<{ type: string; current: number; max: number; percentage: number }[]> {
        const { data, error } = await this.supabase
            .from('ncf_sequences')
            .select('ncf_type, current_value, max_value');

        if (error) throw error;

        return data.map(row => ({
            type: row.ncf_type,
            current: row.current_value,
            max: row.max_value,
            percentage: (row.current_value / row.max_value) * 100
        }));
    }

    async getTopPerformers(period: string): Promise<TopPerformers> {
        // Top Customers
        const topCustomers = await this.getCustomerMetrics(5);

        // Revenue by Month (placeholder - necesitaría más lógica)
        const revenueByMonth = [
            { month: '2026-01', revenue: 50000 },
            { month: '2026-02', revenue: 75000 },
            { month: '2026-03', revenue: 60000 }
        ];

        return {
            topCustomers,
            topServices: [],
            revenueByMonth
        };
    }

    async logEvent(eventType: string, eventData: any, sourceService: string): Promise<void> {
        const { error } = await this.supabase
            .from('event_log')
            .insert({
                event_type: eventType,
                event_data: eventData,
                source_service: sourceService,
                processed: false
            });

        if (error) {
            console.error('Error logging event:', error);
        }
    }

    async processUnprocessedEvents(): Promise<number> {
        const { data, error } = await this.supabase
            .from('event_log')
            .select('*')
            .eq('processed', false)
            .limit(100);

        if (error || !data) return 0;

        // Procesar eventos (placeholder - implementar lógica específica por tipo)
        for (const event of data) {
            console.log(`Processing event: ${event.event_type}`);

            // Marcar como procesado
            await this.supabase
                .from('event_log')
                .update({ processed: true, processed_at: new Date().toISOString() })
                .eq('id', event.id);
        }

        return data.length;
    }
}
