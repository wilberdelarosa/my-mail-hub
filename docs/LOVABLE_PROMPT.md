# PROMPT PARA LOVABLE - Sistema de Facturación ALITO GROUP

## Contexto del Proyecto Existente

Tengo un sistema de facturación industrial con arquitectura de microservicios ya implementada. Necesito que crees componentes frontend que consuman estas APIs sin modificar el backend.

---

## 🏗️ Arquitectura Backend (YA EXISTE - NO MODIFICAR)

### Microservicios Disponibles:

**1. Identity Service** - Puerto 3001
- POST `/api/identity/v1/auth/login` - Login
- POST `/api/identity/v1/auth/register` - Registro
- GET `/api/identity/v1/users` - Lista usuarios

**2. Master Data Service** - Puerto 3002
- GET `/api/master-data/v1/customers` - Lista clientes
- POST `/api/master-data/v1/customers` - Crear cliente
- GET `/api/master-data/v1/customers/:id` - Obtener cliente
- PUT `/api/master-data/v1/customers/:id` - Actualizar cliente
- DELETE `/api/master-data/v1/customers/:id` - Eliminar cliente
- GET `/api/master-data/v1/service-items` - Lista servicios

**3. Quotation Service** - Puerto 3003
- GET `/api/quotation/v1/quotes` - Lista cotizaciones
- POST `/api/quotation/v1/manual` - Crear cotización
- GET `/api/quotation/v1/proformas` - Lista proformas
- GET `/api/quotation/v1/proformas/:id/pdf` - URL del PDF

**4. Billing Service** - Puerto 3004
- GET `/api/billing/v1/invoices` - Lista facturas
- POST `/api/billing/v1/invoices` - Emitir factura

**5. n8n Automation** - Puerto 5678
- POST `/webhook/whatsapp-incoming` - Procesa WhatsApp con IA
- POST `/webhook/create-quote-with-ai` - Crea cotización con GPT-4

---

## 📦 Componentes Requeridos

Necesito que crees los siguientes componentes en **React/TypeScript** que se integren **sin modificar el backend**:

### 1. Hook de Integración API

Crea un hook personalizado `src/hooks/useApi.ts`:

```typescript
import { useState } from 'react';

interface UseApiOptions {
  baseUrl: string;
  authToken?: string;
}

export const useApi = ({ baseUrl, authToken }: UseApiOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (endpoint: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          ...options?.headers,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading, error };
};
```

**URLs Base:**
- Identity: `http://localhost:3001`
- Master Data: `http://localhost:3002`
- Quotation: `http://localhost:3003`
- Billing: `http://localhost:3004`
- n8n: `http://localhost:5678`

---

### 2. Cliente API Específico

Crea `src/lib/quotationClient.ts`:

```typescript
import { useApi } from '@/hooks/useApi';

const QUOTATION_BASE = 'http://localhost:3003/api/quotation/v1';

export interface QuoteItem {
  serviceId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface CreateQuoteRequest {
  customerRnc: string;
  customerName: string;
  projectName: string;
  location: string;
  items: QuoteItem[];
  notes?: string;
}

export const useQuotationAPI = () => {
  const { fetchData, loading, error } = useApi({ baseUrl: QUOTATION_BASE });

  return {
    createQuote: (data: CreateQuoteRequest) => 
      fetchData('/manual', { method: 'POST', body: JSON.stringify(data) }),
    
    getProformas: () => fetchData('/proformas'),
    
    getProformaPDF: async (id: string) => {
      const data = await fetchData(`/proformas/${id}/pdf`);
      window.open(data.pdfUrl, '_blank');
    },
    
    loading,
    error
  };
};
```

---

### 3. Componente: Formulario de Cotización

Crea `src/components/QuoteForm.tsx`:

```typescript
import { useState } from 'react';
import { useQuotationAPI, CreateQuoteRequest, QuoteItem } from '@/lib/quotationClient';

export default function QuoteForm() {
  const { createQuote, loading } = useQuotationAPI();
  const [formData, setFormData] = useState<CreateQuoteRequest>({
    customerRnc: '',
    customerName: '',
    projectName: '',
    location: '',
    items: [],
    notes: ''
  });

  const [currentItem, setCurrentItem] = useState<QuoteItem>({
    serviceId: '',
    description: '',
    quantity: 0,
    unit: 'HR',
    unitPrice: 0
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, currentItem]
    }));
    setCurrentItem({ serviceId: '', description: '', quantity: 0, unit: 'HR', unitPrice: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createQuote(formData);
      alert(`Cotización creada: ${result.quoteId}`);
    } catch (error) {
      alert('Error al crear cotización');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Nueva Cotización</h2>
      
      {/* Cliente */}
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="RNC (ej: 101-90213-7)"
          value={formData.customerRnc}
          onChange={(e) => setFormData({...formData, customerRnc: e.target.value})}
          className="border p-2 rounded"
        />
        <input
          placeholder="Nombre del Cliente"
          value={formData.customerName}
          onChange={(e) => setFormData({...formData, customerName: e.target.value})}
          className="border p-2 rounded"
        />
      </div>

      <input
        placeholder="Nombre del Proyecto"
        value={formData.projectName}
        onChange={(e) => setFormData({...formData, projectName: e.target.value})}
        className="border p-2 rounded w-full"
      />

      <input
        placeholder="Ubicación"
        value={formData.location}
        onChange={(e) => setFormData({...formData, location: e.target.value})}
        className="border p-2 rounded w-full"
      />

      {/* Items */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Agregar Item</h3>
        <div className="grid grid-cols-5 gap-2">
          <input
            placeholder="Descripción"
            value={currentItem.description}
            onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
            className="border p-2 rounded col-span-2"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={currentItem.quantity || ''}
            onChange={(e) => setCurrentItem({...currentItem, quantity: parseFloat(e.target.value)})}
            className="border p-2 rounded"
          />
          <select
            value={currentItem.unit}
            onChange={(e) => setCurrentItem({...currentItem, unit: e.target.value})}
            className="border p-2 rounded"
          >
            <option value="HR">HR</option>
            <option value="M3">M3</option>
            <option value="VIAJE">VIAJE</option>
            <option value="UND">UND</option>
          </select>
          <input
            type="number"
            placeholder="Precio"
            value={currentItem.unitPrice || ''}
            onChange={(e) => setCurrentItem({...currentItem, unitPrice: parseFloat(e.target.value)})}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Agregar Item
        </button>
      </div>

      {/* Lista de Items */}
      {formData.items.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Items ({formData.items.length})</h3>
          {formData.items.map((item, idx) => (
            <div key={idx} className="flex justify-between bg-gray-50 p-2 rounded mb-1">
              <span>{item.description}</span>
              <span>{item.quantity} {item.unit} × RD$ {item.unitPrice}</span>
            </div>
          ))}
        </div>
      )}

      <textarea
        placeholder="Notas adicionales"
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
        className="border p-2 rounded w-full h-20"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Creando...' : 'Crear Cotización'}
      </button>
    </form>
  );
}
```

---

### 4. Componente: Lista de Proformas con PDF

Crea `src/components/ProformasList.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useQuotationAPI } from '@/lib/quotationClient';

interface Proforma {
  id: string;
  number: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function ProformasList() {
  const { getProformas, getProformaPDF, loading } = useQuotationAPI();
  const [proformas, setProformas] = useState<Proforma[]>([]);

  useEffect(() => {
    loadProformas();
  }, []);

  const loadProformas = async () => {
    try {
      const data = await getProformas();
      setProformas(data);
    } catch (error) {
      console.error('Error cargando proformas:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Proformas</h2>
      
      {loading && <p>Cargando...</p>}
      
      <div className="space-y-2">
        {proformas.map(p => (
          <div key={p.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <div>
              <h3 className="font-semibold">{p.number}</h3>
              <p className="text-sm text-gray-600">{p.customerName}</p>
              <p className="text-sm">Total: RD$ {p.total.toLocaleString()}</p>
            </div>
            <button
              onClick={() => getProformaPDF(p.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              📄 Descargar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 5. Integración con n8n (Opcional - IA)

Crea `src/hooks/useN8N.ts`:

```typescript
import { useState } from 'react';

const N8N_BASE = 'http://localhost:5678/webhook';

export const useN8N = () => {
  const [loading, setLoading] = useState(false);

  const processWithAI = async (text: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${N8N_BASE}/create-quote-with-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text })
      });
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  return { processWithAI, loading };
};
```

**Componente de uso:**

```typescript
import { useN8N } from '@/hooks/useN8N';

export default function AIQuoteForm() {
  const { processWithAI, loading } = useN8N();
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    const result = await processWithAI(text);
    alert(`Cotización creada por IA: ${result.quoteId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Cotización Asistida por IA</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe lo que necesitas: ej. 'Necesito 50 M3 de calicote para Villa Bernardo'"
        className="w-full h-32 border p-3 rounded"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        {loading ? 'Procesando con IA...' : '✨ Crear con IA'}
      </button>
    </div>
  );
}
```

---

## 🎨 Diseño Visual Requerido

**Paleta de colores (Tema Industrial):**
- Primary: `#12A594` (Verde azulado - grúas/equipos)
- Secondary: `#FF6D5A` (Naranja - alertas)
- Accent: `#6E56CF` (Púrpura - IA features)
- Background: `#F8F9FA`
- Text: `#1F2937`

**Tipografía:**
- Headings: `font-bold text-2xl`
- Body: `text-base text-gray-700`

**Componentes UI:**
- Usar **shadcn/ui** o **TailwindCSS** puro
- Botones con hover states
- Inputs con border focus
- Loading states con spinners

---

## 📋 Requerimientos Técnicos

1. **Stack:** React 18+ con TypeScript
2. **No modificar backend** - Solo consumir APIs existentes
3. **Estilos:** TailwindCSS (ya configurado)
4. **Manejo de errores:** Try/catch con mensajes claros
5. **Loading states:** Mostrar mientras hace fetch
6. **Responsive:** Mobile-first design

---

## 🚀 Estructura de Carpetas

```
src/
├── hooks/
│   ├── useApi.ts          # Hook genérico API
│   └── useN8N.ts          # Hook n8n
├── lib/
│   ├── quotationClient.ts # Cliente Quotation API
│   ├── billingClient.ts   # Cliente Billing API
│   └── masterDataClient.ts # Cliente Master Data API
├── components/
│   ├── QuoteForm.tsx      # Formulario cotización
│   ├── ProformasList.tsx  # Lista proformas
│   ├── AIQuoteForm.tsx    # Form con IA
│   └── InvoicesList.tsx   # Lista facturas
└── pages/
    ├── quotes.tsx         # Página cotizaciones
    ├── proformas.tsx      # Página proformas
    └── invoices.tsx       # Página facturas
```

---

## ✅ Checklist de Implementación

Por favor, genera:
- [ ] Hook `useApi` genérico
- [ ] Cliente `quotationClient.ts` con tipos TypeScript
- [ ] Componente `QuoteForm` funcional
- [ ] Componente `ProformasList` con botón PDF
- [ ] (Opcional) Hook `useN8N` para IA
- [ ] (Opcional) Componente `AIQuoteForm`

**IMPORTANTE:** No modifiques las URLs de las APIs, son las que ya tengo corriendo localmente.

---

## 🎯 Resultado Esperado

Cuando copies este código en mi proyecto, debería:
1. ✅ Conectarse a mis APIs sin cambios
2. ✅ Mostrar datos correctamente
3. ✅ Crear cotizaciones que aparezcan en mi backend
4. ✅ Descargar PDFs desde Supabase Storage
5. ✅ (Opcional) Integrar con n8n para IA

**NO necesito:**
- ❌ Configuración de rutas (ya tengo Next.js configurado)
- ❌ Auth completo (lo haré después)
- ❌ Validaciones complejas (solo básicas)

---

¿Puedes generar estos componentes listos para copiar/pegar?
