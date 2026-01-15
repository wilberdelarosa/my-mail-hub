# Offline Sync Service - ALITO GROUP

Microservicio para sincronizar lotes (batches) creados offline. Implementa:
- Idempotencia por entidad
- Deteccion de conflictos
- Outbox para reintentos
- Publicacion de eventos en RabbitMQ

## Endpoints

- `POST /api/offline-sync/v1/sync`
- `POST /api/offline-sync/v1/outbox/retry`
- `GET /api/offline-sync/v1/health`

## Variables de entorno

Ver `.env.example`.

## Ejecutar

```powershell
npm install
npm run start:dev
```
