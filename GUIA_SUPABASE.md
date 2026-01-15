# GUÍA RÁPIDA: CONFIGURAR SUPABASE

## 🔗 ACCESO A SUPABASE
https://app.supabase.com

## 📋 CHECKLIST DE CONFIGURACIÓN

### ☑️ PASO 1: Acceder a tu Proyecto
1. Ir a https://app.supabase.com
2. Seleccionar tu proyecto (o crear uno nuevo)
3. Guardar el Project ID de la URL

### ☑️ PASO 2: Obtener Credenciales
1. Ir a: Settings → API
2. Copiar:
   - Project URL (ejemplo: https://xxxxx.supabase.co)
   - anon/public key
   - service_role key (⚠️ SECRETO - no compartir)

### ☑️ PASO 3: Ejecutar Migraciones SQL

Ir a: SQL Editor → New Query

Ejecutar EN ORDEN (copiar contenido de cada archivo):

**ESTRUCTURA (9 archivos):**
```
1. ✅ create_identity_schema.sql      - Usuarios, roles
2. ✅ create_master_data_schema.sql   - Clientes, service_items
3. ✅ create_quotation_schema.sql     - Quotes, quote_items
4. ✅ create_billing_schema.sql       - Invoices, NCF
5. ✅ create_ar_schema.sql            - Pagos
6. ✅ create_audit_schema.sql         - Logs
7. ✅ update_quotation_fields.sql     - Campos adicionales
8. ✅ seed_data.sql                   - DATOS DE PRUEBA ⭐
9. ✅ billing_schema.sql              - Función get_next_ncf
```

**Ubicación:** `c:\Users\wilbe\Downloads\TESISFACTURACION\supabase\migrations\`

### ☑️ PASO 4: Verificar Tablas Creadas

Ir a: Table Editor

Deberías ver:
- ✅ users
- ✅ customers
- ✅ service_items
- ✅ quotes
- ✅ quote_items
- ✅ invoices
- ✅ invoice_items
- ✅ encf_sequences
- ✅ payments
- ✅ audit_logs

### ☑️ PASO 5: Verificar Datos de Prueba

En Table Editor → service_items:
- Debería haber 5 servicios (grúas, montacargas, etc.)

En Table Editor → customers:
- Debería haber 3 clientes de prueba

### ☑️ PASO 6: Configurar Variables de Entorno

Crear `.env` en cada servicio:

**identity-service/.env**
```env
SUPABASE_URL=https://[tu-project-id].supabase.co
SUPABASE_SERVICE_KEY=[tu-service-role-key]
JWT_SECRET=tu_secreto_muy_largo_y_seguro_1234567890
PORT=3001
```

**master-data-service/.env**
```env
SUPABASE_URL=https://[tu-project-id].supabase.co
SUPABASE_SERVICE_KEY=[tu-service-role-key]
PORT=3002
```

**quotation-service/.env**
```env
SUPABASE_URL=https://[tu-project-id].supabase.co
SUPABASE_SERVICE_KEY=[tu-service-role-key]
RABBITMQ_URL=amqp://alito:alito_dev_2026@localhost:5672
PORT=3003
```

**billing-service/.env**
```env
SUPABASE_URL=https://[tu-project-id].supabase.co
SUPABASE_SERVICE_KEY=[tu-service-role-key]
RABBITMQ_URL=amqp://alito:alito_dev_2026@localhost:5672
PORT=3004
```

**documents-service/.env**
```env
SUPABASE_URL=https://[tu-project-id].supabase.co
SUPABASE_SERVICE_KEY=[tu-service-role-key]
PORT=3008
```

**web-app/.env.local**
```env
NEXT_PUBLIC_SUPABASE_URL=https://[tu-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
NEXT_PUBLIC_IDENTITY_URL=http://localhost:3001/api/identity/v1
NEXT_PUBLIC_MASTER_DATA_URL=http://localhost:3002/api/master-data/v1
NEXT_PUBLIC_QUOTATION_URL=http://localhost:3003/api/quotation/v1
NEXT_PUBLIC_BILLING_URL=http://localhost:3004/api/billing/v1
```

---

## 🧪 VERIFICAR QUE TODO FUNCIONA

### Test 1: Conectividad desde un servicio
```powershell
cd sistema_facturacion\services\master-data-service
npm run start:dev
```

Debería conectarse sin errores.

### Test 2: SQL Query Manual
En SQL Editor ejecutar:
```sql
SELECT * FROM service_items;
```

Debería retornar 5 servicios.

### Test 3: API Test
Con el servicio corriendo:
```
http://localhost:3002/api/master-data/v1/service-items
```

---

## ⚠️ PROBLEMAS COMUNES

### Error: "relation does not exist"
- Falta ejecutar las migraciones
- Ejecutar en orden correcto

### Error: "permission denied"
- Usar `service_role` key (no anon key)
- Verificar RLS policies

### Error: "database connection failed"
- Verificar SUPABASE_URL correcto
- Verificar SUPABASE_SERVICE_KEY correcto
- Revisar que el proyecto esté activo

---

## 📞 ENLACES ÚTILES

- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs
- API Reference: https://supabase.com/docs/reference

---

**Última actualización:** 2026-01-14
