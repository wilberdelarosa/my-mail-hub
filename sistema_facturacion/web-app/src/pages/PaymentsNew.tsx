import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

type CustomerOption = {
  id: string
  name: string | null
}

export default function PaymentsNewPage() {
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    customerId: '',
    amount: '',
    method: 'CASH',
    reference: '',
    paymentDate: new Date().toISOString().slice(0, 10),
    status: 'POSTED',
    notes: '',
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true)
      const { data, error } = await supabase
        .from('customers')
        .select('id,name')
        .order('name', { ascending: true })
        .limit(500)

      if (error) {
        toast.error(`Error cargando clientes: ${error.message}`)
        setCustomers([])
      } else {
        setCustomers((data || []) as CustomerOption[])
      }
      setLoadingCustomers(false)
    }

    fetchCustomers()
  }, [])

  const customerOptions = useMemo(() => customers, [customers])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!form.customerId) {
      toast.error('Selecciona un cliente')
      return
    }

    const amountValue = Number(form.amount)
    if (!amountValue || amountValue <= 0) {
      toast.error('Ingresa un monto válido')
      return
    }

    setSaving(true)
    const { error } = await supabase.from('payments').insert({
      customer_id: form.customerId,
      amount: amountValue,
      unapplied_amount: amountValue,
      method: form.method,
      reference: form.reference || null,
      payment_date: form.paymentDate,
      status: form.status,
      notes: form.notes || null,
    })

    if (error) {
      toast.error(`Error guardando pago: ${error.message}`)
    } else {
      toast.success('Pago registrado')
      setForm({
        customerId: '',
        amount: '',
        method: 'CASH',
        reference: '',
        paymentDate: new Date().toISOString().slice(0, 10),
        status: 'POSTED',
        notes: '',
      })
    }

    setSaving(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nuevo Pago</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-gray-600">
            Cliente
            <select
              value={form.customerId}
              onChange={(event) => setForm({ ...form, customerId: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              disabled={loadingCustomers}
            >
              <option value="">Selecciona un cliente</option>
              {customerOptions.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name || 'Cliente sin nombre'}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-gray-600">
            Monto
            <input
              type="number"
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </label>

          <label className="text-sm text-gray-600">
            Método
            <select
              value={form.method}
              onChange={(event) => setForm({ ...form, method: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="CASH">Efectivo</option>
              <option value="TRANSFER">Transferencia</option>
              <option value="CREDIT_CARD">Tarjeta</option>
              <option value="CHECK">Cheque</option>
            </select>
          </label>

          <label className="text-sm text-gray-600">
            Referencia
            <input
              type="text"
              value={form.reference}
              onChange={(event) => setForm({ ...form, reference: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              placeholder="Opcional"
            />
          </label>

          <label className="text-sm text-gray-600">
            Fecha de pago
            <input
              type="date"
              value={form.paymentDate}
              onChange={(event) => setForm({ ...form, paymentDate: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm text-gray-600">
            Estado
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="POSTED">Publicado</option>
              <option value="PENDING">Pendiente</option>
              <option value="CANCELLED">Anulado</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block text-sm text-gray-600">
          Notas
          <textarea
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            rows={3}
            placeholder="Notas adicionales"
          />
        </label>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Registrar pago'}
          </button>
        </div>
      </form>
    </div>
  )
}
