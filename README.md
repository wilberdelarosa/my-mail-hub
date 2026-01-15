# 📚 ÍNDICE MAESTRO - Sistema de Facturación ALITO GROUP

**Última actualización:** 14 de Enero 2026

Este documento es tu punto de entrada a toda la documentación del sistema.

---

## 🎯 INICIO RÁPIDO

### UI (web-app) + microservicios

- UI principal: `npm run dev` (arranca `sistema_facturacion/web-app` en `http://localhost:3000`).
- Backend: `npm run start:all` (arranca microservicios).

Si por alguna razón necesitas la UI Vite de la raíz: `npm run dev:root`.

**¿Primera vez?** Lee estos documentos en orden:

1. **[RESUMEN_EJECUTIVO_FINAL.md](./docs/00_overview/RESUMEN_EJECUTIVO_FINAL.md)** ⭐
   - Visión general del proyecto
   - Estado actual y progreso
   - Componentes implementados
   
2. **[ESTADO_FINAL_FASE1.md](./docs/05_progress/ESTADO_FINAL_FASE1.md)**
   - Estado de infraestructura
   - Servicios corriendo
   - Credenciales de acceso

3. **[ENLACES_ACCESO.md](./docs/01_guides/ENLACES_ACCESO.md)**
   - URLs de todos los servicios
   - Acceso rápido a interfaces

---

## 📖 DOCUMENTACIÓN POR CATEGORÍA

### 🏗️ **ARQUITECTURA & DISEÑO**

| Documento | Descripción |
|-----------|-------------|
| [docs/PRODUCTION_ARCHITECTURE.md](./docs/PRODUCTION_ARCHITECTURE.md) | Diagrama ASCII de arquitectura cloud |
| [task.md](./.gemini/antigravity/brain/*/task.md) | Lista completa de tareas del proyecto |
| [implementation_plan.md](./.gemini/antigravity/brain/*/implementation_plan.md) | Plan de implementación detallado |
| [docs/endpoints_ingesta_cotizaciones.md](./docs/endpoints_ingesta_cotizaciones.md) | Diseño multi-canal de ingesta |

---

### 🚀 **DEPLOYMENT & OPERACIONES**

| Documento | Descripción |
|-----------|-------------|
| [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) | **Guía completa de deployment** ⭐ |
| [scripts/06_deploy/deploy.ps1](./scripts/06_deploy/deploy.ps1) | Script automatizado de deployment |
| [scripts/03_dev/start-all-services.ps1](./scripts/03_dev/start-all-services.ps1) | Iniciar todos los servicios localmente |
| [scripts/04_build/build-all-services.ps1](./scripts/04_build/build-all-services.ps1) | Compilar todos los microservicios |
| [scripts/05_test/run-all-tests.ps1](./scripts/05_test/run-all-tests.ps1) | Ejecutar todos los tests |

---

### 🔌 **INTEGRACIONES**

| Documento | Descripción |
|-----------|-------------|
| [docs/N8N_LOVABLE_INTEGRATION.md](./docs/N8N_LOVABLE_INTEGRATION.md) | Integración n8n + workflows |
| [docs/LOVABLE_PROMPT.md](./docs/LOVABLE_PROMPT.md) | **Prompt para Lovable.dev** ⭐ |

---

### 📊 **PROGRESO & REPORTES**

| Documento | Descripción |
|-----------|-------------|
| [docs/00_overview/RESUMEN_EJECUTIVO_FINAL.md](./docs/00_overview/RESUMEN_EJECUTIVO_FINAL.md) | **Resumen ejecutivo completo** ⭐ |
| [docs/05_progress/PROGRESO_14_ENERO_2026.md](./docs/05_progress/PROGRESO_14_ENERO_2026.md) | Progreso del 14 de enero |
| [docs/05_progress/ESTADO_FINAL_FASE1.md](./docs/05_progress/ESTADO_FINAL_FASE1.md) | Estado infraestructura base |

---

## 💻 CÓDIGO FUENTE

### **Backend - Microservicios**
```
sistema_facturacion/services/
├── identity-service/          # Auth, Users, JWT (Port 3001)
├── master-data-service/       # Clientes, Catálogo (Port 3002)
├── quotation-service/         # Cotizaciones, Proformas (Port 3003)
├── billing-service/           # Facturas, NCF, e-NCF (Port 3004)
├── ar-service/                # Cobros, Pagos (Port 3005)
├── documents-service/         # PDF Generation (Port 3008)
├── analytics-service/         # Analytics, BI, KPIs (Port 3010)
└── offline-sync-service/      # Offline Sync (Port 3011)
```

### **Frontend - Next.js**
```
sistema_facturacion/web-app/
├── src/app/
│   ├── login/                 # Página de login
│   ├── dashboard/             # Dashboard principal
│   ├── customers/             # Gestión de clientes
│   ├── quotes/                # Cotizaciones
│   ├── proformas/             # Proformas
│   ├── invoices/              # Facturas
│   └── payments/              # Cobros
└── src/components/            # Componentes reutilizables
```

### **Base de Datos**
```
supabase/migrations/
├── 20260114000001_create_identity_schema.sql
├── 20260114000002_create_master_data_schema.sql
├── 20260114000003_create_quotation_schema.sql
├── 20260114000004_create_billing_schema.sql
├── 20260114000005_create_ar_schema.sql
├── 20260114000006_create_audit_schema.sql
├── 20260114000020_seed_data.sql
├── 20260114000025_create_analytics_schema.sql
└── 20260114000030_billing_schema.sql
```

---

## 🧪 TESTING

### Scripts de Test
```bash
# Correr todos los tests
.\scripts\05_test\run-all-tests.ps1

# Test unitarios individuales
cd sistema_facturacion/services/quotation-service
npm test

# Test de integración
cd sistema_facturacion/services/billing-service
npm run test:e2e
```

### Tests Creados
- `quotation-service/test/quote.controller.spec.ts`
- `billing-service/test/billing.ncf.spec.ts`

---

## 📋 ENDPOINTS API

### **Identity Service** (Port 3001)
```
POST   /api/identity/v1/auth/login
POST   /api/identity/v1/auth/register
GET    /api/identity/v1/users
POST   /api/identity/v1/users
```

### **Quotation Service** (Port 3003)
```
GET    /api/quotation/v1/quotes
POST   /api/quotation/v1/manual
GET    /api/quotation/v1/proformas
GET    /api/quotation/v1/proformas/:id/pdf
POST   /api/quotation/v1/webhook/whatsapp  ← WhatsApp!
GET    /api/quotation/v1/webhook/whatsapp  ← Meta verification
```

### **Billing Service** (Port 3004)
```
GET    /api/billing/v1/invoices
POST   /api/billing/v1/invoices
POST   /api/billing/v1/preview
POST   /api/billing/v1/encf/issue          ← e-NCF!
GET    /api/billing/v1/encf/:id/xml
```

### **Analytics Service** (Port 3010)
```
GET    /api/analytics/v1/kpis
GET    /api/analytics/v1/dashboard
GET    /api/analytics/v1/sales
GET    /api/analytics/v1/ncf
GET    /api/analytics/v1/customers/top
GET    /api/analytics/v1/dso
POST   /api/analytics/v1/kpis/update
```

### **Swagger Documentation**
- Quotation: http://localhost:3003/api/quotation/docs
- Billing: http://localhost:3004/api/billing/docs

---

## 🔧 CONFIGURACIÓN

### **Variables de Entorno**

Cada servicio tiene su `.env`:
```
services/
├── identity-service/.env
├── master-data-service/.env
├── quotation-service/.env      ← WHATSAPP_VERIFY_TOKEN aquí!
├── billing-service/.env        ← DGII_API_KEY aquí!
├── ar-service/.env
├── documents-service/.env
├── analytics-service/.env
└── offline-sync-service/.env
```

**Frontend:**
```
web-app/.env.local
```

### **Supabase Local**
```
supabase/
├── config.toml
└── .env
```

---

## 📞 SOPORTE & TROUBLESHOOTING

### Problemas Comunes

**1. "Can't connect to database"**
```bash
# Verificar Supabase
supabase status

# Reiniciar
supabase stop
supabase start
```

**2. "Service not starting"**
```bash
# Verificar NODE_PATH
node --version
npm --version

# Limpiar y reinstalar
cd sistema_facturacion/services/quotation-service
rm -rf node_modules
npm install
```

**3. "RabbitMQ connection failed"**
```bash
# Verificar RabbitMQ
docker ps | grep rabbitmq

# Credenciales por defecto:
# User: alito
# Pass: alito_dev_2026
```

**4. "Tests failing"**
```bash
# Los tests requieren configuración adicional
# Ver: RESUMEN_EJECUTIVO_FINAL.md sección "Testing"
```

---

## 🎓 RECURSOS DE APRENDIZAJE

### Tecnologías Usadas
- **NestJS:** https://nestjs.com/
- **Next.js 15:** https://nextjs.org/
- **Supabase:** https://supabase.com/docs
- **RabbitMQ:** https://www.rabbitmq.com/
- **n8n:** https://docs.n8n.io/

### Compliance Fiscal Dominicano
- **NCF DGII:** https://dgii.gov.do/legislacion/normasGenerales/
- **e-NCF Formato:** https://dgii.gov.do/e-cf/
- **ITBIS 18%:** Ley 11-92 y modificaciones

---

## 📦 SCRIPTS ÚTILES

| Script | Descripción |
|--------|-------------|
| `build-all-services.ps1` | Compilar todos los microservicios |
| `start-all-services.ps1` | Iniciar todos los servicios |
| `run-all-tests.ps1` | Ejecutar todos los tests |
| `deploy.ps1` | Preparar para deployment |
| `FIX_PATH_AHORA.ps1` | Arreglar PATH de Node.js temporalmente |
| `FIX-PATH-ADMIN.ps1` | Arreglar PATH permanentemente (admin) |

---

## 🗺️ ROADMAP

### ✅ Completado (85%)
- Core microservices
- Frontend básico
- NCF tradicional
- WhatsApp integration
- Analytics backend
- Offline sync

### 🚧 En Progreso (10%)
- Tests
- Swagger documentation
- e-NCF firma digital
- Analytics frontend

### 📋 Pendiente (5%)
- Public web form
- AI-assisted upload
- Notifications service
- CI/CD pipeline

---

## 📝 NOTAS IMPORTANTES

⚠️ **ANTES DE PRODUCCIÓN:**
1. Cambiar todas las contraseñas y secrets
2. Obtener certificado DGII para e-NCF
3. Configurar backups automáticos
4. Revisar CORS y security headers
5. Configurar monitoreo (Sentry, UptimeRobot)

---

## 👥 CONTACTO

**Proyecto:** Sistema de Facturación Industrial  
**Cliente:** ALITO GROUP SRL  
**Desarrollador:** Antigravity AI  
**Fecha:** Enero 2026  

---

**📌 NOTA:** Este índice se actualiza automáticamente. Última modificación: 14/01/2026 22:10 AST
