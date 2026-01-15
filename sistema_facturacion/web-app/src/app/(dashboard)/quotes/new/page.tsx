'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Edit2,
    Calculator,
    Save,
    User as UserIcon,
    Package,
    Loader2
} from 'lucide-react';

interface Customer {
    id: string;
    name: string;
    rnc: string;
}

interface ServiceItem {
    id: string;
    code: string;
    name: string;
    unitPrice: number;
    taxRate: number;
    unit: string;
}

type ServiceItemRow = {
    id: string;
    code: string;
    name: string;
    unit_price: number;
    tax_rate: number;
    unit: string | null;
};

interface QuoteItem {
    serviceItemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    unit: string;
    total: number;
    conduce: string;
    serviceDate: string;
}

export default function NewQuotePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);

    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [notes, setNotes] = useState('PAGO AL CONTADO');
    const [items, setItems] = useState<QuoteItem[]>([]);
    const emptyDraftItem: QuoteItem = {
        serviceItemId: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0.18,
        unit: 'PA',
        total: 0,
        conduce: '',
        serviceDate: ''
    };
    const [draftItem, setDraftItem] = useState<QuoteItem>(emptyDraftItem);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customersRes, itemsRes] = await Promise.all([
                    supabase.from('customers').select('id,name,rnc').order('name'),
                    supabase.from('service_items').select('id,code,name,unit_price,tax_rate,unit').order('code')
                ]);

                if (customersRes.error) throw customersRes.error;
                if (itemsRes.error) throw itemsRes.error;

                setCustomers((customersRes.data ?? []) as Customer[]);
                const mappedItems = ((itemsRes.data ?? []) as ServiceItemRow[]).map((row) => ({
                    id: row.id,
                    code: row.code,
                    name: row.name,
                    unitPrice: Number(row.unit_price ?? 0),
                    taxRate: Number(row.tax_rate ?? 0),
                    unit: row.unit ?? 'UD',
                }));
                setServiceItems(mappedItems);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const computeLineTotal = (item: QuoteItem) => item.quantity * item.unitPrice;

    const startNewItem = () => {
        setEditingIndex(null);
        setDraftItem({ ...emptyDraftItem });
    };

    const handleDraftChange = (field: keyof QuoteItem, value: any) => {
        setDraftItem((prev) => {
            let next: QuoteItem = { ...prev, [field]: value };

            if (field === 'serviceItemId' && value) {
                const selected = serviceItems.find((s) => s.id === value);
                if (selected) {
                    next = {
                        ...next,
                        serviceItemId: selected.id,
                        description: selected.name,
                        unitPrice: selected.unitPrice,
                        taxRate: selected.taxRate,
                        unit: selected.unit || 'UD'
                    };
                }
            }

            next.total = computeLineTotal(next);
            return next;
        });
    };

    const commitDraftItem = () => {
        if (!draftItem.description || draftItem.quantity <= 0) {
            alert('Completa la descripcion y la cantidad antes de agregar.');
            return;
        }

        const normalized = { ...draftItem, total: computeLineTotal(draftItem) };
        setItems((prev) => {
            if (editingIndex !== null) {
                return prev.map((item, index) => (index === editingIndex ? normalized : item));
            }
            return [...prev, normalized];
        });

        setEditingIndex(null);
        setDraftItem({ ...emptyDraftItem });
    };

    const handleEditItem = (index: number) => {
        setEditingIndex(index);
        setDraftItem(items[index]);
    };

    const handleRemoveItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
            setDraftItem({ ...emptyDraftItem });
        }
    };

    // Cálculos basados en la estructura del formulario industrial dominicano
    const totalExempt = items
        .filter(i => i.taxRate === 0)
        .reduce((sum, item) => sum + item.total, 0);

    const totalTaxable = items
        .filter(i => i.taxRate > 0)
        .reduce((sum, item) => sum + item.total, 0);

    const subtotal = totalExempt + totalTaxable;
    const itbisAmount = items.reduce((sum, item) => sum + (item.total * item.taxRate), 0);
    const total = subtotal + itbisAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomerId || items.length === 0) {
            alert('Selecciona un cliente y agrega al menos un item.');
            return;
        }

        setLoading(true);
        try {
            const year = new Date().getFullYear();
            const number = `COT-${year}-${String(Date.now()).slice(-4)}`;
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 15);

            const { data: quote, error: quoteError } = await supabase
                .from('quotes')
                .insert({
                    number,
                    customer_id: selectedCustomerId,
                    status: 'DRAFT',
                    expiration_date: expirationDate.toISOString(),
                    subtotal,
                    tax_amount: itbisAmount,
                    total,
                    total_exempt: totalExempt,
                    total_taxable: totalTaxable,
                    notes,
                })
                .select('id')
                .single();

            if (quoteError) throw quoteError;

            const quoteId = quote?.id;
            if (!quoteId) throw new Error('No se pudo crear la cotizacion');

            const itemsPayload = items.map((item, index) => ({
                quote_id: quoteId,
                service_item_id: item.serviceItemId || null,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                tax_rate: item.taxRate,
                unit: item.unit,
                tax_amount: item.total * item.taxRate,
                total: item.total + item.total * item.taxRate,
                conduce: item.conduce || null,
                service_date: item.serviceDate ? new Date(item.serviceDate).toISOString().slice(0, 10) : null,
                line_order: index + 1,
            }));

            const { error: itemsError } = await supabase.from('quote_items').insert(itemsPayload);
            if (itemsError) throw itemsError;

            router.push('/quotes');
        } catch (error) {
            console.error('Error creating quote:', error);
            alert('Error al crear la cotización.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nueva Cotización</h1>
                        <p className="text-slate-500">Formato industrial estándar para ALITO GROUP.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Items */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <Package className="h-4 w-4" /> Detalle de Servicios y Equipos
                            </h3>
                            <Button type="button" variant="outline" size="sm" onClick={startNewItem} className="bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-600 font-bold">
                                <Plus className="h-4 w-4 mr-1.5" /> AGREGAR LÍNEA
                            </Button>
                        </div>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50/50 border-b border-slate-200">
                                        <tr className="text-[10px] uppercase text-slate-500 font-bold">
                                            <th className="px-4 py-3 text-center w-24">Conduce</th>
                                            <th className="px-4 py-3 text-center w-28">Fecha</th>
                                            <th className="px-4 py-3 text-left">Descripción</th>
                                            <th className="px-4 py-3 text-center w-20">Cant.</th>
                                            <th className="px-4 py-3 text-center w-20">Ud.</th>
                                            <th className="px-4 py-3 text-right w-32">Precio</th>
                                            <th className="px-4 py-3 text-right w-32">Total</th>
                                            <th className="px-4 py-3 text-center w-20"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                                        <Package className="h-10 w-10 opacity-20" />
                                                        <p>No hay líneas en esta cotización.</p>
                                                        <Button type="button" variant="link" onClick={startNewItem} className="text-indigo-600 font-bold">Agregar la primera línea</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className={`group hover:bg-slate-50/50 transition-colors ${editingIndex === index ? 'bg-indigo-50/60' : ''}`}
                                                >
                                                    <td className="px-4 py-3 text-center text-slate-600">
                                                        {item.conduce || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-slate-600">
                                                        {item.serviceDate ? new Date(item.serviceDate).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-slate-900">{item.description || 'Sin descripción'}</div>
                                                        <div className="text-[10px] text-slate-400">ITBIS: {(item.taxRate * 100).toFixed(0)}%</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-medium text-slate-700">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-slate-600">
                                                        {item.unit}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-slate-700">
                                                        ${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                                                        ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditItem(index)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                                                            title="Editar línea"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveItem(index)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-red-50 hover:text-red-600"
                                                            title="Eliminar línea"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">NOTAS Y CONDICIONES</h3>
                        </div>
                        <CardContent className="p-4">
                            <textarea
                                className="w-full min-h-[100px] rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 transition"
                                placeholder="Indique términos de pago, tiempo de entrega, etc..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Customer & Totals */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                                    Linea de Cotizacion
                                </h3>
                                {editingIndex !== null && (
                                    <span className="text-[10px] font-bold text-indigo-600">
                                        Editando #{editingIndex + 1}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Producto / Servicio</Label>
                                <select
                                    className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-indigo-500 shadow-sm transition"
                                    value={draftItem.serviceItemId}
                                    onChange={(e) => handleDraftChange('serviceItemId', e.target.value)}
                                >
                                    <option value="">Seleccionar item...</option>
                                    {serviceItems.map((si) => (
                                        <option key={si.id} value={si.id}>
                                            {si.code} - {si.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Conduce</Label>
                                    <Input
                                        value={draftItem.conduce}
                                        onChange={(e) => handleDraftChange('conduce', e.target.value)}
                                        placeholder="Entrega / guia"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fecha</Label>
                                    <Input
                                        type="date"
                                        value={draftItem.serviceDate}
                                        onChange={(e) => handleDraftChange('serviceDate', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-2">
                                    <Label>Cantidad</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={draftItem.quantity}
                                        onChange={(e) => handleDraftChange('quantity', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Unidad</Label>
                                    <select
                                        className="w-full rounded-md border border-slate-200 bg-white h-10 p-2 text-sm text-center outline-none"
                                        value={draftItem.unit}
                                        onChange={(e) => handleDraftChange('unit', e.target.value)}
                                    >
                                        <option value="PA">PA</option>
                                        <option value="UD">UD</option>
                                        <option value="M3">M3</option>
                                        <option value="GL">GL</option>
                                        <option value="LB">LB</option>
                                        <option value="HR">HR</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Precio</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={draftItem.unitPrice}
                                        onChange={(e) => handleDraftChange('unitPrice', Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 items-end">
                                <div className="space-y-2">
                                    <Label>ITBIS</Label>
                                    <select
                                        className="w-full rounded-md border border-slate-200 bg-white h-10 p-2 text-sm outline-none"
                                        value={draftItem.taxRate}
                                        onChange={(e) => handleDraftChange('taxRate', Number(e.target.value))}
                                    >
                                        <option value={0}>Exento 0%</option>
                                        <option value={0.18}>ITBIS 18%</option>
                                    </select>
                                </div>
                                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-right">
                                    <div className="text-[10px] uppercase text-slate-500 font-bold">Total Linea</div>
                                    <div className="text-lg font-black text-slate-900">
                                        ${draftItem.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Descripcion</Label>
                                <textarea
                                    className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 transition min-h-[80px]"
                                    placeholder="Descripcion detallada del servicio..."
                                    value={draftItem.description}
                                    onChange={(e) => handleDraftChange('description', e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                    onClick={commitDraftItem}
                                >
                                    {editingIndex !== null ? 'Guardar linea' : 'Agregar linea'}
                                </Button>
                                {editingIndex !== null && (
                                    <Button type="button" variant="outline" onClick={startNewItem}>
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-5 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-indigo-500" /> CLIENTE
                            </h3>
                            <div className="space-y-3">
                                <select
                                    className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-indigo-500 shadow-sm transition"
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                >
                                    <option value="">Seleccionar cliente...</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {selectedCustomerId && (
                                    <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-100">
                                        <p><strong>RNC:</strong> {customers.find(c => c.id === selectedCustomerId)?.rnc}</p>
                                        <p><strong>FECHA:</strong> {new Date().toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-indigo-100 shadow-md shadow-indigo-50 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-indigo-600 px-5 py-3 flex items-center gap-2 text-white">
                                <Calculator className="h-4 w-4" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">RESUMEN FISCAL (RD)</h3>
                            </div>
                            <div className="p-5 space-y-3 bg-white">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>TOTAL EXC (Exento)</span>
                                    <span className="font-bold text-slate-900">${totalExempt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>TOTAL GRAV (18%)</span>
                                    <span className="font-bold text-slate-900">${totalTaxable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-100 space-y-2">
                                    <div className="flex justify-between text-sm font-bold text-slate-700">
                                        <span>TOTAL EXC + GRAV</span>
                                        <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>ITBIS 18%</span>
                                        <span>${itbisAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t-2 border-indigo-100 flex justify-between items-baseline font-black text-xl text-indigo-700">
                                    <span className="text-xs font-bold text-indigo-500 uppercase">TOTAL RD$</span>
                                    <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3 pt-2">
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-md font-bold shadow-lg shadow-indigo-100 rounded-xl transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                            {loading ? 'GUARDANDO...' : 'GUARDAR COTIZACIÓN'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-xl border-slate-200 text-slate-500 font-bold"
                            onClick={() => router.back()}
                        >
                            CANCELAR
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
