# Arquitectura propuesta — Sistema de facturación cloud (ALITO GROUP SRL)

**Documento de arquitectura (nivel masivo / completo)**

- **Proyecto:** Sistema de facturación cloud con automatización (NCF/ITBIS), BI e IA.
- **Organización:** ALITO GROUP SRL (Bávaro – Punta Cana).
- **Contexto normativo:** República Dominicana (DGII / NCF / ITBIS).
- **Fecha de referencia:** 2026-01-11.

---

## 0) Cómo leer este documento

Este documento está diseñado para servir como “arquitectura total” del proyecto. Incluye:

1. Alcance funcional y no funcional (derivado de la documentación del anteproyecto).
2. Arquitectura objetivo por microservicios (sistema completo).
3. Diseño interno por microservicio usando **Arquitectura Hexagonal** (Ports & Adapters) y principios de **Clean Architecture**.
4. Comunicación, consistencia, datos, auditoría, seguridad y observabilidad.
5. Factibilidad real (coste/tiempo/complejidad) y riesgos.
6. Propuesta alternativa recomendada si se prioriza rapidez y menor riesgo: **Monolito modular con hexagonal, evolutivo a microservicios**.
7. Plan de migración y roadmap de implementación.

> Nota: la arquitectura está alineada con los problemas descritos: procesos manuales, dispersión de datos, errores de NCF/ITBIS, falta de trazabilidad, riesgos de auditoría DGII, ausencia de analítica y operación con conectividad inestable.

---

## 1) Fuentes y base de requerimientos

**Documentos usados como base (workspace):**

- Anteproyecto general y alcance: `anteproyecto/archivo final/anteproyecto_final_limpio.md`
- Problemas operativos y requerimientos implícitos: `anteproyecto/archivo final/planteamiento_problema.md`
- Variables/indicadores medibles (metas): `anteproyecto/archivo final/anexo3_variables_indicadores.md`
- Propuesta técnica ya redactada (microservicios + hexagonal + offline): `tesis/info/informe03.md`

---

## 2) Alcance del sistema (visión “sistema completo”)

### 2.1 Flujo end-to-end (mínimo imprescindible)

1. **Cliente / personal** solicita cotización (web o WhatsApp).
2. **Cotización** se genera, revisa y aprueba.
3. Se ejecuta el servicio (alquiler/entrega/horas/trabajo) y se gestiona una **proforma** como control del “cumplimiento” (parcialidades y avance).
4. Con proforma cerrada y pago validado, se emite **factura** con **NCF** y **ITBIS** correctamente.
5. Se registra en **cuentas por cobrar**, se generan estados de cuenta y alertas de vencimiento.
6. Se alimenta una capa de **analítica/BI** para KPI (errores, tiempos, DSO, antigüedad, etc.).

### 2.1.1 Diagrama de flujo (swimlanes)

```mermaid
flowchart TB
  A1[Cliente solicita cotización]
  A2[Cliente recibe cotización y confirma]
  A3[Cliente recibe factura y enlace PDF]
  A4[Cliente realiza pago]

  O1[Operación aprueba cotización]
  O2[Operación registra avances de proforma]
  O3[Operación cierra proforma]
  O4[Operación registra pago]

  S1[Servicio de cotizaciones]
  S2[Servicio de proformas]
  S3[Servicio de facturación e impuestos]
  S4[Servicio de cuentas por cobrar]
  S5[Servicio de documentos]
  S6[Servicio de notificaciones]
  S7[Servicio de analítica BI]

  A1 --> S1 --> O1
  O1 -->|Aprobada| S1 --> A2
  A2 --> O2 --> S2
  O2 -->|Parcialidades| S2
  O3 -->|Cierre| S2 --> S3
  O4 --> S3
  S3 --> S5 --> S6 --> A3
  S3 --> S4
  A4 --> O4
  S1 --> S7
  S3 --> S7
  S4 --> S7
```

### 2.1.2 Diagrama de secuencia (happy-path)

```mermaid
sequenceDiagram
  autonumber
  participant Cliente
  participant GW as API Gateway/BFF
  participant MD as Datos maestros
  participant Q as Cotizaciones
  participant P as Proformas
  participant B as Facturación e impuestos
  participant AR as Cuentas por cobrar
  participant DOC as Documentos
  participant N as Notificaciones

  Cliente->>GW: Solicitar cotización
  GW->>MD: Obtener cliente/tarifas vigentes
  MD-->>GW: Datos maestro
  GW->>Q: RequestQuote
  Q-->>GW: Borrador de cotización (QuoteDraft)
  GW-->>Cliente: Cotización en revisión

  Note over GW,Q: Operación interna aprueba
  GW->>Q: ApproveQuote
  Q-->>GW: Cotización aprobada (QuoteApproved)
  GW->>N: Notificar cotización aprobada
  N-->>Cliente: Mensaje/Correo (aprobada)

  Note over GW,P: Ejecución del servicio
  GW->>P: CreateProformaFromQuote
  loop Parcialidades
    GW->>P: RecordDelivery
    P-->>GW: Avance registrado (DeliveryRecorded)
  end
  GW->>P: CloseProforma
  P-->>GW: Proforma cerrada (ProformaClosed)

  Note over GW,B: Validación fiscal y emisión
  GW->>B: PreviewInvoice (validaciones)
  B-->>GW: Previsualización + warnings
  GW->>B: IssueInvoice
  B-->>GW: InvoiceIssued + NCFAllocated

  GW->>DOC: RenderDocument(invoice)
  DOC-->>GW: Link (Drive/S3)
  GW->>N: Enviar factura + enlace
  N-->>Cliente: Factura enviada

  B-->>AR: InvoiceIssued (evento)
  AR-->>AR: Registrar CxC
```

### 2.2 Módulos funcionales (capabilities)

- **Gestión de clientes** (RNC/Cédula, contactos, unicidad, historial).
- **Catálogo de servicios / tarifas** (versionado de precios, vigencias, reglas por tipo de servicio).
- **Cotizaciones** (vigencia, regeneración, canal WhatsApp/web, PDF/enlace).
- **Proformas** (parcialidades, avance diario, cierre, conciliación con cotización).
- **Facturación** (emisión final, impuestos, NCF, notas de crédito/débito si aplica, control de secuencia).
- **Cuentas por cobrar** (saldos, vencimientos, recordatorios, estados de cuenta, antigüedad).
- **Usuarios, roles y permisos** (RBAC).
- **Auditoría / trazabilidad** (quién hizo qué, cuándo, desde dónde; inmutabilidad lógica).
- **Documentos** (plantillas, generación PDF, almacenamiento externo y enlaces).
- **Automatizaciones** (notificaciones por WhatsApp/correo vía n8n u otro mecanismo).
- **IA aplicada (nivel MVP/realista)**:
  - Validación y detección de inconsistencias (NCF/ITBIS, duplicados, valores atípicos).
  - Extracción de datos desde mensajes/órdenes (WhatsApp) si se decide.
  - Asistencia para limpieza de datos maestros (nombres de clientes, errores tipográficos).
- **Modo offline / conectividad inestable** (captura local, sincronización segura).

### 2.3 Requisitos no funcionales (NFR)

- **Cumplimiento fiscal:** control estricto de NCF, tipos, vigencias, secuencias; cálculo consistente de ITBIS.
- **Trazabilidad/auditabilidad:** reconstrucción de expedientes para auditoría (DGII o interna).
- **Seguridad:** autenticación, RBAC, cifrado en tránsito y reposo, segregación de funciones.
- **Disponibilidad:** tolerancia a fallas parciales; continuidad operativa.
- **Resiliencia offline:** captura sin internet y sincronización sin duplicados.
- **Escalabilidad:** crecer con volumen de transacciones.
- **Mantenibilidad y testabilidad:** dominio aislado de infraestructura (hexagonal).

---

## 3) Decisión estratégica: ¿Microservicios “puros” o alternativa?

### 3.1 Microservicios “puros” (objetivo)

Ventajas:
- Aislamiento de fallos y despliegue independiente.
- Escalado por componente.
- Alineación con bounded contexts.

Costos / riesgos:
- Complejidad operativa: CI/CD, observabilidad, redes, seguridad distribuida.
- Consistencia eventual y transacciones distribuidas.
- Más piezas para un equipo pequeño.

### 3.2 Alternativa recomendada (frecuentemente “mejor” para factibilidad)

**Monolito modular con arquitectura hexagonal + DDD**, preparado para extraer microservicios.

Por qué suele ser mejor al inicio:
- Menos costo operativo y menos fallos por “complejidad distribuida”.
- Mantiene el beneficio principal que buscas: **dominio aislado** (hexagonal) y módulos claros.
- Permite entregar valor (cotizar→proforma→facturar con NCF/ITBIS) rápido.
- Luego se “extraen” servicios con evidencia (cuellos de botella reales).

**Recomendación práctica:**
- **Arquitectura objetivo documentada como microservicios** (para la tesis y escalabilidad).
- **Implementación fase 1 como monolito modular** (para viabilidad) y transición planificada.

Este documento cubre ambos: la arquitectura microservicios completa y el camino factible.

---

## 4) Arquitectura objetivo (microservicios) — Vista de alto nivel

### 4.1 Bounded Contexts (DDD) sugeridos

- **Identity & Access**: usuarios, roles, permisos, políticas.
- **Master Data**: clientes, catálogo de servicios, tarifas.
- **Quotation**: cotizaciones (vigencia, aprobación, regeneración).
- **Proforma/Delivery**: ejecución, parcialidades, cierre.
- **Billing & Tax**: facturación, impuestos, NCF, notas, reglas fiscales.
- **Accounts Receivable (AR)**: saldos, pagos, estados de cuenta, antigüedad.
- **Documents**: plantillas y generación de PDFs, enlaces, almacenamiento.
- **Notifications/Automation**: envío y recordatorios (WhatsApp/correo).
- **Analytics/BI**: KPIs, reportes, modelos de datos analíticos.
- **AI Assist**: validaciones inteligentes, extracción y limpieza de datos.
- **Sync/Offline**: ingestión de eventos offline y conciliación.

> Nota: en un MVP real, algunos bounded contexts se pueden unir inicialmente.

### 4.2 Componentes principales

- **API Gateway / BFF** (para web y para integraciones): enruta, autentica, aplica políticas.
- **Event Bus** (asíncrono): integra eventos de dominio y reduce acoplamiento.
- **Bases de datos por servicio** (ownership): cada microservicio es dueño de sus datos.
- **Observabilidad**: logs, métricas, trazas.

### 4.3 Diagrama (conceptual)

```mermaid
graph TB
    %% Nota: Nodos "*_SVC" son los anclas.
    
    EventBus[("🔁 EVENT BUS<br/>(RabbitMQ/Kafka)")]

    subgraph Identity["🔐 IDENTITY & ACCESS"]
        direction TB
        ID_SVC["🔐 Identity Service"]
        I_RESP["✅ Resp: Autenticación, RBAC"]
        I_DATA["📦 Data: User, Role, Session"]
    end

    subgraph MasterData["📊 MASTER DATA"]
        direction TB
        MD_SVC["📊 Master Data Service"]
        MD_RESP["✅ Resp: Clientes, Catálogo, Tarifas"]
        MD_RULE["⚠️ Regla: Bloqueo de Cotización<br/>si Stock=0"]
    end

    subgraph Quotation["📋 QUOTATION"]
        direction TB
        Q_SVC["📋 Quotation Service"]
        Q_RESP["✅ Resp: Cotizar, Vigencia"]
        Q_RULE["⚠️ Reglas:<br/>• Auto-Invalidar (30 días)<br/>• Bloqueo por Stock (vs MD)"]
        Q_EVENTS["📤 Evt: QuoteApproved, QuoteExpired"]
    end

    subgraph Proforma["📦 PROFORMA/DELIVERY"]
        direction TB
        P_SVC["📦 Proforma Service"]
        P_RESP["✅ Resp: Ejecución, Entregas"]
        P_RULE["⚠️ Reglas:<br/>• Si Ejecutado > Cotizado → Sync Obligatoria<br/>• Cliente Nuevo → Exigir Anticipo<br/>• Vincular Placa/Ficha por viaje"]
    end

    subgraph Billing["💰 BILLING & TAX"]
        direction TB
        B_SVC["💰 Billing Service"]
        B_RESP["✅ Resp: Factura, NCF, ITBIS"]
        B_RULE["⚠️ Reglas (HARD GATE):<br/>• Solo emitir si Pagos == Total Proforma<br/>• Validación 3 pasos<br/>• NCF Secuencial"]
    end

    subgraph AR["💳 ACCOUNTS RECEIVABLE"]
        direction TB
        AR_SVC["💳 AR Service"]
        AR_RESP["✅ Resp: Pagos, Saldos, Mora"]
        AR_RULE["⚠️ Regla: Bloqueo despachos<br/>si hay mora"]
    end

    subgraph Documents["📄 DOCUMENTS"]
        direction TB
        D_SVC["📄 Documents Service"]
        D_RULE["⚠️ Regla: Purga PDF (15-20 días)<br/>Conservar Meta-data en DB"]
    end

    subgraph Notifications["🔔 NOTIFICATIONS"]
        direction TB
        N_SVC["🔔 Notification Service"]
        N_RESP["✅ Resp: WhatsApp, Email"]
    end
    
    subgraph AI["🤖 AI ASSIST"]
        direction TB
        AI_SVC["🤖 AI Service"]
        AI_RULE["⚠️ Regla: Mapeo ID WhatsApp<br/>a Cliente ERP"]
    end
    
    subgraph Analytics["📈 BI"]
        A_SVC["� Analytics Service"]
    end

    subgraph Offline["🔄 OFFLINE SYNC"]
        OS_SVC["🔄 Offline Service"]
    end

    %% Flow/Logic connections
    MD_SVC -.->|"Verifica Stock"| Q_SVC
    Q_SVC -.->|"Genera"| P_SVC
    P_SVC -.->|"Sync si excede"| Q_SVC
    P_SVC -.->|"Valida Anticipo"| AR_SVC
    
    AR_SVC -.->|"Saldo Confirmado"| B_SVC
    B_SVC -.->|"Auditoría"| D_SVC
    
    %% Event Bus Connections
    ID_SVC & MD_SVC & Q_SVC & P_SVC & B_SVC & AR_SVC & D_SVC & N_SVC & OS_SVC <--> EventBus
    
    %% Styles
    classDef core fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef rule fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,stroke-dasharray: 5 5
    
    class ID_SVC,MD_SVC,Q_SVC,P_SVC,B_SVC,AR_SVC,D_SVC,N_SVC,AI_SVC,A_SVC,OS_SVC core
    class MD_RULE,Q_RULE,P_RULE,B_RULE,AR_RULE,D_RULE,AI_RULE rule
```

### 4.4 Vista C4 (Container View) — Qué corre y dónde vive

> Objetivo: que el lector identifique “contenedores ejecutables” (apps/servicios) y sus responsabilidades.

```mermaid
graph TB
    subgraph Externos["👥 ACTORES EXTERNOS"]
        ClienteExt["👤 Cliente Externo"]
        OperadorInt["👔 Operador Interno"]
    end

    subgraph Canales["📱 CANALES DE ENTRADA"]
        WebApp["🌐 Web App<br/>(SPA / React)"]
        WhatsAppBot["💬 WhatsApp Bot<br/>(Webhook)"]
    end

    subgraph FronteraSistema["🛡️ FRONTERA SISTEMA INTERNO"]
        APIGateway["🚪 API Gateway / BFF<br/>(Primary Adapter)"]
    
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
    
        EventBus["🔁 Event Bus<br/>(RabbitMQ/Kafka)"]
        AuditLog["📚 Audit Log<br/>(Append-Only)"]
        Observabilidad["👁️ Observabilidad<br/>(Logs/Metrics/Traces)"]
    end

    subgraph ServiciosExternos["🌍 SERVICIOS EXTERNOS"]
        DriveS3["☁️ Drive/S3<br/>(Object Storage)"]
        WhatsAppEmail["📧 WhatsApp/Email<br/>(Provider)"]
        N8N["⚡ n8n<br/>(Automation)"]
    end

    %% Conexiones Actores → Canales
    ClienteExt -->|"Solicitudes"| WebApp
    ClienteExt -->|"Mensajes"| WhatsAppBot
    OperadorInt -->|"Gestión"| WebApp

    %% Conexiones Canales → Sistema
    WebApp -->|"REST API"| APIGateway
    WhatsAppBot -->|"Webhook"| APIGateway

    %% Conexiones API Gateway → Microservicios
    APIGateway -->|"REST"| MS1
    APIGateway -->|"REST"| MS2
    APIGateway -->|"REST"| MS3
    APIGateway -->|"REST"| MS4
    APIGateway -->|"REST"| MS5
    APIGateway -->|"REST"| MS6
    APIGateway -->|"REST"| MS7
    APIGateway -->|"REST"| MS8
    APIGateway -->|"REST"| MS9
    APIGateway -->|"REST"| MS10
    APIGateway -->|"REST"| MS11

    %% Conexiones Event Bus
    MS1 -.->|"Events"| EventBus
    MS2 -.->|"Events"| EventBus
    MS3 -.->|"Events"| EventBus
    MS4 -.->|"Events"| EventBus
    MS5 -.->|"Events"| EventBus
    MS6 -.->|"Events"| EventBus
    MS7 -.->|"Events"| EventBus
    MS8 -.->|"Events"| EventBus
    MS11 -.->|"Events"| EventBus

    %% Conexiones Audit Log
    MS1 -.->|"Audit"| AuditLog
    MS5 -.->|"Audit"| AuditLog
    MS6 -.->|"Audit"| AuditLog

    %% Conexiones Observabilidad
    APIGateway -.-> Observabilidad
    EventBus -.-> Observabilidad

    %% Conexiones Externas
    MS7 -->|"Store PDF"| DriveS3
    MS8 -->|"Send"| WhatsAppEmail
    MS8 -->|"Automate"| N8N

    %% Event Consumers
    EventBus -.->|"Subscribe"| MS8
    EventBus -.->|"Subscribe"| MS9
    EventBus -.->|"Subscribe"| MS10

    %% Estilos
    classDef externosStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    classDef canalesStyle fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    classDef fronteraStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:4px,color:#000
    classDef coreStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef externosServStyle fill:#ffebee,stroke:#c62828,stroke-width:3px,color:#000
    classDef infraStyle fill:#eceff1,stroke:#455a64,stroke-width:2px,color:#000

    %% Nota Mermaid: el estilo en `subgraph` puede no aplicar; estilos por nodo para render consistente.
    class ClienteExt,OperadorInt externosStyle
    class WebApp,WhatsAppBot canalesStyle
    class APIGateway fronteraStyle
    class MS1,MS2,MS3,MS4,MS5,MS6,MS7,MS8,MS9,MS10,MS11 coreStyle
    class EventBus,AuditLog,Observabilidad infraStyle
    class DriveS3,WhatsAppEmail,N8N externosServStyle
```

### 4.5 Vista de despliegue (alta abstracción)

> Esta vista no amarra a un proveedor cloud específico; describe una topología típica cloud-native.

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

## 5) Microservicios propuestos (sistema completo)

A continuación se describe cada microservicio con:
- **Responsabilidad**
- **Datos (ownership)**
- **APIs/eventos clave**
- **Diseño hexagonal (puertos/adaptadores)**
- **Notas de consistencia y seguridad**

> Convención: cada servicio se implementa con capas: **Domain** (entidades/agregados/reglas), **Application** (casos de uso), **Adapters** (in/out), **Infrastructure**.

### 5.0 Patrón por servicio: Arquitectura Hexagonal (plantilla visual)

> Este diagrama se aplica a cada microservicio; cambia el nombre de puertos/adaptadores según el caso.

```mermaid
flowchart LR
  %% Estilos Hexagonal
  classDef adapterIn fill:#dcedc8,stroke:#33691e,stroke-width:2px
  classDef app fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
  classDef domain fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
  classDef adapterOut fill:#ffccbc,stroke:#bf360c,stroke-width:2px

  subgraph IN[Adaptadores de entrada]
    HTTP[REST/GraphQL]:::adapterIn
    WH[Webhook WhatsApp]:::adapterIn
    JOB[Cron/Jobs]:::adapterIn
    UI[Panel interno]:::adapterIn
  end

  subgraph APP[Aplicación]
    UC["Casos de uso<br/>(Application Services)"]:::app
  end

  subgraph DOMAIN[Dominio]
    ENT[Entidades/Agregados]:::domain
    RULES[Reglas de negocio]:::domain
    POL[Políticas/Servicios de dominio]:::domain
  end

  subgraph OUT[Adaptadores de salida]
    DB[Repositorio/DB]:::adapterOut
    BUS[(Event Bus)]:::adapterOut
    EXT["Servicios externos<br/>(Storage/Email/IA)"]:::adapterOut
  end

  HTTP --> UC
  WH --> UC
  JOB --> UC
  UI --> UC
  UC --> ENT
  UC --> RULES
  UC --> POL
  UC --> DB
  UC --> BUS
  UC --> EXT
```

---

### 5.1 Identity Service (Usuarios y RBAC)

**Responsabilidad**
- Autenticación y autorización (RBAC).
- Emisión/validación de tokens.
- Gestión de usuarios, roles y permisos.

**Datos**
- Users, Roles, RoleBindings, Password/Identity providers.

**Puertos (Hexagonal)**
- **Inbound ports:** `Authenticate`, `Authorize`, `ManageUsers`.
- **Outbound ports:** `UserRepository`, `AuditLogPort`, `IdentityProviderPort`.

**Adaptadores**
- Inbound: HTTP REST (login, refresh, user admin).
- Outbound: DB, integración con proveedor (opcional), auditoría.

**Notas**
- Separación de funciones (ej.: rol facturador vs. administrador NCF).

---

### 5.2 Master Data Service (Clientes + Catálogo + Tarifas)

**Responsabilidad**
- Catálogo único de clientes (evitar duplicados) y datos fiscales (RNC/Cédula).
- Catálogo de servicios/equipos y tarifas con vigencias.

**Datos**
- Customer, CustomerContact, CustomerTaxProfile
- ServiceItem, PriceList, PriceRule (vigencia)

**Puertos**
- Inbound: `CreateCustomer`, `UpdateCustomer`, `SearchCustomer`, `UpsertPriceList`.
- Outbound: `MasterDataRepository`, `DuplicateDetectionPort` (IA opcional).

**Eventos**
- `CustomerCreated`, `CustomerUpdated`
- `PriceListUpdated`

**Reglas clave**
- Unicidad por RNC/Cédula.
- Versionado de tarifas por fecha.

---

### 5.3 Servicio de cotizaciones (Cotizaciones)

**Responsabilidad**
- Crear, revisar, aprobar y controlar vigencia de cotizaciones.
- Regeneración de cotización con tarifas vigentes.
- Exposición para canal Web/WhatsApp.

**Datos**
- Quote (aggregate), QuoteLine, QuoteStatus, ValidityWindow

**Puertos**
- Inbound: `RequestQuote`, `ApproveQuote`, `RejectQuote`, `ExpireQuotes`, `RegenerateQuote`.
- Outbound: `QuoteRepository`, `PricingPort` (consulta al Master Data), `DocumentPort` (crear PDF), `NotificationPort`.

**Eventos**
- `QuoteRequested`, `QuoteApproved`, `QuoteExpired`, `QuoteRegenerated`

**Hexagonal (detalle)**
- Dominio: reglas de vigencia (15–30 días), totales, impuestos estimados (si aplica).
- Aplicación: casos de uso para aprobación y transición de estados.
- Adaptadores: HTTP (panel interno), webhook WhatsApp (ingreso), job scheduler (expirar).

**Diagrama de estados (cotización)**

```mermaid
stateDiagram
  [*] --> Draft: RequestQuote
  Draft --> InReview: Enviar a revisión
  InReview --> Approved: ApproveQuote
  InReview --> Rejected: RejectQuote
  Approved --> Expired: ExpireQuote (timer)
  Approved --> Regenerated: RegenerateQuote
  Expired --> Regenerated: RegenerateQuote
  Rejected --> Regenerated: RegenerateQuote
  Regenerated --> InReview
```

---

### 5.4 Servicio de proformas (Ejecución y control de entrega)

**Responsabilidad**
- Convertir una cotización aprobada en una proforma “ejecutable”.
- Registrar parcialidades (horas, metros, viajes, entregas) y cerrar proforma.

**Datos**
- Proforma (aggregate), DeliveryRecord, CompletionState

**Puertos**
- Inbound: `CreateProformaFromQuote`, `RecordDelivery`, `CloseProforma`.
- Outbound: `ProformaRepository`, `QuotationPort` (leer quote aprobado), `NotificationPort`.

**Eventos**
- `ProformaCreated`, `DeliveryRecorded`, `ProformaClosed`

**Reglas clave**
- No se factura si la proforma no está cerrada.
- La proforma es la “fuente de verdad” de lo realmente entregado.

**Diagrama de estados (proforma)**

```mermaid
stateDiagram
  [*] --> Open: CreateProformaFromQuote
  Open --> Open: RecordDelivery
  Open --> Closed: CloseProforma
  Closed --> [*]
```

---

### 5.5 Servicio de facturación e impuestos (Facturación, NCF, ITBIS)

**Responsabilidad**
- Emitir facturas fiscales, controlar NCF, aplicar ITBIS.
- Validaciones de secuencia, tipo, vigencia.
- Proceso de “confirmación en pasos” antes de emitir documento fiscal.

**Datos**
- Invoice (aggregate), InvoiceLine, TaxBreakdown
- NCFSequence (aggregate), NCFAllocation, NCFType
- CreditNote / DebitNote (si se incluye)

**Puertos**
- Inbound: `IssueInvoice`, `PreviewInvoice`, `ValidateNCF`, `ManageNCFSequences`.
- Outbound: `BillingRepository`, `NCFRepository`, `ProformaPort`, `MasterDataPort`, `DocumentPort`, `AuditPort`.

**Eventos**
- `InvoiceIssued`, `NCFAllocated`, `InvoiceVoided` (si aplica), `TaxValidationFailed`

**Reglas clave (mínimo viable)**
- NCF no duplicado.
- NCF secuencial sin saltos no justificados.
- Tipo NCF correcto según perfil del cliente.
- ITBIS calculado consistentemente (redondeos estandarizados).

**Notas**
- Si se agrega e-CF / firma digital, esto crece bastante en complejidad y costo.

**Diagrama de secuencia (emisión fiscal con validaciones)**

```mermaid
sequenceDiagram
  autonumber
  participant UI as Operación interna
  participant GW as Gateway/BFF
  participant B as Billing & Tax
  participant NCF as NCFSequence
  participant DOC as Documents
  participant AUD as Auditoría

  UI->>GW: Solicitar previsualización
  GW->>B: PreviewInvoice
  B->>AUD: Registrar intento (preview)
  B-->>GW: Previsualización + warnings

  UI->>GW: Confirmar emisión
  GW->>B: IssueInvoice
  B->>NCF: AllocateNextNCF (solo servidor)
  NCF-->>B: NCF asignado
  B->>AUD: Registrar emisión (append-only)
  B-->>GW: InvoiceIssued

  GW->>DOC: RenderDocument(invoice)
  DOC-->>GW: Link
  GW-->>UI: Factura emitida + enlace
```

**Diagrama de estados (factura)**

```mermaid
stateDiagram
  [*] --> Draft: PreviewInvoice
  Draft --> Issued: IssueInvoice + NCFAllocated
  Issued --> [*]
```

---

### 5.6 Accounts Receivable Service (Cuentas por cobrar)

**Responsabilidad**
- Registrar cuentas por cobrar desde facturas.
- Pagos, saldo, vencimientos, estados de cuenta.
- Análisis de antigüedad (0–30/31–60/61–90/90+).

**Datos**
- Account, ARInvoiceRef, Payment, AgingSnapshot

**Puertos**
- Inbound: `RegisterInvoiceAR`, `ApplyPayment`, `GenerateStatement`, `ComputeAging`.
- Outbound: `ARRepository`, `BillingPort`, `NotificationPort`.

**Eventos**
- Consume: `InvoiceIssued`
- Produce: `PaymentApplied`, `StatementGenerated`, `InvoiceOverdue`

---

### 5.7 Servicio de documentos (Generación/almacenamiento de PDFs)

**Responsabilidad**
- Render de documentos (cotización/proforma/factura/estado de cuenta) a PDF.
- Almacenamiento externo y entrega por enlaces.

**Datos**
- DocumentTemplate, DocumentRenderJob, DocumentLink

**Puertos**
- Inbound: `RenderDocument`, `GetDocumentLink`.
- Outbound: `TemplateRepository`, `FileStoragePort` (Drive/S3), `PDFRendererPort`.

**Notas**
- Mantener DB “liviana”: se guardan datos estructurados + enlace, no PDFs en DB.

---

### 5.8 Notifications/Automation Service (n8n u orquestación)

**Responsabilidad**
- Enviar notificaciones por cambios de estado: cotización aprobada, proforma actualizada, factura emitida, vencimientos.

**Enfoque**
- Puede ser un microservicio propio o una integración con n8n self-host.

**Puertos**
- Inbound: consumer de eventos (`QuoteApproved`, `InvoiceIssued`, `InvoiceOverdue`).
- Outbound: `WhatsAppProviderPort`, `EmailProviderPort`.

---

### 5.9 Analytics/BI Service

**Responsabilidad**
- Modelado analítico, KPIs y dashboards.

**Estrategia de datos**
- Ingesta por eventos (CDC o event bus) hacia un modelo analítico.
- Evitar queries “pesadas” contra DB transaccionales.

**KPIs base** (alineados al anexo de indicadores)
- % validaciones NCF/ITBIS automatizadas
- Errores NCF antes/después
- Tiempo de emisión por documento
- DSO y antigüedad
- % expedientes auditables

---

### 5.10 AI Assist Service (IA aplicada)

**Responsabilidad**
- Validaciones inteligentes, detección de anomalías, extracción de datos.

**Principio clave**
- La IA no debe “decidir” sola en lo fiscal: debe **asistir** y dejar rastro.

**Casos de uso realistas**
- Detectar duplicados de clientes (fuzzy matching).
- Alertar valores atípicos (tarifa fuera de rango).
- Extraer datos desde mensajes/adjuntos (si se implementa WhatsApp ingestion).

**Puertos**
- Inbound: `ValidateData`, `SuggestCorrections`.
- Outbound: `ModelProviderPort`, `FeatureStorePort` (opcional).

---

### 5.11 Offline Sync Service (captura y conciliación)

**Responsabilidad**
- Recibir lotes de transacciones capturadas offline.
- Reconciliar secuencias y evitar duplicados.

**Modelo recomendado**
- El cliente genera **IDs deterministas** (UUIDs) y el servidor resuelve numeraciones humanas (ej.: secuencias internas/folio) al sincronizar.
- Para NCF: **solo el servidor asigna**.

**Flujo de sincronización offline (sin colisiones)**

```mermaid
sequenceDiagram
  autonumber
  participant App as App (offline)
  participant Local as Storage local
  participant Sync as Offline Sync Service
  participant Bus as Event Bus
  participant Core as Servicios core

  Note over App,Local: Sin internet
  App->>Local: Guardar transacciones (UUID)
  App->>Local: Cola de pendientes

  Note over App,Sync: Regresa internet
  App->>Sync: Enviar batch (UUID + payload)
  Sync->>Sync: Validar idempotencia (UUID)
  Sync->>Bus: Publicar eventos del batch
  Bus->>Core: Entregar eventos (QuoteRequested/DeliveryRecorded/etc.)
  Core-->>Bus: Eventos resultantes (QuoteApproved/InvoiceIssued)
  Bus-->>Sync: Ack lógico (opcional)
  Sync-->>App: Resultado (aplicado / conflicto)
```

**Eventos**
- `OfflineBatchReceived`, `OfflineBatchApplied`, `ConflictDetected`

---

## 6) Comunicación entre microservicios

### 6.1 Sincrónico vs asíncrono

- **Sincrónico (REST/gRPC)**: consultas necesarias de UX (ej. buscar clientes, previsualizar factura).
- **Asíncrono (event bus)**: propagación de cambios (ej. `InvoiceIssued` → AR + BI + Notificaciones).

### 6.2 Contratos y versionado

- Contratos API documentados (OpenAPI) y versionados.
- Eventos versionados (schema registry o convención interna).

### 6.3 Consistencia

- Preferir consistencia eventual entre bounded contexts.
- Transacciones locales dentro de cada servicio (ACID).
- Para flujos multi-servicio usar **Sagas** (coreografía por eventos) o un orquestador.

Ejemplo de saga:
1) Proforma cerrada → solicita emisión
2) Billing emite factura + NCF
3) AR registra cuenta por cobrar
4) Notifications envía factura

### 6.4 Saga (coreografía por eventos) — Diagrama

```mermaid
flowchart LR
  %% Estilos
  classDef event fill:#fff3e0,stroke:#e65100,stroke-dasharray:5,5,stroke-width:2px
  classDef service fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
  classDef bus fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000

  P[ProformaClosed]:::event --> BUS[(Event Bus)]:::bus
  BUS --> B[Billing & Tax]:::service
  B -->|emite| E1[InvoiceIssued]:::event
  B -->|falla| E2[TaxValidationFailed]:::event

  E1 --> BUS
  E2 --> BUS

  BUS --> AR[Accounts Receivable]:::service
  BUS --> N[Notifications]:::service
  BUS --> BI[Analytics/BI]:::service

  AR -->|registra| AR1[ARRegistered]:::event
  AR1 --> BUS
  N -->|envía| N1[InvoiceSent]:::event
  N1 --> BUS
```

---

## 7) Gestión de datos

### 7.1 “Database per service” (ownership)

Regla: un servicio no escribe en la DB de otro servicio.

### 7.2 Integridad fiscal y auditoría

- Facturas y eventos clave con **inmutabilidad lógica** (no borrar; corregir con notas/anulación según regla).
- Registro de auditoría: usuario, timestamp, acción, entidad, antes/después.

### 7.3 Retención

- Definir políticas de retención y respaldos (especialmente para auditorías DGII).

---

## 8) Seguridad

### 8.1 Autenticación/Autorización

- JWT/OAuth2 (según stack).
- RBAC con permisos por capability (ej.: administrar NCF es distinto a emitir factura).

### 8.2 Segregación de funciones

- Evitar que el mismo rol configure secuencias NCF y emita facturas sin controles.

### 8.3 Auditoría y cumplimiento

- Logs inmutables (WORM si se puede en cloud) o al menos append-only.

---

## 9) Observabilidad

- Logs estructurados con correlación (trace-id).
- Métricas: latencia APIs, errores, colas, tiempo de emisión, tasa de validaciones.
- Trazas distribuidas: esencial si hay microservicios.

---

## 10) Factibilidad (qué tan viable es realmente)

### 10.1 Conclusión honesta

**Sí es factible**, pero la factibilidad depende de la “forma”:

- Microservicios completos desde el día 1: **viable pero costoso** en operación y coordinación.
- Monolito modular hexagonal (fase 1) + extracción gradual: **más viable** para un equipo pequeño y un contexto académico-empresarial.

### 10.2 Riesgos principales

- Complejidad distribuida (observabilidad, seguridad, despliegues).
- Consistencia eventual (errores por mal diseño de eventos).
- Gestión NCF (debe ser estricta, centralizada y auditable).
- Offline sync (conflictos de numeración si se diseña mal).

### 10.3 Mitigaciones

- Mantener NCF y emisión fiscal en un servicio central (Billing).
- Diseñar eventos con idempotencia.
- Empezar con monolito modular y extraer.

---

## 11) Propuesta alternativa (recomendada): Monolito modular hexagonal evolutivo

### 11.1 Qué es

Una sola aplicación desplegable con módulos internos:
- `identity`
- `masterdata`
- `quotation`
- `proforma`
- `billing_tax`
- `accounts_receivable`
- `documents`
- `analytics`

Cada módulo:
- Tiene dominio propio.
- Se comunica por interfaces internas (puertos) y eventos internos.
- Puede tener “schema” separado en la misma DB (o DB separadas en el mismo cluster) para simular ownership.

### 11.2 Por qué encaja con esta tesis

- Mantiene el foco académico: DDD + Hexagonal + Clean Architecture.
- Permite mostrar una “arquitectura moderna” sin caer en sobrecosto operativo.
- Facilita pruebas e incrementa probabilidad de éxito del MVP.

### 11.3 Cómo se migra a microservicios

1. Convertir eventos internos a eventos en bus.
2. Extraer primero “Documents” y “Notifications” (alto desacoplamiento).
3. Luego “Analytics/BI”.
4. Después “Quotation/Proforma” si el volumen lo requiere.
5. Mantener “Billing & Tax” central por control fiscal.

---

## 12) Roadmap sugerido (entregas)

### Fase 0 — Descubrimiento (corto)
- Reglas NCF/ITBIS, tipos de NCF, flujos y roles.
- Catálogo inicial y migración mínima.

### Fase 1 — MVP transaccional
- Clientes + catálogo + cotización + proforma + facturación (NCF/ITBIS).
- Auditoría básica.
- Documentos PDF.

### Fase 2 — Cuentas por cobrar y BI
- AR (pagos, vencimientos, estados de cuenta).
- KPI mínimos + dashboard.

### Fase 3 — IA asistiva
- Detección de duplicados, validaciones inteligentes.

### Fase 4 — Offline robusto
- Sync service (si no se implementó antes).

---

## 13) Apéndices

### A) Principios de diseño (checklist)

- Dominio no depende de infraestructura.
- Repositorios como puertos.
- Adaptadores intercambiables.
- Eventos idempotentes.
- Control fiscal centralizado.

### B) Glosario

- **NCF:** Número de Comprobante Fiscal.
- **ITBIS:** Impuesto a las Transferencias de Bienes Industrializados y Servicios.
- **Hexagonal:** Puertos y adaptadores.
- **DDD:** Domain-Driven Design.
- **Saga:** patrón para coordinar transacciones distribuidas.

---

## 14) Próximo paso

Si quieres, en el siguiente paso convierto esta arquitectura en:
- Lista de endpoints (OpenAPI) por servicio.
- Lista de eventos (schemas) por bounded context.
- Modelo de datos conceptual (entidades/agregados) por microservicio.
