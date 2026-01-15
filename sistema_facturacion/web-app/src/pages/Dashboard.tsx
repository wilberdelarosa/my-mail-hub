import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type DashboardCounts = {
    customers: number
    quotes: number
    invoices: number
    payments: number
}

export default function Dashboard() {
    const [counts, setCounts] = useState<DashboardCounts>({
        customers: 0,
        quotes: 0,
        invoices: 0,
        payments: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true

        const fetchCounts = async () => {
            setLoading(true)
            setError(null)

            const [customersRes, quotesRes, invoicesRes, paymentsRes] = await Promise.all([
                supabase.from('customers').select('id', { count: 'exact', head: true }),
                supabase.from('quotes').select('id', { count: 'exact', head: true }),
                supabase.from('invoices').select('id', { count: 'exact', head: true }),
                supabase.from('payments').select('id', { count: 'exact', head: true }),
            ])

            if (!active) return

            const errors = [customersRes.error, quotesRes.error, invoicesRes.error, paymentsRes.error]
                .filter(Boolean)
                .map((err) => err?.message)

            if (errors.length) {
                setError(errors[0] || 'Error cargando métricas')
            }

            setCounts({
                customers: customersRes.count ?? 0,
                quotes: quotesRes.count ?? 0,
                invoices: invoicesRes.count ?? 0,
                payments: paymentsRes.count ?? 0,
            })

            setLoading(false)
        }

        fetchCounts()

        return () => {
            active = false
        }
    }, [])

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Refrescar
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm text-gray-600">Clientes</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {loading ? '...' : counts.customers}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm text-gray-600">Cotizaciones</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {loading ? '...' : counts.quotes}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm text-gray-600">Facturas</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                        {loading ? '...' : counts.invoices}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm text-gray-600">Cobros</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">
                        {loading ? '...' : counts.payments}
                    </p>
                </div>
            </div>
        </div>
    )
}
