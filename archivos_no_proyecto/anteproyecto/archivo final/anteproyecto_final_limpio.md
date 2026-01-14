# ANTEPROYECTO DE TESIS

UNIVERSIDAD CENTRAL DEL ESTE
FACULTAD DE INGENIERÍA Y TECNOLOGÍA
ESCUELA DE INGENIERÍA EN SOFTWARE

TÍTULO DEL ANTEPROYECTO:
Arquitectura y desarrollo de un sistema de facturación cloud impulsado por agentes de IA para ALITO GROUP SRL, Bávaro – Punta Cana (2025).

TRABAJO DE INVESTIGACIÓN PARA OPTAR POR EL TÍTULO DE:
INGENIERO EN SOFTWARE

SUSTENTANTES:
Wilber Alfredo De la Rosa Marte – Matrícula: 2022-0547
Jesús Andrés Acevedo Carrasco – Matrícula: 2020-2551

ASESOR:
Ramón Eduardo Zorrilla Mateo

Lugar: Bávaro – Punta Cana, La Altagracia, República Dominicana
Año: 2025

---

# CAPÍTULO 1. ASPECTOS GENERALES

## 1.1 Introducción

En el contexto actual de transformación digital, las empresas del sector construcción y alquiler de equipos pesados enfrentan el reto de gestionar de forma eficiente y segura sus procesos de facturación y control financiero. ALITO GROUP SRL, ubicada en Bávaro – Punta Cana, La Altagracia, no es la excepción: sus operaciones de cotización, proformas, facturación y control de cuentas por cobrar se sustentan principalmente en hojas de cálculo y procedimientos manuales, lo que genera duplicidad de datos, errores en cálculos de impuestos y limitaciones para obtener información consolidada en tiempo real.

La facturación en la República Dominicana está fuertemente regulada por la Dirección General de Impuestos Internos (DGII), particularmente en lo referente a la emisión y control de los comprobantes fiscales (NCF) y a la correcta aplicación del ITBIS (18 %). El incumplimiento de estas normas, incluso por errores involuntarios, puede derivar en sanciones económicas, trabas operativas y pérdida de credibilidad frente a clientes y proveedores.

Ante este panorama, se plantea el diseño y desarrollo de un sistema de facturación cloud impulsado por agentes de inteligencia artificial (IA), soportado en una arquitectura moderna, escalable y segura, que permita centralizar la información, automatizar cálculos y validaciones, y ofrecer capacidades analíticas para apoyar la toma de decisiones estratégicas en ALITO GROUP SRL.

Alito Group SRL es una empresa local dedicada al alquiler de equipos pesados y movimiento de materiales con más de siete años de experiencia en el sector. La compañía ofrece servicios de alquiler de maquinaria, movimiento y transporte de materiales, excavaciones y limpieza de obras, así como suministro de materiales de construcción. Su misión enfatiza la entrega de soluciones eficientes y de alta calidad, priorizando la seguridad, el cumplimiento de plazos, la eficiencia operativa y la atención personalizada al cliente.

Este anteproyecto presenta los aspectos generales, teóricos y metodológicos del estudio, definiendo el problema científico, los objetivos, la justificación, así como el enfoque de investigación basado en una encuesta estructurada a los actores clave del proceso de facturación y gestión administrativa.

## 1.1.1 Antecedentes

La automatización de procesos de facturación y la adopción de soluciones en la nube han demostrado beneficios concretos para empresas de pequeño y mediano tamaño: reducción de errores, centralización de la información, trazabilidad de transacciones y mejor cumplimiento de obligaciones fiscales. En sectores con operaciones distribuidas y alta rotación de servicios como el alquiler de maquinaria y movimiento de materiales, la ausencia de un sistema integrado suele derivar en problemas recurrentes que afectan la operación y la relación con clientes.

Estudios de caso y reportes técnicos señalan que las causas más frecuentes de ineficiencia son el uso de hojas de cálculo para procesos transaccionales, la falta de controles automáticos sobre la numeración de comprobantes fiscales y la ausencia de herramientas analíticas que permitan detectar tendencias de morosidad o errores sistemáticos. La incorporación de herramientas de análisis de datos permite transformar los datos transaccionales en indicadores accionables para la gerencia, lo cual facilita decisiones operativas y financieras oportunas.

La aplicación de técnicas de inteligencia artificial en procesos de facturación se ha orientado a la validación automática de datos, la clasificación de documentos y la detección de anomalías que anticipen riesgos de incumplimiento o errores de captura. Estas aproximaciones han mostrado mejoras en la tasa de detección de inconsistencias y en la reducción del trabajo manual asociado a la auditoría.

En el caso de ALITO GROUP SRL, el diagnóstico preliminar identifica dependencia de hojas de cálculo para cotizaciones, proformas y facturación; coordinación mediante correo y mensajería; y procesos manuales para la verificación de NCF e ITBIS. Esta realidad coincide con los problemas descritos en la literatura y justifica la propuesta de un sistema cloud que incorpore validaciones automáticas y capacidades analíticas adaptadas al contexto fiscal dominicano.

## 1.1.2 Justificación e importancia

La presente investigación propone diseñar y desarrollar la arquitectura y el sistema de facturación en la nube, impulsado por agentes de inteligencia artificial, con el fin de modernizar y consolidar los procesos financieros y administrativos de ALITO GROUP SRL.

Actualmente, la organización opera con procesos manuales y hojas de cálculo dispersas, lo que ocasiona errores en la numeración de comprobantes, en los cálculos del ITBIS (18 %) y en la gestión de NCF, además de falta de trazabilidad y demora en la obtención de información consolidada. Estos problemas generan riesgos fiscales, pérdida de eficiencia operativa y mayores costos administrativos.

El enfoque en la arquitectura cloud-native, modular y segura, y en el desarrollo de componentes soportados por agentes de inteligencia artificial aporta soluciones concretas: centralización de datos, automatización y validación inteligente de NCF e impuestos en tiempo real, reducción de errores de cálculo, mejora de la trazabilidad y generación de informes dinámicos para la gerencia.

La importancia del proyecto se manifiesta en las dimensiones empresarial, técnica y académica. En el plano empresarial, mejora la competitividad y el cumplimiento normativo de ALITO GROUP SRL. En lo técnico, introduce una arquitectura moderna que mejora la disponibilidad, seguridad y continuidad del servicio. En lo académico y social, genera evidencia práctica sobre la aplicación de agentes de inteligencia artificial y arquitecturas modernas en empresas locales, contribuyendo al desarrollo tecnológico de la región.

## 1.2 Planteamiento del problema

ALITO GROUP SRL es una empresa dedicada a la construcción y alquiler de equipos pesados en la zona de Bávaro – Punta Cana, provincia La Altagracia. Sus procesos de facturación, elaboración de cotizaciones y proformas, así como el control de cuentas por cobrar, se gestionan principalmente mediante hojas de cálculo y documentos dispersos. Esta situación genera múltiples dificultades, tales como errores frecuentes en la numeración de facturas y comprobantes fiscales, inconsistencias en los cálculos del ITBIS y otros conceptos tributarios, duplicidad de registros, dificultad para obtener estados de cuenta consolidados y ausencia de un repositorio único de información confiable.

Además, la empresa debe ajustarse a las disposiciones de la Dirección General de Impuestos Internos en materia de facturación y comprobantes fiscales, en un contexto de avance hacia la facturación electrónica y el fortalecimiento del control tributario. La falta de un sistema integrado y automatizado incrementa la probabilidad de errores que pueden traducirse en sanciones, retrasos en auditorías y pérdida de confianza de clientes y socios.

Desde el punto de vista tecnológico, la empresa no dispone de una arquitectura de sistema en la nube que permita centralizar información, ofrecer acceso seguro desde múltiples dispositivos y escalar recursos según la demanda. Tampoco se aprovechan aún los beneficios de agentes de inteligencia artificial para automatizar validaciones, alertas y generación de reportes analíticos.

En este contexto, surge la necesidad de diseñar y desarrollar una arquitectura y un sistema de facturación cloud que, apoyado en agentes de inteligencia artificial, permita centralizar los procesos de facturación, mejorar la exactitud fiscal, reducir errores humanos y proporcionar información oportuna para la toma de decisiones estratégicas.

## 1.3 Formulación del problema científico

¿Cómo diseñar y desarrollar la arquitectura y el sistema de facturación cloud, impulsado por agentes de inteligencia artificial, que permita centralizar la información, garantizar la exactitud fiscal, automatizar la generación de documentos comerciales y proveer capacidades de análisis para mejorar la eficiencia operativa, la toma de decisiones estratégicas y el cumplimiento normativo en ALITO GROUP SRL?

## 1.4 Objetivos

### 1.4.1 Objetivo general

Diseñar y desarrollar la arquitectura y el sistema de facturación cloud impulsado por agentes de inteligencia artificial para ALITO GROUP SRL, que permita centralizar procesos de cotización, proformas, facturación y estados de cuenta, garantizar la exactitud fiscal, automatizar validaciones y proporcionar capacidades analíticas para la toma de decisiones.

### 1.4.2 Objetivos específicos

1. Realizar un diagnóstico detallado de los procesos administrativos y financieros actuales en ALITO GROUP SRL para identificar requisitos, limitaciones y fuentes de datos relevantes para el sistema propuesto.
2. Definir los requisitos funcionales y no funcionales del sistema, incluyendo seguridad, disponibilidad, escalabilidad y cumplimiento normativo de acuerdo con las normativas vigentes.
3. Diseñar la arquitectura cloud-native del sistema, considerando componentes, APIs, almacenamiento, seguridad y estrategia de despliegue, basada en buenas prácticas de ingeniería de software.
4. Implementar los módulos principales del sistema (cotizaciones, proformas, facturación, control de comprobantes fiscales y generación de estados de cuenta) siguiendo el diseño arquitectónico definido.
5. Integrar agentes de inteligencia artificial orientados a la validación automática de datos, detección de inconsistencias, automatización de la numeración de comprobantes y apoyo en la generación de documentos y reportes.
6. Desarrollar e incorporar capacidades de análisis de datos para reportes dinámicos, indicadores clave de desempeño y paneles gerenciales relacionados con facturación, cuentas por cobrar y cumplimiento fiscal.
7. Diseñar y aplicar un plan de pruebas piloto para medir la reducción de errores, los tiempos de procesamiento y la satisfacción de los usuarios internos.
8. Capacitar al personal de ALITO GROUP SRL en el uso del sistema de facturación cloud, documentando la arquitectura, el código y los procedimientos de operación para asegurar su adopción y mantenimiento.
9. Elaborar un plan de mantenimiento, escalabilidad y mejora continua que permita integrar el sistema con otras herramientas corporativas en el futuro.

## 1.5 Variables e indicadores

| Variable                                 | Definición                                                                                                                                                                                              |     Tipo     | Indicador                                                                |      Unidad      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----------: | ------------------------------------------------------------------------ | :---------------: |
| Implementación del sistema cloud con IA | Conjunto de componentes de software desplegados en la nube que automatizan la captura, validación y registro de la facturación, incorporando agentes de IA para recomendaciones y control inteligente. | Independiente | Número de módulos implementados en producción                         |      Conteo      |
| Implementación del sistema cloud con IA | Conjunto de componentes de software desplegados en la nube que automatizan la captura, validación y registro de la facturación, incorporando agentes de IA para recomendaciones y control inteligente. | Independiente | Porcentaje de validaciones automatizadas                               |  Porcentaje (%)  |
| Implementación del sistema cloud con IA | Conjunto de componentes de software desplegados en la nube que automatizan la captura, validación y registro de la facturación, incorporando agentes de IA para recomendaciones y control inteligente. | Independiente | Tiempo medio de respuesta de las APIs de facturación                    | Milisegundos (ms) |
| Implementación del sistema cloud con IA | Conjunto de componentes de software desplegados en la nube que automatizan la captura, validación y registro de la facturación, incorporando agentes de IA para recomendaciones y control inteligente. | Independiente | Número de indicadores disponibles en el panel de análisis               |      Conteo      |
| Exactitud fiscal y eficiencia operativa  | Grado de cumplimiento fiscal y eficiencia en la emisión y registro de facturas y estados de cuenta.                                                                                                    |  Dependiente  | Número de errores en comprobantes fiscales por mes                     |    Errores/mes    |
| Exactitud fiscal y eficiencia operativa  | Grado de cumplimiento fiscal y eficiencia en la emisión y registro de facturas y estados de cuenta.                                                                                                    |  Dependiente  | Porcentaje de facturas emitidas sin corrección posterior                |  Porcentaje (%)  |
| Exactitud fiscal y eficiencia operativa  | Grado de cumplimiento fiscal y eficiencia en la emisión y registro de facturas y estados de cuenta.                                                                                                    |  Dependiente  | Tiempo promedio de emisión de una factura                               |      Minutos      |
| Exactitud fiscal y eficiencia operativa  | Grado de cumplimiento fiscal y eficiencia en la emisión y registro de facturas y estados de cuenta.                                                                                                    |  Dependiente  | Tiempo medio de resolución de incidencias relacionadas con facturación |       Horas       |
| Nivel de adopción y capacitación       | Grado de uso efectivo del sistema y nivel de formación del personal en relación con la solución implementada.                                                                                         | Interviniente | Número de usuarios capacitados en el sistema                            |      Conteo      |
| Nivel de adopción y capacitación       | Grado de uso efectivo del sistema y nivel de formación del personal en relación con la solución implementada.                                                                                         | Interviniente | Porcentaje de usuarios activos (uso mensual del sistema)                 |  Porcentaje (%)  |
| Nivel de adopción y capacitación       | Grado de uso efectivo del sistema y nivel de formación del personal en relación con la solución implementada.                                                                                         | Interviniente | Puntaje medio de satisfacción de los usuarios internos                  |    Escala 1–5    |
| Nivel de adopción y capacitación       | Grado de uso efectivo del sistema y nivel de formación del personal en relación con la solución implementada.                                                                                         | Interviniente | Número de solicitudes de soporte por usuario                            |      Conteo      |

---

# CAPÍTULO 2. MARCO TEÓRICO

## 2.1 Sistemas de facturación en la nube

Un sistema de facturación en la nube es una aplicación alojada en infraestructuras remotas de computación en la nube que permite emitir, registrar y consultar documentos comerciales mediante acceso web o móvil. Estos sistemas se caracterizan por el acceso ubicuo a través de internet, actualizaciones centralizadas, copias de seguridad automatizadas y mayor resiliencia ante fallos locales.

Frente a los sistemas instalados de manera local, las soluciones de facturación en la nube ofrecen ventajas como escalabilidad bajo demanda, reducción de costos iniciales de infraestructura, integración con otros servicios y mejor soporte para trabajo remoto y colaborativo. En el contexto de ALITO GROUP SRL, la adopción de un sistema de facturación cloud permitiría consolidar en un único entorno todos los registros de operaciones comerciales, reduciendo la dispersión actual de archivos y mejorando la trazabilidad de las transacciones.

## 2.2 Arquitectura cloud-native y patrones de diseño

La arquitectura cloud-native se fundamenta en el diseño de aplicaciones específicamente pensadas para ejecutarse en entornos de computación en la nube, aprovechando servicios gestionados, escalabilidad automática y despliegues continuos. Entre sus principios se incluyen el desacoplamiento de componentes, la escalabilidad horizontal, la observabilidad y la seguridad por diseño.

Para ALITO GROUP SRL se propone una arquitectura modular por capas que contemple una capa de presentación, una capa de lógica de negocio y una capa de datos, complementadas con servicios específicos para integración con herramientas de análisis.

## 2.3 Agentes de inteligencia artificial aplicados a la gestión administrativa

Los agentes de inteligencia artificial son entidades de software capaces de percibir su entorno, procesar información y ejecutar acciones de manera autónoma o semiautónoma para cumplir objetivos específicos. En el ámbito administrativo, pueden actuar como asistentes virtuales, módulos de validación de datos o sistemas de recomendación.

Aplicados al caso de ALITO GROUP SRL, los agentes de inteligencia artificial pueden verificar la correcta secuencia de comprobantes fiscales, validar montos de impuestos, identificar patrones de retraso en pagos y generar reportes que apoyen decisiones de crédito y cobro.

## 2.4 Análisis de datos para la toma de decisiones

El análisis de datos aplicado a la facturación permite seguir indicadores clave como volumen de facturación mensual, morosidad y concentración de ingresos por cliente o tipo de servicio. La construcción de tableros de control con representaciones gráficas de estos indicadores facilita la interpretación de tendencias y la toma de decisiones.

En este proyecto se prevé la integración de la solución de facturación con herramientas de análisis de datos que permitan explotar la información generada por el sistema para apoyar a la gerencia de ALITO GROUP SRL.

## 2.5 Marco normativo tributario en República Dominicana

El entorno normativo de la República Dominicana, gestionado por la Dirección General de Impuestos Internos, establece lineamientos específicos para la emisión y control de comprobantes fiscales, así como para la aplicación del ITBIS y otros tributos. Para empresas del sector construcción y servicios resulta imprescindible emitir comprobantes válidos, calcular correctamente los impuestos aplicables y mantener registros organizados y accesibles para auditorías o requerimientos de información.

El diseño de la arquitectura y del sistema de facturación cloud propuesto debe contemplar estos requerimientos normativos desde su concepción, integrando reglas de negocio que aseguren la correcta gestión de comprobantes fiscales y la aplicación de impuestos, así como mecanismos de respaldo de la información.

---

# CAPÍTULO 3. MARCO METODOLÓGICO

## 3.1 Tipo, diseño y enfoque de estudio

El estudio se enmarca en un enfoque cuantitativo de tipo descriptivo-propositivo. Es descriptivo porque caracteriza la situación actual de los procesos administrativos y de facturación en ALITO GROUP SRL, y propositivo porque plantea el diseño e implementación de una solución tecnológica concreta.

El diseño es no experimental y transversal, dado que la información mediante encuesta se recolectará en un solo momento, sin manipulación de variables por parte del investigador.

## 3.2 Localización del estudio

El estudio se desarrollará en la empresa ALITO GROUP SRL, ubicada en Bávaro – Punta Cana, provincia La Altagracia, República Dominicana, durante el año 2025, abarcando las fases de diagnóstico, diseño arquitectónico, desarrollo de prototipo funcional y evaluación piloto.

## 3.3 Unidad de análisis, población y muestra

La unidad de análisis está constituida por los procesos de facturación, cotización, proformas, control de cuentas por cobrar y manejo de comprobantes fiscales en ALITO GROUP SRL.

La población estará conformada por el personal administrativo y operativo vinculado a la gestión de facturación y control financiero en la empresa. Dado el tamaño reducido de la población, se plantea trabajar con un muestreo censal, aplicando la encuesta a la totalidad de los colaboradores que intervienen en el proceso de facturación y gestión administrativa.

## 3.4 Métodos y técnicas de investigación

Se emplearán métodos teóricos como el analítico-sintético y el hipotético-deductivo, y métodos empíricos como la observación directa de los procesos actuales y la aplicación de una encuesta estructurada al personal involucrado en la facturación.

## 3.5 Instrumento de recolección de información

Se utilizará un cuestionario estructurado de tipo mixto, con preguntas cerradas en escala Likert y preguntas abiertas breves. El instrumento medirá la percepción de los colaboradores sobre la eficiencia de los procesos actuales de facturación y control financiero, la frecuencia y tipo de errores que se presentan, el nivel de satisfacción con las herramientas actuales, las necesidades y expectativas frente a un sistema de facturación cloud y la disposición para adoptar una nueva solución tecnológica.

El cuestionario incluirá secciones de datos generales, percepción sobre procesos actuales, errores y frecuencia, expectativas y requerimientos, y consentimiento para el uso de la información con fines académicos y de mejora interna.

## 3.6 Fuentes de datos

Las fuentes primarias estarán constituidas por las respuestas a la encuesta aplicada al personal de ALITO GROUP SRL y por las observaciones directas de los procesos actuales de facturación. Las fuentes secundarias incluirán documentación institucional, normativas tributarias, manuales y documentación técnica de herramientas tecnológicas, así como referencias académicas sobre arquitectura en la nube y agentes de inteligencia artificial.

## 3.7 Criterios de inclusión y exclusión

Se incluirán colaboradores de ALITO GROUP SRL que participen directamente en la facturación, elaboración de cotizaciones y proformas, control de cuentas por cobrar o revisión contable, con al menos tres meses de antigüedad en la empresa. Se excluirá al personal que no tenga relación con los procesos de facturación o gestión administrativa, así como a colaboradores en período de prueba o con muy poco tiempo en la empresa.

## 3.8 Aspectos éticos

Se solicitará el consentimiento informado de los participantes, explicando el propósito académico del estudio, la voluntariedad de su participación y la confidencialidad de la información recolectada. Los datos se utilizarán exclusivamente con fines académicos y de mejora interna de la empresa, sin divulgación de información sensible a terceros.

---

# CAPÍTULO 4. ASPECTOS ADMINISTRATIVOS Y DE CONTROL

## 4.1 Plan de trabajo y cronograma de actividades

| Actividad / Mes                                        | Ene | Feb | Mar | Abr | May | Jun | Jul | Ago | Sep | Oct | Nov |
| ------------------------------------------------------ | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Revisión bibliográfica y consolidación del marco      |  X  |  X  |    |    |    |    |    |    |    |    |    |
| Diagnóstico in situ y levantamiento de requisitos     |  X  |  X  |  X  |    |    |    |    |    |    |    |    |
| Diseño arquitectónico y modelos de datos              |    |  X  |  X  |  X  |    |    |    |    |    |    |    |
| Desarrollo del prototipo de sistema                   |    |    |  X  |  X  |  X  |    |    |    |    |    |    |
| Diseño, validación y aplicación de la encuesta        |    |    |    |  X  |  X  |    |    |    |    |    |    |
| Pilotaje del sistema y pruebas funcionales            |    |    |    |    |  X  |  X  |    |    |    |    |    |
| Análisis de resultados y ajuste del prototipo         |    |    |    |    |    |  X  |  X  |    |    |    |    |
| Integración final con módulos de análisis de datos    |    |    |    |    |    |    |  X  |  X  |    |    |    |
| Redacción del informe final                           |    |    |    |    |    |    |    |  X  |  X  |    |    |
| Revisión con asesor y ajustes finales                 |    |    |    |    |    |    |    |    |  X  |  X  |    |
| Preparación para defensa y difusión interna           |    |    |    |    |    |    |    |    |    |  X  |  X  |
| Defensa del proyecto                                  |    |    |    |    |    |    |    |    |    |    |  X  |

## 4.2 Presupuesto estimado

| Concepto                                         | Cantidad aproximada | Precio unitario (RD$) | Inversión total (RD$) |
| ------------------------------------------------ | ------------------: | ---------------------: | ---------------------: |
| Equipos o actualización de hardware              |                   1 |                30,000 |                30,000 |
| Conectividad o mejoras de red                    |                   1 |                10,000 |                10,000 |
| Licencias de software o servicios en la nube     |            12 meses |                 2,000 |                24,000 |
| Material de oficina e impresión de documentos    |                 N/A |                   N/A |                 5,000 |
| Transporte y logística para reuniones            |                 N/A |                   N/A |                 5,000 |
| Diversos e imprevistos                           |                 N/A |                   N/A |                 6,000 |
| Total estimado                                   |                     |                        |                80,000 |

---

# Bibliografía

Dirección General de Impuestos Internos. Normativa tributaria sobre comprobantes fiscales y facturación electrónica.

International Organization for Standardization. ISO 9001:2015 — Quality management systems.

Documentación técnica de herramientas de análisis de datos y automatización de flujos de trabajo.

Guías institucionales de la Universidad Central del Este para la presentación de proyectos de ingeniería.

---

# Anexos

## Anexo 1. Cuestionario de la encuesta

Cuestionario estructurado aplicado al personal de ALITO GROUP SRL, con secciones de datos generales, percepción sobre procesos actuales, errores y frecuencia, expectativas y requerimientos, y consentimiento informado.

## Anexo 2. Diagramas de arquitectura y casos de uso

Diagramas de casos de uso, componentes y despliegue que representan la solución propuesta para el sistema de facturación cloud con agentes de inteligencia artificial.
