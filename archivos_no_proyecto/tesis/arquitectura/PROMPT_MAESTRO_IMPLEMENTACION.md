# PROMPT MAESTRO DE IMPLEMENTACIÓN — SISTEMA FACTURACIÓN CLOUD (ALITO GROUP SRL)

> **Instrucciones para la IA:**
> Actúa como un Arquitecto de Software Senior y Desarrollador Full-Stack experto en Arquitectura Hexagonal, DDD (Domain-Driven Design) y Sistemas Cloud-Native.
> Tu tarea es construir (o guiar la construcción de) la plataforma de facturación para **ALITO GROUP SRL**.
> El sistema debe ser robusto, escalable y visualmente impactante (Premium UI).

---

## 1. VISIÓN DEL PRODUCTO Y CONTEXTO

**Objetivo:** Desarrollar una plataforma SaaS interna para gestionar el ciclo completo de facturación en República Dominicana, cumpliendo estrictamente con normativas **NCF/ITBIS (DGII)**.
**Key Differentiators:** Capacidad **Offline-First**, validaciones fiscales estrictas ("Hard Gates"), interfaz moderna y automatización con IA.

---

## 2. STACK TECNOLÓGICO (Recomendado)

- **Frontend:** React (Vite) o Next.js 14+ (App Router).
  - *UI Library:* Shadcn/UI + Tailwind CSS (para estética premium).
  - *State:* Zustand o TanStack Query.
  - *Icons:* Lucide React.
  - *Diagrams:* Mermaid.js / React Flow (para visualizar flujos).
- **Backend:** NestJS (Node.js) — *Elegido por su soporte nativo a módulos y arquitectura hexagonal*.
  - *ORM:* Prisma (PostgreSQL).
  - *Validación:* Zod / Class-Validator.
  - *Docs:* Swagger/OpenAPI.
- **Base de Datos:** PostgreSQL (con esquemas lógicos separados por módulo).
- **Infraestructura:** Docker (contenedores), AWS/GCP (target cloud).
- **Integraciones:** WhatsApp API (Twilio/Meta), SendGrid, S3 (Storage).

---

## 3. ARQUITECTURA DE SOFTWARE

**Estilo:** **Monolito Modular con Arquitectura Hexagonal**.
- El código debe estar organizado por **Módulos de Dominio (Bounded Contexts)**.
- Cada módulo debe tener capas estrictas:
  - `Domain` (Entidades, Reglas, Puertos).
  - `Application` (Casos de Uso, Servicios).
  - `Infrastructure` (Adaptadores: DB, API Controller, integraciones externas).
- **Regla de Oro:** El dominio NO depende de la infraestructura. La infraestructura implementa las interfaces (puertos) del dominio.

---

## 4. MÓDULOS DEL SISTEMA (Bounded Contexts)

Debes implementar los siguientes 11 módulos, respetando sus responsabilidades y **Reglas de Negocio Críticas**:

### A. Core Comercial & Operativo

1.  **Identity & Access**
    *   *Resp:* Auth, RBAC (Roles: Admin, Vendedor, Operador, Contador).
2.  **Master Data**
    *   *Resp:* Clientes (RNC/Cédula único), Catálogo de Servicios, Tarifas.
    *   *Regla:* **Bloqueo por Stock:** Si `Stock == 0` en MasterData, el módulo de Cotización NO puede agregar el ítem.
3.  **Quotation (Cotizaciones)**
    *   *Resp:* Crear cotizaciones, calcular ITBIS preliminar.
    *   *Regla:* **Auto-Invalidación:** Las cotizaciones expiran a los 30 días automáticamente.
    *   *Regla:* **Sync Obligatoria:** Si se intenta facturar algo diferente a lo cotizado, se fuerza una regeneración/actualización.
4.  **Proforma/Delivery (Ejecución)**
    *   *Resp:* Registrar entregas parciales, control de avance.
    *   *Regla:* **Sync vs Quote:** Si `Ejecutado > Cotizado` (ej. más metros de los previstos), el sistema bloquea y obliga a actualizar la cotización original.
    *   *Regla:* **Cliente Nuevo:** Si es cliente nuevo, exigir "Anticipo Registrado" antes de permitir despacho.

### B. Core Fiscal & Financiero

5.  **Billing & Tax (Facturación)**
    *   *Resp:* Emisión de NCF, cálculo final de ITBIS.
    *   *Regla:* **HARD GATE de Pago:** El botón "Emitir Factura fiscal con NCF" debe estar **DESHABILITADO** hasta que `Total Pagos (AR) >= Total Proforma`.
    *   *Regla:* **NCF Secuencial:** Asignación atómica y sin huecos.
    *   *Regla:* **Validación 3 Pasos:** Preview -> Confirmación -> Emisión.
6.  **Accounts Receivable (CxC)**
    *   *Resp:* Registro de pagos, estados de cuenta, antigüedad.
    *   *Regla:* **Bloqueo por Mora:** Si hay facturas vencidas > X días, bloquear nuevos despachos en Proforma.

### C. Soporte & IA

7.  **Documents**
    *   *Regla:* **Política de Purga:** PDFs temporales se borran a los 15-20 días; la data cruda persiste en DB para regeneración.
8.  **Notifications** (WhatsApp/Email).
9.  **AI Assist**
    *   *Regla:* **Mapeo Identidad:** Detectar cliente por número de WhatsApp entrante y vincular a `MasterData.Client`.
10. **Analytics/BI** (KPIs).
11. **Offline Sync** (Manejo de conflictos y UUIDs).

---

## 5. ESTRUCTURA DE CARPETAS SUGERIDA (NestJS Hexagonal)

```text
src/
 ├── shared/                  # Kernel compartido (EventBus, ValueObjects genéricos)
 ├── modules/
 │    ├── billing/            # Módulo de Facturación
 │    │    ├── domain/
 │    │    │    ├── entities/ (Invoice, TaxResult)
 │    │    │    ├── ports/    (InvoiceRepositoryPort, NCFServicePort)
 │    │    │    └── rules/    (TaxCalculationRule)
 │    │    ├── application/
 │    │    │    ├── services/ (IssueInvoiceService)
 │    │    │    └── use-cases/(CreateInvoiceUseCase)
 │    │    ├── infrastructure/
 │    │    │    ├── adapters/ (PostgresInvoiceRepository)
 │    │    │    ├── controllers/ (InvoiceController - REST)
 │    │    │    └── dtos/
 │    │    └── billing.module.ts
 │    ├── quotation/
 │    ├── identity/
 │    └── ...
 ├── main.ts
 └── app.module.ts
```

---

## 6. PASOS DE IMPLEMENTACIÓN (Roadmap para la IA)

Sigue este orden para generar el código:

1.  **Scaffolding:** Configurar monorepo/setup con NestJS + Prisma + PostgreSQL.
2.  **Dominio Base:** Crear entidades `Customer`, `ServiceItem` en Master Data.
3.  **Core Comercial:** Implementar flujo `Quote` -> `Proforma` con la regla de validación de Stock.
4.  **Core Fiscal (Crítico):** Implementar `Billing` con el **Hard Gate de Pago**. Esto es prioridad máxima. Conectar con `AR` para verificar saldo.
5.  **Frontend:** Crear dashboard "Premium" (Dark mode, glassmorphism) que consuma estas APIs.
6.  **Integración:** Conectar módulos vía Eventos (Domain Events) en lugar de llamadas directas acopladas.

---

## 7. RÚBRICA DE CALIDAD

*   **¿Es un Microservicio Puro?** No necesariamente al inicio, pero debe **parecerlo** (aislamiento lógico).
*   **¿La UI es Premium?** Debe usar gradientes sutiles, buena tipografía (Inter/Geist) y componentes reactivos.
*   **¿Seguridad?** RBAC implementado en cada endpoint.
*   **¿Validación Fiscal?** El NCF nunca puede duplicarse ni saltarse.

---

>**Nota Final:** Usa este prompt para generar cada parte del sistema. Si necesitas generar un módulo específico (ej. Facturación), refiérete a las reglas de la sección 4.B.
