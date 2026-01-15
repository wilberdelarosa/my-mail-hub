import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type CustomerRow = {
  id: string
  rnc: string | null
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
  fiscal_type: string | null
  credit_limit: number | null
  is_active: boolean | null
  created_at: string | null
}

export default function CustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const fetchCustomers = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('customers')
      .select('id,rnc,name,email,phone,address,fiscal_type,credit_limit,is_active,created_at')
      .order('name', { ascending: true })
      .limit(500)

    if (error) {
      setError(error.message)
      setRows([])
    } else {
      setRows((data || []) as CustomerRow[])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) =>
      [row.name, row.rnc, row.email, row.phone].some((value) =>
        (value || '').toLowerCase().includes(term),
      ),
    )
  }, [rows, query])

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, RNC, email o teléfono"
            className="w-full md:w-80 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          />
          <button
            onClick={fetchCustomers}
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
          {loading ? 'Cargando clientes...' : `${filtered.length} clientes`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold">RNC</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Teléfono</th>
                <th className="px-6 py-3 text-left font-semibold">Tipo Fiscal</th>
                <th className="px-6 py-3 text-left font-semibold">Límite Crédito</th>
                <th className="px-6 py-3 text-left font-semibold">Activo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="px-6 py-3 font-medium text-gray-900">{row.name || 'Sin nombre'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.rnc || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.email || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.phone || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.fiscal_type || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">
                    {row.credit_limit != null ? row.credit_limit.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {row.is_active ? 'Sí' : 'No'}
                  </td>
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
