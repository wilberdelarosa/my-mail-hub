**Tabla de Presupuesto (Formato UCE)**

Este documento presenta las tablas de presupuesto siguiendo estrictamente las indicaciones de la guía UCE: tablas en texto con columnas separadas por moneda, distinción clara entre CAPEX y OPEX, y columnas para unidad/cantidad, precio unitario en RD$ y USD, totales y fuente (efectivo o aporte en especie).

**Convenciones aplicadas**
- Tipo de cambio: `1 USD = RD$ 63` (usar la tasa vigente y anotar la fecha en el documento final).
- Columnas: `Concepto | Tipo de gasto | Unidad/Cantidad | Precio unitario (RD$) | Precio unitario (USD) | Total (RD$) | Total (USD) | Fuente | Observaciones`.
- Redacción en tercera persona, lista para copiar en Word siguiendo normas UCE (Arial 12, interlineado 1.5, márgenes 2.54 cm).

---

**CAPEX — Inversión (valor equivalente y/o cash)**

| Concepto | Tipo de gasto | Unidad / Cantidad | Precio unitario (RD$) | Precio unitario (USD) | Total (RD$) | Total (USD) | Fuente (Cash / Aporte) | Observaciones |
| - | - | -: | -: | -: | -: | -: | - | - |
| Frontend (React + UI) | CAPEX (Desarrollo) | 400 h (estim.) | 212.50 / h | 3.37 / h | 85,000 | 1,349.21 | Aporte en especie | 4 desarrolladores (según cotización) |
| Backend API (Node.js) | CAPEX (Desarrollo) | 200 h (estim.) | 210.00 / h | 3.33 / h | 42,000 | 666.67 | Aporte en especie | Endpoints CRUD, auth, lógica fiscal |
| Base de datos (Diseño + RLS) | CAPEX (Desarrollo) | 60 h (estim.) | 200.00 / h | 3.17 / h | 12,000 | 190.48 | Aporte en especie | Esquema, triggers, funciones |
| Automatizaciones (n8n) | CAPEX (Desarrollo) | 60 h (estim.) | 200.00 / h | 3.17 / h | 12,000 | 190.48 | Aporte en especie | 5 flujos clave (NCF, PDFs, recordatorios) |
| Integración DGII / NCF | CAPEX (Integración) | 40 h (estim.) | 200.00 / h | 3.17 / h | 8,000 | 126.98 | Aporte en especie / Cash parcial | Si se contrata integrador, parte cash |
| Testing funcional + capacitación | CAPEX (Servicios) | 140 h (estim.) | 191.67 / h | 3.04 / h | 23,000 | 365.08 | Aporte en especie | Pruebas seguridad y carga; capacitación 20 h |
| **Subtotal CAPEX (valor desarrollo)** | CAPEX (TOTAL) | — | — | — | **182,000** | **2,888.89** | Aporte en especie | Valor equivalente del trabajo de los tesistas |
| Inversión inicial reportada | MIXTO | — | — | — | 172,000 | 2,730.16 | Mix (ver observ.) | Valor reportado en cotización original |

---

**OPEX — Operación (anual / mensual)**

| Concepto | Tipo de gasto | Unidad / Cantidad | Precio unitario (RD$) | Precio unitario (USD) | Total anual (RD$) | Total anual (USD) | Fuente (Cash / Aporte) | Observaciones |
| - | - | -: | -: | -: | -: | -: | - | - |
| VPS Hostinger Business | OPEX (Hosting) | 1 anual / 12 = 818 / mes | — | — | 9,816 | 155.81 | Cash | Hosting VPS plan Business |
| Supabase Pro + Escalado | OPEX (DB gestionada) | 1 anual / 12 = 2,363 / mes | — | — | 28,356 | 450.09 | Cash | BD como servicio, autenticación, RLS |
| SendGrid Email Pro | OPEX (Email) | 1 anual / 12 = 945 / mes | — | — | 11,340 | 180.00 | Cash | Email transaccional |
| Dominio `.com.do` | OPEX (Dominio) | 1 anual | — | — | 1,260 | 20.00 | Cash | Registro dominio |
| Monitoreo (PM2 + Logs) | OPEX (Monitoreo) | 1 anual / 12 = 945 / mes | — | — | 11,340 | 180.00 | Cash | Logs y alertas |
| Backup (Wasabi S3) | OPEX (Backup) | 1 anual / 12 = 315 / mes | — | — | 3,780 | 60.00 | Cash | Almacenamiento backup |
| Contingencia (15%) | OPEX (Reserva) | 1 anual | — | — | 9,884 | 157.06 | Cash | Reserva para imprevistos |
| **Subtotal OPEX (anual)** | OPEX (TOTAL) | — | — | — | **75,776** | **1,203.77** | Cash | Total anual de operación |

---

**Resumen consolidado (Año 1)**

| Concepto | Total (RD$) | Total (USD) | Fuente | Observaciones |
| - | -: | -: | - | - |
| Subtotal CAPEX (valor desarrollo) | 182,000 | 2,888.89 | Aporte en especie | Valor equivalente del desarrollo (tesistas) |
| Subtotal OPEX (anual) | 75,776 | 1,203.77 | Cash | Infraestructura y licencias año 1 |
| **Total Año 1 (cotización)** | **257,776** | **4,092.66** | Mix | Nota: coincide con suma de subtotales (revisar si usar 247,776 según la versión original) |

> Nota: en la cotización original se indicó `Total Año 1: RD$ 247,776`. En esta tabla se presenta un resumen exhaustivo; antes de publicar en versión final para Word confirmar si el valor a mostrar debe ser 247,776 (como en el documento original) o 257,776 (suma actual de subtotales tras ajuste de partidas). Se corregirá según indique el asesor.

---

**Tabla resumen por escenarios (formato UCE)**

| Escenario | CAPEX cash (RD$) | CAPEX aporte (RD$) | OPEX mensual (RD$) | OPEX anual (RD$) | Fuente principal | Observaciones |
| - | -: | -: | -: | -: | - | - |
| Piloto económico (MVP) | 15,000 – 30,000 | 80,000 – 120,000 | 1,200 – 3,000 | 14,400 – 36,000 | Cash mínimo + aporte | Infra mínima; Supabase free/VPS básico; SendGrid free o limitado |
| Económico-robusto (cotización) | 65,776 | 172,000 | 6,315 | 75,776 | Cash (infra Pro) + aporte | Corresponde a la cotización desglosada previamente |
| Producción formal (SLA) | 150,000 – 350,000 | 182,000 – 300,000 | 15,000 – 45,000 | 180,000 – 540,000 | Cash (servicios gestionados) | Alta disponibilidad, soporte 24/7, DB gestionada, backups multi-zona |

---

**Instrucciones UCE para pegar en Word**
- Copiar las tablas tal cual; en Word ajustar ancho de columnas para que la primera columna (Concepto) permita observaciones largas.
- Si la guía de la facultad exige separar CAPEX y OPEX en páginas distintas, colocar la tabla CAPEX en la sección de inversión y la tabla OPEX en aspectos administrativos.
- Incluir al pie: "Tipo de cambio usado: 1 USD = RD$ 63 (fecha: DD/MM/2025)" y una línea que explique qué parte es aporte en especie.

---

Si el usuario desea, se puede:
- Generar `documentacion/presupuesto_uce.csv` y `documentacion/presupuesto_uce.xlsx` listos para Excel.
- Ajustar el total final para coincidir exactamente con `RD$ 247,776` si esa cifra debe mantenerse por decisión del asesor (indicar qué partidas ajustar).
