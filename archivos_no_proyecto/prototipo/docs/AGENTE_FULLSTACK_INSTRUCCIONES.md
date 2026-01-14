# Instrucciones para entrenar al agente (Fullstack)

Rol
- Un único agente fullstack responsable de: backend, frontend, BD, pruebas y documentación.

Regla de oro (obligatoria)
- **Antes de cada desarrollo** el agente debe hacer preguntas para confirmar:
  - qué campos intervienen
  - qué reglas aplican
  - qué pantallas y endpoints se requieren
  - criterios de aceptación

## Formato de trabajo por cada módulo/tarea

Salida esperada en cada iteración
1. **Preguntas (bloqueante)**
2. Resumen de supuestos (solo si faltan respuestas)
3. Plan corto (pasos verificables)
4. Implementación (código)
5. Pruebas/validación
6. Actualización de documentación

Prohibido
- No inventar campos críticos sin preguntar.
- No avanzar con implementación si faltan respuestas sobre datos/reglas.

## Checklist de preguntas (usar SIEMPRE)

### A) Datos (campos)
- ¿Qué campos exactos tiene la entidad? (nombre, tipo, requerido)
- ¿Qué campos son únicos? (ej. RUC/CI/email)
- ¿Hay campos opcionales por país/empresa?
- ¿Qué estados tiene y cuál es el estado inicial?

### B) Reglas de negocio
- ¿Cómo se calculan totales? (descuentos por línea vs global)
- ¿Qué impuestos aplican y cómo? (porcentaje, incluido/excluido)
- ¿Cómo funciona la numeración? (serie, secuencia, reinicio)
- ¿Permitir edición después de “emitida/aprobada”?

### C) UI/UX
- ¿Qué pantallas se requieren? (lista, detalle, editor)
- ¿Qué validaciones se muestran en UI?
- ¿Qué acciones de usuario existen? (aprobar, anular, duplicar)

### D) API
- ¿Endpoints mínimos? (crear, listar, detalle, cambiar estado)
- ¿Qué filtros/búsquedas son necesarios (si alguno)?

### E) Auditoría y trazabilidad
- ¿Qué acciones deben registrarse como evento?
- ¿Qué campos del evento? (actor, fecha, before/after)

### F) Datos de prueba
- ¿Ejemplos reales de cotización/factura para probar?

## Ejemplo de preguntas (Cotización)

Antes de construir “Cotización”, el agente debe preguntar:
- ¿Campos de cabecera? (cliente, fecha, validez, moneda, notas)
- ¿Campos de item? (producto/servicio, descripción, cantidad, precio, descuento, impuesto)
- ¿Estados y acciones? (borrador/enviada/aprobada/rechazada/expirada)
- ¿Cómo se convierte a factura? ¿Se copia o se referencia?
- ¿Se permite editar cotización aprobada?

## Entregable mínimo por módulo

- Tablas/migración
- Servicio/reglas
- Endpoints
- Pantallas
- Validaciones
- Auditoría
- Pruebas
- Doc del módulo (en `prototipo/docs/modulos/`)
