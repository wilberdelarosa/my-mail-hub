# Cotización desglosada y análisis por escenarios

Este documento corrige y presenta de forma clara la tabla de presupuesto original (`cotizacion.md`) separando las monedas en celdas distintas (RD$ / USD) y analizando 3 escenarios: Piloto económico, Económico-robusto y Producción formal. Tipo de cambio usado: **1 USD = RD$ 63**.

## Convenciones

- Todos los montos en RD$ aparecen en la columna `RD$`.
- Se incluye la conversión a USD en la columna `USD` usando la tasa indicada y redondeada a 2 decimales.
- **CAPEX (Desarrollo)**: en el caso de tesis se presenta como **aporte en especie (valor equivalente)** y, separadamente, el **costo directo (cash)** que debe pagar la empresa por infra/servicios.

---

## 1) Paquetes de desarrollo (valores originales)

|                            Paquete |  RD$        | $ |    $USD (RD$/63) |
| ---------------------------------: | ----------------: | -----------------: |
|                  Frontend completo |            85,000 |           1,349.21 |
|                        Backend API |            42,000 |             666.67 |
|           Base de datos (Supabase) |            12,000 |             190.48 |
|             Automatizaciones (n8n) |            12,000 |             190.48 |
|                  Integración DGII |             8,000 |             126.98 |
|            Testing + Capacitación |            23,000 |             365.08 |
| **Total desarrollo (valor)** | **182,000** | **2,888.89** |

Notas:

- Estos valores representan la estimación de horas/trabajo (en la cotización original). Para tesis, este total suele contabilizarse como **aporte en especie** (las horas que Jesús y Wilber aportan), y puede presentarse además el valor equivalente en RD$ y USD.

---

## 2) Infraestructura y licencias (costos anuales y mensuales)

|                        Concepto | Costo anual (RD$) | Costo mensual (RD$) |       USD anual |        USD mensual |                  |
| ------------------------------: | ----------------------------------------: | --------------: | -----------------: | ---------------: |
|          VPS Hostinger Business |                                     9,816 |             818 |             155.81 |            12.98 |
|         Supabase Pro + Escalado |                                    28,356 |           2,363 |             450.09 |            37.66 |
|              SendGrid Email Pro |                                    11,340 |             945 |             180.00 |            15.00 |
|             Dominio `.com.do` |                                     1,260 |             105 |              20.00 |             1.67 |
|          Monitoreo (PM2 + Logs) |                                    11,340 |             945 |             180.00 |            15.00 |
|              Backup (Wasabi S3) |                                     3,780 |             315 |              60.00 |             5.00 |
|              Contingencia (15%) |                                     9,884 |             824 |             157.06 |            13.08 |
| **Total infra/licencias** |                          **75,776** | **6,315** | **1,203.77** | **100.24** |

Notas:

- Tabla tomada del desglose original; todas las filas tienen ahora columnas separadas para RD$ y USD.

---

## 3) Resumen consolidado (Año 1)

|                             Concepto | RD$        | USD (RD$/63) |                    |
| -----------------------------------: | --------------------------: | -----------------: |
|        Inversión desarrollo (valor) |                     182,000 |           2,888.89 |
|    Inversión inicial (desarrollo) * |                     172,000 |           2,730.16 |
|          Infra y licencias (empresa) |                      65,776 |           1,044.70 |
| **Total Año 1 (cotización)** |           **247,776** | **3,933.78** |

*El valor de RD$ 172,000 aparece en la cotización original como "Distribución de costos operacionales / inversión inicial" (detalle del paquete). Se mantiene aquí para consistencia.

---

## 4) Tablas por escenario (valores y explicación)

Se presentan los 3 escenarios más relevantes. Para cada uno se separa:

- `CAPEX (cash)`: monto que requiere pago en efectivo (normalmente infraestructura, servicios externos, licencias que no cubre la universidad ni los tesistas).
- `CAPEX (aporte en especie)`: valor equivalente del trabajo de desarrollo que realizan los tesistas (no es efectivo, pero debe justificarse en la tesis como valor de aporte).
- `OPEX mensual` y `OPEX anual` — servicios recurrentes.

Tipo de cambio: 1 USD = RD$ 63

|          Escenario | CAPEX cash (RD$) | CAPEX cash (USD) | CAPEX aporte (RD$) |  CAPEX aporte (USD) | OPEX mens (RD$) | OPEX mens (USD) | OPEX anual (RD$) |                     |                 |               |                   |
| -----------------: | ---------------------------------------------------------: | ------------------: | -----------------------------------------------------: | ------------------: | --------------: | ------------: | ----------------: |
|  Piloto económico |                                            15,000 - 30,000 |     238.10 - 476.19 |                                       80,000 - 120,000 | 1,269.84 - 1,904.76 |   1,200 - 3,000 | 19.05 - 47.62 |   14,400 - 36,000 |
| Económico-robusto |                                                     65,776 |            1,044.70 |                                                172,000 |            2,730.16 |           6,315 |        100.24 |            75,776 |
| Producción formal |                                          150,000 - 350,000 | 2,380.95 - 5,555.56 |                                      182,000 - 300,000 | 2,888.89 - 4,761.90 | 15,000 - 45,000 | 238.10-714.29 | 180,000 - 540,000 |

Explicaciones rápidas:

- Piloto económico: se minimizan servicios externos — usar VPS básico, supabase/free-tier, SMTP gratuito o SendGrid free; por eso OPEX muy bajo. CAPEX cash cubre solo configuración, dominio y backups. El aporte en especie es menor si se reduce alcance (MVP ligero).
- Económico-robusto: refleja la cotización original (las cifras enumeradas en las tablas previas). Aquí se paga infra más completa (`Supabase Pro`, `SendGrid Pro`, monitoreo) y los tesistas aportan el desarrollo como valor equivalente.
- Producción formal: incluye DB gestionada de alto SLA, balanceo, despliegue multi‑zona, licencias comerciales, soporte 24/7 — sube CAPEX cash y OPEX sensiblemente.

---

## 5) ¿Qué factores influyen más en cada escenario? (análisis)

- Usuarios concurrentes / demanda: a más usuarios concurrentes, mayor necesidad de recursos (CPU/RAM), escalado y DB gestionada — aumenta OPEX. En piloto esto se evita usando límites y cuotas.
- Integración DGII / e-CF: si se integra oficialmente y con alta disponibilidad, puede requerir servicios de integración más robustos y pruebas de compliance; eso aumenta horas de desarrollo (aporte en especie) y puede requerir integradores externos (CAPEX cash).
- Uso de LLM / IA: consumo de APIs (OpenAI, Anthropic) es variable — puede convertirse en un gasto mensual significativo si hay consultas frecuentes. En piloto, limitar prompts o usar rutas batch reduce costos.
- SLA y backup: requerir RTO/RPO cortos obliga a infra redundante y backups (mayor OPEX).
- Licencias y servicios gestionados (Supabase Pro, DB gestionada, S3/backup, email transaccional): mover servicios a managed aumenta OPEX pero reduce riesgo/inversión en operaciones internas.
- Seguridad y auditoría: cumplir auditorías o normativa fiscal puede aumentar costes en testing de seguridad, logging y almacenamiento seguro (tanto CAPEX como OPEX).
- Testing y capacitación: importante un capítulo en el presupuesto; en entorno de producción suele requerir presupuesto adicional para pruebas de carga, seguridad y formación de personal.

---

## 6) Recomendaciones prácticas

- Para tesis/MVP: presentar claridad en el documento entre **lo que se paga en efectivo** y **el valor del trabajo aportado** por los tesistas. En la tabla de gastos del proyecto (anteproyecto o anexo) mantén una columna que indique "¿Cash o Aporte en especie?".
- Usar el escenario "Piloto económico" para la defensa inicial: muestra que los costes directos son bajos y que el desarrollo (aporte) es mayoritariamente trabajo de tesis.
- Si la empresa adopta el sistema a producción, presentar un plan de transición financiera (pasar del piloto al plan robusto), con un horizonte de 6–12 meses para ajustar OPEX según uso real.
- Si se va a integrar con DGII o usar e‑CF desde inicio, aumentar la partida de integraciones y pruebas (CAPEX cash + horas de validación).

---

## 7) Pasos siguientes (si quieres que lo haga yo)

- Generar la misma tabla en formato Excel/CSV con columnas separadas por moneda (lista para importar). Puedo crear el archivo `documentacion/cotizacion_desglosada.csv` si lo deseas.
- Ajustar los rangos numéricos de escenarios con supuestos más concretos (nº usuarios, número de facturas/mes, uso de LLM) para obtener estimaciones más precisas.

Si quieres que exporte estas tablas a Excel/CSV o ajuste los números a un tipo de cambio distinto, dime la tasa y los supuestos (nº usuarios, uso LLM, necesidad e‑CF) y lo preparo.
