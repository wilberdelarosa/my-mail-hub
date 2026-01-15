'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Calendar, CreditCard, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Invoice {
    id: string;
    invoice_number: string;
    customer_name: string;
    total: number;
    balance: number;
    due_date: string;
    status: string;
}

export default function NewPaymentPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('TRANSFER');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadPendingInvoices();
    }, []);

    const loadPendingInvoices = async () => {
        try {
            const response = await fetch('http://localhost:3004/api/billing/v1/invoices');
            const data = await response.json();
            setInvoices(data.filter((inv: Invoice) => inv.balance > 0));
        } catch (error) {
            toast.error('Error cargando facturas');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3005/api/ar/v1/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceId: selectedInvoice,
                    amount: parseFloat(paymentAmount),
                    method: paymentMethod,
                    paymentDate: paymentDate,
                    reference: reference || `REC-${Date.now()}`,
                    notes: notes
                })
            });

            if (response.ok) {
                toast.success('Pago registrado exitosamente');
                router.push('/payments');
            } else {
                toast.error('Error al registrar pago');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const selectedInvoiceData = invoices.find(inv => inv.id === selectedInvoice);

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/payments"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Cobros
                </Link>

                <h1 className="text-3xl font-bold text-gray-900">Registrar Pago</h1>
                <p className="text-gray-600 mt-1">Registra un nuevo pago recibido de cliente</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Seleccionar Factura */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Factura a Pagar *
                                </label>
                                <select
                                    value={selectedInvoice}
                                    onChange={(e) => {
                                        setSelectedInvoice(e.target.value);
                                        const invoice = invoices.find(inv => inv.id === e.target.value);
                                        if (invoice) setPaymentAmount(invoice.balance.toString());
                                    }}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="">Seleccionar factura pendiente...</option>
                                    {invoices.map(inv => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.invoice_number} - {inv.customer_name} - Balance: RD$ {inv.balance.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Monto */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign className="inline w-4 h-4 mr-1" />
                                    Monto del Pago *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                        RD$
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        required
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-lg pl-16 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-lg font-semibold"
                                    />
                                </div>
                                {selectedInvoiceData && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Balance pendiente: RD$ {selectedInvoiceData.balance.toLocaleString()}
                                    </p>
                                )}
                            </div>

                            {/* Método y Fecha */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <CreditCard className="inline w-4 h-4 mr-1" />
                                        Método de Pago *
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition"
                                    >
                                        <option value="TRANSFER">🏦 Transferencia</option>
                                        <option value="CASH">💵 Efectivo</option>
                                        <option value="CHECK">📝 Cheque</option>
                                        <option value="CARD">💳 Tarjeta</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Calendar className="inline w-4 h-4 mr-1" />
                                        Fecha de Pago *
                                    </label>
                                    <input
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition"
                                    />
                                </div>
                            </div>

                            {/* Referencia */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Referencia / No. Transacción
                                </label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="Ej: TRANS-123456 o dejar vacío para auto-generar"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition font-mono text-sm"
                                />
                            </div>

                            {/* Notas */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Notas / Observaciones
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    placeholder="Información adicional sobre el pago..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition resize-none"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={loading || !selectedInvoice}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Registrar Pago
                                        </>
                                    )}
                                </button>
                                <Link
                                    href="/payments"
                                    className="px-6 py-3.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar: Información */}
                <div className="space-y-4">
                    {/* Resumen */}
                    {selectedInvoiceData && (
                        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-indigo-900 mb-3">Resumen del Pago</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-indigo-700">Factura:</span>
                                    <span className="font-semibold text-indigo-900">{selectedInvoiceData.invoice_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-700">Cliente:</span>
                                    <span className="font-medium text-indigo-900">{selectedInvoiceData.customer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-700">Total Factura:</span>
                                    <span className="font-medium">RD$ {selectedInvoiceData.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-indigo-200">
                                    <span className="text-indigo-700 font-semibold">Balance:</span>
                                    <span className="font-bold text-lg text-indigo-900">
                                        RD$ {selectedInvoiceData.balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {paymentAmount && parseFloat(paymentAmount) > 0 && (
                                <div className="mt-4 pt-3 border-t border-indigo-200">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-indigo-700">Pago a aplicar:</span>
                                        <span className="font-semibold text-green-700">
                                            RD$ {parseFloat(paymentAmount).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-indigo-700">Saldo restante:</span>
                                        <span className="font-semibold text-indigo-900">
                                            RD$ {Math.max(0, selectedInvoiceData.balance - parseFloat(paymentAmount)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Ayuda */}
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-amber-900 mb-2">Importante</h4>
                                <ul className="text-xs text-amber-800 space-y-1.5">
                                    <li>• El pago se aplicará automáticamente a la factura seleccionada</li>
                                    <li>• Si el monto es menor al balance, quedará saldo pendiente</li>
                                    <li>• Los pagos quedan registrados en el historial de cobros</li>
                                    <li>• Puedes generar un recibo después de registrar</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Facturas Pendientes */}
                    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Facturas Pendientes ({invoices.length})
                        </h3>

                        {invoices.length === 0 ? (
                            <p className="text-xs text-gray-500">No hay facturas pendientes</p>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {invoices.slice(0, 5).map(inv => (
                                    <button
                                        key={inv.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedInvoice(inv.id);
                                            setPaymentAmount(inv.balance.toString());
                                        }}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedInvoice === inv.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                    >
                                        <div className="text-xs font-semibold text-gray-900">{inv.invoice_number}</div>
                                        <div className="text-xs text-gray-600 truncate">{inv.customer_name}</div>
                                        <div className="text-sm font-bold text-indigo-600 mt-1">
                                            RD$ {inv.balance.toLocaleString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
