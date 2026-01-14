# Sistema de Facturación Cloud — ALITO GROUP SRL

## Representación Visual Moderna (4 Vistas + Despliegue)

**Proyecto:** ALITO GROUP SRL
**Fecha:** 2026-01-13
**Arquitectura:** Microservicios + Hexagonal + DDD

---

## 🏗️ VISTA A — Contenedores y Fronteras (C4 Model)

```mermaid
flowchart TB
    %% Sección: Actores y Canales
    subgraph Externos["👥 ACTORES EXTERNOS"]
        ClienteExt["👤 Cliente Externo"]
        OperadorInt["👔 Operador Interno"]
    end

    subgraph Canales["📱 CANALES DE ENTRADA"]
        WebApp["🌐 Web App\n(SPA / React)"]
        WhatsAppBot["💬 WhatsApp Bot\n(Webhook)"]
    end

    %% Sección: Frontera Interna y Core
    subgraph FronteraSistema["🛡️ FRONTERA SISTEMA INTERNO"]
        APIGateway["🚪 API Gateway / BFF\n(Primary Adapter)"]

        subgraph HexagonalCore["⬡ HEXAGONAL CORE"]
            direction LR
            MS1["🔐 Identity"]
            MS2["📊 Master Data"]
            MS3["📋 Quotation"]
            MS4["📦 Proforma"]
            MS5["💰 Billing"]
            MS6["💳 AR"]
            MS7["📄 Documents"]
            MS8["🔔 Notifications"]
            MS9["📈 Analytics"]
            MS10["🤖 AI Assist"]
            MS11["🔄 Offline Sync"]
        end

        EventBus["🔁 Event Bus\n(RabbitMQ/Kafka)"]
        AuditLog["📚 Audit Log\n(Append-Only)"]
        Observabilidad["👁️ Observabilidad\n(Logs/Metrics/Traces)"]
    end

    subgraph ServiciosExternos["🌍 SERVICIOS EXTERNOS"]
        DriveS3["☁️ Drive/S3\n(Object Storage)"]
        WhatsAppEmail["📧 WhatsApp/Email\n(Provider)"]
        N8N["⚡ n8n\n(Automation)"]
    end

    %% Conexiones Actores → Canales
    ClienteExt -->|Solicitudes| WebApp
    ClienteExt -->|Mensajes| WhatsAppBot
    OperadorInt -->|Gestión| WebApp

    %% Conexiones Canales → Sistema
    WebApp -->|REST API| APIGateway
    WhatsAppBot -->|Webhook| APIGateway

    %% API Gateway → Microservicios
    APIGateway --> MS1
    APIGateway --> MS2
    APIGateway --> MS3
    APIGateway --> MS4
    APIGateway --> MS5
    APIGateway --> MS6
    APIGateway --> MS7
    APIGateway --> MS8
    APIGateway --> MS9
    APIGateway --> MS10
    APIGateway --> MS11

    %% Event Bus (publicación)
    MS1 -.-> EventBus
    MS2 -.-> EventBus
    MS3 -.-> EventBus
    MS4 -.-> EventBus
    MS5 -.-> EventBus
    MS6 -.-> EventBus
    MS7 -.-> EventBus
    MS8 -.-> EventBus
    MS11 -.-> EventBus

    %% Audit Log
    MS1 -.-> AuditLog
    MS5 -.-> AuditLog
    MS6 -.-> AuditLog

    %% Observabilidad
    APIGateway -.-> Observabilidad
    EventBus -.-> Observabilidad

    %% Integraciones externas
    MS7 --> DriveS3
    MS8 --> WhatsAppEmail
    MS8 --> N8N

    %% Consumidores de eventos
    EventBus -.-> MS8
    EventBus -.-> MS9
    EventBus -.-> MS10

    %% Estilos por nodo (compatibles con mermaid 8.8)
    classDef externosStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    classDef canalesStyle fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    classDef fronteraStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:4px,color:#000
    classDef coreStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef externosServStyle fill:#ffebee,stroke:#c62828,stroke-width:3px,color:#000
    classDef infraStyle fill:#eceff1,stroke:#455a64,stroke-width:2px,color:#000

    class ClienteExt,OperadorInt externosStyle
    class WebApp,WhatsAppBot canalesStyle
    class APIGateway fronteraStyle
    class MS1,MS2,MS3,MS4,MS5,MS6,MS7,MS8,MS9,MS10,MS11 coreStyle
    class EventBus,AuditLog,Observabilidad infraStyle
    class DriveS3,WhatsAppEmail,N8N externosServStyle
```

---

## 🎯 VISTA B — Microservicios y Bounded Contexts (DDD)

```mermaid
flowchart TB
    %% Event Bus Central
    EventBus[("🔁 EVENT BUS\n(RabbitMQ/Kafka)")]

    %% Microservicios (usamos *_SVC como nodos ancla)
    subgraph Identity["🔐 IDENTITY & ACCESS"]
        direction TB
        ID_SVC["🔐 Identity & Access"]
        I_DB[("DB Identity")]
        I_OBS["Obs"]
    end

    subgraph MasterData["📊 MASTER DATA"]
        direction TB
        MD_SVC["📊 Master Data"]
        MD_DB[("DB MasterData")]
        MD_OBS["Obs"]
    end

    subgraph Quotation["📋 QUOTATION"]
        direction TB
        Q_SVC["📋 Quotation"]
        Q_DB[("DB Quotation")]
        Q_OBS["Obs"]
    end

    subgraph Proforma["📦 PROFORMA/DELIVERY"]
        direction TB
        P_SVC["📦 Proforma/Delivery"]
        P_DB[("DB Proforma")]
        P_OBS["Obs"]
    end

    subgraph Billing["💰 BILLING & TAX"]
        direction TB
        B_SVC["💰 Billing & Tax"]
        B_DB[("DB Billing")]
        B_OBS["Obs"]
    end

    subgraph AR["💳 ACCOUNTS RECEIVABLE"]
        direction TB
        AR_SVC["💳 Accounts Receivable"]
        AR_DB[("DB AR")]
        AR_OBS["Obs"]
    end

    subgraph Documents["📄 DOCUMENTS"]
        direction TB
        D_SVC["📄 Documents"]
        D_DB[("DB Documents")]
        D_OBS["Obs"]
    end

    subgraph Notifications["🔔 NOTIFICATIONS"]
        direction TB
        N_SVC["🔔 Notifications"]
        N_DB[("DB Notifications")]
        N_OBS["Obs"]
    end

    subgraph Analytics["📈 ANALYTICS/BI"]
        direction TB
        A_SVC["📈 Analytics/BI"]
        A_DB[("DB Analytics")]
        A_OBS["Obs"]
    end

    subgraph AI["🤖 AI ASSIST"]
        AI_SVC["🤖 AI Assist"]
        AI_OBS["Obs"]
    end

    subgraph OfflineSync["🔄 OFFLINE SYNC"]
        direction TB
        OS_SVC["🔄 Offline Sync"]
        OS_DB[("DB OfflineSync")]
        OS_OBS["Obs"]
    end

    %% Publican eventos
    ID_SVC -.-> EventBus
    MD_SVC -.-> EventBus
    Q_SVC -.-> EventBus
    P_SVC -.-> EventBus
    B_SVC -.-> EventBus
    AR_SVC -.-> EventBus
    D_SVC -.-> EventBus
    N_SVC -.-> EventBus
    OS_SVC -.-> EventBus

    %% Consumen eventos
    EventBus -.-> AR_SVC
    EventBus -.-> N_SVC
    EventBus -.-> A_SVC
    EventBus -.-> AI_SVC

    %% Estilos simples (compatibles con mermaid 8.8)
    classDef coreService fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,color:#000
    classDef fiscalService fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000
    classDef supportService fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef eventBusStyle fill:#ffccbc,stroke:#d84315,stroke-width:3px,color:#000

    class ID_SVC,MD_SVC,Q_SVC,P_SVC coreService
    class B_SVC fiscalService
    class AR_SVC,D_SVC,N_SVC,A_SVC,AI_SVC,OS_SVC supportService
    class EventBus eventBusStyle
```

---

## 🔄 VISTA C — Flujos de Negocio End-to-End

### Flujo Principal: Solicitud → Factura → CxC

```mermaid
sequenceDiagram
    autonumber
    participant Cliente
    participant WA as WhatsApp/Web
    participant GW as API Gateway
    participant Q as Quotation
    participant P as Proforma
    participant B as Billing & Tax
    participant D as Documents
    participant N as Notifications
    participant AR as Accounts Receivable
    participant BI as Analytics/BI

    Note over Cliente,BI: 📋 FASE 1: COTIZACIÓN
    Cliente->>WA: Solicitar cotización
    WA->>GW: RequestQuote
    GW->>Q: Crear cotización
    Q-->>GW: QuoteRequested (evento)
    Q-->>Cliente: Cotización #COT-001

    Note over Cliente,BI: ✅ FASE 2: APROBACIÓN
    Cliente->>WA: Aprobar cotización
    WA->>GW: ApproveQuote
    GW->>Q: Aprobar
    Q-->>GW: QuoteApproved (evento)
    Q-->>Cliente: Cotización aprobada

    Note over Cliente,BI: 📦 FASE 3: PROFORMA Y ENTREGAS
    GW->>P: CreateProformaFromQuote
    P-->>GW: ProformaCreated (evento)
  
    loop Parcialidades
        Cliente->>WA: Registrar entrega parcial
        WA->>GW: RecordDelivery
        GW->>P: Actualizar proforma
        P-->>GW: DeliveryRecorded (evento)
    end

    Cliente->>WA: Cerrar proforma
    WA->>GW: CloseProforma
    GW->>P: Cerrar
    P-->>GW: ProformaClosed (evento)

    Note over Cliente,BI: 💰 FASE 4: FACTURACIÓN FISCAL
    GW->>B: PreviewInvoice
    B-->>GW: Vista previa + warnings
  
    WA->>GW: Confirmar emisión
    GW->>B: IssueInvoice
    B->>B: Validar ITBIS + NCF
    B->>B: Asignar NCF secuencial
    B-->>GW: InvoiceIssued (evento)
    B-->>GW: Factura #FAC-001 (NCF: B0100000001)

    Note over Cliente,BI: 📄 FASE 5: GENERACIÓN Y ENVÍO PDF
    GW->>D: RenderDocument(invoice)
    D->>D: Generar PDF
    D->>D: Almacenar en S3
    D-->>GW: DocumentRendered (evento)
    D-->>GW: Link público

    GW->>N: Enviar factura al cliente
    N->>N: WhatsApp/Email
    N-->>GW: InvoiceSent (evento)
    N-->>Cliente: 📧 Factura PDF + link

    Note over Cliente,BI: 💳 FASE 6: REGISTRO CxC
    B-->>AR: InvoiceIssued (vía Event Bus)
    AR->>AR: Registrar CxC
    AR-->>GW: PaymentApplied (cuando pague)

    Note over Cliente,BI: 📈 FASE 7: ANALÍTICA
    B-->>BI: InvoiceIssued (vía Event Bus)
    P-->>BI: ProformaClosed (vía Event Bus)
    AR-->>BI: PaymentApplied (vía Event Bus)
    BI->>BI: Actualizar KPIs
```

### Flujo Secundario 1: Expiración y Regeneración de Cotización

```mermaid
stateDiagram-v2
    [*] --> QuoteRequested: Solicitud
    QuoteRequested --> QuoteApproved: Aprobación
    QuoteApproved --> ValidityCheck: Verificación automática
    ValidityCheck --> QuoteActive: Vigente (< 15-30 días)
    ValidityCheck --> QuoteExpired: Expirada (> 30 días)
    QuoteExpired --> QuoteRegenerated: RegenerateQuote
    QuoteRegenerated --> QuoteApproved: Reaprobación
    QuoteActive --> [*]: Convertir a Proforma
    QuoteApproved --> [*]: Convertir a Proforma

    note right of QuoteExpired
        Se regenera con
        tarifas vigentes
    end note
```

### Flujo Secundario 2: Vencimiento y Recordatorio CxC

```mermaid
flowchart LR
    A["💳 Factura Emitida"] --> B{"⏰ Verificar<br/>Vencimiento"}
    B -->|"< 30 días"| C["✅ OK"]
    B -->|"> 30 días"| D["⚠️ Detectar Vencimiento"]
    D --> E["📤 Publicar<br/>InvoiceOverdue"]
    E --> F["🔔 Notifications"]
    F --> G["📧 Enviar Recordatorio<br/>WhatsApp/Email"]
    G --> H["👤 Cliente Notificado"]

    style D fill:#ffccbc,stroke:#d84315,stroke-width:3px
    style E fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style G fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
```

---

## 🔄 VISTA D — Offline Sync (Modo Sin Internet)

```mermaid
graph TB
    subgraph Cliente["📱 CLIENTE (OFFLINE)"]
        AppOffline["🔌 App Cliente<br/>(Sin internet)"]
        LocalCache["💾 Cache Local<br/>(IndexedDB)"]
        UUID["🔑 Generador UUID<br/>(IdempotencyKey)"]
    end

    subgraph Sincronizacion["🔄 OFFLINE SYNC SERVICE"]
        ReceiveBatch["📥 ReceiveBatch<br/>(SubmitBatch endpoint)"]
        ValidateIdem["✅ ValidateIdempotency<br/>(Check UUID)"]
        ConflictDetector["⚠️ ConflictDetector"]
        ApplyBatch["✨ ApplyBatch"]
    end

    subgraph EventBusOffline["🔁 EVENT BUS"]
        EB["Event Bus<br/>(RabbitMQ/Kafka)"]
    end

    subgraph Core["⬡ SERVICIOS CORE"]
        Quotation["📋 Quotation"]
        Proforma["📦 Proforma"]
        MasterData["📊 Master Data"]
    end

    subgraph Response["📨 RESPUESTA"]
        Success["✅ Success:<br/>Batch aplicado"]
        Conflict["⚠️ Conflict:<br/>UUID duplicado"]
        Error["❌ Error:<br/>Validación fallida"]
    end

    %% Flujo principal
    AppOffline -->|"1. Captura transacciones<br/>offline"| LocalCache
    LocalCache -->|"2. Genera UUID<br/>por transacción"| UUID
    UUID -->|"3. Sincroniza cuando<br/>hay internet"| ReceiveBatch
  
    ReceiveBatch -->|"4. Valida UUID"| ValidateIdem
  
    ValidateIdem -->|"UUID nuevo"| ApplyBatch
    ValidateIdem -->|"UUID duplicado"| ConflictDetector
  
    ApplyBatch -->|"5. Publica eventos"| EB
    EB -->|"6. Propaga a servicios"| Quotation
    EB --> Proforma
    EB --> MasterData
  
    ConflictDetector --> Conflict
    ApplyBatch --> Success
    ValidateIdem -->|"Validación fallida"| Error
  
    Success -->|"7. Responde al cliente"| AppOffline
    Conflict --> AppOffline
    Error --> AppOffline

    %% Estilos
    classDef offlineStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    classDef syncStyle fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    classDef eventStyle fill:#ffccbc,stroke:#d84315,stroke-width:3px,color:#000
    classDef coreStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef successStyle fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
    classDef warningStyle fill:#fff9c4,stroke:#f57f17,stroke-width:3px,color:#000
    classDef errorStyle fill:#ffccbc,stroke:#c62828,stroke-width:3px,color:#000

    class Cliente offlineStyle
    class Sincronizacion syncStyle
    class EventBusOffline eventStyle
    class Core coreStyle
    class Success successStyle
    class Conflict warningStyle
    class Error errorStyle
```

### Mecanismo de Idempotencia

```mermaid
sequenceDiagram
    autonumber
    participant App as App Cliente (Offline)
    participant OS as Offline Sync Service
    participant DB as DB OfflineSync
    participant EB as Event Bus
    participant Core as Servicios Core

    Note over App,Core: 🔌 MODO OFFLINE: Cliente sin internet

    App->>App: Generar UUID único<br/>para cada transacción
    App->>App: Almacenar en cache local

    Note over App,Core: 🌐 RECONEXIÓN: Cliente recupera internet

    App->>OS: SubmitBatch(transacciones[])
  
    loop Para cada transacción
        OS->>DB: Verificar IdempotencyKey (UUID)
      
        alt UUID NO existe (nueva transacción)
            DB-->>OS: ✅ UUID válido
            OS->>DB: Guardar UUID + timestamp
            OS->>EB: Publicar eventos de dominio
            EB-->>Core: Procesar eventos
            Core-->>OS: ✅ Procesado
        else UUID YA existe (duplicado)
            DB-->>OS: ⚠️ UUID duplicado
            OS->>OS: Log conflicto
            OS-->>App: ⚠️ ConflictDetected:<br/>Transacción ya procesada
        end
    end

    OS-->>App: 📊 Resultado final:<br/>X aplicadas, Y conflictos
```

---

## 🚀 MINI-VISTA DE DESPLIEGUE (Lógica Cloud-Native)

```mermaid
graph TB
    subgraph Internet["🌍 INTERNET"]
        Users["👥 Usuarios<br/>(Web + WhatsApp)"]
    end

    subgraph LoadBalancing["⚖️ LOAD BALANCING"]
        LB["🔀 Load Balancer<br/>(ALB/NLB)"]
        CDN["📡 CDN (opcional)<br/>(CloudFront/Cloudflare)"]
    end

    subgraph Edge["🚪 EDGE LAYER"]
        APIGW["🔐 API Gateway/BFF<br/>(Kong/Nginx/AWS API Gateway)"]
        RateLimit["⏱️ Rate Limiting"]
        Auth["🔑 Authentication"]
    end

    subgraph ComputeLayer["💻 COMPUTE LAYER"]
        K8s["☸️ Kubernetes Cluster<br/>(EKS/GKE/AKS)"]
      
        subgraph Pods["📦 PODS (Microservicios)"]
            MS1["Identity"]
            MS2["Master Data"]
            MS3["Quotation"]
            MS4["Proforma"]
            MS5["Billing & Tax"]
            MS6["AR"]
            MS7["Documents"]
            MS8["Notifications"]
            MS9["Analytics"]
            MS10["AI Assist"]
            MS11["Offline Sync"]
        end
    end

    subgraph Messaging["📨 MESSAGING"]
        EventBus["🔁 Event Bus<br/>(RabbitMQ/Kafka/SNS+SQS)"]
    end

    subgraph DataLayer["💾 DATA LAYER"]
        DBs["🗄️ PostgreSQL por servicio<br/>(RDS/Aurora/Cloud SQL)"]
        Redis["⚡ Redis<br/>(Cache + Sessions)"]
    end

    subgraph Storage["☁️ STORAGE"]
        S3["📦 Object Storage<br/>(S3/GCS/Azure Blob)"]
    end

    subgraph Observability["👁️ OBSERVABILITY"]
        Logs["📋 Logs<br/>(CloudWatch/ELK)"]
        Metrics["📊 Metrics<br/>(Prometheus/Datadog)"]
        Traces["🔍 Traces<br/>(Jaeger/X-Ray)"]
    end

    subgraph External["🌍 EXTERNAL SERVICES"]
        WhatsApp["💬 WhatsApp API"]
        Email["📧 Email Provider<br/>(SendGrid/SES)"]
        N8N["⚡ n8n<br/>(Automation)"]
    end

    subgraph Backup["💿 BACKUP & RECOVERY"]
        BackupDB["🔄 DB Snapshots"]
        BackupS3["🔄 S3 Versioning"]
    end

    %% Conexiones principales
    Users --> CDN
    CDN --> LB
    LB --> APIGW
    APIGW --> RateLimit
    RateLimit --> Auth
    Auth --> K8s

    K8s --> MS1
    K8s --> MS2
    K8s --> MS3
    K8s --> MS4
    K8s --> MS5
    K8s --> MS6
    K8s --> MS7
    K8s --> MS8
    K8s --> MS9
    K8s --> MS10
    K8s --> MS11

    Pods --> EventBus
    Pods --> DBs
    Pods --> Redis
    Pods --> S3

    Pods --> Logs
    Pods --> Metrics
    Pods --> Traces

    MS8 --> WhatsApp
    MS8 --> Email
    MS8 --> N8N

    DBs --> BackupDB
    S3 --> BackupS3

    %% Estilos
    classDef internetStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:4px,color:#000
    classDef edgeStyle fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    classDef computeStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:3px,color:#000
    classDef dataStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#000
    classDef obsStyle fill:#eceff1,stroke:#455a64,stroke-width:3px,color:#000
    classDef extStyle fill:#ffebee,stroke:#c62828,stroke-width:3px,color:#000

    %% Nota Mermaid: estilos por nodo (no subgraph) para máxima compatibilidad.
    class Users internetStyle

    class CDN,LB edgeStyle
    class APIGW,RateLimit,Auth edgeStyle

    class K8s,Pods,MS1,MS2,MS3,MS4,MS5,MS6,MS7,MS8,MS9,MS10,MS11 computeStyle

    class EventBus,DBs,Redis,S3 dataStyle

    class Logs,Metrics,Traces obsStyle

    class WhatsApp,Email,N8N,BackupDB,BackupS3 extStyle
```

---

## 📊 RESUMEN DE COMPONENTES

### Microservicios (11 total)

| #  | Microservicio            | DB Propia      | Event Publisher | Event Consumer     |
| -- | ------------------------ | -------------- | --------------- | ------------------ |
| 1  | Identity & Access        | ✅             | ✅              | ❌                 |
| 2  | Master Data              | ✅             | ✅              | ❌                 |
| 3  | Quotation                | ✅             | ✅              | ❌                 |
| 4  | Proforma/Delivery        | ✅             | ✅              | ❌                 |
| 5  | Billing & Tax            | ✅             | ✅              | ❌                 |
| 6  | Accounts Receivable      | ✅             | ✅              | ✅ (InvoiceIssued) |
| 7  | Documents                | ✅             | ✅              | ❌                 |
| 8  | Notifications/Automation | ✅             | ✅              | ✅ (Multi-eventos) |
| 9  | Analytics/BI             | ✅ (Data Mart) | ❌              | ✅ (Todos)         |
| 10 | AI Assist                | ❌ (Stateless) | ❌              | ✅ (Eventos clave) |
| 11 | Offline Sync             | ✅             | ✅              | ❌                 |

### Eventos de Dominio (Principales)

#### Quotation

- `QuoteRequested`, `QuoteApproved`, `QuoteRejected`, `QuoteExpired`, `QuoteRegenerated`

#### Proforma

- `ProformaCreated`, `DeliveryRecorded`, `ProformaClosed`

#### Billing & Tax

- `InvoiceIssued`, `NCFAllocated`, `TaxValidationFailed`, `InvoiceVoided`

#### Accounts Receivable

- `PaymentApplied`, `StatementGenerated`, `InvoiceOverdue`

#### Documents

- `DocumentRendered`, `DocumentStorageFailed`

#### Notifications

- `InvoiceSent`, `NotificationFailed`

#### Offline Sync

- `OfflineBatchReceived`, `OfflineBatchApplied`, `ConflictDetected`

---

## 🔒 Reglas Clave de Negocio

### 1. Facturación Fiscal (Billing & Tax)

- ✅ **NCF único y secuencial** (sin duplicados ni saltos)
- ✅ **ITBIS 18%** con redondeo consistente
- ✅ **Proceso en 2 pasos:** PreviewInvoice → IssueInvoice
- ✅ **Auditoría append-only** de todos los intentos
- ✅ **NCF solo se asigna en servidor** (nunca en cliente)

### 2. Cotizaciones (Quotation)

- ✅ **Vigencia 15-30 días**
- ✅ **Regeneración automática** con tarifas vigentes si expira
- ✅ **Aprobación obligatoria** antes de convertir a proforma

### 3. Proformas (Proforma/Delivery)

- ✅ **No se puede facturar sin proforma cerrada**
- ✅ **Registro de parcialidades** antes de cierre
- ✅ **Conciliación con cotización** original

### 4. Cuentas por Cobrar (AR)

- ✅ **Detección automática de vencimientos**
- ✅ **Análisis de antigüedad** (0-30/31-60/61-90/90+)
- ✅ **Recordatorios automáticos** vía WhatsApp/Email

### 5. Offline Sync

- ✅ **Idempotencia garantizada** con UUID
- ✅ **Detección y resolución de conflictos**
- ✅ **Sincronización batch** al recuperar internet

---

## 🎯 Próximos Pasos

1. ✅ **Validar diagramas** con stakeholders
2. ⬜ **Definir APIs detalladas** (OpenAPI/Swagger)
3. ⬜ **Modelar esquemas de eventos** (AsyncAPI)
4. ⬜ **Diseñar modelos de datos** por microservicio
5. ⬜ **Planificar roadmap de implementación** (MVP → completo)
6. ⬜ **Configurar infraestructura** (IaC con Terraform/Pulumi)

---

**Documento generado:** 2026-01-13
**Herramienta:** GitHub Copilot + Mermaid
**Estado:** ✅ Completo y listo para implementación
