# Identity & Access Service

Microservicio de autenticación y autorización para el Sistema de Facturación Cloud de ALITO GROUP.

## 🏗️ Arquitectura

Este servicio implementa **Arquitectura Hexagonal** (Ports & Adapters) con las siguientes capas:

- **Domain**: Entidades de negocio (User, Role, Permission)
- **Application**: Casos de uso (Login, Register, AssignRole)
- **Adapters Inbound**: HTTP Controllers con Swagger
- **Adapters Outbound**: Supabase (PostgreSQL), RabbitMQ

Ver documentación completa en: `ARCHITECTURE.md`

## 🚀 Uso

### Desarrollo

```bash
# Copiar .env
cp .env.example .env

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run start:dev
```

El servicio estará disponible en:
- API: http://localhost:3001/api/identity/v1
- Swagger: http://localhost:3001/api-docs

### Producción (Docker)

```bash
# Build
docker build -t identity-service .

# Run
docker run -p 3001:3001 --env-file .env identity-service
```

## 📖 API Endpoints

### Authentication

#### POST /api/identity/v1/auth/login
Autenticación de usuario

**Request:**
```json
{
  "email": "admin@alitogroup.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@alitogroup.com",
    "name": "Admin User",
    "roles": ["admin"],
    "isActive": true
  }
}
```

#### POST /api/identity/v1/auth/register
Registro de nuevo usuario

**Request:**
```json
{
  "email": "juan.perez@alitogroup.com",
  "password": "secure123",
  "name": "Juan Pérez"
}
```

**Response:**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "uuid",
    "email": "juan.perez@alitogroup.com",
    "name": "Juan Pérez",
    "roles": [],
    "isActive": true
  }
}
```

## 🔐 RBAC (Role-Based Access Control)

### Roles Predefinidos:

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **admin** | Administrador del sistema | Todos los permisos |
| **operator** | Operador | Crear/editar cotizaciones y facturas |
| **viewer** | Visualizador | Solo lectura |
| **billing** | Facturación | Emitir facturas (e-NCF) |

### Permisos Granulares:

Formato: `resource:action`

**Ejemplos:**
- `quote:create` - Crear cotizaciones
- `invoice:issue` - Emitir facturas (e-NCF)
- `user:delete` - Eliminar usuarios

## 🔔 Eventos Publicados (RabbitMQ)

| Evento | Exchange | Payload |
|--------|----------|---------|
| `identity.user.created` | identity.events | `{ userId, email, roles }` |
| `identity.role.assigned` | identity.events | `{ userId, roleName }` |
| `identity.user.deactivated` | identity.events | `{ userId, reason }` |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Variables de Entorno

Ver `.env.example` para la lista completa.

**Principales:**
- `PORT` - Puerto del servicio (default: 3001)
- `SUPABASE_URL` - URL de Supabase
- `SUPABASE_SERVICE_KEY` - Service key de Supabase
- `JWT_SECRET` - Secret para firmar JWT
- `RABBITMQ_URL` - URL de conexión a RabbitMQ

## 🏥 Health Check

```bash
GET /health
```

Responde con `200 OK` si el servicio está saludable.

## 📊 Métricas

El servicio expone métricas en formato Prometheus:

```bash
GET /metrics
```

## 🐛 Troubleshooting

### Error: Cannot connect to Supabase

Verificar que Supabase esté corriendo:
```bash
supabase status
```

### Error: Cannot connect to RabbitMQ

Verificar que RabbitMQ esté corriendo:
```bash
docker ps | grep rabbitmq
```

### Error: JWT verification failed

Verificar que `JWT_SECRET` sea el mismo en todos los servicios.

## 📚 Documentación

- **Swagger UI**: http://localhost:3001/api-docs
- **Architecture**: Ver `ARCHITECTURE.md`
- **Convenciones de eventos**: Ver raíz del proyecto `/CONVENCIONES_EVENTOS.md`

## 👥 Equipo

Desarrollado por ALITO GROUP SRL para el Sistema de Facturación Cloud.

---

**Versión**: 1.0.0  
**Puerto**: 3001  
**Arquitectura**: Hexagonal (Ports & Adapters)
