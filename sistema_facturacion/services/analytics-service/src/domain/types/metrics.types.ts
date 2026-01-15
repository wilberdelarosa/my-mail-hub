export interface KPISummary {
    periodType: 'daily' | 'weekly' | 'monthly' | 'yearly';
    periodKey: string;

    // Financial KPIs
    totalQuotes: number;
    totalInvoices: number;
    totalPayments: number;
    totalTax: number;

    // NCF KPIs
    ncf31Count: number; // Crédito Fiscal
    ncf32Count: number; // Consumo
    ncf33Count: number; // Nota Débito
    ncf34Count: number; // Nota Crédito

    // Operational KPIs
    avgQuoteToInvoiceDays: number;
    avgDaysSalesOutstanding: number; // DSO
    conversionRate: number; // Quote → Invoice %

    // Quality KPIs
    errorRate: number;
    avgResponseTimeMs: number;

    calculatedAt: Date;
}

export interface SalesMetrics {
    dateKey: string;
    totalSales: number;
    totalTax: number;
    totalExempt: number;
    totalTaxable: number;
    invoiceCount: number;
    avgTicketSize: number;
}

export interface PaymentMetrics {
    dateKey: string;
    totalPayments: number;
    totalApplied: number;
    totalUnapplied: number;
    paymentCount: number;
    avgPaymentSize: number;
    avgDaysToPay: number;
}

export interface CustomerMetrics {
    customerId: string;
    customerName: string;
    totalRevenue: number;
    invoiceCount: number;
    avgDSO: number;
    creditUtilization: number;
}

export interface NCFMetrics {
    ncfType: string;
    count: number;
    totalAmount: number;
    avgAmount: number;
}

export interface TopPerformers {
    topCustomers: CustomerMetrics[];
    topServices: { serviceId: string; serviceName: string; revenue: number }[];
    revenueByMonth: { month: string; revenue: number }[];
}
