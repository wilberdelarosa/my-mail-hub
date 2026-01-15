import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type KpiRow = {
  date: string | null
  total_sales: number | null
  total_collected: number | null
  total_invoiced_count: number | null
  dso_days: number | null
}

export default function ReportsPage() {
  const [rows, setRows] = useState<KpiRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const fetchReports = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('kpi_daily_snapshots')
      .select('date,total_sales,total_collected,total_invoiced_count,dso_days')
      .order('date', { ascending: false })
      .limit(365)

    if (error) {
      setError(error.message)
      setRows([])
    } else {
      setRows((data || []) as KpiRow[])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) => (row.date || '').toLowerCase().includes(term))
  }, [rows, query])

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por fecha (YYYY-MM-DD)"
            className="w-full md:w-80 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          />
          <button
            onClick={fetchReports}
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
          {loading ? 'Cargando reportes...' : `${filtered.length} días`} 
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Fecha</th>
                <th className="px-6 py-3 text-left font-semibold">Ventas</th>
                <th className="px-6 py-3 text-left font-semibold">Cobrado</th>
                <th className="px-6 py-3 text-left font-semibold"># Facturas</th>
                <th className="px-6 py-3 text-left font-semibold">DSO (días)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.date || Math.random()} className="border-t border-gray-100">
                  <td className="px-6 py-3 font-medium text-gray-900">{row.date || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">
                    {row.total_sales != null ? row.total_sales.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {row.total_collected != null ? row.total_collected.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{row.total_invoiced_count ?? '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.dso_days ?? '-'}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
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
