'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    FileText,
    Calendar,
    ArrowRight,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Quote {
    id: string;
    number: string;
    customerId: string;
    status: string;
    total: number;
    createdAt: string;
    expirationDate: string;
}

type QuoteRow = {
    id: string;
    number: string;
    customer_id: string;
    status: string;
    total: number;
    created_at: string;
    expiration_date: string;
};

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('quotes')
                .select('id,number,customer_id,status,total,created_at,expiration_date')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const rows = (data ?? []) as QuoteRow[];
            setQuotes(
                rows.map((row) => ({
                    id: row.id,
                    number: row.number,
                    customerId: row.customer_id,
                    status: row.status,
                    total: Number(row.total ?? 0),
                    createdAt: row.created_at,
                    expirationDate: row.expiration_date,
                }))
            );
        } catch (error) {
            console.error('Error fetching quotes:', error);
            toast.error('Error al cargar cotizaciones desde Supabase');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm('¿Estás seguro de aprobar esta cotización? (Demo: solo cambia el estado a APPROVED)')) return;

        setApprovingId(id);
        try {
            const { error } = await supabase
                .from('quotes')
                .update({ status: 'APPROVED' })
                .eq('id', id);

            if (error) throw error;

            toast.success('Cotización aprobada (estado actualizado).');
            await fetchQuotes();
        } catch (error) {
            console.error('Error approving quote:', error);
            toast.error('Error al aprobar la cotización');
        } finally {
            setApprovingId(null);
        }
    };

    const filteredQuotes = quotes.filter(q =>
        q.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-slate-100 text-slate-700';
            case 'SENT': return 'bg-blue-100 text-blue-700';
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            case 'EXPIRED': return 'bg-amber-100 text-amber-700';
            case 'INVOICED': return 'bg-indigo-100 text-indigo-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Cotizaciones</h2>
                    <p className="text-slate-500">
                        Gestiona tus presupuestos y el seguimiento comercial.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/proformas">
                        <Button variant="outline" className="flex items-center gap-2">
                            Ver Proformas
                        </Button>
                    </Link>
                    <Link href="/quotes/new">
                        <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4" /> Nueva Cotización
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por número (COT-2026-0001)..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Número</th>
                            <th className="px-6 py-4">Fecha Emisión</th>
                            <th className="px-6 py-4">Vencimiento</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={6} className="px-6 py-6 h-16 bg-slate-50/50">
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : filteredQuotes.length > 0 ? (
                            filteredQuotes.map((quote) => (
                                <tr key={quote.id} className="hover:bg-slate-50/50 transition duration-200 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition">
                                                <FileText className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <span className="font-bold text-slate-900 tracking-tight">{quote.number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {new Date(quote.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(quote.expirationDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        ${quote.total.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${getStatusStyle(quote.status)}`}>
                                            {quote.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {quote.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handleApprove(quote.id)}
                                                    disabled={approvingId === quote.id}
                                                    title="Aprobar Cotización"
                                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                >
                                                    {approvingId === quote.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                                                </button>
                                            )}
                                            <Link href={`/quotes/${quote.id}`}>
                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition">
                                                    <ArrowRight className="h-5 w-5" />
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="max-w-xs mx-auto space-y-3">
                                        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                            <FileText className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 text-sm">No hay cotizaciones registradas aún.</p>
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
