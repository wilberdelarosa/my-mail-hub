'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    CreditCard,
    Calendar,
    User,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

interface Payment {
    id: string;
    customerId: string;
    amount: number;
    unappliedAmount: number;
    method: string;
    reference: string;
    date: string;
    status: string;
    customerName?: string;
}

type PaymentRow = {
    id: string;
    customer_id: string;
    amount: number | null;
    unapplied_amount: number | null;
    method: string;
    reference: string | null;
    payment_date: string;
    status: string;
    customer?: Array<{ name: string | null }> | null;
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const { data, error } = await supabase
                    .from('payments')
                    .select('id,customer_id,amount,unapplied_amount,method,reference,payment_date,status,customer:customer_id(name)')
                    .order('payment_date', { ascending: false });

                if (error) throw error;

                const rows = (data ?? []) as PaymentRow[];
                setPayments(
                    rows.map((row) => ({
                        id: row.id,
                        customerId: row.customer_id,
                        amount: Number(row.amount ?? 0),
                        unappliedAmount: Number(row.unapplied_amount ?? 0),
                        method: row.method,
                        reference: row.reference ?? '',
                        date: row.payment_date,
                        status: row.status,
                        customerName: row.customer?.[0]?.name ?? 'Cliente',
                    }))
                );
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Cobros</h2>
                    <p className="text-slate-500">
                        Gestiona los pagos recibidos y su aplicación a facturas.
                    </p>
                </div>
                <Link href="/payments/new">
                    <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                        <Plus className="h-4 w-4" /> Registrar Cobro
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por referencia o cliente..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Método</th>
                            <th className="px-6 py-4">Monto</th>
                            <th className="px-6 py-4">Disponible</th>
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
                        ) : payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/50 transition duration-200 group">
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(payment.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{payment.customerName || 'Cliente'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 rounded-md">
                                                <CreditCard className="h-3.5 w-3.5 text-slate-600" />
                                            </div>
                                            <span className="text-slate-600 capitalize">{payment.method.toLowerCase().replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        ${payment.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {payment.unappliedAmount > 0 ? (
                                            <span className="text-amber-600 font-medium italic">
                                                ${payment.unappliedAmount.toLocaleString()} pendiente
                                            </span>
                                        ) : (
                                            <span className="text-emerald-600 flex items-center gap-1 font-medium">
                                                <CheckCircle2 className="h-3 w-3" /> Aplicado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-indigo-600 transition">
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="max-w-xs mx-auto space-y-3">
                                        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                            <CreditCard className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 text-sm">No hay cobros registrados aún.</p>
                                        <Link href="/payments/new">
                                            <Button variant="outline" size="sm">Registrar primero</Button>
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
