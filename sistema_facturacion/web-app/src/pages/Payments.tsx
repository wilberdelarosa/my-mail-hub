import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type PaymentRow = {
  id: string
  amount: number | null
  unapplied_amount: number | null
  method: string | null
  reference: string | null
  payment_date: string | null
  status: string | null
  customer?: { name?: string } | null
}

export default function PaymentsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const fetchPayments = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('payments')
      .select('id,amount,unapplied_amount,method,reference,payment_date,status,customer:customer_id(name)')
      .order('payment_date', { ascending: false })
      .limit(500)

    if (error) {
      setError(error.message)
      setRows([])
    } else {
      setRows((data || []) as PaymentRow[])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) =>
      [row.method, row.reference, row.status, row.customer?.name]
        .filter(Boolean)
        .some((value) => (value || '').toLowerCase().includes(term)),
    )
  }, [rows, query])

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cobros</h1>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por cliente, método o referencia"
            className="w-full md:w-80 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          />
          <button
            onClick={fetchPayments}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Refrescar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 text-sm text-gray-600">
          {loading ? 'Cargando cobros...' : `${filtered.length} cobros`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                <th className="px-6 py-3 text-left font-semibold">Método</th>
                <th className="px-6 py-3 text-left font-semibold">Referencia</th>
                <th className="px-6 py-3 text-left font-semibold">Monto</th>
                <th className="px-6 py-3 text-left font-semibold">No aplicado</th>
                <th className="px-6 py-3 text-left font-semibold">Estado</th>
                <th className="px-6 py-3 text-left font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="px-6 py-3 font-medium text-gray-900">{row.customer?.name || 'Sin cliente'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.method || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.reference || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">
                    {row.amount != null ? row.amount.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {row.unapplied_amount != null ? row.unapplied_amount.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{row.status || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.payment_date || '-'}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                    Sin datos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
