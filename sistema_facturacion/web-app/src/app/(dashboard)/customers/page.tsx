'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Search, User, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
    id: string;
    rnc: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    fiscalType: string;
    isActive: boolean;
}

type CustomerRow = {
    id: string;
    rnc: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    fiscal_type: string;
    is_active: boolean;
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('id,rnc,name,email,phone,address,fiscal_type,is_active,created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const rows = (data ?? []) as CustomerRow[];
            setCustomers(
                rows.map((row) => ({
                    id: row.id,
                    rnc: row.rnc,
                    name: row.name,
                    email: row.email ?? '',
                    phone: row.phone ?? '',
                    address: row.address ?? '',
                    fiscalType: row.fiscal_type,
                    isActive: row.is_active,
                }))
            );
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Error al cargar clientes desde Supabase');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar al cliente ${name}? Esta acción no se puede deshacer.`)) return;

        try {
            const { error } = await supabase.from('customers').delete().eq('id', id);
            if (error) throw error;
            toast.success('Cliente eliminado');
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error('No se pudo eliminar el cliente');
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rnc.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Clientes</h2>
                    <p className="text-slate-500">
                        Administra tu base de datos de clientes y sus configuraciones fiscales.
                    </p>
                </div>
                <Link href="/customers/new">
                    <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4" /> Nuevo Cliente
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o RNC..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">RNC/Cédula</th>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Tipo Fiscal</th>
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
                        ) : filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50/50 transition duration-200">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{customer.name}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <MapPin className="h-3 w-3" /> {customer.address || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600 bg-slate-50/30">
                                        {customer.rnc}
                                    </td>
                                    <td className="px-6 py-4">
                                        {customer.email && (
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <Mail className="h-3 w-3 text-slate-400" /> {customer.email}
                                            </div>
                                        )}
                                        {customer.phone && (
                                            <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                                                <Phone className="h-3 w-3 text-slate-400" /> {customer.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${customer.fiscalType === 'CREDITO_FISCAL' ? 'bg-indigo-100 text-indigo-700' :
                                            customer.fiscalType === 'CONSUMIDOR' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                            {customer.fiscalType.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${customer.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                                            <span className="font-medium text-slate-600">{customer.isActive ? 'Activo' : 'Inactivo'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/customers/${customer.id}`}>
                                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50">
                                                    Editar
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                                onClick={() => handleDelete(customer.id, customer.name)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <User className="h-10 w-10 opacity-20" />
                                        <p>No se encontraron clientes.</p>
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
