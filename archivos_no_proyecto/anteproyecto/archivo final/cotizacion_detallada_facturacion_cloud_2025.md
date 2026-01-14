# Cotización detallada (2025) — Sistema de facturación cloud con automatización (NCF/ITBIS), BI e IA (ALITO GROUP SRL)

**Documento:** Cotización técnica‑económica (referencial) basada en el alcance del anteproyecto.

**Objetivo del sistema:** Centralizar y automatizar cotizaciones, proformas, facturas, control de NCF e ITBIS, cuentas por cobrar/estado de cuenta, trazabilidad (audit trail), y analítica (BI) con soporte de automatización/IA en nivel MVP.

---

## 0) Cómo leer esta cotización

- **Costo directo (cash)** = gastos reales de bolsillo para ejecutar el piloto (infraestructura/servicios, dominio, etc.).
- **Costo equivalente (aporte en especie)** = valor de mercado de las horas de ingeniería aportadas por los tesistas (Wilber y Jesús). Se incluye para dimensionar el costo “si se contratara”.
- **OPEX** = costo mensual de operación (infraestructura cloud + licencias + monitoreo).
- Se presentan **3 escenarios** para escoger lo **más factible y económico** sin sacrificar seguridad mínima.

### Modalidad de ejecución (proyecto de grado)

Esta cotización asume que **el diseño y desarrollo** del MVP lo realizan **Wilber Alfredo De La Rosa Marte** y **Jesús Andrés Acevedo Carrasco** como parte del proyecto de grado. Por ello:

- El **costo directo** se centra en infraestructura, herramientas y logística.
- El “CAPEX” se presenta como **aporte en especie** (horas de trabajo), y solo como referencia se calcula su **equivalente** a tarifas de mercado.

---

## 1) Alcance funcional (MVP Piloto)

Incluido:
- Gestión de usuarios con roles/permisos.
- Catálogo: clientes, servicios/equipos, tarifas/itinerarios básicos.
- Documentos: cotización, proforma, factura, nota de crédito (si aplica).
- **NCF**: control de secuencia, asignación, validaciones básicas por tipo.
- **ITBIS**: cálculo, redondeos, totales y validaciones.
- Estados de cuenta: saldos, antigüedad simple, historial por cliente.
- Exportación PDF de documentos.
- Bitácora/auditoría: quién hizo qué y cuándo.
- BI: 5–8 KPI y 2–3 dashboards (facturación por periodo, cuentas por cobrar, morosidad simple, top clientes, etc.).
- “IA” nivel MVP (económico):
  - Reglas + alertas de inconsistencias (NCF/ITBIS/duplicados/valores atípicos).
  - (Opcional) asistente de consulta/reportes con LLM por API, con límites de uso.

No incluido (cotizable aparte):
- Facturación electrónica DGII (e‑CF) con certificación/firma digital.
- Integración con contabilidad/ERP/pasarela de pago (salvo requerimiento explícito).
- App móvil nativa.
- Multi‑empresa/multi‑tenant (SaaS).

---

## 2) Escenarios recomendados (más económico → más robusto)

### Escenario 1 — “Ultra‑económico” (VPS único) — Recomendado para piloto

**Idea:** 1 servidor VPS con Docker: API + Web + PostgreSQL + backups + Metabase (BI) + proxy (Caddy/Nginx).

**Stack económico sugerido (open-source):**
- Backend: **FastAPI** (Python) o **NestJS** (Node) (uno).
- DB: **PostgreSQL**.
- BI: **Metabase** (alternativa económica a Power BI, sin licencias por usuario).
- Automatización/Workflows: **n8n self‑host** (opcional).
- PDFs: motor de plantillas + render (wkhtmltopdf/Playwright/WeasyPrint según stack).
- Auth: JWT + RBAC; o Keycloak si se justifica (sube costo).

**OPEX mensual estimado (USD):**
- VPS (2–4 vCPU / 4–8GB RAM): **$25–$90**
- Backups externos (storage): **$5–$20**
- Dominio + SSL: **$1–$15** (SSL gratis; dominio anual prorrateado)
- Email transaccional (si se envían PDFs): **$0–$25**
- Monitoreo básico: **$0–$30**
- **Total OPEX (sin LLM): $31–$180/mes**
- LLM opcional (si se usa): **$10–$300/mes** (según uso)

**Pros:** mínimo costo mensual, rápido de implementar.

**Contras:** un solo servidor (punto único de fallo). Mitigable con backups y buenas prácticas.

---

### Escenario 2 — “Económico‑robusto” (servicios gestionados mínimos)

**Idea:** app en contenedores + **DB gestionada** (reduce riesgo) + storage gestionado.

**OPEX mensual estimado (USD):**
- App compute (contenedor/VM): **$30–$150**
- PostgreSQL gestionado: **$40–$250**
- Storage + backups: **$10–$50**
- Monitoreo: **$10–$80**
- **Total OPEX: $90–$530/mes** (+ LLM si aplica)

**Pros:** reduce riesgo de perder datos, más estable.

**Contras:** sube el costo mensual.

---

### Escenario 3 — “Producción formal” (alta disponibilidad)

HA (2+ instancias), balanceador, DB gestionada con réplica, observabilidad completa.

**OPEX mensual (USD):** **$450–$2,500/mes** (depende de HA, retención de logs, BI, tráfico).

---

## 3) Desglose por fases, entregables y horas (MVP Piloto)

**Duración objetivo:** 10–14 semanas (piloto funcional con capacitación).

| Fase | Entregables | Horas |
|---|---|---:|
| 1. Descubrimiento | workshops, backlog, definición reglas NCF/ITBIS, criterios de aceptación | 120–200 |
| 2. Diseño | arquitectura (hexagonal/clean en monolito modular), modelo de dominio, OpenAPI, diseño de datos | 120–200 |
| 3. UX/UI | flujos, pantallas, prototipo y validación | 100–180 |
| 4. Desarrollo núcleo | auth/RBAC, clientes, catálogo, cotización/proforma/factura, PDF | 650–950 |
| 5. Fiscal y controles | NCF (secuencias/validaciones), ITBIS, auditoría/bitácora | 220–380 |
| 6. CxC / estados de cuenta | saldos, antigüedad simple, reportes operativos | 160–260 |
| 7. BI | KPIs + dashboards (Metabase o Power BI) + dataset/vistas | 140–240 |
| 8. IA (económica) | reglas + alertas + detección simple de anomalías (y LLM opcional) | 80–200 |
| 9. QA | plan de pruebas, casos, regresión, UAT | 200–340 |
| 10. DevOps | CI/CD básico, despliegue, backups, hardening mínimo | 140–240 |
| 11. Documentación/capacitación | manuales, handover, 1–2 sesiones | 60–120 |
| **Total** |  | **1,850–3,310** |

> Nota: Este rango es más “económico” que el anterior porque reduce complejidad (BI open‑source, IA mínima, sin HA, sin e‑CF DGII).

---

## 4) Equipo mínimo (para ser eficiente)

## 4) Equipo ejecutor (tesistas)

**Equipo (2 personas):**
- **Wilber** (Tech Lead/Arquitectura + Backend + DevOps): diseño de arquitectura, dominio, API, reglas NCF/ITBIS, despliegue, CI/CD y hardening.
- **Jesús** (Frontend + QA + BI): UI web, flujos/pantallas, pruebas funcionales/UAT, tableros BI y documentación de uso.

> Nota: En semanas críticas (pruebas/piloto), ambos apoyan QA, soporte de usuario y correcciones.

---

## 5) Presupuesto adaptado a tesistas (2025)

### 5.1 Costo directo (cash) — lo más económico y factible para el piloto

Supuesto: ejecución del MVP en **10–14 semanas** y operación del piloto por **3 meses**.

**Escenario recomendado (piloto económico):** VPS único + Metabase + IA mínima (sin LLM al inicio).

| Concepto (piloto) | Estimación |
|---|---:|
| Infra/OPEX (Escenario 1) | USD **$31–$180 / mes** |
| OPEX 3 meses | USD **$93–$540** |
| Dominio anual (prorrateable) | USD **$10–$25 / año** |
| Backups/almacenamiento adicional | incluido en OPEX (o +USD **$5–$20/mes**) |
| Correo transaccional (si se envían PDFs) | USD **$0–$25/mes** |
| LLM (opcional) | USD **$0** (recomendado al inicio) o USD **$10–$300/mes** |

**Rango de costo directo típico del piloto (sin LLM):**
- **USD $120 – $900** (3 meses, según tamaño del VPS y extras)

> Este es el costo que normalmente sí se paga “de bolsillo” cuando los desarrolladores son los tesistas.

### 5.2 Aporte en especie (valor de mercado) — referencia “si se contratara”

Horas estimadas del MVP (según desglose): **1,850–3,310 horas** (sumadas entre ambos tesistas).

| Referencia | Tarifa | Equivalente (USD) |
|---|---:|---:|
| Mercado RD (económico) | USD **$30–$45/h** | **$55,500 – $148,950** |
| 1er mundo (equipo equivalente) | USD **$120–$165/h** | **$222,000 – $546,150** |

### 5.3 Conversión a RD$

- **RD$ = USD × tasa del día** (usar tasa oficial al presentar).

---

## 6) Licencias y herramientas (lo más factible/económico)

Recomendación “low-cost”:
- BI: **Metabase self-host** (costo $0 licencias; solo infra).
- Automatización: **n8n self-host** (costo $0 licencias; solo infra).
- LLM: empezar **sin LLM**; si se requiere, activar por API con límites y auditoría.

Alternativa “corporativa”:
- BI: **Power BI Pro** por usuario/mes.

---

## 7) Operación y mantenimiento (post‑pilotaje)

Como proyecto de grado, el mantenimiento puede manejarse en dos modalidades:
- **Sin costo de mano de obra (tesistas):** solo se paga OPEX mensual.
- **Con retainer (si la empresa formaliza operación):** 10–20 horas/mes o 15%–25% anual del valor equivalente (según criticidad).

---

## 8) Plan de dedicación y hitos (proyecto de grado)

Para completar el MVP en 10–14 semanas, se recomienda una dedicación aproximada de:
- **Wilber:** 15–25 horas/semana
- **Jesús:** 15–25 horas/semana

Hitos propuestos:
- Semana 1–2: levantamiento + backlog + reglas NCF/ITBIS
- Semana 3–4: arquitectura + modelo de datos + UI base
- Semana 5–8: módulos core (documentos, PDF, auditoría)
- Semana 9–10: CxC + BI
- Semana 11–12: QA + piloto + ajustes

> Si la empresa decide contratar el desarrollo fuera del proyecto de grado, se puede usar un esquema de pagos por hitos basado en el valor equivalente.

---

## 9) Add‑ons (si el cliente lo pide)

- Integración DGII e‑CF + firma digital (proyecto aparte)
- Integración contabilidad/ERP
- HA / DR formal
- Data warehouse + gobierno de datos
- IA avanzada (modelos propios, MLOps)

---

## 10) Recomendación final (lo más económico y viable)

Para ALITO y una tesis con piloto real, el mejor balance costo/valor es:
- **Escenario 1 (VPS único)** + **Metabase** + **IA mínima (reglas/alertas)**.
- Migrar a Escenario 2/3 solo si el piloto demuestra adopción y se decide operación formal.
