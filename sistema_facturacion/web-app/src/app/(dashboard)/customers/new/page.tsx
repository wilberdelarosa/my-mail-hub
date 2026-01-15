'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewCustomerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        rnc: '',
        email: '',
        phone: '',
        address: '',
        fiscalType: 'CONSUMIDOR',
        creditLimit: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('customers').insert({
                name: formData.name,
                rnc: formData.rnc,
                email: formData.email || null,
                phone: formData.phone || null,
                address: formData.address || null,
                fiscal_type: formData.fiscalType,
                credit_limit: Number(formData.creditLimit),
                is_active: true,
            });

            if (error) throw error;
            router.push('/customers');
        } catch (error) {
            console.error('Error creating customer:', error);
            alert('Error al crear cliente. Verifica el RNC.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nuevo Cliente</h1>
            </div>

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Información General</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rnc">RNC / Cédula</Label>
                                    <Input
                                        id="rnc"
                                        name="rnc"
                                        placeholder="999999999"
                                        required
                                        maxLength={11}
                                        value={formData.rnc}
                                        onChange={handleChange}
                                    />
                                    <p className="text-xs text-slate-500">Sin guiones (9 u 11 dígitos)</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fiscalType">Tipo Fiscal</Label>
                                    <div className="relative">
                                        <select
                                            id="fiscalType"
                                            name="fiscalType"
                                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Razón Social / Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Empresa SRL"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="contacto@empresa.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="809-555-5555"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="Av. Winston Churchill..."
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="creditLimit">Límite de Crédito</Label>
                                <Input
                                    id="creditLimit"
                                    name="creditLimit"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={formData.creditLimit}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="button" variant="ghost" onClick={() => router.back()}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {loading ? 'Guardando...' : 'Guardar Cliente'}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
