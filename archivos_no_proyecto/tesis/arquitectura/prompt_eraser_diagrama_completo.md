# Prompt para Eraser.io — Diagrama completo del sistema (ALITO GROUP SRL)

Copia y pega TODO este texto en Eraser (AI / Generate diagram). El objetivo es que Eraser genere un **diagrama completo y detallado** del sistema descrito en los documentos del proyecto.

---

## 1) Contexto del sistema (según documentos)

Necesito modelar un **Sistema de Facturación Cloud** para **ALITO GROUP SRL (Bávaro – Punta Cana)**.

- Dominio: facturación de servicios (equipo pesado/servicios asociados) con flujo **Cotización → Proforma → Factura**.
- Norma fiscal: **República Dominicana (DGII)**, con control estricto de **NCF** y cálculo consistente de **ITBIS (18%)**.
- Canales:
  - **Web App** (operación interna y clientes)
  - **WhatsApp** (bot / webhook) para capturar solicitudes y notificar
- Objetivos clave:
  - Reducir errores de NCF/ITBIS
  - Trazabilidad/auditoría fuerte
  - Automatizar notificaciones y flujos (posible n8n)
  - Analítica/KPIs
  - Soporte de **conectividad inestable** con modo **offline tipo “commit”** y sincronización idempotente

Restricciones importantes (según requerimientos implícitos):
- La operación debe seguir funcionando si un canal cae (ej.: WhatsApp), sin tumbar la plataforma.
- Los PDFs NO deben guardarse en la base de datos transaccional: se generan y se almacenan en Drive/S3; el sistema conserva metadatos y enlaces.
- El control fiscal (NCF) debe ser centralizado y auditable.
- Documentos base (para que uses como “verdad” del sistema):
  - Anteproyecto: problemas y alcance (procesos manuales, dispersión de datos, riesgo de auditoría)
  - Tesis: propuesta técnica (microservicios + hexagonal + offline)
  - Arquitectura elaborada: microservicios, eventos, consistencia, seguridad y observabilidad

---

## 2) Qué necesito que produzcas (salida)

Genera **UN SOLO DIAGRAMA MAESTRO**, pero con secciones bien organizadas (por ejemplo, agrupadas por “capas” o “vistas”).

Quiero que el diagrama incluya **4 vistas dentro del mismo canvas** (o enmarcadas dentro de la misma hoja):

### Vista A — C4 / Arquitectura a nivel contenedores
Incluye:
- Cliente (usuario) y Operación Interna
- Web App
- WhatsApp (canal)
- API Gateway / BFF
- Microservicios Core (con responsabilidades)
- Event Bus
- Bases de datos por servicio (ownership)
- Observabilidad (logs/métricas/trazas)
- Almacenamiento de documentos (Drive/S3)
- Proveedor de notificaciones (WhatsApp/Email) o n8n

Además, marca explícitamente:
- Frontera “Interno” (Operación interna) vs “Cliente” (externo)
- Frontera “Sistema” vs “Servicios externos”
- Camino sincrónico (REST) vs asíncrono (Event Bus)

### Vista B — Microservicios y bounded contexts (DDD)
Representa explícitamente estos bounded contexts (microservicios):
- **Identity & Access**: usuarios/roles/permisos (RBAC)
- **Master Data**: clientes (RNC/Cédula), catálogo de servicios/tarifas con vigencias
- **Quotation**: cotizaciones (vigencia 15–30 días, aprobación, regeneración)
- **Proforma/Delivery**: control de ejecución, parcialidades, cierre
- **Billing & Tax**: emisión de factura, validaciones, ITBIS, asignación de NCF (solo servidor)
- **Accounts Receivable (AR)**: cuentas por cobrar, pagos, vencimientos, estados de cuenta, antigüedad
- **Documents**: plantillas + render PDF + link
- **Notifications/Automation**: WhatsApp/Email (posible n8n)
- **Analytics/BI**: KPIs y tableros
- **AI Assist** (opcional/realista): detección duplicados, anomalías, extracción desde WhatsApp
- **Offline Sync**: ingestión batch y reconciliación idempotente

Para cada microservicio, añade debajo (o en nota) sus 1–2 responsabilidades principales.

Y agrega, para cada uno:
- 3–6 entidades/datos principales (ownership)
- 3–6 endpoints o casos de uso (alto nivel)
- 3–6 eventos de dominio (publica/consume)

Usa esta especificación (derivada de la arquitectura del proyecto):

1) Identity & Access
- Datos: User, Role, Permission, RoleBinding, Session/Token
- Endpoints: Login, RefreshToken, CreateUser, AssignRole, ListRoles
- Eventos: UserCreated, RoleAssigned (opcional)

2) Master Data
- Datos: Customer, CustomerTaxProfile (RNC/Cédula), CustomerContact; ServiceItem; PriceList/PriceRule (vigencia)
- Endpoints: CreateCustomer, UpdateCustomer, SearchCustomer; UpsertPriceList; GetCurrentPrices
- Eventos: CustomerCreated, CustomerUpdated, PriceListUpdated

3) Quotation
- Datos: Quote (aggregate), QuoteLine, QuoteStatus, ValidityWindow
- Endpoints: RequestQuote, ApproveQuote, RejectQuote, RegenerateQuote, GetQuote
- Eventos: QuoteRequested, QuoteApproved, QuoteRejected, QuoteExpired, QuoteRegenerated
- Regla clave: vigencia 15–30 días; si expira, se regenera con tarifas vigentes

4) Proforma/Delivery
- Datos: Proforma (aggregate), DeliveryRecord, CompletionState
- Endpoints: CreateProformaFromQuote, RecordDelivery, CloseProforma, GetProforma
- Eventos: ProformaCreated, DeliveryRecorded, ProformaClosed
- Regla clave: no se permite facturar si la proforma no está cerrada

5) Billing & Tax (fiscal)
- Datos: Invoice (aggregate), InvoiceLine, TaxBreakdown; NCFSequence (aggregate), NCFAllocation, NCFType
- Endpoints: PreviewInvoice, IssueInvoice, ValidateNCF, ManageNCFSequences, VoidInvoice (si aplica)
- Eventos: InvoiceIssued, NCFAllocated, TaxValidationFailed, InvoiceVoided (si aplica)
- Reglas clave:
  - NCF único y secuencial; NCF solo se asigna en servidor
  - ITBIS 18% con redondeo consistente
  - Proceso en 2 pasos: PreviewInvoice → confirmación → IssueInvoice
  - Auditoría append-only de intentos y emisión

6) Accounts Receivable (AR)
- Datos: Account, ARInvoiceRef, Payment, AgingSnapshot
- Endpoints: ApplyPayment, GenerateStatement, ComputeAging, GetAccountBalance
- Consume: InvoiceIssued
- Produce: PaymentApplied, StatementGenerated, InvoiceOverdue

7) Documents
- Datos: DocumentTemplate, DocumentRenderJob, DocumentLink
- Endpoints: RenderDocument, GetDocumentLink, ManageTemplates
- Integración: Drive/S3 (externo)

8) Notifications/Automation
- Datos: NotificationJob, DeliveryAttempt (si se modela)
- Consume: QuoteApproved, InvoiceIssued, InvoiceOverdue
- Produce: InvoiceSent, NotificationFailed (opcional)
- Integración: WhatsApp/Email Provider o n8n (externo)

9) Analytics/BI
- Datos: Modelo analítico (hechos/dimensiones) o “Data Mart”
- Ingesta: por eventos (Event Bus) o CDC
- KPIs: errores NCF/ITBIS, tiempo de emisión, DSO, antigüedad, % expedientes auditables

10) AI Assist (opcional)
- Casos: detección de duplicados (clientes), anomalías de precios, extracción de datos desde WhatsApp
- Nota: la IA asiste; no decide sola lo fiscal

11) Offline Sync
- Datos: OfflineBatch, SyncCursor, IdempotencyKey/UUID
- Endpoints: SubmitBatch, GetSyncStatus
- Eventos: OfflineBatchReceived, OfflineBatchApplied, ConflictDetected

### Vista C — Flujos de negocio end-to-end (con eventos)
Incluye, como flujo principal:
1) Solicitud de cotización (Web/WhatsApp)
2) Aprobación interna
3) Creación de proforma y registro de parcialidades
4) Cierre de proforma
5) Previsualización y emisión fiscal de factura (con NCF y validación de ITBIS)
6) Generación PDF + almacenamiento externo + envío al cliente
7) Registro automático de CxC (AR)
8) Alimentación de analítica (BI)

**Requisitos del flujo**:
- Billing & Tax debe tener un paso explícito de **PreviewInvoice** antes de **IssueInvoice**.
- La asignación de NCF ocurre en Billing & Tax mediante un componente/aggregate **NCFSequence**.
- Luego se emite evento **InvoiceIssued** al bus, que consume AR, Notifications y BI.

Incluye también 2 flujos secundarios (en pequeño, pero dentro del mismo canvas):

Flujo secundario 1 — Expiración y regeneración de cotización
1) QuoteApproved
2) Time passes (15–30 días)
3) ExpireQuote
4) RegenerateQuote con tarifas vigentes desde Master Data
5) Vuelve a revisión/aprobación

Flujo secundario 2 — Vencimiento y recordatorio de CxC
1) AR detecta InvoiceOverdue
2) Publica evento InvoiceOverdue
3) Notifications envía recordatorio por WhatsApp/Email

### Vista D — Offline Sync (modo sin internet)
Modela:
- App/cliente captura transacciones offline (con UUIDs)
- Al volver internet, envía batch al **Offline Sync Service**
- Offline Sync valida idempotencia (UUID)
- Publica eventos al Event Bus
- Servicios core procesan, emiten eventos resultantes
- Respuesta al cliente: aplicado / conflicto

Importante:
- **NCF solo se asigna en servidor**
- El cliente puede generar IDs deterministas, pero nunca asigna NCF

Detalla la estrategia de idempotencia:
- Cada transacción offline lleva un UUID (IdempotencyKey)
- Offline Sync rechaza duplicados y reporta conflicto
- El servidor responde con “aplicado / duplicado / conflicto por estado”

---

## 3) Estilo/convenciones del diagrama

- Idioma: **Español**.
- Usa nombres consistentes (mismos que en la arquitectura):
  - “API Gateway / BFF”, “Event Bus”, “Billing & Tax”, “Accounts Receivable”, etc.
- Deja muy claro el **ownership de datos**:
  - Cada microservicio tiene su propia DB (o esquema) y es dueño de sus datos.
  - Otros servicios NO escriben en DB ajena.
- Marca integraciones externas como “Externos”:
  - Drive/S3
  - Proveedor WhatsApp/Email
  - n8n (si aparece)
- Observabilidad:
  - Logs, métricas y trazas como componente transversal

Convención de integración:
- REST/gRPC: para consultas necesarias de UX (buscar cliente, previsualizar factura)
- Eventos: para propagación y desacoplamiento (InvoiceIssued → AR/BI/Notifications)

Nota de consistencia:
- Aceptar consistencia eventual entre servicios; transacciones solo dentro de cada servicio.

---

## 4) Detalle extra que debes reflejar (importante)

### Seguridad y auditoría
- Identity Service provee autenticación/autorización (RBAC).
- Billing & Tax registra auditoría de intentos y emisión (append-only/inmutable lógico).

Incluye en el diagrama:
- Un componente “Audit Log” (append-only) o “Auditoría” consumido por Billing & Tax (y opcionalmente por otros servicios)
- Políticas RBAC: rol “Administrador NCF” separado de rol “Facturador”

### Reglas de negocio
- Cotizaciones expiran en 15–30 días y pueden “regenerarse” con tarifas vigentes.
- No se factura si la proforma no está cerrada.
- ITBIS debe ser consistente; NCF debe ser único, secuencial y auditable.

Incluye el control de inventario/disponibilidad (si aplica en el contexto de equipos):
- Master Data o un módulo de disponibilidad puede deshabilitar cotización si no hay stock

Incluye la regla de continuidad operativa:
- Si WhatsApp está caído, Web App y panel interno deben seguir operando

Incluye el almacenamiento de PDFs:
- Documents genera PDF → guarda en Drive/S3 → entrega link (solo metadatos en DB)

Incluye el “proceso de validación en 3 pasos” para emisión fiscal como detalle visual:
1) Validar proforma cerrada y pago/condiciones
2) Validar impuestos/ITBIS y tipo NCF
3) Asignar NCF (NCFSequence) y emitir factura

Nota: si no existe un “Pago Service” separado, modela la validación de pago como parte de Operación interna + AR/Billing.

---

## 5) Vista extra dentro del mismo canvas (pequeña): Despliegue lógico

Incluye una mini-vista de despliegue (alta abstracción) con:
- Internet → Load Balancer → API Gateway/BFF
- Compute (Kubernetes o equivalente) corriendo microservicios
- Event Bus
- PostgreSQL (esquema/DB por servicio)
- Object Storage / Drive
- Observabilidad (logs/métricas/trazas)

No uses marcas de proveedor (AWS/Azure/GCP) salvo que sea necesario.

---

## 6) Entregable

Devuélveme el diagrama en Eraser:
- Un canvas con las vistas A/B/C/D + la mini-vista de despliegue (sección pequeña) organizadas, sin duplicación innecesaria.
- Con conexiones claras (sin saturación), y con flechas etiquetadas solo cuando agreguen valor.
- Incluye una leyenda corta con:
  - REST (sincrónico)
  - Eventos (asíncrono)
  - Externo
  - DB ownership

Fin del prompt.
