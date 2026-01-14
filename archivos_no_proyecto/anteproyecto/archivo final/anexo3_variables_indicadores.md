# Anexo 3 — Tabla extendida de Variables e Indicadores

Este anexo contiene la versión extensa y desglosada de la tabla de **Variables e Indicadores** del anteproyecto, conforme a la guía UCE (sección 1.5). Incluye: tipo de variable, definición operativa, dimensiones, indicadores medibles, fuente/técnica de medición y metas sugeridas. Copiar y pegar en Word (Arial 12, interlineado 1.5) o convertir a `.docx` según se requiera.

> Nota: Se recomienda dejar en el Capítulo 1 una versión resumida (2–3 indicadores clave por variable) y conservar esta tabla completa en los anexos.

---

| Tipo de variable | Variable | Definición operativa | Dimensiones | Indicadores (unidad / cómo se mide) | Fuente / Técnica de medición | Meta sugerida |
|---|---|---|---|---|---|---|
| Independiente | Implementación y operación del sistema de facturación cloud‑native con IA y BI | Grado en que el sistema está diseñado, desarrollado y puesto en operación con módulos funcionales (cotizaciones, proformas, facturación, NCF), validaciones automáticas y paneles analíticos. | Existencia operativa; Cobertura funcional; Integración/API; Automatización/validaciones; Capacidad analítica (BI) | - Sistema operando (Sí/No; verificación despliegue).  
- % de módulos funcionales desarrollados e integrados (0–100; matriz de requisitos).  
- Nº de endpoints API documentados (conteo; OpenAPI).  
- % de validaciones críticas automatizadas (NCF/ITBIS) (0–100; logs).  
- Nº de tableros/KPI en BI (conteo). | Repositorio, CI/CD, documentación OpenAPI, logs de API, tablero BI, informe de despliegue. | Sistema operativo: Sí; % módulos ≥ 85%; % validaciones críticas ≥ 80%; Nº KPI ≥ 5 |
| Dependiente | Tiempo de respuesta operativo (cotización → proforma → factura) | Tiempo transcurrido desde la solicitud hasta la aprobación/entrega del documento (cotización/proforma/factura). | Solicitud→aprobación; Emisión; Respuesta a consultas | - Tiempo promedio “solicitud → aprobación” en cotizaciones (horas; cronometría / timestamps).  
- Tiempo promedio emisión de proforma (minutos).  
- Tiempo promedio emisión de factura (minutos).  
- Tiempo promedio respuesta a consultas (horas). | Cronometraje, timestamps del sistema, logs transaccionales, observación directa. | Reducción tiempo emisión factura ≥ 60% vs línea base; solicitud→aprobación cotizaciones ≤ 24–48 h |
| Dependiente | Reducción de errores en comprobantes fiscales (Exactitud fiscal) | Disminución de errores en numeración de NCF, cálculo de ITBIS y correcciones fiscales posteriores. | Errores NCF; Errores ITBIS; Correcciones/rectificaciones | - % de errores NCF antes/después (porcentaje relativo; auditoría).  
- Nº de incidencias errores ITBIS (errores/mes).  
- % de facturas que requieren corrección posterior (0–100). | Auditoría documental, conciliaciones contables, registros de incidencias. | Errores NCF ↓ ≥ 80% vs línea base; % facturas sin corrección ≥ 95% |
| Dependiente | Trazabilidad y cumplimiento fiscal | Proporción de expedientes / transacciones con respaldo completo y conformes con normativa DGII. | Compleción de expediente; Audit trail; Conformidad normativa | - % de órdenes/facturas auditables con respaldo completo (0–100).  
- % de transacciones con trazabilidad completa (0–100; logs).  
- Nº de observaciones regulatorias detectadas (conteo/periodo). | Auditoría interna, logs, revisión documental. | % expedientes auditable ≥ 95%; % transacciones trazables ≥ 95% |
| Interviniente | Adopción y capacitación (factor humano) | Nivel de uso efectivo por usuarios clave y cumplimiento del plan de formación; factor que condiciona impacto. | Capacitación; Uso efectivo; Satisfacción; Apoyo directivo | - Existencia de plan de capacitación (Sí/No).  
- Nº de usuarios capacitados (conteo).  
- Horas de capacitación impartidas (hrs).  
- % de usuarios activos mensual (0–100; analítica uso).  
- Puntaje medio de satisfacción (escala 1–5).  
- Participación de gerentes en sesiones (%) | Registros de capacitación, analytics del sistema, encuestas, actas. | % usuarios activos ≥ 75% al mes 2; Puntaje satisfacción ≥ 4/5; Horas capacitación ≥ 8 por usuario clave |
| Interviniente | Condiciones tecnológicas e infraestructura | Disponibilidad de conectividad y equipo que permite operar el sistema cloud de forma estable. | Conectividad; Disponibilidad/uptime; Equipamiento | - Nivel de conectividad (Mbps / latencia ms).  
- Disponibilidad del servicio (uptime % mensual).  
- Nº de incidencias de conectividad/mes (conteo).  
- % de equipos con requisitos mínimos (0–100). | Monitoreo de red, reportes ISP, inventario TI. | Uptime ≥ 99%; Incidencias conectividad ≤ 2/mes; % equipos aptos ≥ 80% |
| Dependiente (impacto) | Impacto financiero operativo | Efecto sobre cobranza y costos operativos por mejoras en procesos. | Cobranza / flujo de caja; Costos operativos | - Días promedio de cobranza (DSO).  
- % facturas cobradas a tiempo (0–100).  
- Reducción de costos operativos por procesos administrativos (RD$ o %). | Registros financieros, conciliaciones, análisis de costos. | DSO reducción 20–30%; % facturas cobradas a tiempo ↑ 10–20%; Costos operativos ↓ 15% |
| Dependiente | Satisfacción del usuario y calidad del servicio | Percepción de usuarios internos/externos sobre rapidez, exactitud y soporte. | Rapidez; Calidad documental; Satisfacción | - Promedio encuestas internas sobre eficiencia (1–5).  
- % documentos entregados sin errores (0–100).  
- Tiempo promedio solicitud→entrega (horas/minutos). | Encuestas, registros de atención, logs. | Promedio encuestas ≥ 4/5; % documentos sin errores ≥ 98%; Tiempo solicitud→entrega < 24 h (mayoría) |

---

## Instrucciones de uso
- Pegar en Word con fuente Arial 12 y espaciado 1.5; si una celda resulta demasiado larga, usar saltos de línea o mover la tabla completa al anexo y dejar una versión resumida en el capítulo 1.
- Antes del piloto: medir línea base (tiempos y errores actuales) para comparar con métricas post‑implementación.
- Recomendación: incluir la tabla resumida en el Capítulo 1 y mantener este anexo (completo) como `Anexo 3`.

Si deseas, puedo crear también un archivo `.xlsx` con esta tabla (útil para mediciones) o convertir el anexo a `.docx` (requiere herramientas externas). Dime qué prefieres y lo creo.
