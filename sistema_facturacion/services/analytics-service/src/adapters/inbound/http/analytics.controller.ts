import { Controller, Get, Query, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { GetKPISummaryUseCase } from '../../../application/use-cases/get-kpi-summary.usecase';
import { GetDashboardDataUseCase } from '../../../application/use-cases/get-dashboard-data.usecase';
import { UpdateKPIsUseCase } from '../../../application/use-cases/update-kpis.usecase';

@Controller('analytics')
export class AnalyticsController {
    constructor(
        private readonly getKPISummaryUseCase: GetKPISummaryUseCase,
        private readonly getDashboardDataUseCase: GetDashboardDataUseCase,
        private readonly updateKPIsUseCase: UpdateKPIsUseCase
    ) { }

    /**
     * GET /api/analytics/v1/kpis
     * Obtener resumen de KPIs por período
     */
    @Get('kpis')
    async getKPISummary(
        @Query('periodType') periodType: string = 'monthly',
        @Query('periodKey') periodKey?: string
    ) {
        // Si no hay periodKey, usar mes actual
        if (!periodKey) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            periodKey = `${year}-${month}`;
        }

        const kpis = await this.getKPISummaryUseCase.execute(periodType, periodKey);

        return {
            success: true,
            data: kpis
        };
    }

    /**
     * GET /api/analytics/v1/dashboard
     * Obtener datos completos para dashboard
     */
    @Get('dashboard')
    async getDashboardData(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        // Defaults: último mes
        if (!startDate || !endDate) {
            const now = new Date();
            endDate = now.toISOString().split('T')[0];
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            startDate = monthAgo.toISOString().split('T')[0];
        }

        const dashboard = await this.getDashboardDataUseCase.execute(startDate, endDate);

        return {
            success: true,
            data: dashboard
        };
    }

    /**
     * GET /api/analytics/v1/sales
     * Métricas de ventas
     */
    @Get('sales')
    async getSalesMetrics(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const sales = await this.getDashboardDataUseCase.execute(startDate, endDate);

        return {
            success: true,
            data: sales.salesMetrics
        };
    }

    /**
     * GET /api/analytics/v1/ncf
     * Métricas de NCF
     */
    @Get('ncf')
    async getNCFMetrics(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const dashboard = await this.getDashboardDataUseCase.execute(startDate, endDate);

        return {
            success: true,
            data: dashboard.ncfMetrics
        };
    }

    /**
     * GET /api/analytics/v1/customers/top
     * Top clientes por revenue
     */
    @Get('customers/top')
    async getTopCustomers(@Query('limit') limit: number = 10) {
        const dashboard = await this.getDashboardDataUseCase.execute(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
        );

        return {
            success: true,
            data: dashboard.customerMetrics.slice(0, limit)
        };
    }

    /**
     * POST /api/analytics/v1/kpis/update
     * Forzar actualización de KPIs del mes actual
     */
    @Post('kpis/update')
    @HttpCode(HttpStatus.OK)
    async updateCurrentMonthKPIs() {
        const now = new Date();
        await this.updateKPIsUseCase.execute(now.getFullYear(), now.getMonth() + 1);

        return {
            success: true,
            message: 'KPIs updated successfully'
        };
    }

    /**
     * GET /api/analytics/v1/dso
     * Days Sales Outstanding
     */
    @Get('dso')
    async getDSO(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const dashboard = await this.getDashboardDataUseCase.execute(startDate, endDate);

        return {
            success: true,
            data: {
                dso: dashboard.kpiSummary?.avgDaysSalesOutstanding || 0,
                period: { startDate, endDate }
            }
        };
    }
}
