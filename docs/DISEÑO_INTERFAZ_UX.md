# 🎨 BLUEPRINT DE INTERFAZ & UX - SISTEMA DE FACTURACIÓN CLOUD

**Fecha:** 14 de enero de 2026
**Alcance:** Definición visual y de interacción basada en Backend implementado (Fases 1-8).

---

## 🏗️ 1. Arquitectura del Frontend (Next.js App Router)

La aplicación usará un layout tipo dashboard con navegación lateral persistente.

```
/app
├── (auth)                  # Layout sin sidebar
│   ├── login/page.tsx      # Pantalla acceso
│   └── register/page.tsx   # Registro tenant
│
├── (dashboard)             # Layout con Sidebar + Header
│   ├── layout.tsx          # Shell principal
│   ├── page.tsx            # Dashboard Home (KPIs)
│   │
│   ├── customers/          # Módulo Master Data
│   │   ├── page.tsx        # Lista Clientes
│   │   ├── new/page.tsx    # Formulario Crear
│   │   └── [id]/page.tsx   # Detalle Cliente
│   │
│   ├── quotes/             # Módulo Cotizaciones
│   │   ├── page.tsx        # Lista Cotizaciones
│   │   ├── new/page.tsx    # Editor Cotización
│   │   └── [id]/page.tsx   # Vista Previa / Acciones
│   │
│   ├── invoices/           # Módulo Facturación
│   │   ├── page.tsx        # Lista Facturas
│   │   └── [id]/page.tsx   # Detalle Factura + Pagos
│   │
│   └── ar/                 # Módulo Cobros
│       └── payments/new/   # Registrar Pago
```

---

## 🖱️ 2. Mapa de Navegación y Acciones

### 📌 Sidebar (Menú Principal)
1.  **Dashboard** (Icon: Home)
2.  **Ventas**
    *   Cotizaciones (Icon: FileText)
    *   Facturas (Icon: Receipt)
    *   Clientes (Icon: Users)
3.  **Finanzas**
    *   Cobros / Recibos (Icon: Banknote)
    *   Reportes (Icon: BarChart)
4.  **Configuración** (Icon: Settings) -> Usuarios, Roles, NCF

---

## 🖥️ 3. Detalle de Pantallas y Conexiones

A continuación, el diseño detallado de cada vista basada *exactamente* en los campos que tenemos en BD.

### A. Pantalla Login (Auth)
*   **Campos:** `Email`, `Password`.
*   **Acción Principal:** Botón "Ingresar".
    *   → *On Click:* Llama a `POST /auth/login`.
    *   → *On Success:* Redirige a `/dashboard`.
    *   → *On Error:* Muestra Toast "Credenciales inválidas".

### B. Módulo Clientes (Master Data)

#### B1. Lista de Clientes (`/customers`)
*   **Tabla:**
    *   Cols: RNC/Cédula, Razón Social, Email, Teléfono, Tipo Fiscal.
    *   Acciones por fila: [Editar], [Nueva Cotización].
*   **Botón Flotante/Header:** "+ Nuevo Cliente".
    *   → *Click:* Navega a `/customers/new`.

#### B2. Formulario Nuevo Cliente (`/customers/new`)
*   **Campos (Inputs):**
    *   `RNC / Cédula` (Mask: 999-99999-9 o 999-9999999-9).
    *   `Razón Social`.
    *   `Tipo Fiscal` (Select: Crédito Fiscal 31 / Consumo 32).
        *   *Default:* Consumo.
    *   `Límite Crédito` (Input Number).
*   **Validación:** RNC debe tener 9 u 11 dígitos (Regla de negocio Phase 3).
*   **Acción:** Botón "Guardar Cliente".
    *   → *Success:* Redirige a `/customers` + Toast "Cliente Creado".

---

### C. Módulo Cotizaciones (Quotation) **[COMPLEJO]**

#### C1. Editor de Cotización (`/quotes/new`)
Esta es la pantalla más interactiva.

*   **Cabecera:**
    *   `Cliente` (Combobox con búsqueda asíncrona).
    *   `Fecha Expiración` (DatePicker, default +15 días).
*   **Detalle (Grid Dinámico):**
    *   Boton "+ Agregar Item".
        *   Abre Modal o Línea Inline.
        *   Calcula `Subtotal = Cantidad * Precio`.
        *   Calcula `ITBIS = Subtotal * 0.18`.
*   **Footer Totales:**
    *   Subtotal, ITBIS, **Total General**.
*   **Acciones:**
    *   [Guardar Borrador] → `status: DRAFT`.
    *   [Guardar y Finalizar] → `status: SENT` (Bloquea edición).

#### C2. Vista Cotización (`/quotes/[id]`)
Pantalla de solo lectura o acciones de transición.
*   **Visual:** Renderizado tipo "Hoja de papel" (Preview PDF).
*   **Barra de Acciones (Top Bar):**
    *   [🖨️ Imprimir] (Genera PDF).
    *   [📧 Enviar Email] (Llama Notification Service Phase 8).
    *   **[🚀 CONVERTIR A FACTURA]** (Botón Primario).
        *   → *Click:* Navega a `/invoices/new?quoteId={id}` (Pre-llena datos).

---

### D. Módulo Facturación (Billing & e-NCF)

#### D1. Emisión de Factura (`/invoices/new`)
Puede venir vacía o pre-llenada desde una cotización.

*   **Panel NCF (Crucial):**
    *   `Tipo Comprobante`: [Crédito Fiscal (B01)] | [Consumo (B02)].
    *   `NCF Asignado`: *Preview* (ej: "Se generará el próximo disponible").
*   **Validación Hard Gate:**
    *   Si `Cliente.RNC` es inválido para Crédito Fiscal, deshabilitar opción B01.
*   **Acción Principal:** Botón "EMITIR FACTURA (FIRMADA)".
    *   → *Click:* Llama a `POST /invoices`.
    *   → *Proceso:* Genera NCF atómico, firma XML, guarda.
    *   → *Resultado:* Redirige a Pantalla Detalle Factura.

---

### E. Módulo Cobros (Accounts Receivable)

#### E1. Detalle Factura + Pagos (`/invoices/[id]`)
Muestra la factura emitida y su estado de deuda.

*   **Estado Visual:** Badge [PARTIALLY PAID] (Amarillo) o [PAID] (Verde).
*   **Sección Pagos:** Lista de pagos aplicados.
*   **Acción:** Botón "Registrar Pago".
    *   Abre Modal "Nuevo Pago".
        *   `Monto`: (Max: Saldo pendiente).
        *   `Método`: Efectivo / Transferencia.
        *   `Referencia`: Ingresar # confirmación.
    *   → *Click Guardar:* Llama a `POST /payments` (Lógica transaccional Phase 7).
    *   → *UI Update:* La barra de saldo pendiente baja, y si llega a 0, el Badge cambia a [PAID] 🎉.

---

## 🔄 4. Mapa de Transiciones (User Flow)

```mermaid
graph TD
    LOGIN[Login] --> DASH[Dashboard]
    DASH -->|Click "Nuevo Cliente"| NEW_CUST[Form Cliente]
    NEW_CUST -->|Guardar| LIST_CUST[Lista Clientes]
    
    LIST_CUST -->|Click "Cotizar"| NEW_QUOTE[Editor Cotización]
    NEW_QUOTE -->|Guardar| VIEW_QUOTE[Ver Cotización]
    
    VIEW_QUOTE -->|Click "Facturar"| NEW_INV[Emitir Factura]
    NEW_INV -->|Confirmar| VIEW_INV[Ver Factura]
    
    VIEW_INV -->|Click "Pagar"| MODAL_PAY[Modal Pago]
    MODAL_PAY -->|Guardar| VIEW_INV
```

---

## 🧩 5. Componentes UI Reutilizables (Design System)

Para implementar esto rápido usaremos **Shadcn/UI**:

1.  `<DataTable />`: Para listas (paginación, filtros).
2.  `<StatusBadge />`: Para estados (Draft=Gris, Paid=Verde, Overdue=Rojo).
3.  `<InvoicePreview />`: Componente complejo que renderiza el HTML del PDF.
4.  `<NCFSelector />`: RadioGroup con lógica de validación fiscal.

---

**Este documento sirve como especificación funcional completa para el equipo de Frontend (o para la Fase 13).**
