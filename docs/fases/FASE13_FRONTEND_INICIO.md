# 🚀 FASE 13: FRONTEND (WEB APP) - INICIO

**Fecha:** 14 de enero de 2026
**Tecnología:** Next.js 14 (App Router), Tailwind CSS, Shadcn/UI, TypeScript.

---

## 🎯 OBJETIVOS

1.  **Inicialización:** Crear proyecto web moderno.
2.  **Autenticación:** Pantalla Login conectada a `POST /auth/login`.
3.  **Layout:** Dashboard Shell (Sidebar + Header + Content).
4.  **Módulos:**
    -   Clientes (CRUD)
    -   Cotizaciones (Editor)
    -   Facturas (Listado y Emisión)

## 🏗️ ESTRUCTURA (Basada en DISEÑO_INTERFAZ_UX.md)

```
web-app/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (dashboard)/layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (Shadcn components)
│   │   └── business/ (InvoiceDesigner, CustomerForm)
│   └── lib/
│       ├── api.ts (Axios instances)
│       └── utils.ts
```

---

## 🔗 CONEXIONES DE API

| Módulo | Endpoint Backend | Puerto |
| :--- | :--- | :--- |
| **Auth** | `http://localhost:3001` | Identity Svc |
| **Customers** | `http://localhost:3002` | Master Data Svc |
| **Quotes** | `http://localhost:3003` | Quotation Svc |
| **Billing** | `http://localhost:3004` | Billing Svc |

---
