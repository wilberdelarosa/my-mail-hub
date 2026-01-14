# RabbitMQ setup

Ejecuta `setup_rabbitmq.sh` cuando RabbitMQ Management esté disponible (por ejemplo http://localhost:15672).

Ejemplo:

```bash
# desde WSL o Git Bash
bash infrastructure/rabbitmq/setup_rabbitmq.sh

# o con variables
RABBIT_USER=guest RABBIT_PASS=guest bash infrastructure/rabbitmq/setup_rabbitmq.sh
```

Notas:
- El script usa la API HTTP del management plugin.
- No destruye recursos: crea exchanges y queues (idempotente).
- Revisa `infrastructure/docker-compose.yml` para credenciales y puertos.
