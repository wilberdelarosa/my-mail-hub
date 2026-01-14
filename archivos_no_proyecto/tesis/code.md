title Sistema de Facturación Cloud — ALITO GROUP SRL (Vistas A/B/C/D + Despliegue)

////////////////////////////////////////////////////////////////////////////////

// VISTA A — C4: Contenedores y Fronteras

////////////////////////////////////////////////////////////////////////////////

Clientes y Operación Interna [color:gray,icon:users]{

  Cliente Externo [icon:user]

  Operador Interno [icon:user-check]

}

Canales [color:blue,icon:message-square]{

  Web App [icon:monitor]

  WhatsApp Bot [icon:message-circle]

}

Frontera Sistema Interno [color:green,icon:shield]{

  "API Gateway / BFF" [icon:server]

  Microservicios Core [icon:package]{

    Identity & Access [icon:lock]

    Master Data [icon:database]

    Quotation [icon:file-text]

    Proforma Delivery [icon:truck,label:"Proforma/Delivery"]

    Billing & Tax [icon:file-invoice-dollar]

    Accounts Receivable [icon:credit-card,label:"Cuentas x Cobrar"]

    Documents [icon:file]

    Notifications Automation [icon:bell,label:"Notificaciones/Automatización"]

    Analytics BI [icon:bar-chart,label:"Analítica/BI"]

    AI Assist [icon:cpu]

    Offline Sync [icon:refresh-ccw]

  }

  Event Bus [icon:repeat]

  DBs por Servicio [icon:database,label:"DB por Servicio"]

  Cache Redis [icon:zap,label:"Redis (cache/sesiones)"]

  Observabilidad [icon:activity]

  Audit Log [icon:book-open]

}

Servicios Externos [color:orange,icon:globe]{

  Drive S3 [icon:cloud,label:"Drive/S3"]

  WhatsApp Email Provider [icon:send,label:"WhatsApp/Email"]

  n8n [icon:zap]

}

////////////////////////////////////////////////////////////////////////////////

// VISTA B — Microservicios y Bounded Contexts (DDD)

////////////////////////////////////////////////////////////////////////////////

Microservicios [icon:layers]{

  // 1. Identity & Access

  Identity & Access [icon:lock]{

    DB Identity [icon:database,label:"DB"]

    Observabilidad Identity [icon:activity,label:"Observabilidad"]

    // Responsabilidades

    Resp_1 [icon:check,label:"Autenticación, RBAC, Sesiones"]

    // Datos

    User [icon:user]

    Role [icon:users]

    Permission [icon:key]

    RoleBinding [icon:link]

    SessionToken [icon:shield]

    // Endpoints

    Login [icon:log-in]

    RefreshToken [icon:refresh-cw]

    CreateUser [icon:user-plus]

    AssignRole [icon:user-check]

    ListRoles [icon:list]

    // Eventos

    UserCreated [icon:plus-square]

    RoleAssigned [icon:user-check]

  }

  // 2. Master Data

  Master Data [icon:database]{

    DB MasterData [icon:database,label:"DB"]

    Observabilidad MasterData [icon:activity,label:"Observabilidad"]

    Resp_2 [icon:check,label:"Clientes, Catálogo, Tarifas"]

    Customer [icon:user]

    CustomerTaxProfile [icon:file-text,label:"Perfil Fiscal"]

    CustomerContact [icon:phone]

    ServiceItem [icon:package]

    PriceList [icon:tag]

    PriceRule [icon:percent]

    // Endpoints

    CreateCustomer [icon:user-plus]

    UpdateCustomer [icon:edit]

    SearchCustomer [icon:search]

    UpsertPriceList [icon:upload]

    GetCurrentPrices [icon:dollar-sign]

    // Eventos

    CustomerCreated [icon:plus-square]

    CustomerUpdated [icon:edit-2]

    PriceListUpdated [icon:refresh-cw]

  }

  // 3. Quotation

  Quotation [icon:file-text]{

    DB Quotation [icon:database,label:"DB"]

    Observabilidad Quotation [icon:activity,label:"Observabilidad"]

    Resp_3 [icon:check,label:"Cotizaciones, Vigencia, Aprobación"]

    Quote [icon:file-text]

    QuoteLine [icon:list]

    QuoteStatus [icon:check-circle]

    ValidityWindow [icon:clock]

    // Endpoints

    RequestQuote [icon:file-plus]

    ApproveQuote [icon:thumbs-up]

    RejectQuote [icon:thumbs-down]

    RegenerateQuote [icon:refresh-cw]

    GetQuote [icon:search]

    // Eventos

    QuoteRequested [icon:file-plus]

    QuoteApproved [icon:thumbs-up]

    QuoteRejected [icon:thumbs-down]

    QuoteExpired [icon:alert-triangle]

    QuoteRegenerated [icon:refresh-cw]

  }

  // 4. Proforma/Delivery

  Proforma Delivery [icon:truck,label:"Proforma/Delivery"]{

    DB Proforma [icon:database,label:"DB"]

    Observabilidad Proforma [icon:activity,label:"Observabilidad"]

    Resp_4 [icon:check,label:"Proformas, Entregas, Cierre"]

    Proforma [icon:file]

    DeliveryRecord [icon:truck]

    CompletionState [icon:check]

    // Endpoints

    CreateProformaFromQuote [icon:file-plus]

    RecordDelivery [icon:edit]

    CloseProforma [icon:lock]

    GetProforma [icon:search]

    // Eventos

    ProformaCreated [icon:file-plus]

    DeliveryRecorded [icon:truck]

    ProformaClosed [icon:lock]

  }

  // 5. Billing & Tax

  Billing & Tax [icon:file-invoice-dollar]{

    DB Billing [icon:database,label:"DB"]

    Observabilidad Billing [icon:activity,label:"Observabilidad"]

    Resp_5 [icon:check,label:"Facturación, NCF, ITBIS, Auditoría"]

    Invoice [icon:file-invoice]

    InvoiceLine [icon:list]

    TaxBreakdown [icon:percent]

    NCFSequence [icon:hash]

    NCFAllocation [icon:hash]

    NCFType [icon:type]

    // Endpoints

    PreviewInvoice [icon:eye]

    IssueInvoice [icon:send]

    ValidateNCF [icon:check]

    ManageNCFSequences [icon:settings]

    VoidInvoice [icon:x-circle]

    IssueCreditNote [icon:minus-circle,label:"Nota de Crédito (opcional)"]

    IssueDebitNote [icon:plus-circle,label:"Nota de Débito (opcional)"]

    // Eventos

    InvoiceIssued_1 [icon:send,label:"InvoiceIssued"]

    NCFAllocated [icon:hash]

    TaxValidationFailed [icon:alert-triangle]

    InvoiceVoided [icon:x-circle]

    CreditNoteIssued [icon:minus-circle]

    DebitNoteIssued [icon:plus-circle]

  }

  // 6. Accounts Receivable (AR)

  Accounts Receivable [icon:credit-card,label:"Cuentas x Cobrar"]{

    DB AR [icon:database,label:"DB"]

    Observabilidad AR [icon:activity,label:"Observabilidad"]

    Resp_6 [icon:check,label:"CxC, Pagos, Estados de Cuenta"]

    Account [icon:user]

    ARInvoiceRef [icon:file-invoice]

    Payment [icon:dollar-sign]

    AgingSnapshot [icon:clock]

    // Endpoints

    ApplyPayment [icon:dollar-sign]

    GenerateStatement [icon:file-text]

    ComputeAging [icon:clock]

    GetAccountBalance [icon:bar-chart]

    // Eventos

    PaymentApplied [icon:check]

    StatementGenerated [icon:file-text]

    InvoiceOverdue_1 [icon:alert-triangle,label:"InvoiceOverdue"]

    // Consume

    InvoiceIssued_2 [icon:send,label:"InvoiceIssued"]

  }

  // 7. Documents

  Documents [icon:file]{

    DB Documents [icon:database,label:"DB"]

    Observabilidad Documents [icon:activity,label:"Observabilidad"]

    Resp_7 [icon:check,label:"Plantillas, PDF, Links"]

    DocumentTemplate [icon:file]

    DocumentRenderJob [icon:printer]

    DocumentLink [icon:link]

    // Endpoints

    RenderDocument [icon:printer]

    GetDocumentLink [icon:link]

    ManageTemplates [icon:settings]

    // Eventos

    DocumentRendered [icon:file-check]

    DocumentStorageFailed [icon:alert-triangle]

    // Integración

    Drive S3 [icon:cloud,label:"Drive/S3"]

  }

  // 8. Notifications/Automation

  Notifications Automation [icon:bell,label:"Notificaciones/Automatización"]{

    DB Notifications [icon:database,label:"DB"]

    Observabilidad Notifications [icon:activity,label:"Observabilidad"]

    Resp_8 [icon:check,label:"Notificaciones, Automatización"]

    NotificationJob [icon:bell]

    DeliveryAttempt [icon:send]

    // Endpoints

    SendNotification [icon:send]

    RetryNotification [icon:refresh-cw]

    GetNotificationStatus [icon:info]

    // Consume

    QuoteApproved [icon:thumbs-up]

    InvoiceIssued_3 [icon:send,label:"InvoiceIssued"]

    InvoiceOverdue_2 [icon:alert-triangle,label:"InvoiceOverdue"]

    // Produce

    InvoiceSent [icon:send]

    NotificationFailed [icon:alert-triangle]

    // Integración

    WhatsApp Email Provider [icon:send,label:"WhatsApp/Email"]

    n8n [icon:zap]

  }

  // 9. Analytics/BI

  Analytics BI [icon:bar-chart,label:"Analítica/BI"]{

    DB Analytics [icon:database,label:"DB"]

    Observabilidad Analytics [icon:activity,label:"Observabilidad"]

    Resp_9 [icon:check,label:"KPIs, Tableros, Data Mart"]

    DataMart [icon:database]

    // Ingesta

    Event Bus [icon:repeat]

    // Endpoints

    GetKPI [icon:bar-chart]

    GenerateReport [icon:file-text]

    GetDashboard [icon:monitor]

    // KPIs

    KPI_NCF [icon:hash]

    KPI_ITBIS [icon:percent]

    KPI_DSO [icon:clock]

    KPI_Auditable [icon:check]

  }

  // 10. AI Assist

  AI Assist [icon:cpu]{

    Observabilidad AI [icon:activity,label:"Observabilidad"]

    Resp_10 [icon:check,label:"Detección duplicados, anomalías, extracción WhatsApp"]

    // Casos

    Duplicados [icon:copy]

    Anomalias [icon:alert-triangle]

    ExtraccionWhatsApp [icon:message-circle]

  }

  // 11. Offline Sync

  Offline Sync [icon:refresh-ccw]{

    DB OfflineSync [icon:database,label:"DB"]

    Observabilidad OfflineSync [icon:activity,label:"Observabilidad"]

    Resp_11 [icon:check,label:"Batch offline, idempotencia, reconciliación"]

    OfflineBatch [icon:package]

    SyncCursor [icon:arrow-right]

    IdempotencyKey [icon:hash]

    // Endpoints

    SubmitBatch [icon:upload]

    GetSyncStatus [icon:info]

    // Eventos

    OfflineBatchReceived [icon:inbox]

    OfflineBatchApplied [icon:check]

    ConflictDetected [icon:alert-triangle]

  }

}

////////////////////////////////////////////////////////////////////////////////

// VISTA C — Flujos de Negocio End-to-End (Swimlanes)

////////////////////////////////////////////////////////////////////////////////

Flujo Principal [icon:shuffle]{

  SolicitudCotizacion [icon:file-plus,label:"Solicitud de Cotización"]

  AprobacionInterna [icon:thumbs-up,label:"Aprobación Interna"]

  CreacionProforma [icon:file,label:"Creación de Proforma"]

  RegistroParcialidades [icon:edit,label:"Registro de Parcialidades"]

  CierreProforma [icon:lock,label:"Cierre de Proforma"]

  PreviewFactura [icon:eye,label:"Previsualización Factura"]

  EmisionFactura [icon:send,label:"Emisión Fiscal (NCF/ITBIS)"]

  GeneracionPDF [icon:printer,label:"Generación PDF"]

  AlmacenamientoPDF [icon:cloud,label:"Almacenamiento Externo"]

  EnvioCliente [icon:send,label:"Envío al Cliente"]

  RegistroCxC [icon:credit-card,label:"Registro CxC"]

  RegistroPago [icon:dollar-sign,label:"Registro de Pago"]

  AlimentacionBI [icon:bar-chart,label:"Alimentación Analítica"]

}

Flujo Secundario 1 [icon:refresh-cw,label:"Expiración y Regeneración Cotización"]{

  QuoteApproved [icon:thumbs-up]

  TiempoPasa [icon:clock]

  ExpiraCotizacion [icon:alert-triangle]

  RegeneraCotizacion [icon:refresh-cw]

  Reaprobacion [icon:thumbs-up]

}

Flujo Secundario 2 [icon:alert-triangle,label:"Vencimiento y Recordatorio CxC"]{

  DetectaVencimiento [icon:alert-triangle]

  PublicaEvento [icon:send]

  EnviaRecordatorio [icon:send]

}

////////////////////////////////////////////////////////////////////////////////

// VISTA D — Offline Sync (Modo Sin Internet)

////////////////////////////////////////////////////////////////////////////////

OfflineSyncVista [icon:refresh-ccw,label:"Offline Sync"]{

  AppClienteOffline [icon:smartphone,label:"App Cliente (Offline)"]

  OfflineSyncService [icon:refresh-ccw,label:"Offline Sync Service"]

  EventBusOffline [icon:repeat,label:"Event Bus"]

  ServiciosCoreOffline [icon:package,label:"Servicios Core"]

  // Idempotencia

  UUIDTransaccion [icon:hash,label:"UUID/IdempotencyKey"]

  ValidacionIdempotencia [icon:check,label:"Validación Idempotencia"]

  Conflicto [icon:alert-triangle,label:"Conflicto"]

  RespuestaCliente [icon:message-square,label:"Respuesta Cliente"]

}

////////////////////////////////////////////////////////////////////////////////

// MINI-VISTA DE DESPLIEGUE (Lógica)

////////////////////////////////////////////////////////////////////////////////

Despliegue [icon:server,label:"Despliegue Lógico"]{

  Internet [icon:globe]

  LoadBalancer [icon:server,label:"Load Balancer"]

  CDN [icon:globe,label:"CDN (opcional)"]

  APIGatewayBFF [icon:server,label:"API Gateway/BFF"]

  RateLimiting [icon:clock,label:"Rate Limiting"]

  AuthEdge [icon:key,label:"AuthN/AuthZ"]

  ComputeCluster [icon:cpu,label:"Compute (K8s/VMs)"]

  EventBusDespliegue [icon:repeat,label:"Event Bus"]

  DBsPorServicio [icon:database,label:"DBs por Servicio"]

  CacheRedis [icon:zap,label:"Redis (cache/sesiones)"]

  ObjectStorage [icon:cloud,label:"Object Storage/Drive"]

  ObservabilidadDespliegue [icon:activity,label:"Observabilidad"]

  Backups [icon:refresh-ccw,label:"Backups/Snapshots"]

}

////////////////////////////////////////////////////////////////////////////////

// CONEXIONES PRINCIPALES (REST, EVENTOS, EXTERNOS, OWNERSHIP)

////////////////////////////////////////////////////////////////////////////////

// Actores/Canales

Cliente Externo > Web App: Solicitudes/Gestión

Operador Interno > Web App: Operación/Backoffice

Cliente Externo > WhatsApp Bot: Mensaje

WhatsApp Bot > "API Gateway / BFF": Webhook

Web App > "API Gateway / BFF": REST

// API Gateway a Microservicios Core (REST)

"API Gateway / BFF" > Identity & Access: REST
"API Gateway / BFF" > Master Data: REST
"API Gateway / BFF" > Quotation: REST
"API Gateway / BFF" > Proforma Delivery: REST
"API Gateway / BFF" > Billing & Tax: REST
"API Gateway / BFF" > Accounts Receivable: REST
"API Gateway / BFF" > Documents: REST
"API Gateway / BFF" > Notifications Automation: REST
"API Gateway / BFF" > Analytics BI: REST
"API Gateway / BFF" > AI Assist: REST
"API Gateway / BFF" > Offline Sync: REST

// Ownership (DB por servicio; ningún servicio escribe en DB ajena)

Identity & Access > DB Identity: Ownership
Master Data > DB MasterData: Ownership
Quotation > DB Quotation: Ownership
Proforma Delivery > DB Proforma: Ownership
Billing & Tax > DB Billing: Ownership
Accounts Receivable > DB AR: Ownership
Documents > DB Documents: Ownership
Notifications Automation > DB Notifications: Ownership
Analytics BI > DB Analytics: Ownership
Offline Sync > DB OfflineSync: Ownership

// Observabilidad transversal (logs/métricas/trazas)

"API Gateway / BFF" > Observabilidad: Logs/Métricas/Traces
Identity & Access > Observabilidad: Logs/Métricas/Traces
Master Data > Observabilidad: Logs/Métricas/Traces
Quotation > Observabilidad: Logs/Métricas/Traces
Proforma Delivery > Observabilidad: Logs/Métricas/Traces
Billing & Tax > Observabilidad: Logs/Métricas/Traces
Accounts Receivable > Observabilidad: Logs/Métricas/Traces
Documents > Observabilidad: Logs/Métricas/Traces
Notifications Automation > Observabilidad: Logs/Métricas/Traces
Analytics BI > Observabilidad: Logs/Métricas/Traces
AI Assist > Observabilidad: Logs/Métricas/Traces
Offline Sync > Observabilidad: Logs/Métricas/Traces

// Audit Log (append-only)

Identity & Access > Audit Log: Auditoría (cambios roles/sesiones)
Master Data > Audit Log: Auditoría (cambios clientes/precios)
Quotation > Audit Log: Auditoría (aprobaciones/regeneraciones)
Proforma Delivery > Audit Log: Auditoría (entregas/cierre)
Billing & Tax > Audit Log: Auditoría (preview/emisión/anulación)
Accounts Receivable > Audit Log: Auditoría (pagos/estados/vencimientos)
Documents > Audit Log: Auditoría (render/almacenamiento)
Notifications Automation > Audit Log: Auditoría (envíos/reintentos)
Offline Sync > Audit Log: Auditoría (batches/conflictos)

// Event Bus (asíncrono; eventos de dominio)

Identity & Access > Event Bus: UserCreated, RoleAssigned
Master Data > Event Bus: CustomerCreated, CustomerUpdated, PriceListUpdated
Quotation > Event Bus: QuoteRequested, QuoteApproved, QuoteRejected, QuoteExpired, QuoteRegenerated
Proforma Delivery > Event Bus: ProformaCreated, DeliveryRecorded, ProformaClosed
Billing & Tax > Event Bus: InvoiceIssued, NCFAllocated, TaxValidationFailed, InvoiceVoided, CreditNoteIssued, DebitNoteIssued
Accounts Receivable > Event Bus: PaymentApplied, StatementGenerated, InvoiceOverdue
Documents > Event Bus: DocumentRendered, DocumentStorageFailed
Notifications Automation > Event Bus: InvoiceSent, NotificationFailed
Offline Sync > Event Bus: OfflineBatchReceived, OfflineBatchApplied, ConflictDetected

// Consumidores de eventos

Event Bus > Accounts Receivable: InvoiceIssued
Event Bus > Notifications Automation: QuoteApproved, InvoiceIssued, InvoiceOverdue
Event Bus > Analytics BI: Todos los eventos de dominio
Event Bus > AI Assist: QuoteRequested, InvoiceIssued

// Integraciones externas

Documents > Drive S3: Guardar PDF
Notifications Automation > WhatsApp Email Provider: Notificación
Notifications Automation > n8n: Automatización

// Offline Sync (modo sin internet)

AppClienteOffline > OfflineSyncService: SubmitBatch (UUID)
OfflineSyncService > ValidacionIdempotencia: Validar UUID
ValidacionIdempotencia > Conflicto: Si duplicado/conflicto
ValidacionIdempotencia > EventBusOffline: Si nuevo
EventBusOffline > ServiciosCoreOffline: Propaga eventos
ServiciosCoreOffline > RespuestaCliente: Aplicado/Duplicado/Conflicto

// Mini-vista de despliegue

Internet > CDN: Opcional
CDN > LoadBalancer
LoadBalancer > RateLimiting
RateLimiting > AuthEdge
AuthEdge > APIGatewayBFF
APIGatewayBFF > ComputeCluster
ComputeCluster > EventBusDespliegue
ComputeCluster > DBsPorServicio
ComputeCluster > CacheRedis
ComputeCluster > ObjectStorage
ComputeCluster > ObservabilidadDespliegue
ComputeCluster > Backups

////////////////////////////////////////////////////////////////////////////////

// FLUJOS DE NEGOCIO (VISTA C)

////////////////////////////////////////////////////////////////////////////////

// Flujo principal

SolicitudCotizacion > "API Gateway / BFF": RequestQuote
"API Gateway / BFF" > Quotation: RequestQuote

Operador Interno > AprobacionInterna: Revisar/Aprobar
AprobacionInterna > "API Gateway / BFF": ApproveQuote
"API Gateway / BFF" > Quotation: ApproveQuote

CreacionProforma > "API Gateway / BFF": CreateProformaFromQuote
"API Gateway / BFF" > Proforma Delivery: CreateProformaFromQuote

RegistroParcialidades > "API Gateway / BFF": RecordDelivery
"API Gateway / BFF" > Proforma Delivery: RecordDelivery

CierreProforma > "API Gateway / BFF": CloseProforma
"API Gateway / BFF" > Proforma Delivery: CloseProforma

PreviewFactura > "API Gateway / BFF": PreviewInvoice
"API Gateway / BFF" > Billing & Tax: PreviewInvoice

EmisionFactura > "API Gateway / BFF": IssueInvoice
"API Gateway / BFF" > Billing & Tax: IssueInvoice

"API Gateway / BFF" > Documents: RenderDocument
Documents > GeneracionPDF: RenderDocument
GeneracionPDF > AlmacenamientoPDF: Guardar en Drive S3
AlmacenamientoPDF > EnvioCliente: Enviar link

"API Gateway / BFF" > Notifications Automation: SendNotification (factura/link)
"API Gateway / BFF" > Accounts Receivable: Registrar CxC

Cliente Externo > RegistroPago: Realizar pago
RegistroPago > "API Gateway / BFF": ApplyPayment
"API Gateway / BFF" > Accounts Receivable: ApplyPayment

"API Gateway / BFF" > Analytics BI: Alimentar KPIs

// Flujo secundario 1 (Expiración/regeneración)

QuoteApproved > TiempoPasa
TiempoPasa > ExpiraCotizacion: 15-30 días
ExpiraCotizacion > RegeneraCotizacion: RegenerateQuote
RegeneraCotizacion > Master Data: GetCurrentPrices
RegeneraCotizacion > Reaprobacion: ApproveQuote

// Flujo secundario 2 (Vencimiento y recordatorio CxC)

Accounts Receivable > DetectaVencimiento: Detecta InvoiceOverdue
DetectaVencimiento > PublicaEvento: InvoiceOverdue
PublicaEvento > Event Bus: InvoiceOverdue
Event Bus > Notifications Automation: InvoiceOverdue
Notifications Automation > EnviaRecordatorio: WhatsApp/Email

////////////////////////////////////////////////////////////////////////////////

// REGLAS Y POLÍTICAS (en conexiones y labels)

////////////////////////////////////////////////////////////////////////////////

// NCF solo se asigna en Billing & Tax (servidor)
Billing & Tax > NCFSequence: Asignar NCF

// PreviewInvoice → confirmación → IssueInvoice
Billing & Tax > ValidateNCF: Validar ITBIS y tipo NCF

// Regla: no se permite facturar si la proforma no está cerrada
Proforma Delivery > Billing & Tax: ProformaClosed requerido

// Control de stock (si aplica)
Master Data > Quotation: Validar disponibilidad

// Continuidad operativa: canales independientes (no hay conexión directa WhatsApp Bot ↔ Web App)
