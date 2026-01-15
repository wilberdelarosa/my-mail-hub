'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditCustomerPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        rnc: '',
        email: '',
        phone: '',
        address: '',
        fiscalType: 'CONSUMIDOR',
        creditLimit: 0,
        isActive: true
    });

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const { data, error } = await supabase
                    .from('customers')
                    .select('id,name,rnc,email,phone,address,fiscal_type,credit_limit,is_active')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                const customer = data;
                if (customer) {
                    setFormData({
                        name: customer.name,
                        rnc: customer.rnc,
                        email: customer.email || '',
                        phone: customer.phone || '',
                        address: customer.address || '',
                        fiscalType: customer.fiscal_type,
                        creditLimit: customer.credit_limit || 0,
                        isActive: customer.is_active ?? true
                    });
                } else {
                    toast.error('Cliente no encontrado');
                    router.push('/customers');
                }
            } catch (error) {
                console.error('Error fetching customer:', error);
                toast.error('Error al cargar datos del cliente');
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchCustomer();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('customers')
                .update({
                    name: formData.name,
                    rnc: formData.rnc,
                    email: formData.email || null,
                    phone: formData.phone || null,
                    address: formData.address || null,
                    fiscal_type: formData.fiscalType,
                    credit_limit: Number(formData.creditLimit),
                    is_active: formData.isActive,
                })
                .eq('id', id);

            if (error) throw error;
            toast.success('Cliente actualizado correctamente');
            router.push('/customers');
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error('Error al actualizar cliente');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        const val = type === 'checkbox' ? (e.target as any).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    if (fetching) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Editar Cliente</h1>
                    <p className="text-slate-500">Modifica la información de {formData.name}</p>
                </div>
            </div>

            <div className="mx-auto max-w-2xl">
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Información del Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="rnc" className="text-xs font-bold uppercase text-slate-500">RNC / Cédula</Label>
                                    <Input
                                        id="rnc"
                                        name="rnc"
                                        required
                                        maxLength={11}
                                        className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition"
                                        value={formData.rnc}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fiscalType" className="text-xs font-bold uppercase text-slate-500">Tipo Fiscal</Label>
                                    <select
                                        id="fiscalType"
                                        name="fiscalType"
                                        className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        value={formData.fiscalType}
                                        onChange={handleChange}
                                    >
                                        <option value="CREDITO_FISCAL">Crédito Fiscal (31)</option>
                                        <option value="CONSUMIDOR">Consumo (32)</option>
                                        <option value="GUBERNAMENTAL">Gubernamental (15)</option>
                                        <option value="ESPECIAL">Régimen Especial (14)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500">Razón Social / Nombre Completo</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    className="h-11 border-slate-200 text-lg font-bold"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="h-11 border-slate-200"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500">Teléfono de Contacto</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        className="h-11 border-slate-200"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-xs font-bold uppercase text-slate-500">Dirección Física / Despacho</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    className="h-11 border-slate-200"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="creditLimit" className="text-xs font-bold uppercase text-slate-500">Límite de Crédito (RD$)</Label>
                                    <Input
                                        id="creditLimit"
                                        name="creditLimit"
                                        type="number"
                                        className="h-11 border-slate-200 font-bold text-indigo-600"
                                        value={formData.creditLimit}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-8">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />
                                    <Label htmlFor="isActive" className="text-sm font-semibold text-slate-700">Cliente Activo</Label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <Button type="button" variant="ghost" onClick={() => router.back()} className="h-12 px-6">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold">
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                                    {loading ? 'ACTUALIZANDO...' : 'GUARDAR CAMBIOS'}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
