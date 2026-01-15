# 🔗 ENLACES DE ACCESO AL SISTEMA - ALITO GROUP

## 📱 APLICACIÓN WEB (Frontend)
🌐 **Web App Principal:** http://localhost:3000
🌐 **Web App (Puerto Alternativo):** http://localhost:3002

### Páginas Disponibles:
- 🔐 Login: http://localhost:3000/login
- 📊 Dashboard: http://localhost:3000/dashboard
- 👥 Clientes: http://localhost:3000/customers
- ➕ Nuevo Cliente: http://localhost:3000/customers/new
- 📝 Cotizaciones: http://localhost:3000/quotes
- ➕ Nueva Cotización: http://localhost:3000/quotes/new
- 📄 Proformas: http://localhost:3000/proformas
- 🧾 Facturas: http://localhost:3000/invoices
- 💰 Pagos: http://localhost:3000/payments

---

## 🎛️ SERVICIOS BACKEND (APIs)

### Identity Service (Port 3001)
- 🔗 API Base: http://localhost:3001/api/identity/v1
- 📚 Swagger Docs: http://localhost:3001/api/identity/docs
- Endpoints:
  - POST /api/identity/v1/auth/register
  - POST /api/identity/v1/auth/login
  - GET /api/identity/v1/users

### Master Data Service (Port 3002)
- 🔗 API Base: http://localhost:3002/api/master-data/v1
- 📚 Swagger Docs: http://localhost:3002/api/master-data/docs
- Endpoints:
  - GET /api/master-data/v1/customers
  - POST /api/master-data/v1/customers
  - GET /api/master-data/v1/service-items
  - POST /api/master-data/v1/service-items

### Quotation Service (Port 3003)
- 🔗 API Base: http://localhost:3003/api/quotation/v1
- 📚 Swagger Docs: http://localhost:3003/api/quotation/docs
- Endpoints:
  - GET /api/quotation/v1/quotes
  - POST /api/quotation/v1/quotes
  - PUT /api/quotation/v1/quotes/:id
  - POST /api/quotation/v1/quotes/:id/approve
  - DELETE /api/quotation/v1/quotes/:id
  - GET /api/quotation/v1/proformas
  - POST /api/quotation/v1/proformas/:id/complete
  - GET /api/quotation/v1/proformas/:id/pdf

### Billing Service (Port 3004)
- 🔗 API Base: http://localhost:3004/api/billing/v1
- 📚 Swagger Docs: http://localhost:3004/api/billing/docs
- Endpoints:
  - GET /api/billing/v1/invoices
  - POST /api/billing/v1/invoices
  - GET /api/billing/v1/invoices/:id

### AR Service (Port 3005)
- 🔗 API Base: http://localhost:3005/api/ar/v1
- 📚 Swagger Docs: http://localhost:3005/api/ar/docs

### Documents Service (Port 3008)
- 🔗 API Base: http://localhost:3008/api/documents/v1
- 📚 Swagger Docs: http://localhost:3008/api/documents/docs
- Endpoints:
  - POST /api/documents/v1/generate

### Audit Service (Port 3009)
- 🔗 API Base: http://localhost:3009/api/audit/v1
- 📚 Swagger Docs: http://localhost:3009/api/audit/docs

---

## 📊 INFRAESTRUCTURA

### RabbitMQ Management Console
- 🔗 URL: http://localhost:15672
- 👤 Usuario: `guest`
- 🔑 Password: `guest`
- Ver colas, exchanges, mensajes en tiempo real

### Supabase (Base de Datos)
- 🔗 Dashboard: https://app.supabase.com
- 🔗 Tu Proyecto: [URL de tu proyecto Supabase]
- 📊 Table Editor
- 🔍 SQL Editor (para ejecutar migraciones)
- 📦 Storage (para PDFs generados)

---

## 🧪 TESTING DE APIs (Ejemplos)

### Crear un Cliente (Master Data Service)
```bash
curl -X POST http://localhost:3002/api/master-data/v1/customers \
  -H "Content-Type: application/json" \
  -d '{
    "rnc": "131-12345-6",
    "name": "Empresa Test SRL",
    "email": "test@empresa.com",
    "phone": "809-555-1234",
    "address": "Santo Domingo",
    "fiscalType": "CREDITO_FISCAL",
    "creditLimit": 100000
  }'
```

### Crear una Cotización (Quotation Service)
```bash
curl -X POST http://localhost:3003/api/quotation/v1/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust-001",
    "items": [
      {
        "serviceItemId": "si-001",
        "description": "Alquiler Grua 20 Ton",
        "quantity": 4,
        "unitPrice": 3500,
        "taxRate": 0.18,
        "unit": "HR"
      }
    ],
    "notes": "Servicio urgente"
  }'
```

### Generar PDF de Proforma
```bash
curl http://localhost:3003/api/quotation/v1/proformas/[ID]/pdf
```

---

## 📝 NOTAS IMPORTANTES

### ⚠️ Antes de Acceder al Sistema:

1. **Base de Datos:**
   - Las migraciones deben estar aplicadas en Supabase
   - Los datos de prueba (seed) deben estar cargados

2. **RabbitMQ:**
   - Debe estar corriendo: `docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

3. **Variables de Entorno:**
   - Cada servicio necesita un archivo `.env` con:
     - SUPABASE_URL
     - SUPABASE_SERVICE_KEY
     - RABBITMQ_URL
     - JWT_SECRET

4. **Servicios Iniciados:**
   - Todos los servicios backend deben estar corriendo
   - La web-app debe estar corriendo

---

## 🚀 ESTADO ACTUAL

✅ **Web App:** Corriendo en puerto 3000 o 3002
⚠️ **Backend Services:** Verificar que estén iniciados

Para verificar qué está corriendo:
```powershell
Get-Process node | Select-Object Id, ProcessName, @{Name="Port";Expression={(Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue).LocalPort}} | Format-Table
```

---

## 🔧 SOLUCIÓN RÁPIDA

Si algo no funciona:

1. **Web App no carga:**
   ```powershell
   cd sistema_facturacion\web-app
   npm run dev
   ```

2. **Servicios backend no responden:**
   ```powershell
  .\scripts\03_dev\start-all-services.ps1
   ```
   O iniciar cada uno manualmente:
   ```powershell
   cd sistema_facturacion\services\[nombre-servicio]
   npm run start:dev
   ```

3. **Error 404 en APIs:**
   - Verificar que el servicio esté corriendo
   - Verificar el puerto correcto
   - Verificar la ruta: `/api/[servicio]/v1/[endpoint]`

---

**🎯 ACCESO PRINCIPAL:** http://localhost:3000

**📚 DOCUMENTACIÓN SWAGGER:** http://localhost:300X/api/[servicio]/docs
(Reemplazar X con el puerto del servicio)

---

**Última actualización:** 2026-01-14
