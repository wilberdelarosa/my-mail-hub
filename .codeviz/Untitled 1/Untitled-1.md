# Unnamed CodeViz Diagram

```mermaid
graph TD

    base.cv::billing_service["**Billing Service**<br>sistema_facturacion/services/billing-service"]
    base.cv::documents_service["**Documents Service**<br>sistema_facturacion/services/documents-service"]
    base.cv::master_data_service["**Master Data Service**<br>sistema_facturacion/services/master-data-service"]
    base.cv::offline_sync_service["**Offline Sync Service**<br>sistema_facturacion/services/offline-sync-service"]
    base.cv::quotation_service["**Quotation Service**<br>sistema_facturacion/services/quotation-service"]
    base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::end_user["**End User**<br>[External]"]
    subgraph base.cv::ar_service["**AR Service**<br>[External]"]
        base.cv::ar_service_api["**AR Service API**<br>sistema_facturacion/services/ar-service/package.json `name": "ar-service"`, sistema_facturacion/services/ar-service/src/main.ts `bootstrap()`"]
    end
    subgraph base.cv::notification_service["**Notification Service**<br>[External]"]
        base.cv::notification_service_api["**Notification Service API**<br>sistema_facturacion/services/notification-service `(inferred: service directory)`"]
    end
    subgraph base.cv::web_app["**Web Application**<br>[External]"]
        base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"]
    end
    subgraph base.cv::redis["**Redis**<br>[External]"]
        base.cv::redis_instance["**Redis Instance**<br>sistema_facturacion/docker-compose.yml `redis:`"]
    end
    subgraph base.cv::grafana["**Grafana**<br>[External]"]
        base.cv::grafana_instance["**Grafana Web UI**<br>sistema_facturacion/docker-compose.yml `grafana:`"]
    end
    subgraph base.cv::prometheus["**Prometheus**<br>[External]"]
        base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    end
    subgraph base.cv::jaeger["**Jaeger**<br>[External]"]
        base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    end
    subgraph base.cv::audit_service["**Audit Service**<br>[External]"]
        base.cv::audit_service_api["**Audit Service API**<br>sistema_facturacion/services/audit-service `(inferred: service directory)`"]
    end
    subgraph base.cv::identity_service["**Identity Service**<br>[External]"]
        base.cv::identity_service_api["**Identity Service API**<br>sistema_facturacion/services/identity-service/package.json `name": "identity-service"`, sistema_facturacion/services/identity-service/Dockerfile `FROM node:18-alpine`"]
    end
    %% Edges at this level (grouped by source)
    base.cv::end_user["**End User**<br>[External]"] -->|"Uses"| base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"]
    base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"] -->|"Calls API on"| base.cv::identity_service_api["**Identity Service API**<br>sistema_facturacion/services/identity-service/package.json `name": "identity-service"`, sistema_facturacion/services/identity-service/Dockerfile `FROM node:18-alpine`"]
    base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"] -->|"Calls API on"| base.cv::master_data_service["**Master Data Service**<br>sistema_facturacion/services/master-data-service"]
    base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"] -->|"Calls API on"| base.cv::quotation_service["**Quotation Service**<br>sistema_facturacion/services/quotation-service"]
    base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"] -->|"Calls API on"| base.cv::billing_service["**Billing Service**<br>sistema_facturacion/services/billing-service"]
    base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"] -->|"Collects metrics from"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::web_app_server["**Next.js Web Server**<br>sistema_facturacion/web-app/package.json `next:`, sistema_facturacion/web-app/src/app `root layout`"] -->|"Uses for direct API calls"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::identity_service_api["**Identity Service API**<br>sistema_facturacion/services/identity-service/package.json `name": "identity-service"`, sistema_facturacion/services/identity-service/Dockerfile `FROM node:18-alpine`"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::identity_service_api["**Identity Service API**<br>sistema_facturacion/services/identity-service/package.json `name": "identity-service"`, sistema_facturacion/services/identity-service/Dockerfile `FROM node:18-alpine`"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::identity_service_api["**Identity Service API**<br>sistema_facturacion/services/identity-service/package.json `name": "identity-service"`, sistema_facturacion/services/identity-service/Dockerfile `FROM node:18-alpine`"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::master_data_service["**Master Data Service**<br>sistema_facturacion/services/master-data-service"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::master_data_service["**Master Data Service**<br>sistema_facturacion/services/master-data-service"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::master_data_service["**Master Data Service**<br>sistema_facturacion/services/master-data-service"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::quotation_service["**Quotation Service**<br>sistema_facturacion/services/quotation-service"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::quotation_service["**Quotation Service**<br>sistema_facturacion/services/quotation-service"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::quotation_service["**Quotation Service**<br>sistema_facturacion/services/quotation-service"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::billing_service["**Billing Service**<br>sistema_facturacion/services/billing-service"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::billing_service["**Billing Service**<br>sistema_facturacion/services/billing-service"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::billing_service["**Billing Service**<br>sistema_facturacion/services/billing-service"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::documents_service["**Documents Service**<br>sistema_facturacion/services/documents-service"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::documents_service["**Documents Service**<br>sistema_facturacion/services/documents-service"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::documents_service["**Documents Service**<br>sistema_facturacion/services/documents-service"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::ar_service_api["**AR Service API**<br>sistema_facturacion/services/ar-service/package.json `name": "ar-service"`, sistema_facturacion/services/ar-service/src/main.ts `bootstrap()`"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::ar_service_api["**AR Service API**<br>sistema_facturacion/services/ar-service/package.json `name": "ar-service"`, sistema_facturacion/services/ar-service/src/main.ts `bootstrap()`"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::ar_service_api["**AR Service API**<br>sistema_facturacion/services/ar-service/package.json `name": "ar-service"`, sistema_facturacion/services/ar-service/src/main.ts `bootstrap()`"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::audit_service_api["**Audit Service API**<br>sistema_facturacion/services/audit-service `(inferred: service directory)`"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::audit_service_api["**Audit Service API**<br>sistema_facturacion/services/audit-service `(inferred: service directory)`"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::audit_service_api["**Audit Service API**<br>sistema_facturacion/services/audit-service `(inferred: service directory)`"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::notification_service_api["**Notification Service API**<br>sistema_facturacion/services/notification-service `(inferred: service directory)`"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::notification_service_api["**Notification Service API**<br>sistema_facturacion/services/notification-service `(inferred: service directory)`"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::notification_service_api["**Notification Service API**<br>sistema_facturacion/services/notification-service `(inferred: service directory)`"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::offline_sync_service["**Offline Sync Service**<br>sistema_facturacion/services/offline-sync-service"] -->|"Uses"| base.cv::supabase["**Supabase**<br>GUIA_SUPABASE.md `ACCESO A SUPABASE`, sistema_facturacion/supabase/migrations"]
    base.cv::offline_sync_service["**Offline Sync Service**<br>sistema_facturacion/services/offline-sync-service"] -->|"Sends metrics to"| base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"]
    base.cv::offline_sync_service["**Offline Sync Service**<br>sistema_facturacion/services/offline-sync-service"] -->|"Sends traces to"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]
    base.cv::prometheus_server["**Prometheus Server**<br>sistema_facturacion/docker-compose.yml `prometheus:`"] -->|"Provides data to"| base.cv::grafana_instance["**Grafana Web UI**<br>sistema_facturacion/docker-compose.yml `grafana:`"]
    base.cv::grafana_instance["**Grafana Web UI**<br>sistema_facturacion/docker-compose.yml `grafana:`"] -->|"Visualizes traces from"| base.cv::jaeger_all_in_one["**Jaeger All-in-One**<br>sistema_facturacion/docker-compose.yml `jaeger:`"]

```
---
*Generated by [CodeViz.ai](https://codeviz.ai) on 1/14/2026, 9:57:37 PM*
