**UNIVERSIDAD CENTRAL DEL ESTE**

**FACULTAD:** Facultad de Ciencias y Tecnologías Aplicadas

**ESCUELA:** Escuela de Ingeniería de Software

**TÍTULO:**

Arquitectura y desarrollo de un sistema de facturación cloud impulsado por agentes de IA para ALITO GROUP SRL, Bávaro – Punta Cana (2025)

**TRABAJO DE INVESTIGACIÓN PARA OPTAR POR EL TÍTULO DE GRADO EN:**

**GRADO EN:** Ingeniería de Software (Extensión Punta Cana)

**SUSTENTANTE(S):**

Jesus Andrés Acevedo Carrasco

Wilber Alfredo de la Rosa Marte

**MATRÍCULA(S):**

2022-0547

2020-2551

**ASESOR(ES):**

Ramon Eduardo Zorrilla Mateo

Patricia Gisela Mendoza Orellana

**Lugar, República Dominicana**

16/12/2025

**Los conceptos emitidos en el presente trabajo son de la exclusiva responsabilidad de sus autores.**


**TABLA DE CONTENIDOS**

1. ASPECTOS GENERALES ........................................... 3

1.1 Introducción .................................................. 3

1.1.1 Antecedentes .............................................. 4

1.1.2 Justificación e importancia ............................... 5

1.2 Planteamiento del problema .................................. 7

1.3 Formulación del problema científico ........................ 9

1.4 Objetivos ....................................................10

1.4.1 Objetivo general .........................................10

1.4.2 Objetivos específicos ...................................10

1.5 Variables e indicadores ....................................11

2. MARCO METODOLÓGICO (No requerido completo en anteproyecto) .....13

3. MARCO METODOLÓGICO ...........................................13

4. ASPECTOS ADMINISTRATIVOS Y DE CONTROL ........................17

BIBLIOGRAFÍA ....................................................20


**CAPÍTULO 1. ASPECTOS GENERALES**

1.1 Introducción

En el contexto de transformación digital, muchas empresas dominicanas del sector de alquiler de equipos y movimiento de materiales dependen de procesos manuales y hojas de cálculo para la emisión de cotizaciones, proformas y facturas. Esta práctica aumenta la probabilidad de errores en la numeración fiscal (NCF), en la aplicación del ITBIS (18 %) y limita la disponibilidad de información gerencial en tiempo real.

La presente investigación propone diseñar y desarrollar una solución cloud-native de facturación, integrada con agentes de inteligencia artificial y capacidades de Business Intelligence, que permita a ALITO GROUP SRL centralizar procesos, automatizar validaciones fiscales (NCF, ITBIS), mejorar la trazabilidad y entregar reportes gerenciales que apoyen la toma de decisiones.

El documento está organizado de la siguiente manera: en el Capítulo 1 se exponen los aspectos generales (antecedentes, justificación, formulación del problema y objetivos); el Capítulo 2 resume el marco metodológico; el Capítulo 3 detalla la propuesta técnica y plan de desarrollo; el Capítulo 4 presenta los aspectos administrativos, cronograma y presupuesto; finalmente se incluye la bibliografía.

1.1.1 Antecedentes

La adopción de soluciones de facturación en la nube y la automatización mediante IA han mostrado reducción de errores y mayor trazabilidad en PYMES. Estudios recientes y casos de implementación señalan que la integración de validaciones automáticas de comprobantes fiscales y herramientas de BI reduce tiempos de procesamiento y ocurrencia de errores (DGII, 2024; Delgado, 2024).

En sectores con operaciones distribuidas como la construcción y el alquiler de maquinaria, la falta de un sistema integrado suele dar lugar a: duplicidad de clientes, errores en NCF, cálculos incorrectos de impuestos y ausencia de reportes consolidados. Estas consecuencias justifican la intervención propuesta para ALITO GROUP SRL.

1.1.2 Justificación e importancia

Social y empresarial:
- Se mejora la eficiencia operativa y la capacidad de respuesta frente a clientes.
- Se reduce el riesgo de sanciones por incumplimientos fiscales (errores en NCF y ITBIS).

Académica:
- El proyecto integra tecnologías cloud, arquitectura modular y agentes de IA, aportando un caso aplicado al campo de la Ingeniería de Software.

Técnica y operativa:
- Centraliza la gestión de clientes, catálogos de servicios y documentación transaccional.
- Automatiza validaciones fiscales y proporciona paneles BI para seguimiento de KPI.

1.2 Planteamiento del problema

a) Descripción de la situación problemática

ALITO GROUP SRL gestiona cotizaciones, proformas y facturación mediante hojas de cálculo y procesos manuales. Se identificaron las siguientes deficiencias principales:
- Uso de plantillas y archivos dispersos sin control de versiones.
- Registro manual y sin validación de NCF, causando saltos y duplicidades.
- Cálculo manual del ITBIS susceptible a errores de aplicación y redondeo.
- Ausencia de respaldo y acceso remoto fiable a la información.
- Falta de paneles gerenciales que permitan analizar antigüedad de cartera y KPIs financieros.

Siempre que sea posible, se recomienda documentar con evidencias cuantitativas (por ejemplo: número de facturas mensuales, casos de NCF fuera de secuencia, tiempos de generación de proformas) para robustecer la justificación.

b) Formulación del problema científico

¿Cómo diseñar y desarrollar una arquitectura cloud-native, integrada con agentes de inteligencia artificial y capacidades de Business Intelligence, que permita a ALITO GROUP SRL centralizar y automatizar sus procesos de cotización, facturación y control de cuentas por cobrar, garantizando exactitud fiscal (NCF, ITBIS), trazabilidad, seguridad de datos y mejora medible en la eficiencia operativa?

1.3 Formulación de hipótesis (si aplica)

Dado el enfoque descriptivo-propositivo, la investigación no exige hipótesis formales; en cambio, se plantean supuestos de trabajo que orientan la validación: "La implementación de un sistema cloud con validaciones automáticas de NCF y paneles BI reducirá la tasa de errores fiscales en al menos un 30% y el tiempo promedio de emisión de documentos en un 40% durante los tres primeros meses de operación piloto."

1.4 Objetivos

1.4.1 Objetivo general

Diseñar y desarrollar la arquitectura y el sistema de facturación cloud impulsado por agentes de inteligencia artificial para ALITO GROUP SRL, que permita centralizar procesos de cotización, proformas, facturación y estados de cuenta, garantizar la exactitud fiscal, automatizar validaciones y proporcionar capacidades analíticas para la toma de decisiones.

1.4.2 Objetivos específicos

1. Realizar un diagnóstico detallado de los procesos administrativos y financieros actuales, identificando cuellos de botella y riesgos fiscales.
2. Definir los requisitos funcionales y no funcionales del sistema, incluyendo seguridad, escalabilidad y cumplimiento con la normativa de la DGII.
3. Diseñar la arquitectura cloud-native (componentes, APIs, almacenamiento, seguridad y esquemas de integración).
4. Implementar los módulos principales (cotizaciones, proformas, facturación, NCF, gestión de clientes y reportes BI).
5. Integrar agentes de IA para validación de comprobantes, clasificación automática de documentos y detección de anomalías.
6. Ejecutar un plan de pruebas piloto y validar indicadores de desempeño y reducción de errores.
7. Diseñar procedimientos de operación, respaldo y capacitación para asegurar la adopción y sostenibilidad.

1.5 Variables e indicadores

A continuación se presenta la matriz de variables e indicadores en formato de tabla de texto, conforme a las normas del anteproyecto:

| Tipo de variable | Variable | Dimensiones | Indicadores (unidad / medición) |
| --- | --- | --- | --- |
| Independiente | Implementación del sistema cloud-native con IA y BI | Existencia; Cobertura funcional; Integración/API; Automatización; Capacidad analítica | Sistema operativo (Sí/No); % módulos desarrollados; Nº endpoints API; % validaciones automatizadas; Nº KPI disponibles |
| Dependiente | Tiempo de respuesta operativo | Solicitud → emisión (cotización, proforma, factura) | Tiempo promedio (minutos) por tipo de documento |
| Dependiente | Reducción de errores fiscales | Errores en NCF, ITBIS, correcciones posteriores | % reducción de errores; Nº incidencias/mes |
| Dependiente | Trazabilidad y cumplimiento fiscal | Expediente completo; Audit trail | % expedientes completos; Nº observaciones regulatorias |
| Interviniente | Adopción y capacitación | Usuarios capacitados; Horas de formación; Satisfacción | Nº usuarios activos; Horas de capacitación; Puntaje de satisfacción (escala) |
| Interviniente | Condiciones tecnológicas | Conectividad; Equipamiento | Mbps/latencia; % uptime; Nº incidencias/mes |
| Dependiente | Impacto financiero operativo | Mejora en cobranza y costos | DSO (días), % facturas cobradas a tiempo, reducción de costos operativos (%) |


**Observación:** Las dimensiones e indicadores se deben operacionalizar con valores y métodos de medición concretos en la fase de diseño del instrumento de recolección.


---

Nota: He generado la versión estilizada del inicio del anteproyecto (portada, tabla de contenidos y Capítulo 1 completo). Puedo:

- Continuar con la redacción de los capítulos restantes (Cap. 2, Cap. 3 y Cap. 4) siguiendo el mismo formato.
- Exportar este documento a `DOCX` o `ODT` para entrega formal (necesitaré confirmación para generar el archivo). 
- Insertar esta versión directamente en `archivo final/anteproyecto_final.md` si así lo desea.

Indique la opción deseada y procederé con la siguiente acción.