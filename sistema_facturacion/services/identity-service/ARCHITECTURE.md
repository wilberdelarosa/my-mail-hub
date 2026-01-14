# Identity & Access Service - Arquitectura Hexagonal

**Microservicio:** Identity & Access  
**Puerto:** 3001  
**Responsabilidad:** Autenticación, autorización, gestión de usuarios y roles (RBAC)

---

## 🏗️ Arquitectura Hexagonal (Ports & Adapters)

```
identity-service/
├── src/
│   ├── domain/                          # ⬡ NÚCLEO (Lógica de negocio pura)
│   │   ├── entities/                    # Entidades de dominio
│   │   │   ├── user.entity.ts
│   │   │   ├── role.entity.ts
│   │   │   └── permission.entity.ts
│   │   ├── value-objects/               # Objetos de valor
│   │   │   ├── email.vo.ts
│   │   │   └── password.vo.ts
│   │   ├── ports/                       # Puertos (interfaces)
│   │   │   ├── inbound/                 # Casos de uso (entrada)
│   │   │   │   ├── authenticate.port.ts
│   │   │   │   ├── manage-users.port.ts
│   │   │   │   └── manage-roles.port.ts
│   │   │   └── outbound/                # Repositorios (salida)
│   │   │       ├── user-repository.port.ts
│   │   │       ├── audit-log.port.ts
│   │   │       └── event-publisher.port.ts
│   │   └── rules/                       # Reglas de negocio
│   │       └── rbac.rule.ts
│   │
│   ├── application/                     # 🎯 CAPA DE APLICACIÓN
│   │   ├── services/                    # Servicios de aplicación
│   │   │   └── authentication.service.ts
│   │   └── use-cases/                   # Casos de uso (implementaciones)
│   │       ├── login.usecase.ts
│   │       ├── register.usecase.ts
│   │       ├── assign-role.usecase.ts
│   │       └── revoke-permission.usecase.ts
│   │
│   ├── adapters/                        # 🔌 ADAPTADORES (Implementaciones)
│   │   ├── inbound/                     # Controladores (entrada)
│   │   │   └── http/
│   │   │       ├── auth.controller.ts
│   │   │       ├── users.controller.ts
│   │   │       ├── roles.controller.ts
│   │   │       └── swagger.config.ts
│   │   └── outbound/                    # Infraestructura (salida)
│   │       ├── persistence/
│   │       │   ├── supabase-user.repository.ts
│   │       │   └── supabase.client.ts
│   │       ├── events/
│   │       │   └── rabbitmq-publisher.adapter.ts
│   │       └── cache/
│   │           └── redis-cache.adapter.ts
│   │
│   ├── infrastructure/                  # ⚙️ CONFIGURACIÓN
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   ├── rabbitmq.config.ts
│   │   │   └── redis.config.ts
│   │   └── modules/
│   │       ├── identity.module.ts
│   │       └── shared.module.ts
│   │
│   └── main.ts                          # Entrada de la aplicación
│
├── test/                                # Pruebas
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── package.json
├── tsconfig.json
├── nest-cli.json
├── Dockerfile
└── README.md
```

---

## 📋 Flujo de Datos (Hexagonal)

```
CLIENTE (Frontend/Postman)
    ↓
┌─────────────────────────────────────────────┐
│  ADAPTADORES INBOUND (HTTP Controllers)     │
│  - auth.controller.ts                       │
│  - users.controller.ts                      │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  PUERTOS INBOUND (Use Case Interfaces)      │
│  - AuthenticatePort                         │
│  - ManageUsersPort                          │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  APLICACIÓN (Use Cases)                     │
│  - LoginUseCase                             │
│  - RegisterUseCase                          │
│  - AssignRoleUseCase                        │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  DOMINIO (Entities + Rules)                 │
│  - User entity                              │
│  - Role entity                              │
│  - RBAC rules                               │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  PUERTOS OUTBOUND (Repository Interfaces)   │
│  - UserRepositoryPort                       │
│  - EventPublisherPort                       │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  ADAPTADORES OUTBOUND (Implementaciones)    │
│  - SupabaseUserRepository                   │
│  - RabbitMQPublisher                        │
│  - RedisCache                               │
└─────────────────────────────────────────────┘
     ↓              ↓              ↓
 Supabase      RabbitMQ         Redis
```

---

## 🔐 Entidades de Dominio

### User Entity

```typescript
// src/domain/entities/user.entity.ts
import { Email } from '../value-objects/email.vo';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly name: string,
    public roles: Role[],
    public readonly createdAt: Date,
    public isActive: boolean
  ) {}

  // Regla de negocio: Usuario puede tener múltiples roles
  hasRole(roleName: string): boolean {
    return this.roles.some(role => role.name === roleName);
  }

  // Regla de negocio: Usuario con rol Admin puede todo
  hasPermission(permission: string): boolean {
    if (this.hasRole('admin')) return true;
    return this.roles.some(role => 
      role.permissions.includes(permission)
    );
  }

  // Regla de negocio: Solo usuarios activos pueden autenticarse
  canAuthenticate(): boolean {
    return this.isActive;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }
}
```

---

## 🎯 Casos de Uso

### LoginUseCase

```typescript
// src/application/use-cases/login.usecase.ts
import { Injectable } from '@nestjs/common';
import { AuthenticatePort } from '../../domain/ports/inbound/authenticate.port';
import { UserRepositoryPort } from '../../domain/ports/outbound/user-repository.port';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUseCase implements AuthenticatePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> {
 (1) Buscar usuario por email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // (2) Validar contraseña
    const isValid = await this.validatePassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // (3) Regla de negocio: Solo usuarios activos
    if (!user.canAuthenticate()) {
      throw new ForbiddenException('User is deactivated');
    }

    // (4) Generar tokens
    const payload = {
      sub: user.id,
      email: user.email.value,
      roles: user.roles.map(r => r.name)
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken, user };
  }
}
```

---

## 🔌 Adaptadores

### Supabase Repository (Outbound)

```typescript
// src/adapters/outbound/persistence/supabase-user.repository.ts
import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../../domain/ports/outbound/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseUserRepository implements UserRepositoryPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(`
        *,
        user_roles (
          role:roles (*)
        )
      `)
      .eq('email', email)
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data);
  }

  async save(user: User): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email.value,
        name: user.name,
        is_active: user.isActive,
        updated_at: new Date()
      });

    if (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }
  }

  private mapToEntity(data: any): User {
    // Mapeo de BD a entidad de dominio
    return new User(
      data.id,
      new Email(data.email),
      data.name,
      data.user_roles?.map(ur => new Role(ur.role)) || [],
      new Date(data.created_at),
      data.is_active
    );
  }
}
```

### HTTP Controller (Inbound)

```typescript
// src/adapters/inbound/http/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../../application/use-cases/login.usecase';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Autenticación de usuario
   *     description: Autentica usuario y retorna JWT
   */
  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.login(loginDto.email, loginDto.password);
  }
}
```

---

## 📡 Comunicación con RabbitMQ

### Event Publisher (Outbound)

```typescript
// src/adapters/outbound/events/rabbitmq-publisher.adapter.ts
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventPublisherPort } from '../../../domain/ports/outbound/event-publisher.port';

@Injectable()
export class RabbitMQPublisher implements EventPublisherPort {
  constructor(private readonly client: ClientProxy) {}

  async publish(eventName: string, payload: any): Promise<void> {
    await this.client.emit(eventName, payload).toPromise();
  }

  // Evento: Usuario creado
  async publishUserCreated(user: User): Promise<void> {
    await this.publish('identity.user.created', {
      userId: user.id,
      email: user.email.value,
      roles: user.roles.map(r => r.name),
      timestamp: new Date()
    });
  }

  // Evento: Rol asignado
  async publishRoleAssigned(userId: string, roleName: string): Promise<void> {
    await this.publish('identity.role.assigned', {
      userId,
      roleName,
      timestamp: new Date()
    });
  }
}
```

---

## 🔧 Configuración

### package.json (Dependencias principales)

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/microservices": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "amqplib": "^0.10.3",
    "redis": "^4.6.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1"
  }
}
```

### Dockerfile

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

---

## 🚀 Ejecución

### Desarrollo

```bash
cd services/identity-service
npm install
npm run start:dev
```

### Producción (Docker)

```bash
docker build -t identity-service .
docker run -p 3001:3001 identity-service
```

---

## 📖 API Endpoints (Swagger)

Una vez iniciado: **http://localhost:3001/api-docs**

### Endpoints Disponibles:

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Login de usuario |
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/refresh` | Renovar token |
| GET | `/users` | Listar usuarios (Admin) |
| POST | `/users` | Crear usuario (Admin) |
| PATCH | `/users/:id/roles` | Asignar rol (Admin) |
| GET | `/roles` | Listar roles disponibles |

---

## 🧪 Pruebas

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:cov
```

---

## 📊 Eventos Publicados (RabbitMQ)

| Evento | Exchange | Routing Key | Payload |
|--------|----------|-------------|---------|
| User Created | `identity.events` | `identity.user.created` | `{ userId, email, roles }` |
| Role Assigned | `identity.events` | `identity.role.assigned` | `{ userId, roleName }` |
| User Deactivated | `identity.events` | `identity.user.deactivated` | `{ userId, reason }` |

---

## ✅ Checklist de Implementación

### Dominio
- [ ] User entity
- [ ] Role entity
- [ ] Permission entity
- [ ] Email value object
- [ ] RBAC rules

### Application
- [ ] LoginUseCase
- [ ] RegisterUseCase
- [ ] AssignRoleUseCase
- [ ] RevokePermissionUseCase

### Adapters Inbound
- [ ] AuthController
- [ ] UsersController
- [ ] RolesController
- [ ] Swagger configuration

### Adapters Outbound
- [ ] SupabaseUserRepository
- [ ] RabbitMQPublisher
- [ ] RedisCache

### Infrastructure
- [ ] Database config (Supabase)
- [ ] JWT config
- [ ] RabbitMQ config
- [ ] Redis config

### Testing
- [ ] Unit tests (domain + application)
- [ ] Integration tests (adapters)
- [ ] E2E tests (API endpoints)

---

**Estado:** 🚧 En construcción  
**Próximo:** Generar código automáticamente con NestJS CLI
