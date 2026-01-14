#!/usr/bin/env bash
# setup_rabbitmq.sh
# Crea exchanges, queues y bindings necesarios para el proyecto.
# Ejecutar cuando RabbitMQ esté corriendo (management plugin disponible).

# Variables
RABBIT_HOST=${RABBIT_HOST:-localhost}
RABBIT_PORT=${RABBIT_PORT:-15672}
RABBIT_USER=${RABBIT_USER:-guest}
RABBIT_PASS=${RABBIT_PASS:-guest}

# Ejemplos de exchanges y queues
# event.exchange: tipo topic para eventos de dominio
# queues: quotation.events, proforma.events, billing.events, audit.events

echo "Creando recursos en RabbitMQ (no destructivo)." 

# Crear exchanges
curl -u $RABBIT_USER:$RABBIT_PASS -H "Content-Type: application/json" -XPUT \
  http://$RABBIT_HOST:$RABBIT_PORT/api/exchanges/%2f/event.exchange -d '{"type":"topic","durable":true}'

# Crear queues
for q in quotation.events proforma.events billing.events audit.events; do
  curl -u $RABBIT_USER:$RABBIT_PASS -H "Content-Type: application/json" -XPUT \
    http://$RABBIT_HOST:$RABBIT_PORT/api/queues/%2f/$q -d '{"durable":true}'
done

# Bind queues to exchange with routing keys
curl -u $RABBIT_USER:$RABBIT_PASS -H "Content-Type: application/json" -XPOST \
  http://$RABBIT_HOST:$RABBIT_PORT/api/bindings/%2f/e/event.exchange/q/quotation.events -d '{"routing_key":"quotation.#"}'

curl -u $RABBIT_USER:$RABBIT_PASS -H "Content-Type: application/json" -XPOST \
  http://$RABBIT_HOST:$RABBIT_PORT/api/bindings/%2f/e/event.exchange/q/proforma.events -d '{"routing_key":"proforma.#"}'

curl -u $RABBIT_USER:$RABBIT_PASS -H "Content-Type: application/json" -XPOST \
  http://$RABBIT_HOST:$RABBIT_PORT/api/bindings/%2f/e/event.exchange/q/billing.events -d '{"routing_key":"billing.#"}'

curl -u $RABBIT_USER:$RABBIT_PASS -H "Content-Type: application/json" -XPOST \
  http://$RABBIT_HOST:$RABBIT_PASS -H "Content-Type: application/json" -XPOST \
  http://$RABBIT_HOST:$RABBIT_PORT/api/bindings/%2f/e/event.exchange/q/audit.events -d '{"routing_key":"audit.#"}'

echo "Recursos creados (o ya existentes)." 
