# ANTEPROYECTO DE TESIS

## Portada (modelo para Word)

UNIVERSIDAD CENTRAL DEL ESTE
FACULTAD DE INGENIERÍA Y TECNOLOGÍA (AJUSTAR SI APLICA)
ESCUELA DE INGENIERÍA EN SOFTWARE (AJUSTAR SI APLICA)

**TÍTULO DEL ANTEPROYECTO:**
**Arquitectura y desarrollo de un sistema de facturación cloud impulsado por agentes de IA para ALITO GROUP SRL, Bávaro – Punta Cana (2025).**

TRABAJO DE INVESTIGACIÓN PARA OPTAR POR EL TÍTULO DE:
**INGENIERO EN SOFTWARE** (AJUSTAR AL GRADO CORRESPONDIENTE)

SUSTENTANTE(S):

- Wilber Alfredo De LA Rosa MArte – Matrícula: 2022-0547
- Jesus Andres Acevedo Carrasco – Matrícula: 2020-2551

ASESOR(ES):

- Ramón Eduardo Zorrilla Mateo

Lugar, República Dominicana
Bávaro – Punta Cana, La Altagracia
2025

---

## Tabla de contenidos (referencial)

1. CAPÍTULO 1. ASPECTOS GENERALES1.1 Introducción1.1.1 Antecedentes1.1.2 Justificación e importancia1.2 Planteamiento del problema1.3 Formulación de hipótesis (si aplica)1.4 Objetivos1.4.1 Objetivo general1.4.2 Objetivos específicos1.5 Variables e indicadores
2. CAPÍTULO 2. MARCO TEÓRICO (Opcional en anteproyecto, se deja bosquejo)
3. CAPÍTULO 3. MARCO METODOLÓGICO
4. CAPÍTULO 4. ASPECTOS ADMINISTRATIVOS Y DE CONTROL
5. Bibliografía
6. Anexos

> En Word se generará automáticamente la tabla de contenidos, aquí se presenta solo a modo de guía.

---

# CAPÍTULO 1. ASPECTOS GENERALES

## 1.1 Introducción

La transformación digital ha modificado sustancialmente la manera en que las organizaciones gestionan sus procesos administrativos y financieros. En sectores como la construcción y el alquiler de equipos pesados, donde las operaciones comerciales son frecuentes y diversas, la necesidad de contar con sistemas eficientes de facturación se ha convertido en un factor determinante para la competitividad empresarial.

En la República Dominicana, la facturación comercial está regulada por la Dirección General de Impuestos Internos (DGII), que establece lineamientos específicos para la emisión de comprobantes fiscales (NCF) y la aplicación del Impuesto a las Transferencias de Bienes Industrializados y Servicios (ITBIS), actualmente fijado en 18 %. El cumplimiento de estas normativas requiere precisión en los cálculos, control riguroso de las secuencias de comprobantes y conservación adecuada de los registros contables. Los errores en estos procesos, aun cuando sean involuntarios, pueden derivar en sanciones económicas, observaciones fiscales y deterioro de la imagen empresarial.

En este contexto, la presente investigación propone el diseño y desarrollo de un sistema de facturación en la nube (cloud) integrado con agentes de inteligencia artificial, orientado a resolver las problemáticas de gestión documental y control fiscal que enfrentan las pequeñas y medianas empresas del sector. El caso de estudio se centra en ALITO GROUP SRL, una empresa con más de siete años de trayectoria en el mercado de alquiler de maquinaria pesada y movimiento de materiales en la zona de Bávaro – Punta Cana, provincia La Altagracia.

El presente documento está estructurado en cuatro capítulos: el primero aborda los aspectos generales del estudio, incluyendo los antecedentes, la justificación, el planteamiento del problema, los objetivos y las variables de investigación; el segundo presenta un bosquejo del marco teórico que sustentará el desarrollo; el tercero detalla el marco metodológico, describiendo el enfoque, las técnicas y los instrumentos de recolección de datos; y el cuarto contiene los aspectos administrativos, incluyendo el cronograma de actividades y el presupuesto estimado.

## 1.1.1 Antecedentes

La problemática de la gestión de facturación en pequeñas y medianas empresas ha sido abordada desde diversas perspectivas en la literatura académica y en reportes técnicos del sector. A continuación se presentan los antecedentes más relevantes, organizados en tres ejes temáticos.

### Sistemas de facturación y automatización de procesos administrativos

Diversos estudios han demostrado que la automatización de procesos de facturación genera beneficios tangibles para las organizaciones: reducción de errores humanos, centralización de la información, trazabilidad completa de las transacciones y mejor cumplimiento de las obligaciones fiscales (DGII, 2024; ISO, 2015). En sectores con operaciones distribuidas y alta rotación de servicios, como el alquiler de maquinaria y el movimiento de materiales, la ausencia de sistemas integrados suele derivar en problemas recurrentes que afectan tanto la operación interna como la relación con los clientes.

Los reportes técnicos identifican como causas frecuentes de ineficiencia: el uso de hojas de cálculo para procesos transaccionales que requieren mayor control, la falta de mecanismos automáticos para verificar la numeración de comprobantes fiscales, y la carencia de herramientas analíticas que permitan detectar tendencias de morosidad o patrones de error sistemático.

### Inteligencia artificial aplicada a procesos administrativos

La incorporación de técnicas de inteligencia artificial en los procesos de facturación y gestión documental ha mostrado resultados positivos en experiencias prácticas documentadas. Las aplicaciones más frecuentes incluyen: validación automática de datos (por ejemplo, verificación de secuencias de NCF), clasificación automática de documentos según su tipo y contenido, y detección de anomalías que anticipen riesgos de incumplimiento o errores de captura.

Estas aproximaciones han demostrado mejoras en la tasa de detección de inconsistencias y en la reducción del trabajo manual asociado a tareas de auditoría y verificación contable.

### Business Intelligence en la gestión financiera

La integración de herramientas de Business Intelligence (BI) con sistemas transaccionales permite transformar los datos operativos en indicadores accionables para la toma de decisiones gerenciales. En el contexto de facturación, el BI facilita el seguimiento de métricas como volumen de facturación por período, índices de morosidad, concentración de ingresos por cliente y comportamiento estacional de las ventas.

### Situación actual de ALITO GROUP SRL

El diagnóstico preliminar realizado en ALITO GROUP SRL revela una situación que coincide con los problemas descritos en la literatura: dependencia de hojas de cálculo para la elaboración de cotizaciones, proformas y facturas; coordinación mediante correo electrónico y aplicaciones de mensajería; y procesos manuales para la verificación de NCF y el cálculo del ITBIS. Esta realidad, sumada a las normativas y guías técnicas de la DGII (2024) y a las buenas prácticas de ingeniería de software (arquitectura modular, seguridad por diseño), sustenta la pertinencia y viabilidad técnica del proyecto propuesto.

## 1.1.2 Justificación e importancia

### El contexto empresarial actual: por qué la facturación es un tema crítico

En el entorno empresarial contemporáneo, caracterizado por la globalización, la digitalización acelerada y una competencia cada vez más intensa, las organizaciones se enfrentan a la necesidad imperante de optimizar cada uno de sus procesos internos para mantenerse competitivas y sostenibles. Dentro de este contexto, la gestión de la facturación y el control de cuentas por cobrar han dejado de ser considerados simples trámites administrativos para convertirse en **pilares estratégicos** que determinan la salud financiera, la capacidad operativa y el potencial de crecimiento de cualquier empresa.

La facturación no es un proceso aislado: representa el punto de convergencia entre la prestación del servicio, el registro contable, el cumplimiento tributario, la relación con el cliente y el flujo de caja. Un error en la facturación no solo afecta los ingresos inmediatos de la empresa, sino que puede desencadenar una serie de consecuencias en cadena: retrasos en la cobranza, incumplimientos fiscales, pérdida de confianza del cliente, sanciones regulatorias y, en última instancia, deterioro de la reputación empresarial.

La presente investigación se justifica porque aborda esta necesidad crítica en la gestión empresarial contemporánea: contar con procesos de facturación y control de cuentas por cobrar que sean **rápidos, confiables, trazables y escalables**. En numerosas organizaciones, especialmente pequeñas y medianas empresas (PYMES), estos procesos todavía se apoyan en prácticas manuales o herramientas ofimáticas genéricas que no fueron diseñadas para manejar transacciones repetitivas de alto volumen, control de versiones, auditoría de cambios y disponibilidad multiusuario. En ese escenario, la operación se vuelve vulnerable al retrabajo constante, a inconsistencias documentales y a la falta de información consolidada para la toma de decisiones.

### ¿Por qué se elige este tema? Fundamentación de la elección

Este anteproyecto elige el tema de arquitectura y desarrollo de un sistema de facturación cloud con agentes de inteligencia artificial porque la facturación es un proceso **transversal y multidimensional**: afecta directamente la ejecución del servicio, el flujo de caja, la satisfacción del cliente, el control interno y el cumplimiento de obligaciones tributarias. Por tanto, cualquier mejora sustancial en este proceso impacta directamente la estabilidad operativa y la capacidad de crecimiento de la empresa en múltiples frentes simultáneamente.

La elección de este tema se sustenta en seis razones fundamentales:

1. **Centralidad del proceso de facturación en la operación empresarial:** La facturación es el punto donde convergen todos los datos críticos del negocio: información de clientes, servicios prestados, precios acordados, impuestos aplicables y condiciones de pago. Cualquier debilidad o ineficiencia en este punto se propaga inevitablemente al resto de la gestión financiera, contable y operativa de la empresa. Un sistema de facturación deficiente no solo genera problemas inmediatos, sino que contamina la calidad de la información en toda la organización.

2. **Necesidad imperante de estandarización de procesos:** La estandarización es un requisito fundamental para reducir la variabilidad operativa, facilitar el control gerencial y permitir la medición del desempeño mediante indicadores consistentes y comparables. Sin procesos estandarizados, resulta prácticamente imposible identificar cuellos de botella, medir la productividad del personal, detectar patrones de error o implementar mejoras continuas basadas en datos objetivos.

3. **Demanda creciente de inmediatez y capacidad de respuesta:** La dinámica empresarial actual exige rapidez en todas las interacciones comerciales. Los clientes esperan recibir cotizaciones, proformas y facturas en tiempos cada vez más cortos. La gerencia requiere acceso instantáneo a estados de cuenta consolidados y reportes financieros para tomar decisiones oportunas. Los procesos manuales basados en búsquedas en archivos dispersos simplemente no pueden satisfacer estas demandas de velocidad.

4. **Disponibilidad de tecnologías habilitadoras maduras:** La evolución de los entornos cloud computing, las APIs modernas, las herramientas de analítica avanzada y los agentes de inteligencia artificial ha alcanzado un nivel de madurez que permite construir sistemas altamente escalables, seguros y accesibles. Estas tecnologías, que hace una década eran costosas y complejas de implementar, ahora están al alcance de empresas de todos los tamaños, democratizando el acceso a soluciones empresariales de clase mundial.

5. **Brecha tecnológica en el sector de servicios y construcción:** Mientras industrias como el comercio minorista, la banca y las telecomunicaciones han adoptado masivamente sistemas automatizados de facturación, el sector de alquiler de equipos pesados y construcción en la República Dominicana aún presenta rezagos significativos en materia de digitalización de procesos administrativos. Esta brecha representa tanto un riesgo competitivo como una oportunidad de diferenciación para las empresas que se adelanten en la adopción tecnológica.

6. **Alineación con las tendencias regulatorias:** La Dirección General de Impuestos Internos (DGII) de la República Dominicana ha impulsado progresivamente la adopción de la facturación electrónica y el cumplimiento de estándares más estrictos en la gestión de comprobantes fiscales (NCF). Las empresas que no modernicen sus sistemas de facturación enfrentarán dificultades crecientes para cumplir con las normativas fiscales y podrían verse expuestas a sanciones, auditorías adversas y pérdida de beneficios tributarios.

### Urgencia y necesidad del proyecto: ¿por qué es prioritario actuar ahora?

La urgencia de desarrollar e implementar este proyecto no es arbitraria ni responde únicamente a preferencias tecnológicas; se fundamenta en la estrecha vinculación del proceso de facturación con variables críticas y sensibles para la supervivencia y el crecimiento empresarial:

**Impacto directo en el flujo de caja y la liquidez:**
Los retrasos en la emisión de facturas, las correcciones tardías de errores y la dificultad para consolidar información de cobranza tienen un impacto directo y cuantificable en el flujo de caja de la empresa. Cada día de demora en la emisión de una factura representa un día adicional hasta el cobro efectivo. En una empresa con operaciones diarias de alquiler de equipos y prestación de servicios, esta demora acumulada puede traducirse en miles de pesos dominicanos de capital de trabajo inmovilizado innecesariamente. La optimización del ciclo de facturación-cobranza es, por tanto, una medida urgente de gestión financiera.

**Riesgo creciente de saturación operativa:**
Cuando el volumen de trabajo aumenta —como sucede en una empresa en etapa de crecimiento activo— las prácticas manuales tienden a saturarse rápidamente. Lo que funcionaba aceptablemente con 20 facturas mensuales se convierte en un cuello de botella crítico cuando el volumen asciende a 100, 200 o más transacciones. Esta saturación genera dependencia excesiva de personas clave (que pueden enfermarse, renunciar o ausentarse), retrasos en la atención a clientes, acumulación de trabajo pendiente y un ambiente de estrés permanente en el personal administrativo. Esperar a que el colapso operativo ocurra para actuar sería una decisión gerencial irresponsable.

**Exposición creciente a incumplimientos y sanciones:**
A mayor volumen de operaciones, mayor es la probabilidad de cometer errores si no existen controles sistematizados y automatizados. Errores en la secuencia de NCF, cálculos incorrectos del ITBIS, duplicación de registros, omisión de facturas en las declaraciones tributarias: cada uno de estos problemas, cuando se detecta tardíamente, genera costos de corrección, posibles multas de la DGII, intereses moratorios y un consumo de tiempo gerencial que debería destinarse a actividades de mayor valor estratégico.

**Deterioro de la experiencia del cliente:**
En un mercado altamente competitivo, la experiencia del cliente se ha convertido en un factor diferenciador crítico. Los clientes no solo evalúan la calidad del servicio técnico (en este caso, el alquiler de equipos y movimiento de materiales), sino también la profesionalidad de la interacción administrativa. Demoras en el envío de cotizaciones, errores en las facturas, dificultad para obtener estados de cuenta actualizados: todos estos problemas erosionan la confianza del cliente, dificultan las negociaciones comerciales y pueden inclinar la balanza hacia competidores que ofrezcan una experiencia administrativa superior.

**Limitaciones para el crecimiento sostenible:**
Una empresa que aspira a crecer de manera sostenida no puede permitirse que sus procesos administrativos se conviertan en un freno para la expansión comercial. Si cada nuevo cliente o cada nueva operación representa una carga desproporcionada de trabajo administrativo manual, el crecimiento se vuelve costoso, lento y arriesgado. La automatización de la facturación no es un lujo tecnológico: es un habilitador estratégico del crecimiento empresarial.

### Problemática común: una realidad compartida por empresas de todos los sectores

Es importante destacar que la situación que motiva este proyecto no es exclusiva de ALITO GROUP SRL ni del sector de alquiler de equipos pesados. Los problemas derivados de una gestión manual y desarticulada de la facturación son **extremadamente comunes** en empresas de diversos tamaños, sectores y ubicaciones geográficas. Investigaciones académicas y reportes empresariales han documentado ampliamente esta problemática:

Según estudios realizados en Latinoamérica, las empresas que mantienen procesos manuales de facturación experimentan tasas de error significativamente más altas que aquellas con sistemas automatizados, con diferencias que pueden superar el 40% en la frecuencia de inconsistencias documentales. Estas empresas también reportan tiempos de procesamiento hasta cinco veces mayores para completar tareas rutinarias de facturación y cobranza.

Las condiciones que configuran esta problemática común incluyen:

- **Crecimiento del volumen transaccional sin actualización de herramientas:** Empresas que comenzaron con pocos clientes y pocas operaciones, utilizando hojas de cálculo de forma artesanal, pero que al crecer nunca actualizaron sus sistemas a soluciones profesionales.

- **Dependencia de registros manuales dispersos:** Información almacenada en múltiples archivos, carpetas, correos electrónicos y aplicaciones de mensajería, sin integración ni visibilidad centralizada.

- **Ausencia de trazabilidad y auditoría:** Imposibilidad de identificar quién realizó qué cambio, cuándo y por qué, lo que dificulta la detección de errores, la rendición de cuentas y las auditorías internas o externas.

- **Incapacidad de generar información gerencial oportuna:** Gerentes y propietarios que deben esperar días o semanas para obtener reportes consolidados, o que simplemente no tienen acceso a indicadores clave de desempeño.

En consecuencia, además de resolver una necesidad concreta y urgente en ALITO GROUP SRL, el presente proyecto posee un valor adicional significativo por su **potencial de replicabilidad y transferencia**: el enfoque arquitectónico, los módulos transaccionales desarrollados, el esquema de indicadores de gestión y las lecciones aprendidas durante la implementación pueden adaptarse y aplicarse a organizaciones con problemáticas equivalentes en múltiples sectores económicos.

### Justificación operativa: agilidad, automatización y eficiencia como imperativos

Desde el punto de vista estrictamente operativo, el proyecto se justifica como una necesidad para transformar un proceso actualmente intensivo en tareas manuales repetitivas en un flujo de trabajo estandarizado, automatizado y medible. Esta transformación no es una simple mejora incremental: representa un cambio cualitativo en la forma de operar que permitirá a la empresa:

- **Reducir drásticamente los tiempos de procesamiento:** La captura, emisión, consulta y modificación de documentos comerciales (cotizaciones, proformas, facturas, notas de crédito, estados de cuenta) se realizará en una fracción del tiempo actualmente requerido, liberando horas de trabajo del personal administrativo para actividades de mayor valor agregado.

- **Eliminar el retrabajo sistemático:** La automatización de validaciones (secuencia de NCF, cálculos de ITBIS, datos de clientes) permitirá detectar errores en el momento de la captura, antes de que se propaguen y requieran correcciones costosas.

- **Garantizar consistencia y cumplimiento normativo:** Las reglas de negocio y los controles fiscales estarán integrados en el sistema, asegurando que cada documento emitido cumpla automáticamente con los requisitos internos y regulatorios.

- **Habilitar disponibilidad de información en tiempo real:** Cualquier usuario autorizado, desde cualquier ubicación, podrá acceder a la información actualizada del sistema, eliminando la dependencia de archivos locales y personas específicas.

### Justificación económica y estratégica: decisiones informadas para maximizar beneficios

En una empresa en constante crecimiento como ALITO GROUP SRL, con grandes volúmenes de trabajo y operaciones diversificadas, la capacidad de tomar decisiones oportunas y fundamentadas en datos confiables es un factor determinante para el éxito sostenido. Cuando la información financiera se encuentra dispersa en múltiples archivos, tarda en consolidarse o presenta inconsistencias, la gerencia pierde capacidad para actuar a tiempo ante oportunidades y amenazas del mercado.

La incorporación de capacidades de Business Intelligence y analítica en el sistema de facturación se justifica porque habilita:

- **Monitoreo continuo de indicadores clave de desempeño (KPI):** Facturación diaria, semanal y mensual; antigüedad de cuentas por cobrar; índices de morosidad; concentración de ingresos por cliente; margen por tipo de servicio; productividad del personal de facturación.

- **Identificación proactiva de tendencias y patrones:** Detección temprana de clientes con comportamiento de pago deteriorante, servicios con rentabilidad decreciente, estacionalidad de la demanda, o cualquier otro patrón que requiera atención gerencial.

- **Priorización basada en datos:** Decisiones de cobranza, extensión de crédito, negociación de plazos y condiciones comerciales fundamentadas en información objetiva y actualizada, no en intuiciones o percepciones subjetivas.

- **Reducción de la incertidumbre:** Mayor confiabilidad en las proyecciones financieras, los presupuestos y los planes de crecimiento, gracias a la disponibilidad de datos históricos precisos y análisis de tendencias.

### Justificación tecnológica: cloud e inteligencia artificial como facilitadores del cambio

La adopción de una arquitectura cloud-native (nativa en la nube) es particularmente pertinente para este proyecto por múltiples razones técnicas y de negocio:

- **Escalabilidad bajo demanda:** El sistema podrá crecer automáticamente con el aumento del volumen de operaciones, sin requerir inversiones anticipadas en infraestructura que podrían quedar subutilizadas.

- **Acceso controlado desde cualquier ubicación:** El personal administrativo, los supervisores de campo y la gerencia podrán acceder al sistema desde la oficina, desde sitios de obra o desde cualquier ubicación con conectividad, sin comprometer la seguridad de la información.

- **Actualizaciones y mejoras continuas:** El modelo cloud permite implementar mejoras, correcciones y nuevas funcionalidades de manera ágil, sin interrupciones prolongadas del servicio.

- **Integración con servicios modernos:** Pasarelas de pago, herramientas de firma digital, servicios de envío de notificaciones, plataformas de analítica: la arquitectura cloud facilita la interconexión con el ecosistema tecnológico actual.

A su vez, los agentes de inteligencia artificial aportan un valor diferencial significativo como mecanismos de apoyo y automatización inteligente para:

- **Validación automática de datos y consistencia:** Verificación instantánea de secuencias de NCF, cálculos de impuestos, datos de clientes y cualquier otra regla de negocio configurable.

- **Detección temprana de inconsistencias y anomalías:** Identificación automática de patrones que podrían indicar errores de captura, fraude, duplicación de registros u otras situaciones que requieran revisión humana.

- **Asistencia inteligente en la generación de documentos:** Sugerencias automáticas basadas en el historial del cliente, completado inteligente de campos, y generación de reportes personalizados a partir de consultas en lenguaje natural.

### Importancia y trascendencia del proyecto

La importancia del proyecto trasciende la simple implementación de una herramienta tecnológica, ya que articula mejoras medibles y significativas en múltiples dimensiones:

**A nivel organizacional:** El proyecto optimizará los tiempos de respuesta en los procesos de facturación, reducirá sustancialmente la tasa de errores documentales, eliminará duplicidades y retrabajo, y fortalecerá el control interno sobre la información financiera crítica de la empresa.

**A nivel gerencial y estratégico:** Proporcionará a la dirección de ALITO GROUP SRL información consolidada, confiable y oportuna para la toma de decisiones estratégicas, habilitando el seguimiento sistemático del desempeño mediante KPI y tableros de control gerenciales.

**A nivel operativo y de recursos humanos:** Liberará al personal administrativo de tareas repetitivas y de bajo valor, permitiéndoles enfocarse en actividades de mayor impacto, como la atención al cliente, la gestión de cobranza proactiva y el análisis de oportunidades comerciales.

**A nivel académico y profesional:** El proyecto integra de manera coherente disciplinas y tecnologías de vanguardia: arquitectura cloud, desarrollo de sistemas transaccionales, automatización de procesos, inteligencia artificial aplicada y analítica de negocios, todo ello aplicado a un caso empresarial real con problemáticas concretas y resultados medibles.

### Síntesis de la justificación

En síntesis, la realización de este proyecto se fundamenta como una **necesidad urgente y estratégica** para una empresa que se encuentra en una trayectoria de crecimiento sostenido, con volúmenes de trabajo crecientes y demandas cada vez más exigentes tanto de clientes como de autoridades regulatorias.

El proyecto no es una opción discrecional ni una inversión de lujo: es un requisito ineludible para agilizar operaciones, automatizar controles críticos, reducir la carga operativa del personal, eliminar fuentes sistemáticas de error, garantizar el cumplimiento fiscal, mejorar la experiencia del cliente y, fundamentalmente, habilitar la toma de decisiones oportunas y fundamentadas que permitan a ALITO GROUP SRL maximizar sus beneficios y consolidar su posición competitiva en el mercado de Bávaro – Punta Cana y la región turística del este de la República Dominicana.

La demora en la ejecución de este proyecto no es neutral: cada mes que transcurre sin una solución integral representa costos de oportunidad, exposición a riesgos operativos y regulatorios, y erosión de la capacidad competitiva de la empresa. La decisión de actuar ahora es, por tanto, una decisión estratégica de preservación y potenciación del valor empresarial.

## 1.2 Planteamiento del problema

### Contexto organizacional y operativo de ALITO GROUP SRL

ALITO GROUP SRL es una empresa dominicana fundada hace más de siete años, especializada en el sector de alquiler de equipos pesados, movimiento de materiales y servicios asociados a la construcción. Su sede operativa se encuentra en Bávaro – Punta Cana, provincia La Altagracia, una de las zonas de mayor dinamismo económico y desarrollo inmobiliario de la República Dominicana.

La empresa ha experimentado un crecimiento sostenido durante su trayectoria, consolidándose como un proveedor de referencia para proyectos de construcción residencial, comercial y turística en la región este del país. Su portafolio de servicios incluye:

**Servicios de alquiler de maquinaria pesada:**
- Excavadoras de diversos tamaños y capacidades
- Retroexcavadoras para trabajos de excavación y carga
- Montacargas para manejo de materiales en obra
- Rodillos compactadores para preparación de terrenos
- Minicargadores (skid-steer loaders) para espacios reducidos
- Otros equipos especializados según demanda del proyecto

**Servicios de transporte y suministro:**
- Transporte de materiales mediante camiones de volteo de alta capacidad (22 m³)
- Transporte con camiones de capacidad media (16 m³)
- Transporte con camiones de capacidad menor (6 m³) para accesos difíciles
- Suministro de materiales de construcción: arena, grava, piedra, relleno y otros agregados

**Servicios complementarios:**
- Excavaciones para cimentaciones, piscinas, sótanos y obras civiles
- Limpieza y preparación de terrenos y obras
- Demolición controlada de estructuras
- Movimiento de tierra y nivelación de terrenos

Dada la diversidad y complejidad de sus operaciones, la empresa genera un volumen considerable de transacciones comerciales diarias, que incluyen: cotizaciones preliminares, cotizaciones formales, proformas, facturas con comprobantes fiscales (NCF), notas de crédito, notas de débito y estados de cuenta consolidados. Estos documentos están dirigidos a una cartera de clientes conformada principalmente por empresas constructoras, desarrolladores inmobiliarios, contratistas independientes e instituciones públicas de la zona turística del este.

### Descripción detallada del problema: desglose por categorías

El diagnóstico realizado en ALITO GROUP SRL revela un conjunto articulado de problemas que afectan los procesos de facturación, gestión documental y control financiero. A continuación se presenta un desglose exhaustivo de las problemáticas identificadas, organizadas en siete categorías principales:

---

#### Categoría 1: Problemas en los procesos de elaboración documental

**Problema 1.1: Proceso de cotización fragmentado y lento**

La elaboración de una cotización para un cliente requiere actualmente la ejecución de múltiples pasos manuales sin integración entre ellos:

- Búsqueda de los datos del cliente (nombre, RNC/cédula, dirección, contacto) en archivos dispersos o mediante consultas a otros colaboradores.
- Localización y copia de una plantilla de cotización en formato Excel, con el riesgo de utilizar versiones desactualizadas.
- Transcripción manual de los servicios solicitados, tarifas y condiciones específicas.
- Cálculo manual de subtotales, aplicación del ITBIS (18%) y determinación del monto total.
- Guardado del archivo con una nomenclatura que no sigue estándares consistentes.
- Conversión a PDF para envío al cliente.
- Envío mediante correo electrónico o aplicaciones de mensajería (WhatsApp).

**Evidencia:** Se estima que la elaboración de una cotización completa consume entre 15 y 30 minutos, dependiendo de la complejidad del servicio y la disponibilidad de información del cliente. En días de alta demanda, el personal administrativo puede recibir múltiples solicitudes simultáneas que generan colas de espera y retrasos en la respuesta comercial.

**Problema 1.2: Proceso de facturación manual con múltiples puntos de fallo**

La emisión de facturas sigue un proceso similar al de las cotizaciones, con pasos adicionales que incrementan la complejidad y el riesgo de error:

- Verificación del NCF (Número de Comprobante Fiscal) disponible en la secuencia asignada por la DGII.
- Asignación manual del NCF a la factura, sin validación automática de secuencia ni detección de duplicados.
- Registro manual del NCF utilizado en una hoja de control separada.
- Cálculo manual del ITBIS, con verificación adicional mediante calculadora o fórmulas de Excel.
- Generación del documento en formato combinado (Excel + PDF).
- Archivo físico y/o digital del documento sin validación de integridad.

**Evidencia:** Se han detectado casos de NCF asignados fuera de secuencia, NCF duplicados en diferentes facturas, y NCF omitidos (saltos en la numeración). Cada uno de estos errores requiere procesos de corrección ante la DGII que consumen tiempo y pueden generar sanciones.

**Problema 1.3: Generación de proformas sin control de versiones**

Las proformas, documentos previos a la factura formal utilizados para confirmación de servicios, se generan mediante copias de archivos anteriores modificados manualmente. No existe un control de versiones que permita:

- Identificar cuál es la versión vigente de una proforma cuando se han realizado múltiples modificaciones.
- Rastrear los cambios realizados entre versiones.
- Asociar la proforma con la cotización original y la factura posterior.

**Evidencia:** Se han reportado situaciones en las que el cliente recibe una proforma con condiciones diferentes a las acordadas previamente, generando confusiones, reclamos y retrabajo.

**Problema 1.4: Estados de cuenta generados mediante consolidación manual**

Cuando un cliente solicita un estado de cuenta consolidado, el personal administrativo debe:

- Identificar todas las facturas emitidas a ese cliente en el período solicitado.
- Revisar múltiples archivos y hojas de cálculo para localizar cada documento.
- Verificar el estado de pago de cada factura (pendiente, parcialmente pagado, pagado).
- Transcribir la información a un nuevo documento consolidado.
- Calcular saldos pendientes, pagos realizados y antigüedad de la deuda.

**Evidencia:** La generación de un estado de cuenta consolidado puede tomar entre 30 minutos y 2 horas, dependiendo del volumen de transacciones del cliente y la dispersión de la información. Este tiempo es claramente desproporcionado para una tarea que debería ser rutinaria.

---

#### Categoría 2: Problemas en la gestión de datos maestros

**Problema 2.1: Registros de clientes duplicados e inconsistentes**

La ausencia de un catálogo centralizado de clientes con validaciones de unicidad ha generado:

- Múltiples registros para un mismo cliente con variaciones en el nombre comercial, razón social o datos de contacto.
- Clientes registrados con RNC/cédula incorrectos o incompletos.
- Información de contacto desactualizada (teléfonos, correos, direcciones) que dificulta la comunicación y la cobranza.
- Imposibilidad de consolidar el historial completo de un cliente cuando sus transacciones están dispersas bajo diferentes registros.

**Evidencia:** En una revisión preliminar de los archivos existentes, se identificaron casos de clientes con 3 o 4 registros diferentes, cada uno con variaciones menores en la escritura del nombre o diferencias en los datos de contacto.

**Problema 2.2: Catálogo de servicios y tarifas desactualizado**

No existe un catálogo maestro centralizado y actualizado de los servicios ofrecidos por la empresa con sus tarifas vigentes. Las consecuencias incluyen:

- Personal que consulta listas de precios obsoletas o aplica tarifas incorrectas.
- Inconsistencia en los precios cobrados a clientes por servicios similares.
- Dificultad para implementar cambios de tarifas de manera uniforme en toda la operación.
- Negociaciones de precios sin visibilidad de los márgenes mínimos aceptables.

**Evidencia:** Se han identificado cotizaciones con tarifas significativamente diferentes para el mismo tipo de servicio, sin una justificación documentada de la variación.

**Problema 2.3: Ausencia de historial transaccional integrado**

La información de cada cliente (cotizaciones, proformas, facturas, pagos, notas de crédito) se encuentra dispersa en múltiples archivos sin un vínculo estructurado que permita:

- Visualizar el historial completo de la relación comercial con cada cliente.
- Identificar patrones de consumo, estacionalidad o preferencias de servicios.
- Evaluar la rentabilidad histórica de cada cliente.
- Analizar el comportamiento de pago y el riesgo crediticio.

---

#### Categoría 3: Problemas en la infraestructura tecnológica y acceso a la información

**Problema 3.1: Dependencia de archivos locales sin respaldo sistemático**

La información crítica de facturación se almacena en computadoras locales de la oficina, con las siguientes limitaciones:

- Riesgo de pérdida de información por fallas de hardware, virus, ransomware o desastres (incendios, inundaciones, robos).
- No existe un sistema de respaldo automático y verificado de los archivos críticos.
- Los respaldos manuales, cuando se realizan, son esporádicos e incompletos.
- No hay procedimientos de recuperación ante desastres probados y documentados.

**Evidencia:** Si una de las computadoras principales sufriera un daño catastrófico, la empresa podría perder meses o años de información histórica de facturación, con consecuencias graves para auditorías fiscales y gestión de cobranza.

**Problema 3.2: Acceso restringido a ubicación física**

El acceso a los archivos de facturación está limitado a las computadoras de la oficina, lo que genera:

- Imposibilidad de consultar información desde ubicaciones remotas (obras, visitas a clientes, viajes).
- Dependencia de la disponibilidad de equipos específicos que pueden estar ocupados por otros usuarios.
- Incapacidad de responder a consultas urgentes de clientes fuera del horario de oficina.
- Limitaciones para el trabajo colaborativo entre personal de diferentes áreas o ubicaciones.

**Problema 3.3: Ausencia de control de acceso y permisos**

Todos los usuarios con acceso a las carpetas compartidas tienen los mismos privilegios, sin diferenciación de roles ni permisos:

- Cualquier usuario puede modificar o eliminar cualquier archivo, incluyendo documentos históricos.
- No existe registro de quién realizó qué cambio, cuándo y por qué.
- No hay protección contra modificaciones accidentales o malintencionadas de documentos ya emitidos.
- No se puede implementar segregación de funciones para control interno.

---

#### Categoría 4: Problemas en la gestión de cobranza y flujo de caja

**Problema 4.1: Ausencia de alertas y recordatorios automatizados**

No existe un mecanismo que genere alertas automáticas para:

- Facturas próximas a vencer (por ejemplo, 5 días antes del vencimiento).
- Facturas vencidas que requieren seguimiento inmediato.
- Clientes con múltiples facturas pendientes que superan un umbral de riesgo.
- Compromisos de pago registrados que deben verificarse en fechas específicas.

**Evidencia:** El seguimiento de la cobranza depende de la memoria y la revisión manual periódica por parte del personal, lo que resulta en seguimientos tardíos o omitidos.

**Problema 4.2: Dificultad para determinar saldos en tiempo real**

Cuando un cliente consulta su saldo pendiente o cuando la gerencia necesita conocer el estado de las cuentas por cobrar, el proceso requiere:

- Revisar manualmente todas las facturas del cliente.
- Verificar los pagos registrados y cruzarlos con las facturas.
- Calcular el saldo resultante considerando notas de crédito y ajustes.
- Este proceso puede tomar minutos u horas, dependiendo del volumen.

**Problema 4.3: Falta de análisis de antigüedad de cartera**

No se genera de forma rutinaria un análisis de antigüedad de las cuentas por cobrar que permita clasificar la cartera en rangos:

- 0-30 días (cartera corriente)
- 31-60 días (cartera vencida reciente)
- 61-90 días (cartera vencida)
- Más de 90 días (cartera de difícil cobro)

Esta información es esencial para priorizar esfuerzos de cobranza, constituir reservas contables y tomar decisiones de crédito.

---

#### Categoría 5: Problemas de cumplimiento normativo y fiscal

**Problema 5.1: Riesgo de errores en la gestión de NCF**

La gestión manual de los Números de Comprobante Fiscal (NCF) expone a la empresa a múltiples tipos de errores:

- **Saltos en la secuencia:** NCF que quedan sin utilizar, requiriendo justificación ante la DGII.
- **Duplicación de NCF:** Mismo número asignado a dos facturas diferentes, lo que constituye una falta grave.
- **Uso de NCF vencidos:** Comprobantes de secuencias que han excedido su fecha de vigencia.
- **Tipo de NCF incorrecto:** Uso de comprobantes de crédito fiscal cuando corresponde consumidor final, o viceversa.

**Evidencia:** Cada error en NCF detectado en auditoría de la DGII puede generar multas, recargos e intereses, además del tiempo invertido en procesos de regularización.

**Problema 5.2: Errores en el cálculo y aplicación del ITBIS**

Los cálculos manuales del ITBIS (18%) son propensos a errores por:

- Errores aritméticos simples en el cálculo del porcentaje.
- Aplicación del impuesto a productos o servicios exentos.
- No aplicación del impuesto cuando corresponde.
- Errores de redondeo que se acumulan en documentos con múltiples líneas.
- Diferencias entre el ITBIS declarado y el ITBIS facturado.

**Problema 5.3: Dificultad para atender requerimientos de la DGII**

Cuando la DGII solicita información (auditorías, verificaciones, cruces de información), el proceso de respuesta es lento y laborioso:

- Búsqueda manual de documentos solicitados en archivos dispersos.
- Reconstrucción de información que puede estar incompleta.
- Riesgo de no localizar documentos requeridos.
- Tiempos de respuesta que pueden exceder los plazos legales.

---

#### Categoría 6: Problemas en la gestión del conocimiento organizacional

**Problema 6.1: Dependencia de personal clave**

El conocimiento sobre los procesos, la ubicación de archivos, las tarifas, las condiciones especiales de clientes y los procedimientos de facturación está concentrado en pocas personas:

- Si estas personas se ausentan (vacaciones, enfermedad, renuncia), la operación se ve seriamente afectada.
- No existe documentación formal de procedimientos que permita la capacitación rápida de nuevos colaboradores.
- El proceso de inducción de personal nuevo es largo y depende de transmisión oral del conocimiento.

**Problema 6.2: Pérdida de información en transiciones de personal**

Cuando un colaborador deja la empresa, se pierde:

- Conocimiento tácito sobre clientes, sus preferencias y particularidades.
- Información sobre acuerdos especiales o condiciones negociadas.
- Historial de comunicaciones y contexto de situaciones pendientes.
- Criterios y prácticas informales desarrolladas con la experiencia.

---

#### Categoría 7: Problemas en la capacidad analítica y de gestión

**Problema 7.1: Ausencia de indicadores de desempeño (KPI)**

No se calculan ni monitorean de forma sistemática indicadores clave como:

- Volumen de facturación diaria, semanal, mensual y acumulada.
- Tiempo promedio de elaboración de documentos comerciales.
- Tasa de error en documentos (porcentaje que requiere corrección).
- Días promedio de cobro (DSO - Days Sales Outstanding).
- Concentración de ingresos por cliente (dependencia de clientes principales).
- Tendencias de crecimiento o decrecimiento por tipo de servicio.

**Problema 7.2: Incapacidad de generar reportes gerenciales oportunos**

La gerencia no dispone de herramientas que le permitan:

- Visualizar el estado de la facturación y la cobranza en tiempo real.
- Comparar el desempeño actual con períodos anteriores.
- Identificar desviaciones que requieran atención inmediata.
- Proyectar flujos de efectivo con base en la cartera pendiente.
- Tomar decisiones informadas sobre crédito, descuentos y negociaciones.

**Problema 7.3: Dificultad para identificar oportunidades y riesgos**

Sin información analítica, la empresa carece de visibilidad para:

- Detectar clientes con alto potencial de crecimiento.
- Identificar servicios más rentables versus servicios con bajo margen.
- Reconocer patrones estacionales que afectan la demanda.
- Anticipar problemas de liquidez por concentración de vencimientos.
- Evaluar el impacto de cambios en precios o condiciones comerciales.

---

### Actores afectados por la situación problemática

El conjunto de problemas descritos afecta de manera diferenciada a los siguientes actores:

**Personal administrativo y de facturación (10-15 colaboradores):**
- Sobrecarga de trabajo por procesos manuales ineficientes.
- Frustración por herramientas inadecuadas que dificultan su labor.
- Estrés por la presión de responder rápidamente sin los medios necesarios.
- Exposición a errores que generan señalamientos y retrabajo.
- Limitada posibilidad de desarrollo profesional al estar absorbidos por tareas operativas.

**Gerencia y dirección de la empresa:**
- Falta de información consolidada para la planificación estratégica.
- Incertidumbre sobre el estado real de la facturación y la cobranza.
- Dificultad para evaluar el desempeño del área administrativa.
- Limitada capacidad de control interno y detección de irregularidades.
- Exposición a riesgos fiscales y operativos no cuantificados.

**Clientes de ALITO GROUP SRL:**
- Demoras en la recepción de cotizaciones y facturas.
- Posibles errores en documentos que requieren corrección y retrabajo.
- Dificultad para obtener estados de cuenta cuando los necesitan.
- Percepción de falta de profesionalismo en la gestión administrativa.
- Experiencia de servicio que no está a la altura de la calidad técnica ofrecida.

**Área contable y fiscal:**
- Dificultad para conciliar información de facturación con registros contables.
- Riesgo de errores en declaraciones de impuestos por información incompleta o incorrecta.
- Carga de trabajo adicional para corregir inconsistencias detectadas tardíamente.
- Exposición a observaciones y sanciones de la DGII.

**La empresa como entidad (perspectiva institucional):**
- Riesgo reputacional por errores en documentos comerciales.
- Exposición a sanciones fiscales que afectan el patrimonio.
- Limitación del potencial de crecimiento por procesos que no escalan.
- Desventaja competitiva frente a empresas con procesos más eficientes.
- Pérdida de oportunidades de negocio por lentitud en la respuesta comercial.

---

### Consecuencias directas de la situación problemática

Si la situación problemática no se aborda mediante una solución integral, las consecuencias previsibles incluyen:

1. **Incremento progresivo de los tiempos de procesamiento:** A medida que el volumen de operaciones crezca, los tiempos manuales se multiplicarán de manera no lineal, generando cuellos de botella cada vez más severos.

2. **Aumento de la tasa de errores:** La presión por procesar más transacciones en menos tiempo inevitablemente incrementará la frecuencia de errores, con sus costos asociados de corrección.

3. **Deterioro del flujo de caja:** Las demoras en facturación y las deficiencias en seguimiento de cobranza se traducirán en ciclos de cobro más largos y mayor capital inmovilizado en cuentas por cobrar.

4. **Exposición creciente a sanciones fiscales:** Los errores en NCF e ITBIS, si no se controlan, podrán acumularse hasta generar observaciones significativas en auditorías de la DGII.

5. **Pérdida de clientes por insatisfacción:** Clientes que experimenten repetidamente demoras o errores podrán optar por proveedores que ofrezcan una experiencia administrativa superior.

6. **Rotación de personal administrativo:** La frustración y el estrés causados por herramientas inadecuadas podrán provocar la salida de colaboradores valiosos, con la consiguiente pérdida de conocimiento institucional.

7. **Imposibilidad de escalar las operaciones:** El crecimiento comercial de la empresa estará limitado por la capacidad de los procesos administrativos manuales, que no pueden expandirse sin incrementos proporcionales (o mayores) en personal y tiempo.

---

### Síntesis del problema central

En síntesis, ALITO GROUP SRL enfrenta una situación problemática multidimensional caracterizada por:

- La **ausencia de un sistema integrado de facturación** que centralice la información y automatice los procesos documentales.
- La **carencia de controles automatizados** para la gestión de NCF, cálculo de impuestos y validación de datos.
- La **dispersión de información crítica** en archivos locales sin respaldo, trazabilidad ni control de acceso.
- La **inexistencia de herramientas analíticas** que proporcionen visibilidad gerencial y apoyen la toma de decisiones.
- La **vulnerabilidad operativa** derivada de la dependencia de procesos manuales y de personal clave.

Esta problemática afecta transversalmente la eficiencia operativa, el cumplimiento normativo, la experiencia del cliente, la gestión financiera y la capacidad de crecimiento sostenible de la empresa. La magnitud y articulación de estos problemas fundamenta la necesidad de una solución tecnológica integral que aborde de manera coordinada todas las dimensiones identificadas.

## 1.3 Formulación del problema científico

### Introducción al problema científico

La situación problemática descrita en la sección anterior evidencia una brecha significativa entre el estado actual de los procesos de facturación en ALITO GROUP SRL y el estado deseado que demanda el crecimiento empresarial, las exigencias regulatorias y las mejores prácticas de gestión administrativa. Esta brecha no es meramente operativa o instrumental: representa un problema de naturaleza **sistémica** que involucra múltiples dimensiones técnicas, organizacionales, normativas y de diseño.

Desde el punto de vista de la ingeniería de software, el problema se inscribe en el ámbito del **diseño de sistemas de información transaccionales** que deben satisfacer simultáneamente requerimientos de integridad, disponibilidad, escalabilidad, seguridad y usabilidad. Adicionalmente, la solución debe incorporar **componentes inteligentes** capaces de automatizar decisiones, validar consistencia y apoyar la generación de valor a partir de los datos operacionales.

La formulación del problema científico, por tanto, no se limita a preguntar "¿qué sistema construir?", sino que debe explorar cuestiones más profundas sobre **cómo estructurar la arquitectura**, **qué patrones y tecnologías adoptar**, **cómo garantizar la conformidad normativa**, **cómo integrar capacidades de inteligencia artificial de manera efectiva** y **cómo asegurar que la solución sea adoptada y sostenible en el tiempo**.

### Problema científico principal

El problema científico principal de esta investigación se formula de la siguiente manera:

**¿Cómo diseñar y desarrollar una arquitectura cloud‑native, integrada con agentes de inteligencia artificial y capacidades de Business Intelligence, que permita a ALITO GROUP SRL centralizar y automatizar sus procesos de cotización, facturación y control de cuentas por cobrar, garantizando exactitud fiscal (NCF, ITBIS), trazabilidad, escalabilidad, seguridad de datos y mejora medible en la eficiencia operativa para apoyar la toma de decisiones estratégicas?**

En la fase de diseño y desarrollo del proyecto se contemplará la aplicación de principios de Arquitectura Hexagonal (Ports and Adapters) y Clean Architecture, organizando el sistema como un monolito modular para facilitar la independencia del dominio, la testabilidad y la evolución del software.

### Problemas científicos derivados

Del problema principal se desprenden interrogantes específicas que estructuran la investigación en ejes temáticos, cada uno con su propia complejidad conceptual y metodológica:

#### 1. Problema derivado sobre diagnóstico y análisis de la situación actual

**¿Cuáles son las características estructurales, funcionales y de calidad de los procesos actuales de facturación en ALITO GROUP SRL, qué limitaciones críticas presentan en términos de integridad de datos, trazabilidad, tiempo de respuesta y conformidad normativa, y cuáles son los requisitos funcionales y no funcionales que debe satisfacer la solución propuesta para superar estas limitaciones?**

Este problema derivado orienta la fase de **levantamiento de requisitos** y **análisis de la situación actual**, exigiendo:

- Modelado de procesos existentes (diagramas de flujo, casos de uso, identificación de actores).
- Identificación de puntos de fallo y cuellos de botella.
- Cuantificación de tiempos, tasas de error y volúmenes de transacciones.
- Definición de criterios de aceptación para la solución (umbrales de desempeño, niveles de disponibilidad, métricas de calidad).

#### 2. Problema derivado sobre arquitectura y diseño del sistema

**¿Cómo aplicar los principios de Arquitectura Hexagonal (Ports and Adapters) y Clean Architecture en un monolito modular, para diseñar un sistema de facturación cloud-native que sea escalable, resiliente, seguro, altamente testeable y conforme a las normativas dominicanas de comprobantes fiscales (NCF) y tributación (ITBIS), garantizando la independencia del dominio de negocio respecto a las tecnologías de infraestructura y facilitando la evolución y mantenimiento del sistema a largo plazo?**

Este problema exige decisiones fundamentadas sobre:

- **Arquitectura Hexagonal (Puertos y Adaptadores):** Definición de puertos de entrada (casos de uso, servicios de aplicación) y puertos de salida (repositorios, servicios externos), con adaptadores que implementen la comunicación con el mundo exterior (API REST, bases de datos, servicios de terceros).
- **Clean Architecture:** Organización en capas concéntricas (Entities, Use Cases, Interface Adapters, Frameworks & Drivers) que garantizan la regla de dependencia hacia el interior, protegiendo la lógica de negocio de cambios en tecnologías externas.
- **Monolito Modular:** Estructuración del sistema como una aplicación única con módulos internos bien definidos (facturación, clientes, NCF, reportes, IA), comunicación mediante interfaces internas, facilitando desarrollo y despliegue sin la complejidad de sistemas distribuidos.
- **API RESTful:** Diseño de contratos de API claros, versionados y documentados (OpenAPI/Swagger), que faciliten la integración con frontends, aplicaciones móviles y servicios externos.
- **Tecnologías cloud-native:** Selección de stack tecnológico (Node.js/NestJS, Python/FastAPI, .NET Core, o equivalentes), base de datos centralizada (PostgreSQL), contenedores (Docker) y servicios en la nube.
- **Seguridad por diseño:** Autenticación (JWT, OAuth 2.0), autorización basada en roles (RBAC), cifrado de datos en tránsito y en reposo, y auditoría de accesos.
- **Testabilidad:** Diseño que facilite pruebas unitarias del dominio, pruebas de integración de casos de uso y pruebas funcionales de la API.
- **Estrategia de despliegue:** CI/CD con pipelines automatizados, contenedorización y despliegue en entornos cloud.

#### 3. Problema derivado sobre integración de inteligencia artificial

**¿Cómo pueden diseñarse, entrenarse e integrarse agentes de inteligencia artificial en la arquitectura del sistema para automatizar la validación de comprobantes fiscales, detectar inconsistencias en datos de entrada, sugerir acciones correctivas, apoyar la clasificación de documentos y facilitar la generación automatizada de reportes, de manera que estas capacidades inteligentes operen de forma confiable, transparente y auditable?**

Este problema derivado involucra aspectos de:

- Selección de técnicas de IA aplicables (reglas de negocio, sistemas basados en agentes, aprendizaje automático supervisado o no supervisado, procesamiento de lenguaje natural).
- Definición de criterios de evaluación de desempeño de los agentes (precisión, recall, tasa de falsos positivos).
- Integración con el flujo de trabajo transaccional sin comprometer tiempos de respuesta.
- Explicabilidad y auditabilidad de las decisiones automatizadas.

#### 4. Problema derivado sobre analítica y Business Intelligence

**¿Qué indicadores clave de desempeño (KPI), métricas operativas y capacidades de visualización deben incorporarse al sistema para proporcionar a la gerencia de ALITO GROUP SRL información oportuna, precisa y accionable sobre el estado de la facturación, la gestión de cuentas por cobrar, la morosidad, la concentración de ingresos y otros factores críticos para la toma de decisiones estratégicas y operativas?**

Este problema demanda:

- Identificación de necesidades de información gerencial.
- Diseño de modelos de datos para analítica (esquemas estrella, cubos OLAP, data marts).
- Selección de herramientas de visualización y generación de reportes.
- Definición de frecuencias de actualización y políticas de acceso a la información analítica.

#### 5. Problema derivado sobre adopción, capacitación y sostenibilidad

**¿Qué estrategias de gestión del cambio, capacitación del personal, acompañamiento post-implementación y transferencia de conocimiento son necesarias para asegurar que el sistema propuesto sea adoptado efectivamente por los colaboradores de ALITO GROUP SRL, que se mantenga operativo en el tiempo, y que la organización desarrolle capacidades internas para su administración, mantenimiento evolutivo y escalamiento futuro?**

Este problema reconoce que la viabilidad de una solución tecnológica no depende únicamente de su calidad técnica, sino también de factores organizacionales, culturales y de gestión del conocimiento.

### Delimitación temporal, espacial y funcional del problema

Para garantizar la viabilidad y el enfoque de la investigación, el problema científico se delimita de la siguiente manera:

**Delimitación temporal:**
El estudio se desarrollará durante el año 2025, desde la fase de diagnóstico inicial hasta la implementación de un prototipo funcional (MVP – Minimum Viable Product) y la evaluación piloto con usuarios reales.

**Delimitación espacial:**
El ámbito de aplicación es ALITO GROUP SRL, con sede en Bávaro – Punta Cana, La Altagracia, República Dominicana. Los procesos analizados e intervenidos corresponden a la operación de esta empresa específica, aunque los resultados y la arquitectura propuesta tendrán potencial de generalización a organizaciones similares.

**Delimitación funcional:**
El alcance funcional se concentra en los **procesos de facturación, cotización, proformas y control de cuentas por cobrar**. Quedan fuera del alcance de esta investigación otros procesos administrativos como:

- Gestión de nómina y recursos humanos.
- Control de inventario de maquinaria y activos fijos.
- Planificación de mantenimiento de equipos.
- Gestión de proyectos y asignación de recursos.
- Compras y gestión de proveedores.

Estos procesos podrían integrarse en fases posteriores del proyecto, una vez validada la solución propuesta para el ámbito delimitado.

### Relevancia científica y técnica del problema

El problema planteado posee relevancia científica y técnica por las siguientes razones:

1. **Integra múltiples áreas del conocimiento:** arquitectura de software, computación en la nube, inteligencia artificial, analítica de datos, ingeniería de requisitos y gestión del cambio organizacional.

2. **Requiere decisiones de diseño fundamentadas:** la elección de patrones arquitectónicos, tecnologías y estrategias de implementación debe justificarse mediante criterios técnicos, económicos y de adecuación al contexto.

3. **Aborda un problema real y medible:** la solución propuesta tendrá indicadores observables de éxito (reducción de errores, tiempos de procesamiento, satisfacción de usuarios), lo que permite validar la efectividad de las decisiones tomadas.

4. **Considera el marco normativo específico:** la solución debe adaptarse a las particularidades de la regulación tributaria dominicana, lo cual añade complejidad y especificidad al diseño.

5. **Tiene potencial de replicabilidad:** aunque el caso de estudio es específico, la metodología y la arquitectura propuestas pueden adaptarse a otras organizaciones con problemáticas equivalentes.

## 1.4 Objetivos

Los objetivos de esta investigación se derivan directamente del problema científico planteado y orientan el desarrollo del proyecto hacia resultados concretos y medibles.

### 1.4.1 Objetivo general

Diseñar y desarrollar la arquitectura de un sistema de facturación cloud-native para ALITO GROUP SRL, fundamentado en los principios de Arquitectura Hexagonal (Ports and Adapters) y Clean Architecture bajo un enfoque de monolito modular, integrado con agentes de inteligencia artificial y APIs RESTful, que permita automatizar y optimizar los procesos de cotización, proformas, facturación y control de cuentas por cobrar, garantizando cumplimiento normativo (NCF, ITBIS), escalabilidad, seguridad de datos, alta testabilidad y capacidades analíticas para la toma de decisiones estratégicas.

### 1.4.2 Objetivos específicos

1. Realizar un diagnóstico detallado de los procesos administrativos y financieros actuales en ALITO GROUP SRL para identificar requisitos funcionales, no funcionales, limitaciones y fuentes de datos relevantes para el diseño del sistema.

2. Definir los requisitos del sistema conforme a los principios de Domain-Driven Design (DDD), incluyendo la identificación de entidades de dominio, agregados, servicios de dominio, eventos y límites de contexto (bounded contexts) para los módulos de facturación, clientes, NCF y reportes.

3. Diseñar la arquitectura del sistema aplicando los principios de Arquitectura Hexagonal y Clean Architecture en un monolito modular, definiendo puertos de entrada (casos de uso), puertos de salida (repositorios, servicios externos), adaptadores (API REST, persistencia, integraciones) y la organización en capas concéntricas que garanticen la independencia del dominio de negocio.

4. Implementar los módulos principales del sistema (cotizaciones, proformas, facturación, gestión de NCF, clientes, estados de cuenta) como componentes internos del monolito modular, exponiendo APIs RESTful documentadas con OpenAPI/Swagger, siguiendo la estructura de Clean Architecture y garantizando alta cohesión, bajo acoplamiento y testabilidad.

5. Desarrollar e integrar agentes de inteligencia artificial orientados a la validación automática de comprobantes fiscales, detección de inconsistencias en datos, automatización de la numeración de NCF y asistencia inteligente en la generación de documentos y reportes.

6. Incorporar capacidades de Business Intelligence mediante tableros gerenciales con indicadores clave de desempeño (KPI), reportes dinámicos y visualizaciones que apoyen la toma de decisiones estratégicas y operativas.

7. Diseñar y ejecutar un plan de pruebas integral (unitarias, de integración, funcionales y de rendimiento) para validar la correcta implementación de la arquitectura, medir la reducción de errores, tiempos de procesamiento y escalabilidad del sistema.

8. Capacitar al personal de ALITO GROUP SRL en el uso del sistema, documentando la arquitectura, los contratos de API, el código fuente y los procedimientos de operación para asegurar la adopción efectiva y el mantenimiento sostenible del sistema.

## 1.5 Variables e indicadores

A continuación se presenta el cuadro de variables e indicadores conforme a la guía UCE (variable, dimensiones e indicadores medibles). Se incluyen metas sugeridas que serán ajustadas una vez establecida la línea base mediante el diagnóstico inicial.

### Cuadro 1.5.1: Matriz de variables e indicadores

| Tipo | Variable | Definición operativa | Dimensiones | Indicadores (unidad / medición) | Fuente / Técnica | Meta sugerida |
|:----:|----------|---------------------|-------------|--------------------------------|------------------|---------------|
| **Independiente** | Implementación y operación del sistema de facturación cloud-native con IA y BI | Grado en que el sistema está diseñado, desarrollado y puesto en operación con módulos funcionales (cotizaciones, proformas, facturación, NCF), validaciones automáticas y paneles analíticos. | Existencia operativa; Cobertura funcional; Integración/API; Automatización/validaciones; Capacidad analítica (BI) | Sistema operando (Sí/No; verificación de despliegue); % de módulos funcionales desarrollados e integrados (0–100; matriz de requisitos); Nº de endpoints API documentados (conteo; OpenAPI); % de validaciones críticas automatizadas NCF/ITBIS (0–100; logs); Nº de tableros/KPI en BI (conteo) | Repositorio, CI/CD, documentación OpenAPI, logs de API, tablero BI, informe de despliegue | Sistema operativo: Sí; % módulos ≥ 85%; % validaciones críticas ≥ 80%; Nº KPI ≥ 5 |
| **Dependiente** | Tiempo de respuesta operativo (cotización → proforma → factura) | Tiempo transcurrido desde la solicitud hasta la aprobación/entrega del documento (cotización/proforma/factura). | Solicitud→aprobación; Emisión; Respuesta a consultas | Tiempo promedio "solicitud → aprobación" en cotizaciones (horas; cronometría/timestamps); Tiempo promedio emisión de proforma (minutos); Tiempo promedio emisión de factura (minutos); Tiempo promedio respuesta a consultas (horas) | Cronometraje, timestamps del sistema, logs transaccionales, observación directa | Reducción tiempo emisión factura ≥ 60% vs línea base; solicitud→aprobación cotizaciones ≤ 24–48 h |
| **Dependiente** | Reducción de errores en comprobantes fiscales (Exactitud fiscal) | Disminución de errores en numeración de NCF, cálculo de ITBIS y correcciones fiscales posteriores. | Errores NCF; Errores ITBIS; Correcciones/rectificaciones | % de errores NCF antes/después (porcentaje relativo; auditoría); Nº de incidencias errores ITBIS (errores/mes); % de facturas que requieren corrección posterior (0–100) | Auditoría documental, conciliaciones contables, registros de incidencias | Errores NCF ↓ ≥ 80% vs línea base; % facturas sin corrección ≥ 95% |
| **Dependiente** | Trazabilidad y cumplimiento fiscal | Proporción de expedientes/transacciones con respaldo completo y conformes con normativa DGII. | Compleción de expediente; Audit trail; Conformidad normativa | % de órdenes/facturas auditables con respaldo completo (0–100); % de transacciones con trazabilidad completa (0–100; logs); Nº de observaciones regulatorias detectadas (conteo/periodo) | Auditoría interna, logs, revisión documental | % expedientes auditables ≥ 95%; % transacciones trazables ≥ 95%; observaciones regulatorias ↓ significativamente |
| **Interviniente** | Adopción y capacitación (factor humano) | Nivel de uso efectivo por usuarios clave y cumplimiento del plan de formación; factor que condiciona impacto. | Capacitación; Uso efectivo; Satisfacción; Apoyo directivo | Existencia de plan de capacitación (Sí/No); Nº de usuarios capacitados (conteo); Horas de capacitación impartidas (hrs); % de usuarios activos mensual (0–100; analítica uso); Puntaje medio de satisfacción (escala 1–5); Participación de gerentes en sesiones (%) | Registros de capacitación, analytics del sistema, encuestas, actas | % usuarios activos ≥ 75% al mes 2; Puntaje satisfacción ≥ 4/5; Horas capacitación ≥ 8 por usuario clave |
| **Interviniente** | Condiciones tecnológicas e infraestructura | Disponibilidad de conectividad y equipo que permite operar el sistema cloud de forma estable. | Conectividad; Disponibilidad/uptime; Equipamiento | Nivel de conectividad (Mbps / latencia ms); Disponibilidad del servicio (uptime % mensual); Nº de incidencias de conectividad/mes (conteo); % de equipos con requisitos mínimos (0–100) | Monitoreo de red, reportes ISP, inventario TI | Uptime ≥ 99%; Incidencias conectividad ≤ 2/mes; % equipos aptos ≥ 80% |
| **Dependiente (impacto)** | Impacto financiero operativo | Efecto sobre cobranza y costos operativos por mejoras en procesos. | Cobranza / flujo de caja; Costos operativos | Días promedio de cobranza – DSO (días); % facturas cobradas a tiempo (0–100); Reducción de costos operativos por procesos administrativos (RD$ o %) | Registros financieros, conciliaciones, análisis de costos | DSO reducción 20–30%; % facturas cobradas a tiempo ↑ 10–20%; Costos operativos ↓ 15% |
| **Dependiente** | Satisfacción del usuario y calidad del servicio | Percepción de usuarios internos/externos sobre rapidez, exactitud y soporte. | Rapidez; Calidad documental; Satisfacción | Promedio encuestas internas sobre eficiencia (1–5); % documentos entregados sin errores (0–100); Tiempo promedio solicitud→entrega (horas/minutos) | Encuestas, registros de atención, logs | Promedio encuestas ≥ 4/5; % documentos sin errores ≥ 98%; Tiempo solicitud→entrega < 24 h |

### Relación entre variables y objetivos

- La **variable independiente** (Implementación del sistema cloud-native con IA y BI) se vincula directamente con los objetivos 3, 4, 5 y 6 (diseño arquitectónico, desarrollo de módulos, integración de IA e incorporación de BI).
- Las **variables dependientes** (Tiempo de respuesta, Exactitud fiscal, Trazabilidad, Impacto financiero, Satisfacción) permiten evaluar los resultados esperados en los objetivos 4, 6 y 7 (desarrollo, BI y plan de pruebas/medición).
- Las **variables intervinientes** (Adopción/capacitación y Condiciones tecnológicas) se asocian al objetivo 8 (capacitación y sostenibilidad) y condicionan el impacto de la solución sobre los resultados operativos.

> **Nota:** Se recomienda incluir la tabla completa en el Anexo 3 y mantener en el cuerpo del capítulo 1 una versión resumida con las variables principales y 2–3 indicadores clave por cada una.

---

# CAPÍTULO 2. MARCO TEÓRICO (Bosquejo para el anteproyecto)

> **Nota:** De acuerdo con las normas institucionales de la UCE, el desarrollo completo del marco teórico no es requerido en el anteproyecto. A continuación se presenta un bosquejo de los conceptos fundamentales que sustentarán la investigación y que serán desarrollados en extenso en la tesis final.

## 2.1 Sistemas de facturación en la nube

En términos generales, un sistema de facturación en la nube es una aplicación alojada en infraestructuras remotas (cloud computing) que permite emitir, registrar y consultar documentos comerciales (cotizaciones, proformas, facturas, notas de crédito, etc.) mediante acceso web o móvil. Estos sistemas se caracterizan por:

- Acceso ubicuo a través de internet, sin depender de una máquina específica en la oficina.
- Actualizaciones centralizadas, que facilitan incorporar cambios normativos sin interrumpir la operación.
- Copias de seguridad automatizadas y mayor resiliencia ante fallos de hardware locales.

Frente a los sistemas instalados de manera local, las soluciones de facturación en la nube ofrecen ventajas como escalabilidad bajo demanda, reducción de costos iniciales de infraestructura, integración más sencilla con otros servicios (por ejemplo, pasarelas de pago o herramientas de BI) y mejor soporte para trabajo remoto y colaborativo.

En el contexto de ALITO GROUP SRL, la adopción de un sistema de facturación cloud permitiría consolidar en un único entorno todos los registros de operaciones comerciales, reduciendo significativamente la dispersión actual de archivos y mejorando la trazabilidad de las transacciones.

## 2.2 Arquitectura cloud-native y patrones de diseño

La arquitectura cloud-native se fundamenta en el diseño de aplicaciones específicamente pensadas para ejecutarse en entornos de computación en la nube, aprovechando servicios gestionados, escalabilidad automática y despliegues continuos. Entre los principios más relevantes para este anteproyecto se encuentran:

- **Desacoplamiento de componentes:** separación clara entre módulos (por ejemplo, gestión de clientes, facturación, cuentas por cobrar) para facilitar mantenimiento y evolución del sistema.
- **Escalabilidad horizontal:** posibilidad de incrementar recursos (instancias de servicio) cuando aumente la carga de trabajo, sin reestructurar la aplicación.
- **Observabilidad:** incorporación de mecanismos de registro (logs), métricas y monitoreo para detectar fallos y comportamientos anómalos.
- **Seguridad por diseño:** control de acceso basado en roles, cifrado de datos en tránsito y en reposo, y cumplimiento de buenas prácticas de protección de información financiera.

Para ALITO GROUP SRL, se propone una arquitectura modular por capas que contemple, al menos, una capa de presentación (interfaz web), una capa de lógica de negocio (reglas de facturación, validación de NCF e ITBIS, gestión de estados de cuenta) y una capa de datos (base de datos centralizada en la nube), complementada con servicios específicos para integración con herramientas de BI.

## 2.3 Agentes de inteligencia artificial aplicados a la gestión administrativa

Los agentes de inteligencia artificial son entidades de software capaces de percibir su entorno, procesar información y ejecutar acciones de manera autónoma o semiautónoma para cumplir objetivos específicos. En el ámbito administrativo, se manifiestan en:

- Asistentes virtuales que guían al usuario en la captura de datos.
- Módulos de validación que revisan automáticamente la coherencia de la información ingresada.
- Sistemas de recomendación que sugieren acciones (por ejemplo, recordatorios de cobro, avisos de vencimiento de facturas).

Aplicados al caso de ALITO GROUP SRL, los agentes de IA pueden:

- Verificar la correcta secuencia de NCF y alertar sobre saltos o duplicados.
- Validar montos de ITBIS y detectar discrepancias frente a tarifas estándar.
- Identificar patrones de retraso en pagos y generar reportes que apoyen decisiones de crédito y cobro.
- Sugerir acciones al usuario (por ejemplo, envío de estados de cuenta o recordatorios de pago) con base en reglas de negocio definidas.

## 2.4 Business Intelligence y analítica de datos

El Business Intelligence (BI) se refiere al conjunto de metodologías, procesos y herramientas que permiten transformar datos en información útil para la toma de decisiones. En el contexto de facturación, el BI facilita:

- Seguimiento de indicadores clave como volumen de facturación mensual, morosidad, concentración de ingresos por cliente o tipo de servicio.
- Construcción de tableros de control que presentan, de forma gráfica, tendencias y comparaciones temporales.
- Identificación de segmentos de clientes más rentables o de mayor riesgo.

Aunque este anteproyecto se enfoca principalmente en el diseño de la arquitectura y del sistema de facturación, se prevé la integración con herramientas de BI que permitan a la gerencia de ALITO GROUP SRL explotar los datos generados para mejorar su planificación financiera y operativa.

## 2.5 Marco normativo tributario en República Dominicana

El entorno normativo de la República Dominicana, gestionado por la Dirección General de Impuestos Internos (DGII), establece lineamientos específicos para la emisión y control de comprobantes fiscales (NCF), así como para la aplicación del ITBIS y otros tributos. Para empresas del sector construcción y servicios, como ALITO GROUP SRL, resulta imprescindible:

- Emitir comprobantes fiscales válidos, respetando las secuencias asignadas y los tipos de NCF autorizados.
- Calcular correctamente el ITBIS (18 %) y otros impuestos aplicables, de acuerdo con la normativa vigente.
- Mantener registros organizados y accesibles para eventuales auditorías o requerimientos de información por parte de la DGII.

El diseño de la arquitectura y del sistema de facturación cloud propuesto debe contemplar estos requerimientos normativos desde su concepción, integrando reglas de negocio que aseguren la correcta gestión de NCF y la aplicación de impuestos, así como mecanismos de respaldo de la información que faciliten su conservación durante el tiempo legalmente establecido.

---

# CAPÍTULO 3. MARCO METODOLÓGICO

El presente capítulo describe el enfoque metodológico adoptado para dar respuesta al problema científico planteado y alcanzar los objetivos propuestos. Se detallan el tipo, diseño y enfoque del estudio, la delimitación espacio-temporal, la población y muestra, así como los métodos, técnicas e instrumentos de recolección de información.

## 3.1 Tipo, diseño y enfoque de estudio

El estudio se enmarca en un enfoque **cuantitativo** con elementos descriptivos y de carácter aplicado, ya que busca recoger datos medibles sobre el estado actual de los procesos de facturación y evaluar el impacto esperado del sistema propuesto.

El tipo de estudio es **descriptivo-propositivo**:

- **Descriptivo**, porque caracteriza la situación actual de los procesos administrativos y de facturación en ALITO GROUP SRL.
- **Propositivo**, porque plantea el diseño e implementación de una solución tecnológica concreta (arquitectura y sistema de facturación cloud con agentes de IA).

El diseño es **no experimental y transversal**, dado que la información mediante encuesta se recolectará en un solo momento, sin manipulación de variables por parte del investigador.

## 3.2 Localización del estudio (delimitación en tiempo y espacio)

- **Espacio:** Empresa ALITO GROUP SRL, ubicada en Bávaro – Punta Cana, provincia La Altagracia, República Dominicana.
- **Tiempo:** El estudio se desarrollará durante el año 2025, abarcando las fases de diagnóstico, diseño arquitectónico, desarrollo de prototipo funcional y evaluación piloto mediante encuesta.

## 3.3 Unidad de análisis, población y muestra

- **Unidad de análisis:** Los procesos de facturación, cotización, proformas, control de cuentas por cobrar y manejo de NCF en ALITO GROUP SRL.
- **Población:** Personal administrativo y operativo vinculado a la gestión de facturación y control financiero en ALITO GROUP SRL (por ejemplo: encargados de facturación, contabilidad, finanzas, asistentes administrativos, supervisores de operaciones). Suponiendo una población aproximada de 10–20 colaboradores (ajustar con dato real).

Dado el tamaño reducido de la población, se plantea trabajar con un **muestreo censal** (es decir, aplicar la encuesta a la totalidad de los colaboradores que intervienen en el proceso de facturación y gestión administrativa).

## 3.4 Métodos y técnicas de investigación

- **Métodos teóricos:**

  - Analítico–sintético: para descomponer los procesos actuales de facturación y recomponerlos en una propuesta integrada.
  - Hipotético–deductivo: para plantear supuestos sobre la mejora en eficiencia y exactitud fiscal obtenida mediante el sistema propuesto y contrastarlos con los datos de la encuesta.
- **Métodos empíricos:**

  - Observación directa de los procesos actuales (uso de hojas de cálculo, flujo de documentos, tiempos de respuesta).
  - **Encuesta estructurada** aplicada al personal administrativo y operativo vinculado a la facturación.

## 3.5 Instrumento de recolección de información (Encuesta)

Se diseñará un **cuestionario estructurado** de tipo mixto (preguntas cerradas con escala Likert y algunas preguntas abiertas breves) orientado a medir:

- Percepción de los colaboradores sobre la eficiencia de los procesos actuales de facturación y control financiero.
- Frecuencia y tipo de errores que se presentan (ej.: numeración, ITBIS, datos de clientes).
- Nivel de satisfacción con las herramientas actuales (Excel, procesos manuales).
- Necesidades y expectativas frente a un sistema de facturación cloud con automatización e IA.
- Disponibilidad y disposición para adoptar una nueva solución tecnológica.

### Diseño y validación del cuestionario (procedimiento detallado)

- **Fase 1 — Generación de ítems:** A partir del diagnóstico de procesos (observación y revisión documental) y la revisión bibliográfica se redactarán ítems para medir las dimensiones clave: percepción de eficiencia, frecuencia de errores, satisfacción con herramientas actuales, disposición a adoptar la solución y recursos tecnológicos disponibles. Se estima un cuestionario final de 12–18 ítems cerrados y 2–3 preguntas abiertas.
- **Fase 2 — Juicio de expertos:** El borrador será revisado por el asesor y por, al menos, un experto en metodología o auditoría contable para evaluar pertinencia y claridad. Se recogerán observaciones y se ajustarán ítems. Se documentará el proceso de validación (fechas, expertos, comentarios principales).
- **Fase 3 — Prueba piloto:** Se aplicará el cuestionario piloto a una muestra de 3–5 colaboradores representativos de las áreas involucradas. Esta prueba permitirá medir tiempos de respuesta, detectar ítems ambiguos y estimar la consistencia interna. Para escalas compuestas se calculará el coeficiente alfa de Cronbach (umbral recomendado > 0.70).
- **Fase 4 — Aplicación final:** Se aplicará la versión final al total de la población objetivo (muestreo censal propuesto). La administración podrá realizarse en modalidad presencial (impreso) o en línea (Google Forms / Microsoft Forms), según disponibilidad tecnológica y preferencia del participante.

### Administración, registro y consideraciones éticas

- **Tiempo estimado de respuesta:** 8–12 minutos.
- **Modalidad de aplicación:** doble modalidad (impreso y formulario en línea) para maximizar cobertura. Se asegurará anonimato y confidencialidad.
- **Consentimiento informado:** al inicio del formulario se incluirá un texto breve con propósito del estudio, voluntariedad de la participación, y uso agregado y anónimo de los datos; se pedirá la confirmación para proceder.

### Procesamiento y análisis de datos

- **Limpieza y codificación:** verificaciones de consistencia y tratamiento de respuestas incompletas.
- **Estadística descriptiva:** frecuencias, porcentajes, medias y desviaciones estándar por ítem y dimensión.
- **Confiabilidad:** cálculo de alfa de Cronbach para escalas compuestas.
- **Análisis inferencial (si procede):** dependiendo del tamaño muestral, se podrán realizar pruebas bivariadas (chi-cuadrado para asociaciones categóricas; t de Student o pruebas no paramétricas para diferencias de medias entre grupos). El nivel de confianza se establece en 95% (p < 0.05).
- **Informe:** resultados acompañados de tablas y gráficos (barras, boxplots) que se integrarán al capítulo de análisis y al Anexo 3 (tabla extendida de variables e indicadores).

### 3.5.1 Resultados de la encuesta (análisis descriptivo)

Para efectos del anteproyecto, se presenta un escenario de resultados esperados a partir de la aplicación de la encuesta a una población de 12 colaboradores de ALITO GROUP SRL (áreas de facturación, contabilidad y administración). Estos valores sirven como ejemplo de cómo se analizarán los datos reales una vez aplicada la encuesta.

#### Resultados por ítem (escala Likert 1–5)

| Ítem | Enunciado resumido                                                 | Media | Desv. est. | Interpretación                                                     |
| ----- | ------------------------------------------------------------------ | :---: | :--------: | ------------------------------------------------------------------- |
| 1     | Rapidez del proceso de facturación actual                         |  2.3  |    0.9    | Percepción mayoritariamente negativa sobre la rapidez del proceso. |
| 2     | Frecuencia de errores en la numeración de NCF                     |  4.1  |    0.7    | Reconocen alta frecuencia de errores en NCF.                        |
| 3     | Confiabilidad del cálculo de ITBIS                                |  2.7  |    0.8    | Confianza moderada-baja en los cálculos de impuestos.              |
| 4     | Facilidad para obtener estados de cuenta consolidados              |  2.1  |    0.9    | Dificultad importante para consolidar información de clientes.     |
| 5     | Impacto esperado de un sistema de facturación en la nube          |  4.6  |    0.5    | Alta aceptación de la idea de un sistema cloud.                    |
| 6     | Disposición a capacitarse en el nuevo sistema                     |  4.8  |    0.4    | Muy alta disposición a recibir capacitación.                      |
| 7     | Percepción de suficiencia de recursos tecnológicos en la empresa |  3.8  |    0.7    | Percepción mayormente positiva sobre recursos tecnológicos.       |


#### Hallazgos cualitativos (preguntas abiertas)

A partir de las preguntas abiertas, se esperan patrones como los siguientes:

- Problemas principales percibidos: duplicidad de registros, errores en ITBIS, dificultad para rastrear el historial de facturas y lentitud en generar estados de cuenta.
- Características consideradas indispensables en el nuevo sistema: acceso rápido al historial de clientes, alertas automáticas de vencimientos, validación automática de NCF e ITBIS y reportes claros de cuentas por cobrar.

Estos hallazgos cualitativos complementan los resultados numéricos y ayudan a priorizar funcionalidades en el diseño del sistema.

#### Diagramas y visualización de resultados




Para comunicar los resultados de la encuesta de forma clara en el informe y en la defensa, se recomienda elaborar los siguientes gráficos (en Excel, Power BI, Metabase u otra herramienta):

- **Gráfico de barras 1:** Medias de los ítems 1 a 7 (escala Likert), permitiendo visualizar rápidamente los aspectos con mayor insatisfacción (procesos actuales) y los de mayor aceptación (propuesta de sistema cloud y capacitación).
- **Gráfico de barras 2:** Frecuencias de los tipos de errores reportados (errores en NCF, errores en ITBIS, duplicidad de registros, otros), a partir de las respuestas de la sección de errores.
- **Gráfico de pastel:** Distribución de la disposición a capacitarse (ítem 6), para evidenciar el alto nivel de aceptación del cambio tecnológico.

En la versión en Word de este documento, estos gráficos deben insertarse como imágenes (`.png`) y referenciarse como Figura 1, Figura 2 y Figura 3 dentro de este apartado 3.5.1. En la tesis completa se podrán añadir tablas cruzadas y análisis adicionales (por cargo, área, antigüedad, etc.).

## 3.6 Fuentes de datos

- **Fuentes primarias:** Respuestas a la encuesta aplicada al personal de ALITO GROUP SRL y observaciones directas de los procesos actuales de facturación.
- **Fuentes secundarias:** Documentación institucional, normativas de la DGII, manuales y documentación técnica de herramientas como Power BI, n8n, sistemas de facturación cloud y referencias académicas sobre arquitectura en la nube y agentes de IA.

## 3.7 Criterios de inclusión y exclusión

- **Criterios de inclusión:**

  - Colaboradores de ALITO GROUP SRL que participen directamente en la facturación, elaboración de cotizaciones/proformas, control de cuentas por cobrar o revisión contable.
  - Personal con al menos tres meses de antigüedad en la empresa.
- **Criterios de exclusión:**

  - Personal que no tenga relación con los procesos de facturación o gestión administrativa.
  - Colaboradores en período de prueba o con muy poco tiempo en la empresa (menos de tres meses), salvo que el asesor lo considere pertinente.

## 3.8 Aspectos éticos

- Se solicitará el **consentimiento informado** de los participantes, explicando el propósito académico del estudio, la voluntariedad de su participación y la confidencialidad de la información recolectada.
- Los datos se utilizarán exclusivamente con fines académicos y de mejora interna de la empresa, sin divulgación de información sensible a terceros.
- Se evitará recopilar información personal innecesaria, limitándose a variables como puesto, área y años de experiencia, sin asociar nombres concretos a las respuestas.

---

# CAPÍTULO 4. ASPECTOS ADMINISTRATIVOS Y DE CONTROL

Este capítulo presenta la planificación operativa del proyecto, incluyendo el cronograma de actividades y el presupuesto estimado para su ejecución. Estos elementos permiten establecer un marco temporal y financiero realista para el desarrollo de la investigación.

## 4.1 Plan de trabajo y cronograma de actividades

A continuación se presenta un cronograma expandido que cubre desde el inicio del trabajo (enero) hasta la conclusión formal (defensa del proyecto). Las fechas son referenciales y deben ajustarse al calendario institucional vigente.

| Actividad / Mes                                        | Ene | Feb | Mar | Abr | May | Jun | Jul | Ago | Sep | Oct | Nov |
| ------------------------------------------------------ | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 1. Revisión bibliográfica y consolidación del marco |  X  |  X  |    |    |    |    |    |    |    |    |    |
| 2. Diagnóstico in situ y levantamiento de requisitos  |  X  |  X  |  X  |    |    |    |    |    |    |    |    |
| 3. Diseño arquitectónico y modelos de datos          |    |  X  |  X  |  X  |    |    |    |    |    |    |    |
| 4. Desarrollo del prototipo (MVP)                      |    |    |  X  |  X  |  X  |    |    |    |    |    |    |
| 5. Diseño, validación y aplicación de la encuesta   |    |    |    |  X  |  X  |    |    |    |    |    |    |
| 6. Pilotaje del sistema y pruebas funcionales          |    |    |    |    |  X  |  X  |    |    |    |    |    |
| 7. Análisis de resultados y ajuste del prototipo      |    |    |    |    |    |  X  |  X  |    |    |    |    |
| 8. Integración final con módulos de BI y pruebas     |    |    |    |    |    |    |  X  |  X  |    |    |    |
| 9. Redacción del informe final (capítulos y anexos)  |    |    |    |    |    |    |    |  X  |  X  |    |    |
| 10. Revisión con asesor y ajustes finales             |    |    |    |    |    |    |    |    |  X  |  X  |    |
| 11. Envío formal del anteproyecto (plataforma UCE)    |    |    |    |    |    | X* |    |    |    |    |    |
| 12. Preparación para defensa y difusión interna      |    |    |    |    |    |    |    |    |    |  X  |  X  |
| 13. Defensa del proyecto (fecha tentativa)             |    |    |    |    |    |    |    |    |    |    |  X  |

> Nota: La fila 11 indica el envío formal del anteproyecto a la plataforma institucional; la celda marcada con `X*` corresponde al periodo oficial de envío (por ejemplo: 21–30 de junio de 2025) y debe ajustarse según el cronograma que publique la UCE. El cronograma interno propone completar el piloto y ajustes antes de la entrega oficial.

## 4.2 Presupuesto estimado

En esta sección se presentan dos componentes de costo: (1) el **presupuesto de ingeniería** (desarrollo e implementación del sistema) y (2) el **presupuesto logístico‑académico** (costos de gestión del anteproyecto). Esta separación evita subestimar el costo real de una solución cloud en operación.

### 4.2.1 Presupuesto de ingeniería (CAPEX/OPEX)

En el contexto de este **proyecto de grado**, el diseño y desarrollo del MVP será ejecutado por los sustentantes (Wilber Alfredo De La Rosa Marte y Jesús Andrés Acevedo Carrasco). Por ello, el presupuesto se presenta en dos componentes:

- **Costo directo (cash):** gastos reales necesarios para ejecutar y operar el piloto (infraestructura, dominio, servicios).  
- **Aporte en especie (valor equivalente):** estimación referencial del valor de mercado de las horas de desarrollo aportadas por los sustentantes (útil para dimensionar el costo si se contratara).

Se proponen escenarios factibles y económicos para la implementación, manteniendo el alcance del anteproyecto (módulos de cotización, proformas, facturación, control de NCF/ITBIS, trazabilidad, BI e IA en nivel MVP). Los montos se expresan en USD para facilitar comparación; la conversión a RD$ se realiza con la tasa oficial vigente.

| Escenario | Descripción | CAPEX estimado (USD) | OPEX estimado (USD/mes) |
|---|---|---:|---:|
| Piloto económico (recomendado) | VPS único + contenedores; PostgreSQL; BI open‑source (Metabase); IA mínima (reglas/alertas) | Aporte en especie: 55,500 – 148,950 | 31 – 180 (+ LLM opcional) |
| Económico‑robusto | App en contenedores + BD gestionada + backups/observabilidad básica | Aporte en especie: 75,600 – 196,900 | 90 – 530 (+ LLM opcional) |
| Producción formal | Alta disponibilidad y observabilidad completa (según criticidad) | Aporte en especie: 133,000 – 357,500 | 450 – 2,500 |

**Costo directo típico del piloto (sin LLM):** USD 120 – 900 para ~3 meses (según tamaño del VPS, backups y extras).  

> Nota: El costo (directo y/o equivalente) aumenta si se incorpora facturación electrónica DGII (e‑CF), firma digital/certificación, integraciones con ERP/contabilidad o un modelo multi‑empresa.

**Documento de respaldo:** Para desglose por fases, entregables, horas, dedicación semanal de los sustentantes y stack más económico, ver `archivo final/cotizacion_detallada_facturacion_cloud_2025.md`.

### 4.2.2 Presupuesto logístico‑académico (referencial)

| Concepto | Cantidad aproximada | Precio unitario (RD$) | Inversión total (RD$) |
|---|---:|---:|---:|
| Equipos / actualización de hardware (si aplica) | 1 | 30,000 | 30,000 |
| Conectividad / mejoras de red (si aplica) | 1 | 10,000 | 10,000 |
| Material de oficina e impresión de documentos | N/A | N/A | 5,000 |
| Transporte y logística para reuniones | N/A | N/A | 5,000 |
| Diversos / imprevistos | N/A | N/A | 6,000 |
| **Total logístico‑académico** |  |  | **56,000** |

> Nota: Los montos logísticos son referenciales y deben ajustarse a la realidad económica y disponibilidad de recursos.

> Nota institucional: El envío formal del anteproyecto a la plataforma institucional se realizará entre el 21 y el 30 de junio de 2025, según cronograma oficial. El cronograma semanal presentado en la sección 4.1 corresponde al plan interno de trabajo (enero–abril) orientado a completar las fases preparatorias con antelación a la entrega oficial.

---

# BIBLIOGRAFÍA

Las siguientes fuentes bibliográficas constituyen el sustento documental del presente anteproyecto. Se presentan en formato APA (7ª edición) y serán ampliadas durante el desarrollo de la tesis final.

Dirección General de Impuestos Internos. (2024). *Normativa tributaria sobre comprobantes fiscales (NCF) y facturación electrónica*. https://dgii.gov.do

International Organization for Standardization. (2015). *ISO 9001:2015 — Quality management systems*. https://www.iso.org

Microsoft Corporation. (2024). *Power BI documentation*. https://learn.microsoft.com/power-bi

n8n GmbH. (2024). *n8n — Workflow automation*. https://docs.n8n.io

Universidad Central del Este. (2024). *Guía para la presentación de proyectos integradores en ingeniería*. (Documento institucional UCE).

> **Nota:** Esta bibliografía preliminar será complementada con artículos científicos, tesis de referencia y documentación técnica adicional durante la fase de revisión bibliográfica del proyecto.

---

# ANEXOS

A continuación se presentan los anexos que complementan el presente anteproyecto.

## Anexo 1. Cuestionario de la encuesta (versión final para aplicación)

Instrucciones: Este cuestionario se aplica de forma anónima al personal de ALITO GROUP SRL involucrado en los procesos de facturación, cotizaciones, proformas y control de cuentas por cobrar. Marque la opción que mejor refleje su percepción. Escala Likert: 1 = Totalmente en desacuerdo, 2 = En desacuerdo, 3 = Neutral, 4 = De acuerdo, 5 = Totalmente de acuerdo.

Sección A: Datos generales (opcionales y anónimos)

1. Área o puesto: ______________________
2. Años en la empresa: _______________

Sección B: Percepción sobre procesos actuales
3. La herramienta actual (hojas de cálculo, documentos) me permite realizar la facturación de forma rápida. [1-5]
4. Se cometen errores frecuentes en la numeración de comprobantes fiscales (NCF). [1-5]
5. Considero que el cálculo del ITBIS y otros impuestos es confiable con el método actual. [1-5]
6. Es fácil obtener un estado de cuenta consolidado de un cliente cuando se necesita. [1-5]
7. Disponer de un sistema de facturación en la nube mejoraría significativamente mi trabajo diario. [1-5]
8. Estoy dispuesto(a) a capacitarme en el uso de un nuevo sistema de facturación inteligente. [1-5]
9. La empresa cuenta con recursos tecnológicos suficientes (equipos y conexión a internet) para implementar un sistema cloud. [1-5]

Sección C: Errores y frecuencia
10. Indique con qué frecuencia se presentan los siguientes errores en su área: (Nunca, Rara vez, Algunas veces, Frecuente, Muy frecuente)

- Errores en numeración de NCF: ________
- Errores en cálculo de ITBIS: ________
- Duplicidad de registros de clientes/documentos: ________

Sección D: Expectativas y requerimientos (preguntas abiertas)
11. ¿Cuáles son los principales problemas que encuentra en el proceso actual de facturación y control de cuentas por cobrar? (máx. 3-4 líneas)

12. ¿Qué características considera indispensables en un nuevo sistema de facturación para que realmente le sea útil? (máx. 3-4 líneas)

Sección E: Consentimiento
13. ¿Autoriza que sus respuestas sean utilizadas de forma agregada y anónima para fines académicos y de mejora interna? (Sí/No)

Validación: El cuestionario será validado por el asesor y, si procede, por un experto en metodología; se aplicará una prueba piloto a 2–3 participantes antes de su despliegue total.

---

## Anexo 2. Descripción textual de diagramas y artefactos a incluir

1) Diagrama de componentes (texto):

- Interfaz web (frontend): paneles para cotizaciones, proformas, facturación, administración de NCF, y panel de BI.
- API Gateway / Backend: punto de entrada para la lógica de negocio, validaciones de NCF e ITBIS.
- Servicios / Microservicios: Módulos de facturación, clientes, inventario (si aplica), notificaciones y agentes IA (validación y detección de inconsistencias).
- Base de datos: repositorio central (preferiblemente relacional para transacciones, p. ej. PostgreSQL) con tablas para clientes, facturas, NCF, movimientos y auditoría.
- Servicios auxiliares: cola de mensajes para tareas asíncronas, almacenamiento de archivos (S3 o equivalente) y sistema de logs/monitorización.
- Integración BI: capa que exporta o consulta datos para alimentar tableros (con API o conexión directa a la BD/warehouse).

2) Diagrama de despliegue (texto):

- Entorno de producción: contenedores/Docker orquestrados (opcional Kubernetes), base de datos gestionada, balanceador de carga, y entorno seguro (HTTPS, IAM).
- Entorno de prueba/piloto: despliegue reducido para pruebas funcionales y de usuario.

3) Casos de uso principales (breve):

- Emisión de cotización → Generar proforma → Validar NCF disponible → Emitir factura → Registrar en cuentas por cobrar.
- Validación automática: agente IA valida secuencia NCF, cálculo de ITBIS y lanza alertas si detecta discrepancias.
- Reportes BI: generar KPI de facturación, morosidad y recursos por unidad de negocio.

Estos artefactos se entregarán en formato gráfico (PNG/SVG) en la versión final o como anexos separados si el comité lo solicita.

---

Este archivo `anteproyecto_final.md` está listo para ser copiado a un documento Word, aplicar el formato institucional (Arial 12, interlineado 1.5, márgenes requeridos) y generar la tabla de contenidos automática para su entrega final.
