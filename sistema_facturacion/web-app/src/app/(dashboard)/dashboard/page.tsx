'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

type Stat = { label: string; value: string; helper: string };

export default function DashboardPage() {
    const [stats, setStats] = useState<Stat[]>([
        { label: 'Clientes', value: '—', helper: 'Registrados en Supabase' },
        { label: 'Cotizaciones', value: '—', helper: 'Total en tabla quotes' },
        { label: 'Facturas', value: '—', helper: 'Total en tabla invoices' },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [customersRes, quotesRes, invoicesRes] = await Promise.all([
                    supabase.from('customers').select('id', { count: 'exact', head: true }),
                    supabase.from('quotes').select('id', { count: 'exact', head: true }),
                    supabase.from('invoices').select('id', { count: 'exact', head: true }),
                ]);

                if (customersRes.error) throw customersRes.error;
                if (quotesRes.error) throw quotesRes.error;
                if (invoicesRes.error) throw invoicesRes.error;

                setStats([
                    { label: 'Clientes', value: String(customersRes.count ?? 0), helper: 'Registrados en Supabase' },
                    { label: 'Cotizaciones', value: String(quotesRes.count ?? 0), helper: 'Total en tabla quotes' },
                    { label: 'Facturas', value: String(invoicesRes.count ?? 0), helper: 'Total en tabla invoices' },
                ]);
            } catch (e: any) {
                console.error(e);
                setError(e?.message ?? 'No se pudieron cargar estadisticas');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
                <p className="mt-1 text-sm text-slate-600">Vista general (datos reales desde Supabase).</p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                    <div className="mt-2 text-xs text-red-600">
                        Si no hay datos, ejecuta <span className="font-mono">supabase db reset</span> en la raiz del proyecto.
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{loading ? '…' : stat.value}</p>
                        <p className="mt-1 text-xs text-slate-500">{stat.helper}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Ver datos</h3>
                <p className="mt-2 text-sm text-slate-600">
                    Abre <Link className="text-indigo-600 hover:underline" href="/customers">Clientes</Link> o{' '}
                    <Link className="text-indigo-600 hover:underline" href="/quotes">Cotizaciones</Link>.
                </p>
            </div>
        </div>
    );
}
