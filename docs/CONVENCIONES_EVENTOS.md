# Convención de Eventos - Sistema de Facturación ALITO GROUP

**Fecha:** 14 de enero de 2026  
**Versión:** 1.0

---

## 🎯 Patrón de Eventos

Usamos **Event-Driven Architecture** con RabbitMQ como Event Bus.

### Formato de Nombres de Eventos

```
<servicio>.<entidad>.<acción>
```

**Ejemplos:**
- `identity.user.created`
- `quotation.quote.approved`
- `billing.invoice.issued`
- `ar.payment.received`

---

## 📋 Exchanges y Queues

### Exchanges (tipo: **topic**)

| Exchange | Descripción | Routing Key Pattern |
|----------|-------------|---------------------|
| `identity.events` | Eventos de autenticación y usuarios | `identity.#` |
| `quotation.events` | Eventos de cotizaciones | `quotation.#` |
| `billing.events` | Eventos de facturación | `billing.#` |
| `ar.events` | Eventos de cuentas por cobrar | `ar.#` |
| `notification.events` | Eventos de notificaciones | `notification.#` |

### Queues

| Queue | Consume de | Purpose |
|-------|------------|---------|
| `identity_events` | `identity.events` | Audit log + sincronización |
| `quotation_events` | `quotation.events` | Procesamiento de cotizaciones |
| `billing_events` | `billing.events` | Procesamiento de facturas |
| `notification_events` | `*.#` | Envío de emails/SMS/WhatsApp |

---

## 📦 Estructura de Payload

Todos los eventos deben seguir esta estructura:

```json
{
  "eventId": "uuid-v4",
  "eventName": "servicio.entidad.accion",
  "timestamp": "2026-01-14T10:30:00Z",
  "source": "service-name",
  "data": {
    // Payload específico del evento
  },
  "metadata": {
    "userId": "uuid",
    "correlationId": "uuid",
    "version": "1.0"
  }
}
```

---

## 🔐 Eventos del Servicio Identity

### identity.user.created

**Descripción:** Usuario creado en el sistema

**Payload:**
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventName": "identity.user.created",
  "timestamp": "2026-01-14T10:30:00Z",
  "source": "identity-service",
  "data": {
    "userId": "uuid",
    "email": "usuario@alitogroup.com",
    "name": "Juan Pérez",
    "roles": ["operator"]
  },
  "metadata": {
    "userId": "admin-uuid",
    "correlationId": "request-uuid",
    "version": "1.0"
  }
}
```

**Consumidores:**
- Audit Service (log)
- Notification Service (email de bienvenida)

---

### identity.role.assigned

**Descripción:** Rol asignado a usuario

**Payload:**
```json
{
  "eventId": "uuid",
  "eventName": "identity.role.assigned",
  "timestamp": "2026-01-14T10:30:00Z",
  "source": "identity-service",
  "data": {
    "userId": "uuid",
    "roleName": "admin",
    "assignedBy": "admin-user-uuid"
  },
  "metadata": {
    "userId": "admin-uuid",
    "correlationId": "request-uuid",
    "version": "1.0"
  }
}
```

---

### identity.user.deactivated

**Descripción:** Usuario desactivado

**Payload:**
```json
{
  "eventId": "uuid",
  "eventName": "identity.user.deactivated",
  "timestamp": "2026-01-14T10:30:00Z",
  "source": "identity-service",
  "data": {
    "userId": "uuid",
    "reason": "User requested account deletion",
    "deactivatedBy": "admin-uuid"
  },
  "metadata": {
    "userId": "admin-uuid",
    "correlationId": "request-uuid",
    "version": "1.0"
  }
}
```

---

## 📝 Eventos del Servicio Quotation

### quotation.quote.created

```json
{
  "eventName": "quotation.quote.created",
  "data": {
    "quoteId": "uuid",
    "customerId": "uuid",
    "totalAmount": 15000.00,
    "status": "draft",
    "createdBy": "operator-uuid"
  }
}
```

### quotation.quote.approved

```json
{
  "eventName": "quotation.quote.approved",
  "data": {
    "quoteId": "uuid",
    "approvedBy": "admin-uuid",
    "approvalDate": "2026-01-14T10:30:00Z"
  }
}
```

---

## 💰 Eventos del Servicio Billing

### billing.invoice.issued

```json
{
  "eventName": "billing.invoice.issued",
  "data": {
    "invoiceId": "uuid",
    "encf": "E310000000001",
    "customerId": "uuid",
    "totalAmount": 15000.00,
    "dgiiStatus": "approved",
    "issuedBy": "billing-operator-uuid"
  }
}
```

### billing.invoice.cancelled

```json
{
  "eventName": "billing.invoice.cancelled",
  "data": {
    "invoiceId": "uuid",
    "encf": "E310000000001",
    "reason": "Client requested cancellation",
    "notaCreditoEncf": "E340000000001"
  }
}
```

---

## 🔔 Routing Keys - Ejemplos

### Publicación

```typescript
// Identity Service
eventPublisher.publish('identity.user.created', payload);

// Quotation Service
eventPublisher.publish('quotation.quote.approved', payload);

// Billing Service
eventPublisher.publish('billing.invoice.issued', payload);
```

### Consumo con Filtros

```typescript
// Escuchar TODOS los eventos de identity
channel.consume('identity_events', callback, {
  routingKey: 'identity.#'
});

// Escuchar SOLO eventos de creación
channel.consume('audit_log', callback, {
  routingKey: '*.*.created'
});

// Escuchar eventos de facturación e-NCF
channel.consume('dgii_monitor', callback, {
  routingKey: 'billing.invoice.*'
});
```

---

## ⚡ Dead Letter Queue (DLQ)

Si un mensaje falla después de 3 reintentos, se mueve a DLQ:

```
identity_events_dlq
quotation_events_dlq
billing_events_dlq
```

**Configuración:**
- Max retries: 3
- Backoff: exponencial (1s, 2s, 4s)
- TTL en DLQ: 7 días

---

## 📊 Monitoreo de Eventos

### Métricas en Prometheus

- `rabbitmq_queue_messages_total{queue="identity_events"}`
- `rabbitmq_queue_messages_unacked_total`
- `rabbitmq_queue_consumers_total`

### Alertas

- Queue con más de 1000 mensajes pendientes
- Queue sin consumidores activos
- Mensajes en DLQ

---

## 🧪 Testing de Eventos

### Publicar evento manual (RabbitMQ Management UI)

1. Ir a http://localhost:15672
2. Login: alito / alito_dev_2026
3. Exchanges → identity.events → Publish message
4. Routing key: `identity.user.created`
5. Payload: JSON del evento

### Verificar consumo

1. Queues → identity_events
2. Ver "Get messages"
3. Verificar payload recibido

---

## ✅ Checklist para Nuevo Evento

- [ ] Nombrar según convención: `servicio.entidad.accion`
- [ ] Incluir `eventId`, `eventName`, `timestamp`
- [ ] Incluir `source` (nombre del servicio)
- [ ] Payload en `data`
- [ ] Metadata con `userId`, `correlationId`
- [ ] Documentar en este archivo
- [ ] Configurar dead letter queue
- [ ] Agregar métricas
- [ ] Escribir tests

---

**Última actualización:** 14-Ene-2026  
**Mantenido por:** Equipo de Desarrollo ALITO GROUP
