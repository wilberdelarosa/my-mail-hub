'use client';

import { useState } from 'react';
import {
    FileText,
    DollarSign,
    TrendingUp,
    Users,
    Calendar,
    Download,
    Filter,
    BarChart3
} from 'lucide-react';

type ReportType = 'sales' | 'collections' | 'ncf' | 'customers' | 'aging' | 'inventory';

interface DateRange {
    from: string;
    to: string;
}

export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState<ReportType>('sales');
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    const reports = [
        {
            id: 'sales' as ReportType,
            name: 'Ventas',
            icon: TrendingUp,
            color: 'bg-blue-500',
            description: 'Reporte de ventas por período'
        },
        {
            id: 'collections' as ReportType,
            name: 'Cobros',
            icon: DollarSign,
            color: 'bg-green-500',
            description: 'Análisis de cobros y pagos'
        },
        {
            id: 'ncf' as ReportType,
            name: 'NCF Emitidos',
            icon: FileText,
            color: 'bg-purple-500',
            description: 'Comprobantes fiscales emitidos'
        },
        {
            id: 'customers' as ReportType,
            name: 'Clientes',
            icon: Users,
            color: 'bg-orange-500',
            description: 'Análisis de cartera de clientes'
        },
        {
            id: 'aging' as ReportType,
            name: 'Antigüedad',
            icon: Calendar,
            color: 'bg-red-500',
            description: 'Cuentas por cobrar vencidas'
        },
        {
            id: 'inventory' as ReportType,
            name: 'Inventario',
            icon: BarChart3,
            color: 'bg-indigo-500',
            description: 'Stock y movimientos'
        }
    ];

    const generateReport = async () => {
        setLoading(true);
        try {
            // TODO: Llamar API según el tipo de reporte
            await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (format: 'pdf' | 'excel') => {
        // TODO: Exportar reporte
        alert(`Exportando a ${format.toUpperCase()}...`);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
                <p className="text-gray-600 mt-1">Análisis y reportes del sistema</p>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {reports.map(report => {
                    const Icon = report.icon;
                    const isSelected = selectedReport === report.id;

                    return (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            className={`p-6 rounded-xl border-2 transition text-left ${isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${report.color} p-3 rounded-lg text-white`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{report.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Filters & Actions */}
            <div className="bg-white rounded-xl shadow-md border p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>
                        <button
                            onClick={generateReport}
                            disabled={loading}
                            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            {loading ? 'Generando...' : 'Generar'}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => exportReport('pdf')}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Download className="w-4 h-4" />
                            PDF
                        </button>
                        <button
                            onClick={() => exportReport('excel')}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Download className="w-4 h-4" />
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Content */}
            <div className="bg-white rounded-xl shadow-md border p-6">
                {selectedReport === 'sales' && <SalesReport dateRange={dateRange} />}
                {selectedReport === 'collections' && <CollectionsReport dateRange={dateRange} />}
                {selectedReport === 'ncf' && <NCFReport dateRange={dateRange} />}
                {selectedReport === 'customers' && <CustomersReport dateRange={dateRange} />}
                {selectedReport === 'aging' && <AgingReport dateRange={dateRange} />}
                {selectedReport === 'inventory' && <InventoryReport dateRange={dateRange} />}
            </div>
        </div>
    );
}

// Sub-componentes para cada tipo de reporte

function SalesReport({ dateRange }: { dateRange: DateRange }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Reporte de Ventas</h2>
            <p className="text-gray-600 mb-6">Período: {dateRange.from} - {dateRange.to}</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Total Ventas</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">RD$ 125,450</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Facturas Emitidas</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">23</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">ITBIS Cobrado</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">RD$ 22,581</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 font-medium">Ticket Promedio</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">RD$ 5,454</p>
                </div>
            </div>

            {/* Table */}
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Fecha</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Factura</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Cliente</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Subtotal</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">ITBIS</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Placeholder data */}
                    <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm">14/01/2026</td>
                        <td className="py-3 px-4 text-sm font-mono">E310000000001</td>
                        <td className="py-3 px-4 text-sm">DOLFOS SRL</td>
                        <td className="py-3 px-4 text-sm text-right">RD$ 10,000</td>
                        <td className="py-3 px-4 text-sm text-right">RD$ 1,800</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold">RD$ 11,800</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function CollectionsReport({ dateRange }: { dateRange: DateRange }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Reporte de Cobros</h2>
            <p className="text-gray-600">Período: {dateRange.from} - {dateRange.to}</p>
            {/* TODO: Implementar contenido */}
        </div>
    );
}

function NCFReport({ dateRange }: { dateRange: DateRange }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Comprobantes Fiscales Emitidos</h2>
            <p className="text-gray-600">Período: {dateRange.from} - {dateRange.to}</p>

            {/* NCF by Type */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Tipo 31 (Crédito)</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">15</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Tipo 32 (Consumo)</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">8</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Tipo 33 (Débito)</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">2</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Tipo 34 (Crédito)</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">1</p>
                </div>
            </div>
        </div>
    );
}

function CustomersReport({ dateRange }: { dateRange: DateRange }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Análisis de Clientes</h2>
            <p className="text-gray-600">Período: {dateRange.from} - {dateRange.to}</p>
            {/* TODO: Top customers, revenue, etc */}
        </div>
    );
}

function AgingReport({ dateRange }: { dateRange: DateRange }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Antigüedad de Saldos</h2>
            <p className="text-gray-600">Cuentas por cobrar vencidas</p>
            {/* TODO: Aging buckets: 0-30, 31-60, 61-90, 90+ */}
        </div>
    );
}

function InventoryReport({ dateRange }: { dateRange: DateRange }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Reporte de Inventario</h2>
            <p className="text-gray-600">Stock actual y movimientos</p>
            {/* TODO: Stock levels, movements */}
        </div>
    );
}
