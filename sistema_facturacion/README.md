# Sistema de Facturación Cloud - ALITO GROUP SRL

Sistema de facturación con IA basado en arquitectura de microservicios con soporte para comprobantes fiscales electrónicos (e-NCF) según normativas DGII República Dominicana.

## 🏗️ Arquitectura

- **Supabase Local**: PostgreSQL + PostgREST + Auth + Storage + Realtime
- **Microservicios**: Arquitectura Hexagonal (Ports & Adapters)
- **Event Bus**: RabbitMQ para comunicación asíncrona
- **API Gateway**: Kong para enrutamiento centralizado
- **Observabilidad**: Prometheus + Grafana + Jaeger

## 📁 Estructura del Proyecto

```
TESISFACTURACION/
├── sistema_facturacion/         # 🎯 PROYECTO EJECUTABLE
│   ├── infrastructure/          # Infraestructura compartida
│   │   ├── api-gateway/
│   │   │   └── kong.yml        # Configuración Kong
│   │   └── observability/
│   │       ├── prometheus.yml   # Métricas
│   │       └── grafana/        # Dashboards
│   │
│   ├── services/                # Microservicios (Hexagonal + Swagger)
│   │   ├── quotation/          # Servicio de Cotizaciones
│   │   ├── billing/            # Servicio de Facturación (e-NCF)
│   │   ├── ar/                 # Cuentas por Cobrar
│   │   └── ...                 # (11 microservicios en total)
│   │
│   ├── frontend/                # Aplicación web (Next.js + React)
│   │
│   ├── docker-compose.yml       # RabbitMQ + Redis + Kong + Observabilidad
│   ├── .env.example             # Variables de entorno
│   └── README.md                # Este archivo
│
├── supabase/                    # ⚙️ Supabase Local (PostgreSQL + PostgREST)
│   ├── config.toml
│   ├── migrations/              # Migraciones de base de datos
│   └── seed.sql                 # Datos iniciales
│
└── archivos_no_proyecto/        # 📚 Documentación académica (tesis, fases, etc.)
```

> [!NOTE]
> **Supabase** debe estar en la raíz `TESISFACTURACION/supabase/` porque el CLI lo busca ahí.  
> Todo lo demás vive dentro de `sistema_facturacion/`.

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** 22.x
- **Docker Desktop** (corriendo) ⚠️
- **Supabase CLI** 2.67.1+

### 1. Clonar e Instalar

```bash
cd TESISFACTURACION
cp sistema_facturacion/.env.example sistema_facturacion/.env
```

### 2. Iniciar Supabase Local

```bash
# Desde la raíz TESISFACTURACION (importante!)
supabase start
```

Esto inicia:
- PostgreSQL: `postgresql://postgres:postgres@localhost:54322/postgres`
- Post gREST API: `http://localhost:54321`
- Supabase Studio: `http://localhost:54323`
- Inbucket (email): `http://localhost:54324`

### 3. Iniciar Servicios Complementarios

```bash
cd sistema_facturacion
docker-compose up -d
```

Esto inicia:
- RabbitMQ Management: `http://localhost:15672` (user: `alito`, pass: `.env`)
- Kong API Gateway: `http://localhost:8000`
- Kong Admin: `http://localhost:8001`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`
- Jaeger UI: `http://localhost:16686`

### 4. Verificar que Todo Esté Corriendo

```bash
# Supabase (desde raíz)
cd ..
supabase status

# Docker services (desde sistema_facturacion)
cd sistema_facturacion
docker-compose ps

# Health checks
curl http://localhost:54321/rest/v1/   # PostgREST
curl http://localhost:8001             # Kong Admin
```

## 📊 Servicios y Puertos

| Servicio | Puerto | URL | Credenciales |
|----------|--------|-----|--------------|
| **Supabase Studio** | 54323 | http://localhost:54323 | - |
| PostgREST API | 54321 | http://localhost:54321/rest/v1 | anon key |
| PostgreSQL | 54322 | postgresql://localhost:54322 | postgres/postgres |
| Kong Proxy | 8000 | http://localhost:8000 | - |
| Kong Admin | 8001 | http://localhost:8001 | - |
| RabbitMQ | 5672/15672 | http://localhost:15672 | alito/[.env] |
| Redis | 6379 | localhost:6379 | - |
| Prometheus | 9090 | http://localhost:9090 | - |
| Grafana | 3001 | http://localhost:3001 | admin/[.env] |
| Jaeger | 16686 | http://localhost:16686 | - |

## 🔐 Autenticación

### Supabase Auth (JWT)

```bash
# Crear usuario
curl -X POST http://localhost:54321/auth/v1/signup \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alitogroup.com","password":"admin123"}'

# Login
curl -X POST http://localhost:54321/auth/v1/token?grant_type=password \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alitogroup.com","password":"admin123"}'
```

## 📖 Documentación de APIs

### PostgREST (Supabase)

```bash
# Listar clientes
GET http://localhost:8000/rest/customers

# Crear cliente
POST http://localhost:8000/rest/customers
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "rnc": "101-12345-6",
  "nombre": "Cliente Prueba"
}
```

### Microservicios (Swagger)

Cuando los microservicios estén desplegados:

- Quotation: `http://localhost:8000/api/quotation/api-docs`
- Billing: `http://localhost:8000/api/billing/api-docs`
- AR: `http://localhost:8000/api/ar/api-docs`

## 🧪 Desarrollo

### Crear Migración de Base de Datos

```bash
# Desde raíz TESISFACTURACION
supabase migration new create_customers_table
# Editar: supabase/migrations/XXXXXX_create_customers_table.sql
supabase db reset
```

### Logs en Tiempo Real

```bash
# Supabase logs (desde raíz)
supabase logs -f

# Docker services logs (desde sistema_facturacion)
cd sistema_facturacion
docker-compose logs -f rabbitmq
docker-compose logs -f kong
```

## ✅ Checklist Fase 1

- [x] Instalar Supabase CLI (2.67.1)
- [x] Inicializar Supabase (`supabase init`)
- [x] Crear docker-compose.yml
- [x] Crear kong.yml
- [x] Crear prometheus.yml
- [x] Crear .env.example
- [ ] **Iniciar Docker Desktop** ⚠️ PENDIENTE
- [ ] Iniciar Supabase (`supabase start`)
- [ ] Iniciar servicios (`docker-compose up -d`)
- [ ] Verificar todos los endpoints

## 📚 Documentación Adicional

- [Plan de Implementación](../../.gemini/antigravity/brain/.../implementation_plan.md)
- [Lista de Tareas](../../.gemini/antigravity/brain/.../task.md)
- [Endpoints de Ingesta](../../.gemini/antigravity/brain/.../endpoints_ingesta_cotizaciones.md)

## 🤝 Equipo

**ALITO GROUP SRL**  
Sistema desarrollado para cumplir normativas DGII (e-NCF) de facturación electrónica.

---

**Estado del Proyecto:** 🚧 En Desarrollo - Fase 1 (Infraestructura Base)

**Próximo Paso:** ⚠️ Iniciar Docker Desktop para continuar
