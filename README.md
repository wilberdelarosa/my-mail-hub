# Sistema de Facturación Cloud - ALITO GROUP SRL

Sistema de facturación con IA basado en arquitectura de microservicios con soporte para **e-NCF (Comprobantes Fiscales Electrónicos)** según normativas DGII República Dominicana.

---

## 🚀 Inicio Rápido

### Requisitos Previos

- ✅ **Node.js** 22.x  
- ✅ **Docker Desktop** (corriendo)  
- ✅ **Supabase CLI** 2.67.1+  

### Iniciar Todo (1 comando)

```powershell
.\start.ps1
```

Esto iniciará automáticamente:
- Supabase (PostgreSQL + PostgREST + Auth + Storage)
- RabbitMQ (Event Bus)
- Redis (Cache)
- Kong (API Gateway)
- Prometheus + Grafana + Jaeger (Observabilidad)

### Verificar Salud

```powershell
.\health-check.ps1
```

### Detener Todo

```powershell
.\stop.ps1
```

---

## 📁 Estructura del Proyecto

```
TESISFACTURACION/
├── sistema_facturacion/         # 🎯 PROYECTO EJECUTABLE
│   ├── infrastructure/          # Configuración de infraestructura
│   │   ├── api-gateway/         # Kong
│   │   └── observability/       # Prometheus, Grafana
│   ├── services/                # Microservicios (próximamente)
│   ├── frontend/                # Frontend (próximamente)
│   ├── docker-compose.yml       # Servicios complementarios
│   ├── .env.example             # Template de configuración
│   └── README.md                # Docs del proyecto
│
├── supabase/                    # ⚙️ Supab ase Local
│   ├── config.toml              # Configuración Supabase
│   └── migrations/              # Migraciones de BD (próximamente)
│
├── start.ps1                    # ✅ Script de inicio
├── stop.ps1                     # ⏹️  Script de parada
├── health-check.ps1             # 🏥 Verificación de salud
│
└── archivos_no_proyecto/        # 📚 Documentación académica
```

---

## 📊 URLs de Servicios

Una vez iniciado con `.\start.ps1`:

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Supabase Studio | http://localhost:54323 | - |
| PostgREST API | http://localhost:54321/rest/v1 | anon key (ver Supabase Studio) |
| PostgreSQL | postgresql://postgres:postgres@localhost:54322/postgres | postgres/postgres |
| Kong Proxy | http://localhost:8000 | - |
| Kong Admin | http://localhost:8001 | - |
| RabbitMQ | http://localhost:15672 | alito/alito_dev_2026 |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3001 | admin/admin |
| Jaeger | http://localhost:16686 | - |

---

## 🔧 Comandos Útiles

### Supabase

```bash
# Ver estado
supabase status

# Crear migración
supabase migration new nombre_migracion

# Aplicar migraciones
supabase db reset

# Ver logs
supabase logs -f
```

### Docker Compose

```bash
cd sistema_facturacion

# Ver logs
docker-compose logs -f

# Ver solo RabbitMQ
docker-compose logs -f rabbitmq

# Reiniciar un servicio
docker-compose restart kong
```

---

## 📚 Documentación Completa

- **Plan de Implementación**: `.gemini/brain/.../implementation_plan.md`
- **Lista de Tareas**: `.gemini/brain/.../task.md`
- **Endpoints de Ingesta**: `.gemini/brain/.../endpoints_ingesta_cotizaciones.md`
- **Seguimiento del Proyecto**: `.gemini/brain/.../proyecto_seguimiento.md`

---

## ✅ Checklist de Instalación

- [ ] Instalar Node.js 22.x
- [ ] Instalar Docker Desktop
- [ ] Instalar Supabase CLI
- [ ] Clonar repositorio
- [ ] Copiar `.env.example` a `.env` en `sistema_facturacion/`
- [ ] Ejecutar `.\start.ps1`
- [ ] Verificar con `.\health-check.ps1`
- [ ] Abrir Supabase Studio (http://localhost:54323)

---

## 🎯 Estado del Proyecto

**Fase Actual:** Fase 1 - Infraestructura Base (35% completado)

**Próximos Pasos:**
1. Crear primera migración de BD (schema customers)
2. Implementar microservicio Identity & Access
3. Integrar Supabase Auth con Kong

---

## 🛠️ Solución de Problemas

### Docker no inicia

```powershell
# Verificar que Docker Desktop esté corriendo
docker ps
```

### Supabase no inicia

```powershell
# Verificar versión
supabase --version

# Reiniciar
supabase stop
supabase start
```

### Puerto ya en uso

```powershell
# Ver qué usa el puerto 54321
netstat -ano | findstr :54321

# Detener todo y reiniciar
.\stop.ps1
.\start.ps1
```

---

**Desarrollado por:** Equipo de Desarrollo - ALITO GROUP SRL  
**Última actualización:** 14 de enero de 2026  
**Versión:** 0.1.0-alpha (Fase 1 en progreso)
