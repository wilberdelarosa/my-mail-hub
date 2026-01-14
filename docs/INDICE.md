# 📚 Índice de Documentación - Sistema de Facturación ALITO GROUP

**Última actualización:** 14 de enero de 2026

---

## 📁 Estructura de Documentación

```
TESISFACTURACION/
├── README.md (este archivo)
├── docs/
│   ├── INDICE.md (índice de documentación)
│   ├── CONVENCIONES_EVENTOS.md
│   ├── RESUMEN_EJECUTIVO.md
│   ├── DOCUMENTACION_PROYECTO.md
│   └── fases/
│       ├── FASE1_100_COMPLETADA.md
│       ├── FASE2_IDENTITY_COMPLETADA.md
│       └── ...
├── scripts/
│   ├── start.ps1
│   ├── stop.ps1
│   ├── health-check.ps1
│   └── configure-rabbitmq.ps1
└── sistema_facturacion/
    └── services/
        └── identity-service/
            ├── ARCHITECTURE.md
            └── README.md
```

---

## 🚀 Quick Start

### 1. Iniciar Todo
```powershell
.\scripts\start.ps1
```

### 2. Verificar Salud
```powershell
.\scripts\health-check.ps1
```

### 3. Detener Todo
```powershell
.\scripts\stop.ps1
```

---

## 📖 Documentación por Categoría

### 🏗️ Arquitectura

| Documento | Descripción | Ubicación |
|-----------|-------------|-----------|
| **README Principal** | Guía de inicio rápido | `/README.md` |
| **Resumen Ejecutivo** | Overview del proyecto completo | `/docs/RESUMEN_EJECUTIVO.md` |
| **Architecture (Identity)** | Arquitectura hexagonal del servicio | `/sistema_facturacion/services/identity-service/ARCHITECTURE.md` |

### 📋 Progreso y Fases

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| **Fase 1 - Infraestructura** | 23 tareas completadas | ✅ `/docs/fases/FASE1_100_COMPLETADA.md` |
| **Fase 2 - Identity Service** | 11 tareas completadas | ✅ `/docs/fases/FASE2_IDENTITY_COMPLETADA.md` |

### 🔔 Convenciones y Estándares

| Documento | Descripción | Ubicación |
|-----------|-------------|-----------|
| **Convenciones de Eventos** | Patrones de eventos RabbitMQ | `/docs/CONVENCIONES_EVENTOS.md` |
| **Plan de Implementación** | Plan maestro (1,463 líneas) | `/.gemini/.../implementation_plan.md` |
| **Lista de Tareas** | 290 tareas en 24 fases | `/.gemini/.../task.md` |

### 🔧 Scripts y Automatización

| Script | Descripción | Uso |
|--------|-------------|-----|
| `start.ps1` | Inicia Supabase + Docker Compose | `.\scripts\start.ps1` |
| `stop.ps1` | Detiene todos los servicios | `.\scripts\stop.ps1` |
| `health-check.ps1` | Verifica salud de servicios | `.\scripts\health-check.ps1` |
| `configure-rabbitmq.ps1` | Configura exchanges/queues | `.\scripts\configure-rabbitmq.ps1` |

### 🎯 Microservicios

| Servicio | Documentación | Estado |
|----------|---------------|--------|
| **Identity & Access** | `/sistema_facturacion/services/identity-service/README.md` | ✅ Completado |
| **Master Data** | Pendiente | 🔵 No iniciado |
| **Quotation** | Pendiente | 🔵 No iniciado |
| **Billing** | Pendiente | 🔵 No iniciado |

---

## 📊 Estado del Proyecto

### Fases Completadas: 2/24 (8%)

- ✅ **Fase 1:** Infraestructura Base (100%)
- ✅ **Fase 2:** Identity & Access Service (100%)
- 🔵 **Fase 3-24:** Pendientes

### Servicios Operacionales: 11/11

- ✅ Supabase (PostgreSQL + PostgREST + Auth + Storage + Realtime)
- ✅ RabbitMQ (Event Bus)
- ✅ Redis (Cache)
- ✅ Kong (API Gateway)
- ✅ Prometheus + Grafana + Jaeger (Observabilidad)

---

## 🌐 URLs de Servicios

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Supabase Studio | http://127.0.0.1:54323 | - |
| PostgREST API | http://localhost:54321/rest/v1 | Ver `supabase status` |
| RabbitMQ Management | http://localhost:15672 | alito / alito_dev_2026 |
| Grafana | http://localhost:3001 | admin / admin |
| Prometheus | http://localhost:9090 | - |
| Jaeger | http://localhost:17686 | - |
| Kong Proxy | http://localhost:8000 | - |

---

## 🔍 Búsqueda Rápida

### ¿Cómo...?

**...iniciar el proyecto?**  
→ Ver [README.md](/README.md) sección "Inicio Rápido"

**...entender la arquitectura?**  
→ Ver `/docs/RESUMEN_EJECUTIVO.md` y `/sistema_facturacion/services/identity-service/ARCHITECTURE.md`

**...crear un nuevo evento?**  
→ Ver `/docs/CONVENCIONES_EVENTOS.md`

**...ver el progreso?**  
→ Ver `/docs/fases/FASE1_100_COMPLETADA.md` y `FASE2_IDENTITY_COMPLETADA.md`

**...ejecutar un microservicio?**  
→ Ver README del servicio, ej: `/sistema_facturacion/services/identity-service/README.md`

**...ver las tareas pendientes?**  
→ Ver `/.gemini/.../task.md` (interno)

---

## 📞 Soporte

Para preguntas sobre:
- **Arquitectura:** Ver `ARCHITECTURE.md` de cada servicio
- **Eventos:** Ver `CONVENCIONES_EVENTOS.md`
- **Infraestructura:** Ver `FASE1_100_COMPLETADA.md`
- **Troubleshooting:** Ver README principal

---

**Proyecto:** Sistema de Facturación Cloud - ALITO GROUP SRL  
**Arquitectura:** Microservicios con Hexagonal  
**e-NCF:** Cumplimiento DGII República Dominicana
