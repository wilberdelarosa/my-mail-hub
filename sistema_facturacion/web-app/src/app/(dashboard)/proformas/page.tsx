'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Search,
    FileText,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Clock,
    Receipt,
    Loader2,
    Printer
} from 'lucide-react';
import { toast } from 'sonner';

interface Proforma {
    id: string;
    number: string;
    customerId: string;
    status: string;
    createdAt: string;
    total: number;
}

type ProformaRow = {
    id: string;
    status: string;
    created_at: string;
    customer_id: string | null;
    quote?: Array<{
        number: string | null;
        total: number | null;
    }> | null;
};

export default function ProformasPage() {
    const [proformas, setProformas] = useState<Proforma[]>([]);
    const [loading, setLoading] = useState(true);
    const [completingId, setCompletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProformas = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('proformas')
                .select('id,status,created_at,customer_id,quote:quote_id(number,total)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const rows = (data ?? []) as ProformaRow[];
            setProformas(
                rows.map((row) => ({
                    id: row.id,
                    number: row.quote?.[0]?.number ?? 'PRF-—',
                    customerId: row.customer_id ?? '',
                    status: row.status,
                    createdAt: row.created_at,
                    total: Number(row.quote?.[0]?.total ?? 0),
                }))
            );
        } catch (error) {
            console.error('Error fetching proformas:', error);
            toast.error('Error al cargar proformas desde Supabase');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProformas();
    }, []);

    const handleComplete = async (id: string) => {
        if (!confirm('¿Marcar proforma como completada? (Demo: solo actualiza estado)')) return;

        setCompletingId(id);
        try {
            const { error } = await supabase
                .from('proformas')
                .update({ status: 'CLOSED' })
                .eq('id', id);

            if (error) throw error;

            toast.success('Proforma completada (estado actualizado).');
            await fetchProformas();
        } catch (error) {
            console.error('Error completing proforma:', error);
            toast.error('Error al completar la proforma');
        } finally {
            setCompletingId(null);
        }
    };

    const handleDownloadPdf = async (id: string) => {
        try {
            toast.info('PDF de Proforma en desarrollo.');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Error al descargar el PDF');
        }
    };

    const filteredProformas = proformas.filter(p =>
        p.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Proformas / Conduces</h2>
                    <p className="text-slate-500">
                        Gestiona las entregas y la facturación automática.
                    </p>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por número (PRF-2026-0001)..."
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
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Fecha</th>
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
                        ) : filteredProformas.length > 0 ? (
                            filteredProformas.map((proforma) => (
                                <tr key={proforma.id} className="hover:bg-slate-50/50 transition duration-200 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition">
                                                <FileText className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <span className="font-bold text-slate-900 tracking-tight">{proforma.number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        Cliente #123
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(proforma.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        ${proforma.total.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${proforma.status === 'COMPLETED'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : proforma.status === 'INVOICED'
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {proforma.status === 'CLOSED' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {proforma.status === 'CLOSED' ? 'Completado' : proforma.status === 'PARTIALLY_DELIVERED' ? 'Parcial' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDownloadPdf(proforma.id)}
                                                title="Descargar PDF"
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                                            >
                                                <Printer className="h-5 w-5" />
                                            </button>
                                            {proforma.status !== 'CLOSED' && (
                                                <button
                                                    onClick={() => handleComplete(proforma.id)}
                                                    disabled={completingId === proforma.id}
                                                    title="Generar Factura Fiscal"
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                >
                                                    {completingId === proforma.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Receipt className="h-5 w-5" />}
                                                </button>
                                            )}
                                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition">
                                                <ArrowRight className="h-5 w-5" />
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
                                            <FileText className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 text-sm">No hay proformas disponibles.</p>
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
