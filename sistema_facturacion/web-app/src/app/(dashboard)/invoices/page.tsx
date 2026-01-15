'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    Receipt,
    Calendar,
    ExternalLink,
    CheckCircle2,
    Clock,
    Printer
} from 'lucide-react';

interface Invoice {
    id: string;
    ncf: string;
    customerId: string;
    customerName?: string;
    status: 'ISSUED' | 'PAID' | 'VOID' | 'OVERDUE';
    total: number;
    balance: number;
    dueDate: string;
    issueDate: string;
}

type InvoiceRow = {
    id: string;
    ncf_sequence: string | null;
    customer_id: string;
    status: string;
    total: number | null;
    balance: number | null;
    due_date: string;
    issue_date: string;
    customer?: Array<{ name: string | null }> | null;
};

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const { data, error } = await supabase
                    .from('invoices')
                    .select('id,ncf_sequence,customer_id,status,total,balance,due_date,issue_date,customer:customer_id(name)')
                    .order('issue_date', { ascending: false });

                if (error) throw error;

                const rows = (data ?? []) as InvoiceRow[];
                setInvoices(
                    rows.map((row) => ({
                        id: row.id,
                        ncf: row.ncf_sequence ?? 'B0100000000',
                        customerId: row.customer_id,
                        customerName: row.customer?.[0]?.name ?? 'Cliente',
                        status: (row.status as Invoice['status']) || 'ISSUED',
                        total: Number(row.total ?? 0),
                        balance: Number(row.balance ?? 0),
                        dueDate: row.due_date,
                        issueDate: row.issue_date,
                    }))
                );
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleDownloadPdf = async (id: string) => {
        try {
            alert(`PDF de factura (${id}) en desarrollo.`);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            // Fallback provisional para demo
            alert('Simulación: Abriendo PDF de factura...');
        }
    };

    const getStatusStyle = (status: Invoice['status'] | string) => {
        switch (status) {
            case 'ISSUED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PAID': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Facturas</h2>
                    <p className="text-slate-500">
                        Historial de comprobantes fiscales emitidos.
                    </p>
                </div>
                <Link to="/invoices/new">
                    <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                        <Plus className="h-4 w-4" /> Emitir Factura
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por NCF..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">NCF / Comprobante</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Fecha Emisión</th>
                            <th className="px-6 py-4">Monto Total</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={6} className="px-6 py-6 h-20">
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50/50 transition duration-200 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                                                <Receipt className="h-4 w-4 text-slate-600" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 block tracking-tight">
                                                    {invoice.ncf || 'B0100000000'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 uppercase font-medium">Factura de Crédito</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-700">{invoice.customerName || 'Cliente'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(invoice.issueDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">${invoice.total.toLocaleString()}</div>
                                        {invoice.balance > 0 && (
                                            <div className="text-[10px] text-red-500 font-medium italic">
                                                Pendiente: ${invoice.balance.toLocaleString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${getStatusStyle(invoice.status)}`}>
                                            {invoice.status === 'ISSUED' && <Clock className="h-3 w-3" />}
                                            {invoice.status === 'PAID' && <CheckCircle2 className="h-3 w-3" />}
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDownloadPdf(invoice.id)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                                                title="Descargar PDF"
                                            >
                                                <Printer className="h-5 w-5" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition">
                                                <ExternalLink className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="max-w-xs mx-auto space-y-3">
                                        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                            <Receipt className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 text-sm">No hay facturas emitidas recientemente.</p>
                                        <Link to="/invoices/new">
                                            <Button variant="outline" size="sm">Comenzar ahora</Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
