import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type TemplateRow = {
  id: string
  code: string | null
  name: string | null
  subject: string | null
  include_pdf: boolean | null
  pdf_type: string | null
  updated_at: string | null
}

export default function TemplatesPage() {
  const [rows, setRows] = useState<TemplateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const fetchTemplates = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('email_templates')
      .select('id,code,name,subject,include_pdf,pdf_type,updated_at')
      .order('updated_at', { ascending: false })
      .limit(500)

    if (error) {
      setError(error.message)
      setRows([])
    } else {
      setRows((data || []) as TemplateRow[])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) =>
      [row.code, row.name, row.subject, row.pdf_type]
        .filter(Boolean)
        .some((value) => (value || '').toLowerCase().includes(term)),
    )
  }, [rows, query])

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Templates de Email</h1>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por código, nombre o asunto"
            className="w-full md:w-80 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          />
          <button
            onClick={fetchTemplates}
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
          {loading ? 'Cargando templates...' : `${filtered.length} templates`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Código</th>
                <th className="px-6 py-3 text-left font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold">Asunto</th>
                <th className="px-6 py-3 text-left font-semibold">PDF</th>
                <th className="px-6 py-3 text-left font-semibold">Tipo PDF</th>
                <th className="px-6 py-3 text-left font-semibold">Actualizado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="px-6 py-3 font-medium text-gray-900">{row.code || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.name || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.subject || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.include_pdf ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.pdf_type || '-'}</td>
                  <td className="px-6 py-3 text-gray-700">{row.updated_at || '-'}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
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
