# Presupuesto general consolidado

Archivo que reúne en una sola tabla las partidas de Desarrollo (valor equivalente / aporte en especie) y la Infraestructura y licencias (costos que normalmente paga la empresa), con descripciones breves y totales en RD$ y USD.

Tipo de cambio usado: `1 USD = RD$ 63`.

---

|                                              Nº | Concepto                             | Tipo de gasto        |        Unidad / Cantidad | Precio unitario (RD) | Precio unitario (USD) |        Total (RD) | Total (USD)        |
| -----------------------------------------------: | ------------------------------------ | -------------------- | -----------------------: | -------------------: | --------------------: | ----------------: | ------------------ |
|                                                1 | Frontend completo (React + Tailwind) | CAPEX (Desarrollo)   |           400 h (estim.) |           212.50 / h |              3.37 / h |            85,000 | 1,349.21           |
|                                                2 | Backend API (Node.js / Express)      | CAPEX (Desarrollo)   |           200 h (estim.) |           210.00 / h |              3.33 / h |            42,000 | 666.67             |
|                                                3 | Base de datos (Supabase / Diseño)   | CAPEX (Desarrollo)   |            60 h (estim.) |           200.00 / h |              3.17 / h |            12,000 | 190.48             |
|                                                4 | Automatizaciones (n8n)               | CAPEX (Desarrollo)   |            60 h (estim.) |           200.00 / h |              3.17 / h |            12,000 | 190.48             |
|                                                5 | Integración DGII / NCF              | CAPEX (Integración) |            40 h (estim.) |           200.00 / h |              3.17 / h |             8,000 | 126.98             |
|                                                6 | Testing funcional + Capacitación    | CAPEX (Servicios)    |           140 h (estim.) |           191.67 / h |              3.04 / h |            23,000 | 365.08             |
|          **Sub‑total Desarrollo (valor)** |                                      |                      |                          |                      |                       | **182,000** | **2,888.89** |
|                                                7 | VPS Hostinger Business               | OPEX (Infra)         |   Anual / 12 = 818 / mes |                   — |                    — |             9,816 | 155.81             |
|                                                8 | Supabase Pro + Escalado              | OPEX (Infra)         | Anual / 12 = 2,363 / mes |                   — |                    — |            28,356 | 450.09             |
|                                                9 | SendGrid Email Pro                   | OPEX (Servicios)     |   Anual / 12 = 945 / mes |                   — |                    — |            11,340 | 180.00             |
|                                               10 | Dominio `.com.do`                  | OPEX (Servicios)     |                    Anual |                   — |                    — |             1,260 | 20.00              |
|                                               11 | Monitoreo (PM2 + Logs)               | OPEX (Monitoreo)     |   Anual / 12 = 945 / mes |                   — |                    — |            11,340 | 180.00             |
|                                               12 | Backup (Wasabi S3)                   | OPEX (Backup)        |   Anual / 12 = 315 / mes |                   — |                    — |             3,780 | 60.00              |
|                                               13 | Contingencia (15%)                   | OPEX (Reserva)       |                    Anual |                   — |                    — |             9,884 | 157.06             |
|   **Sub‑total Infra / Licencias (anual)** |                                      |                      |                          |                      |                       |  **75,776** | **1,203.77** |
| **Gran Total Año 1 (Desarrollo + Infra)** |                                      |                      |                          |                      |                       | **257,776** | **4,092.66** |

---


Presupuesto Total Año 1

Presupuesto Total: RD$ 247,776 (±10-15%)
Inversión Inicial (Desarrollo + Setup): RD$ 172,000
Costo Operacional Anual: RD$ 75,776
Costo Mensual Promedio: RD$ 20,648

Tipo de Cambio: 1 USD = RD$ 63
Duración Desarrollo: 4 meses (16 semanas)

1. DESARROLLO REAJUSTADO POR PAQUETES (NO HORAS)

**Paquete 1: Plataforma Completa Frontend - RD$ 85,000**

Incluye 7 módulos frontend (React + Tailwind CSS):

- ✓ Dashboard gerencial con KPIs reales
- ✓ Cotizaciones (CRUD + PDF + Email)
- ✓ Proformas (desde cotización + numeración)
- ✓ Facturación (NCF + ITBIS 18%)
- ✓ Cuentas por Cobrar (Aging + recordatorios)
- ✓ Reportería BI (gráficos + exportación)
- ✓ Admin multi-usuario (roles y permisos)

Tiempo estimado: 4 programadores × 400 horas totales = RD$ 85,000
Tarifa realista RD 2025: RD$ 212.50/hora (incluye programador senior + junior)

**Paquete 2: Backend API Completa - RD$ 42,000**

Incluye todas las APIs REST (Node.js + Express):

- ✓ 25+ endpoints CRUD optimizados
- ✓ Lógica fiscal (ITBIS) y validaciones DGII
- ✓ Autenticación JWT y medidas de seguridad
- ✓ Rate limiting y validaciones de entrada
- ✓ Logging y auditoría completa
- ✓ Testing unitario (meta ~80% cobertura)

Tiempo estimado: 3 programadores × 200 horas = RD$ 42,000

**Paquete 3: Base de Datos + Infra - RD$ 12,000**

Configuración Supabase y diseño de esquema:

- ✓ Diseño relacional (25+ tablas)
- ✓ Políticas RLS por rol
- ✓ Triggers para auditoría automática
- ✓ Funciones y consultas optimizadas
- ✓ Pruebas de performance de queries

Tiempo estimado: 1 DBA × 60 horas = RD$ 12,000

**Paquete 4: Automatizaciones (n8n) - RD$ 12,000**

5 flujos empresariales completos:

- ✓ Validación NCF DGII automática
- ✓ Cálculo ITBIS automatizado
- ✓ Generación masiva de PDFs
- ✓ Reportes y envíos diarios por email
- ✓ Recordatorios de cobranza escalados

Tiempo estimado: 1 especialista × 60 horas = RD$ 12,000

**Paquete 5: Integración Fiscal DGII - RD$ 8,000**

Integración y controles:

- ✓ API DGII para validación en tiempo real
- ✓ Control de series y comprobantes
- ✓ Prevención de duplicados
- ✓ Reportes fiscales y documentación de compliance

Tiempo estimado: 1 integrador × 40 horas = RD$ 8,000

**Paquete 6: Testing y Capacitación - RD$ 23,000**

Actividades principales:

- ✓ Testing funcional (cobertura de pruebas)
- ✓ Testing de seguridad (OWASP Top 10)
- ✓ Pruebas de carga (hasta ~1,000 usuarios en escenarios)
- ✓ Capacitación (20 horas de personal) y manuales de usuario
- ✓ Prueba piloto con datos reales

Tiempo estimado: 2 testers × 120 horas + 20 h capacitación = RD$ 23,000
