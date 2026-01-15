# Guía de Deployment en Producción - Sistema de Facturación ALITO GROUP

## 📋 Índice
1. [Arquitectura de Deployment](#arquitectura)
2. [Supabase Cloud (Base de Datos)](#supabase)
3. [Microservicios Backend](#backend)
4. [Frontend (Lovable/Next.js)](#frontend)
5. [n8n Cloud](#n8n)
6. [Variables de Entorno](#env)
7. [CI/CD Automation](#cicd)
8. [Monitoreo y Logs](#monitoring)

---

## 🏗️ Arquitectura de Deployment {#arquitectura}

```mermaid
graph TB
    subgraph Internet["🌐 Internet"]
        User[👤 Usuarios]
        WhatsAppMeta[💬 WhatsApp Meta]
    end

    subgraph Vercel["Vercel (Frontend)"]
        NextJS[Next.js App]
    end

    subgraph Railway["Railway (Backend Microservices)"]
        Identity[Identity Service :3001]
        MasterData[Master Data :3002]
        Quotation[Quotation :3003]
        Billing[Billing :3004]
        Documents[Documents :3008]
    end

    subgraph N8NCloud["n8n Cloud"]
        N8NWorkflows[Workflows & Automation]
    end

    subgraph Supabase["Supabase Cloud"]
        PostgreSQL[(PostgreSQL)]
        Storage[Storage/Files]
        Auth[Auth Service]
    end

    subgraph CloudAMQP["CloudAMQP"]
        RabbitMQ[RabbitMQ Managed]
    end

    User --> NextJS
    WhatsAppMeta --> N8NWorkflows
    
    NextJS --> Identity
    NextJS --> MasterData
    NextJS --> Quotation
    NextJS --> Billing
    
    N8NWorkflows --> Quotation
    N8NWorkflows --> WhatsAppMeta
    
    Identity --> PostgreSQL
    MasterData --> PostgreSQL
    Quotation --> PostgreSQL
    Quotation --> RabbitMQ
    Billing --> PostgreSQL
    Billing --> RabbitMQ
    Documents --> Storage
    
    style Vercel fill:#000
    style Railway fill:#0B0D0E
    style Supabase fill:#3ECF8E
    style N8NCloud fill:#FF6D5A
```

---

## 🗄️ Paso 1: Supabase Cloud (Base de Datos) {#supabase}

### 1.1 Crear Proyecto en Supabase

1. Ve a https://app.supabase.com
2. Click en **"New Project"**
3. Configuración:
   - **Name:** alito-facturacion-prod
   - **Database Password:** (guarda esto - lo necesitarás)
   - **Region:** East US (us-east-1) - más cercano a RD
   - **Plan:** Pro ($25/mes) - incluye Point-in-Time Recovery

### 1.2 Aplicar Migraciones

**Opciones:**

#### Opción A: Vía Supabase CLI (Recomendado)

```bash
# 1. Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# 2. Login a Supabase
supabase login

# 3. Link a tu proyecto
supabase link --project-ref YOUR_PROJECT_REF

# 4. Aplicar todas las migraciones
supabase db push

# 5. Verificar
supabase db diff
```

**Obtener PROJECT_REF:**
- Dashboard → Settings → API → Project URL
- Ejemplo: `https://abcdefghijk.supabase.co` → REF = `abcdefghijk`

#### Opción B: SQL Editor Manual

1. Ve a **SQL Editor** en Supabase Dashboard
2. Copia y pega cada archivo `.sql` en orden:
   ```
   20260114000001_create_identity_schema.sql
   20260114000002_create_master_data_schema.sql
   20260114000003_create_quotation_schema.sql
   20260114000004_create_billing_schema.sql
   20260114000005_create_ar_schema.sql
   20260114000006_create_audit_schema.sql
   20260114000020_seed_data.sql
   20260114000030_billing_schema.sql
   ```
3. Click **Run** en cada uno

### 1.3 Configurar Storage para PDFs

```sql
-- Crear bucket para documentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Policy: Permitir lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Policy: Permitir escritura autenticada
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

### 1.4 Obtener Credenciales

Dashboard → Settings → API:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (⚠️ SECRETO)
DATABASE_URL=postgresql://postgres:PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
```

---

## 🚀 Paso 2: Backend Microservicios (Railway) {#backend}

### 2.1 ¿Por qué Railway?

- ✅ Deploy desde GitHub automático
- ✅ Free tier generoso ($5/mes gratis)
- ✅ Variables de entorno fáciles
- ✅ Logs y métricas incluidos
- ✅ SSL/HTTPS automático

### 2.2 Preparar Repositorio GitHub

```bash
# 1. Inicializar Git (si no lo tienes)
cd c:/Users/wilbe/Downloads/TESISFACTURACION
git init
git add .
git commit -m "Initial commit - Sistema Facturación"

# 2. Crear repo en GitHub
# Ve a github.com/new

# 3. Push
git remote add origin https://github.com/TU_USUARIO/alito-facturacion.git
git branch -M main
git push -u origin main
```

### 2.3 Configurar Railway

1. Ve a https://railway.app
2. Login con GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Selecciona `alito-facturacion`

### 2.4 Deploy cada Microservicio

**Para CADA servicio, crea un nuevo Service en Railway:**

#### Identity Service

```yaml
# railway.json (crear en raíz de identity-service/)
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Variables de Entorno en Railway:**
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=your_super_secret_key_min_32_characters
```

**Repetir para:**
- Master Data Service (Puerto 3002)
- Quotation Service (Puerto 3003)
- Billing Service (Puerto 3004)
- Documents Service (Puerto 3008)

### 2.5 RabbitMQ en CloudAMQP

**¿Por qué CloudAMQP?**
- ✅ RabbitMQ managed (no administrar)
- ✅ Free tier (1M mensajes/mes)
- ✅ High availability

**Configuración:**

1. Ve a https://www.cloudamqp.com
2. Click **"Create Instance"**
3. Plan: **Little Lemur (Free)**
4. Region: **US-East-1**
5. Copia la **CLOUDAMQP_URL**

```env
RABBITMQ_URL=amqps://user:pass@HOST.cloudamqp.com/VHOST
```

**Agregar a Railway:**
- Quotation Service → Environment Variables → `RABBITMQ_URL`
- Billing Service → Environment Variables → `RABBITMQ_URL`

---

## 🎨 Paso 3: Frontend (Vercel) {#frontend}

### 3.1 Deploy Next.js en Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy desde web-app/
cd sistema_facturacion/web-app
vercel

# Sigue el wizard:
# - Project Name: alito-facturacion-web
# - Framework: Next.js
# - Deploy: Yes
```

### 3.2 Variables de Entorno en Vercel

Dashboard → Settings → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Backend APIs (URLs de Railway)
NEXT_PUBLIC_IDENTITY_URL=https://identity-production-XXXX.up.railway.app/api/identity/v1
NEXT_PUBLIC_MASTER_DATA_URL=https://master-data-production-XXXX.up.railway.app/api/master-data/v1
NEXT_PUBLIC_QUOTATION_URL=https://quotation-production-XXXX.up.railway.app/api/quotation/v1
NEXT_PUBLIC_BILLING_URL=https://billing-production-XXXX.up.railway.app/api/billing/v1
NEXT_PUBLIC_DOCUMENTS_URL=https://documents-production-XXXX.up.railway.app/api/documents/v1

# n8n (si usas)
NEXT_PUBLIC_N8N_WEBHOOK=https://YOUR_INSTANCE.app.n8n.cloud/webhook
```

### 3.3 Configurar Dominio Personalizado

En Vercel → Settings → Domains:

```
alito-facturacion.com → Production
web.alito-facturacion.com → Production
```

**Configurar DNS (en tu proveedor):**
```
Type: CNAME
Name: web
Value: cname.vercel-dns.com
```

---

## 🤖 Paso 4: n8n Cloud {#n8n}

### 4.1 Crear Cuenta n8n Cloud

1. Ve a https://n8n.io/cloud
2. Plan: **Starter ($20/mes)** - 5,000 executions/mes
3. Crea tu instancia

### 4.2 Importar Workflows

1. Dashboard → Workflows → **Import from File**
2. Sube los archivos JSON de workflows (de `N8N_LOVABLE_INTEGRATION.md`)
3. Configura credenciales:

**Supabase:**
```
Host: db.YOUR_PROJECT.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [tu password]
SSL: Enabled
```

**RabbitMQ (CloudAMQP):**
```
URL: amqps://user:pass@HOST.cloudamqp.com/VHOST
```

**WhatsApp (Meta):**
```
Access Token: [de Meta Business Suite]
Phone Number ID: [de WhatsApp Business]
```

### 4.3 Configurar Webhook para WhatsApp

En Meta Business Suite:

```
Callback URL: https://YOUR_INSTANCE.app.n8n.cloud/webhook/whatsapp-incoming
Verify Token: alito_whatsapp_2026
```

---

## 🔐 Paso 5: Variables de Entorno Completas {#env}

### Railway (Backend Services)

**identity-service/.env.production**
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=tu_secreto_min_32_caracteres_aqui
JWT_EXPIRATION=7d
```

**quotation-service/.env.production**
```env
NODE_ENV=production
PORT=3003
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
RABBITMQ_URL=amqps://user:pass@HOST.cloudamqp.com/VHOST
DOCUMENTS_SERVICE_URL=https://documents-production-XXXX.up.railway.app/api/documents/v1
```

**billing-service/.env.production**
```env
NODE_ENV=production
PORT=3004
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
RABBITMQ_URL=amqps://user:pass@HOST.cloudamqp.com/VHOST
```

**documents-service/.env.production**
```env
NODE_ENV=production
PORT=3008
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

### Vercel (Frontend)

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_BASE_URL=https://api.alito-facturacion.com
```

---

## ⚙️ Paso 6: CI/CD con GitHub Actions {#cicd}

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [identity-service, master-data-service, quotation-service, billing-service, documents-service]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: |
          cd sistema_facturacion/services/${{ matrix.service }}
          npm ci
      
      - name: Build
        run: |
          cd sistema_facturacion/services/${{ matrix.service }}
          npm run build
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up -s ${{ matrix.service }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd sistema_facturacion/web-app
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Configurar Secrets en GitHub:**
- Settings → Secrets → New repository secret
  - `RAILWAY_TOKEN` (de Railway Dashboard)
  - `VERCEL_TOKEN` (de Vercel Dashboard)

---

## 📊 Paso 7: Monitoreo y Logs {#monitoring}

### 7.1 Supabase Logs

Dashboard → Logs:
- Query Performance
- Database Stats
- API Requests

### 7.2 Railway Logs

Dashboard → Service → **Observability**:
- Real-time logs
- Metrics (CPU, Memory)
- Request traces

### 7.3 Sentry (Error Tracking)

```bash
npm install @sentry/node @sentry/nextjs
```

**Backend (main.ts):**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 1.0,
});
```

**Frontend (next.config.js):**
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // next config
}, {
  org: 'alito-group',
  project: 'facturacion-web',
});
```

### 7.4 Uptime Monitoring (UptimeRobot)

https://uptimerobot.com (Free)

Monitorear:
- Frontend: `https://web.alito-facturacion.com`
- Identity API: `https://identity-prod.up.railway.app/health`
- Quotation API: `https://quotation-prod.up.railway.app/health`

---

## 💰 Costos Estimados Mensuales

| Servicio | Plan | Costo |
|----------|------|-------|
| **Supabase** | Pro | $25/mes |
| **Railway** | Hobby (5 services × $5) | $25/mes |
| **CloudAMQP** | Little Lemur | $0 (Free) |
| **n8n Cloud** | Starter | $20/mes |
| **Vercel** | Hobby | $0 (Free) |
| **Dominio** | .com | $12/año |
| **Total** | | **~$70/mes** |

**Alternativa más económica (Free Tier):**
- Supabase Free ($0)
- Railway Free ($5 crédito)
- Render Free
- n8n Self-hosted (Railway)
- **Total: $0-10/mes**

---

## 🚀 Checklist de Deployment

### Pre-Deploy
- [ ] Código en GitHub
- [ ] Migraciones SQL probadas localmente
- [ ] Variables de entorno documentadas
- [ ] Tests pasando (si hay)

### Supabase
- [ ] Proyecto creado
- [ ] Migraciones aplicadas
- [ ] Storage configurado
- [ ] Credenciales copiadas

### Backend (Railway)
- [ ] Servicios creados (6)
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Health checks funcionando

### Frontend (Vercel)
- [ ] Deploy exitoso
- [ ] Variables de entorno configuradas
- [ ] Dominio configurado (opcional)
- [ ] APIs conectando correctamente

### n8n
- [ ] Cuenta creada
- [ ] Workflows importados
- [ ] Credenciales configuradas
- [ ] Webhook WhatsApp funcionando

### CI/CD
- [ ] GitHub Actions configurado
- [ ] Secrets agregados
- [ ] Pipeline corriendo

### Monitoring
- [ ] Sentry configurado
- [ ] UptimeRobot configurado
- [ ] Logs revisados

---

## 🆘 Troubleshooting

### Error: "Can't connect to database"
```bash
# Verificar credenciales
psql $DATABASE_URL

# Verificar IP whitelist en Supabase
# Dashboard → Settings → Database → Connection Pooling
```

### Error: "RabbitMQ connection timeout"
```bash
# Verificar URL
echo $RABBITMQ_URL

# Test connection
curl -u user:pass https://HOST.cloudamqp.com/api/overview
```

### Error: "CORS en producción"
```typescript
// Agregar en main.ts (NestJS)
app.enableCors({
  origin: ['https://web.alito-facturacion.com', 'https://alito-facturacion.com'],
  credentials: true,
});
```

---

## 📞 Soporte

**Recursos:**
- Supabase Docs: https://supabase.com/docs
- Railway Docs: https://docs.railway.app
- n8n Community: https://community.n8n.io
- Vercel Docs: https://vercel.com/docs

**Community Support:**
- Discord de Supabase
- Railway Discord
- Stack Overflow

---

¡Tu sistema está listo para producción! 🎉
