# PLANTEAMIENTO DEL PROBLEMA

## Contexto organizacional y operativo de ALITO GROUP SRL

ALITO GROUP SRL es una empresa dominicana fundada hace más de siete años, especializada en el sector de alquiler de equipos pesados, movimiento de materiales y servicios asociados a la construcción. Su sede operativa se encuentra en Bávaro – Punta Cana, provincia La Altagracia, una de las zonas de mayor dinamismo económico y desarrollo inmobiliario de la República Dominicana.

La empresa ha experimentado un crecimiento sostenido durante su trayectoria, consolidándose como un proveedor de referencia para proyectos de construcción residencial, comercial y turística en la región este del país. Su portafolio de servicios incluye:

### Servicios de alquiler de maquinaria pesada:
- Excavadoras de diversos tamaños y capacidades
- Retroexcavadoras para trabajos de excavación y carga
- Montacargas para manejo de materiales en obra
- Rodillos compactadores para preparación de terrenos
- Minicargadores (skid-steer loaders) para espacios reducidos
- Otros equipos especializados según demanda del proyecto

### Servicios de transporte y suministro:
- Transporte de materiales mediante camiones de volteo de alta capacidad (22 m³)
- Transporte con camiones de capacidad media (16 m³)
- Transporte con camiones de capacidad menor (6 m³) para accesos difíciles
- Suministro de materiales de construcción: arena, grava, piedra, relleno y otros agregados

### Servicios complementarios:
- Excavaciones para cimentaciones, piscinas, sótanos y obras civiles
- Limpieza y preparación de terrenos y obras
- Demolición controlada de estructuras
- Movimiento de tierra y nivelación de terrenos

Dada la diversidad y complejidad de sus operaciones, la empresa genera un volumen considerable de transacciones comerciales diarias, que incluyen: cotizaciones preliminares, cotizaciones formales, proformas, facturas con comprobantes fiscales (NCF), notas de crédito, notas de débito y estados de cuenta consolidados. Estos documentos están dirigidos a una cartera de clientes conformada principalmente por empresas constructoras, desarrolladores inmobiliarios, contratistas independientes e instituciones públicas de la zona turística del este.

---

## Descripción detallada del problema: desglose por categorías

El diagnóstico realizado en ALITO GROUP SRL revela un conjunto articulado de problemas que afectan los procesos de facturación, gestión documental y control financiero. A continuación se presenta un desglose exhaustivo de las problemáticas identificadas, organizadas en siete categorías principales:

---

## Categoría 1: Problemas en los procesos de elaboración documental

### Problema 1.1: Proceso de cotización fragmentado y lento

La elaboración de una cotización para un cliente requiere actualmente la ejecución de múltiples pasos manuales sin integración entre ellos:

- Búsqueda de los datos del cliente (nombre, RNC/cédula, dirección, contacto) en archivos dispersos o mediante consultas a otros colaboradores.
- Localización y copia de una plantilla de cotización en formato Excel, con el riesgo de utilizar versiones desactualizadas.
- Transcripción manual de los servicios solicitados, tarifas y condiciones específicas.
- Cálculo manual de subtotales, aplicación del ITBIS (18%) y determinación del monto total.
- Guardado del archivo con una nomenclatura que no sigue estándares consistentes.
- Conversión a PDF para envío al cliente.
- Envío mediante correo electrónico o aplicaciones de mensajería (WhatsApp).

**Evidencia:** Se estima que la elaboración de una cotización completa consume entre 15 y 30 minutos, dependiendo de la complejidad del servicio y la disponibilidad de información del cliente. En días de alta demanda, el personal administrativo puede recibir múltiples solicitudes simultáneas que generan colas de espera y retrasos en la respuesta comercial.

### Problema 1.2: Proceso de facturación manual con múltiples puntos de fallo

La emisión de facturas sigue un proceso similar al de las cotizaciones, con pasos adicionales que incrementan la complejidad y el riesgo de error:

- Verificación del NCF (Número de Comprobante Fiscal) disponible en la secuencia asignada por la DGII.
- Asignación manual del NCF a la factura, sin validación automática de secuencia ni detección de duplicados.
- Registro manual del NCF utilizado en una hoja de control separada.
- Cálculo manual del ITBIS, con verificación adicional mediante calculadora o fórmulas de Excel.
- Generación del documento en formato combinado (Excel + PDF).
- Archivo físico y/o digital del documento sin validación de integridad.

**Evidencia:** Se han detectado casos de NCF asignados fuera de secuencia, NCF duplicados en diferentes facturas, y NCF omitidos (saltos en la numeración). Cada uno de estos errores requiere procesos de corrección ante la DGII que consumen tiempo y pueden generar sanciones.

### Problema 1.3: Generación de proformas sin control de versiones

Las proformas, documentos previos a la factura formal utilizados para confirmación de servicios, se generan mediante copias de archivos anteriores modificados manualmente. No existe un control de versiones que permita:

- Identificar cuál es la versión vigente de una proforma cuando se han realizado múltiples modificaciones.
- Rastrear los cambios realizados entre versiones.
- Asociar la proforma con la cotización original y la factura posterior.

**Evidencia:** Se han reportado situaciones en las que el cliente recibe una proforma con condiciones diferentes a las acordadas previamente, generando confusiones, reclamos y retrabajo.

### Problema 1.4: Estados de cuenta generados mediante consolidación manual

Cuando un cliente solicita un estado de cuenta consolidado, el personal administrativo debe:

- Identificar todas las facturas emitidas a ese cliente en el período solicitado.
- Revisar múltiples archivos y hojas de cálculo para localizar cada documento.
- Verificar el estado de pago de cada factura (pendiente, parcialmente pagado, pagado).
- Transcribir la información a un nuevo documento consolidado.
- Calcular saldos pendientes, pagos realizados y antigüedad de la deuda.

**Evidencia:** La generación de un estado de cuenta consolidado puede tomar entre 30 minutos y 2 horas, dependiendo del volumen de transacciones del cliente y la dispersión de la información. Este tiempo es claramente desproporcionado para una tarea que debería ser rutinaria.

---

## Categoría 2: Problemas en la gestión de datos maestros

### Problema 2.1: Registros de clientes duplicados e inconsistentes

La ausencia de un catálogo centralizado de clientes con validaciones de unicidad ha generado:

- Múltiples registros para un mismo cliente con variaciones en el nombre comercial, razón social o datos de contacto.
- Clientes registrados con RNC/cédula incorrectos o incompletos.
- Información de contacto desactualizada (teléfonos, correos, direcciones) que dificulta la comunicación y la cobranza.
- Imposibilidad de consolidar el historial completo de un cliente cuando sus transacciones están dispersas bajo diferentes registros.

**Evidencia:** En una revisión preliminar de los archivos existentes, se identificaron casos de clientes con 3 o 4 registros diferentes, cada uno con variaciones menores en la escritura del nombre o diferencias en los datos de contacto.

### Problema 2.2: Catálogo de servicios y tarifas desactualizado

No existe un catálogo maestro centralizado y actualizado de los servicios ofrecidos por la empresa con sus tarifas vigentes. Las consecuencias incluyen:

- Personal que consulta listas de precios obsoletas o aplica tarifas incorrectas.
- Inconsistencia en los precios cobrados a clientes por servicios similares.
- Dificultad para implementar cambios de tarifas de manera uniforme en toda la operación.
- Negociaciones de precios sin visibilidad de los márgenes mínimos aceptables.

**Evidencia:** Se han identificado cotizaciones con tarifas significativamente diferentes para el mismo tipo de servicio, sin una justificación documentada de la variación.

### Problema 2.3: Ausencia de historial transaccional integrado

La información de cada cliente (cotizaciones, proformas, facturas, pagos, notas de crédito) se encuentra dispersa en múltiples archivos sin un vínculo estructurado que permita:

- Visualizar el historial completo de la relación comercial con cada cliente.
- Identificar patrones de consumo, estacionalidad o preferencias de servicios.
- Evaluar la rentabilidad histórica de cada cliente.
- Analizar el comportamiento de pago y el riesgo crediticio.

---

## Categoría 3: Problemas en la infraestructura tecnológica y acceso a la información

### Problema 3.1: Dependencia de archivos locales sin respaldo sistemático

La información crítica de facturación se almacena en computadoras locales de la oficina, con las siguientes limitaciones:

- Riesgo de pérdida de información por fallas de hardware, virus, ransomware o desastres (incendios, inundaciones, robos).
- No existe un sistema de respaldo automático y verificado de los archivos críticos.
- Los respaldos manuales, cuando se realizan, son esporádicos e incompletos.
- No hay procedimientos de recuperación ante desastres probados y documentados.

**Evidencia:** Si una de las computadoras principales sufriera un daño catastrófico, la empresa podría perder meses o años de información histórica de facturación, con consecuencias graves para auditorías fiscales y gestión de cobranza.

### Problema 3.2: Acceso restringido a ubicación física

El acceso a los archivos de facturación está limitado a las computadoras de la oficina, lo que genera:

- Imposibilidad de consultar información desde ubicaciones remotas (obras, visitas a clientes, viajes).
- Dependencia de la disponibilidad de equipos específicos que pueden estar ocupados por otros usuarios.
- Incapacidad de responder a consultas urgentes de clientes fuera del horario de oficina.
- Limitaciones para el trabajo colaborativo entre personal de diferentes áreas o ubicaciones.

### Problema 3.3: Ausencia de control de acceso y permisos

Todos los usuarios con acceso a las carpetas compartidas tienen los mismos privilegios, sin diferenciación de roles ni permisos:

- Cualquier usuario puede modificar o eliminar cualquier archivo, incluyendo documentos históricos.
- No existe registro de quién realizó qué cambio, cuándo y por qué.
- No hay protección contra modificaciones accidentales o malintencionadas de documentos ya emitidos.
- No se puede implementar segregación de funciones para control interno.

---

## Categoría 4: Problemas en la gestión de cobranza y flujo de caja

### Problema 4.1: Ausencia de alertas y recordatorios automatizados

No existe un mecanismo que genere alertas automáticas para:

- Facturas próximas a vencer (por ejemplo, 5 días antes del vencimiento).
- Facturas vencidas que requieren seguimiento inmediato.
- Clientes con múltiples facturas pendientes que superan un umbral de riesgo.
- Compromisos de pago registrados que deben verificarse en fechas específicas.

**Evidencia:** El seguimiento de la cobranza depende de la memoria y la revisión manual periódica por parte del personal, lo que resulta en seguimientos tardíos o omitidos.

### Problema 4.2: Dificultad para determinar saldos en tiempo real

Cuando un cliente consulta su saldo pendiente o cuando la gerencia necesita conocer el estado de las cuentas por cobrar, el proceso requiere:

- Revisar manualmente todas las facturas del cliente.
- Verificar los pagos registrados y cruzarlos con las facturas.
- Calcular el saldo resultante considerando notas de crédito y ajustes.
- Este proceso puede tomar minutos u horas, dependiendo del volumen.

### Problema 4.3: Falta de análisis de antigüedad de cartera

No se genera de forma rutinaria un análisis de antigüedad de las cuentas por cobrar que permita clasificar la cartera en rangos:

- 0-30 días (cartera corriente)
- 31-60 días (cartera vencida reciente)
- 61-90 días (cartera vencida)
- Más de 90 días (cartera de difícil cobro)

Esta información es esencial para priorizar esfuerzos de cobranza, constituir reservas contables y tomar decisiones de crédito.

---

## Categoría 5: Problemas de cumplimiento normativo y fiscal

### Problema 5.1: Riesgo de errores en la gestión de NCF

La gestión manual de los Números de Comprobante Fiscal (NCF) expone a la empresa a múltiples tipos de errores:

- **Saltos en la secuencia:** NCF que quedan sin utilizar, requiriendo justificación ante la DGII.
- **Duplicación de NCF:** Mismo número asignado a dos facturas diferentes, lo que constituye una falta grave.
- **Uso de NCF vencidos:** Comprobantes de secuencias que han excedido su fecha de vigencia.
- **Tipo de NCF incorrecto:** Uso de comprobantes de crédito fiscal cuando corresponde consumidor final, o viceversa.

**Evidencia:** Cada error en NCF detectado en auditoría de la DGII puede generar multas, recargos e intereses, además del tiempo invertido en procesos de regularización.

### Problema 5.2: Errores en el cálculo y aplicación del ITBIS

Los cálculos manuales del ITBIS (18%) son propensos a errores por:

- Errores aritméticos simples en el cálculo del porcentaje.
- Aplicación del impuesto a productos o servicios exentos.
- No aplicación del impuesto cuando corresponde.
- Errores de redondeo que se acumulan en documentos con múltiples líneas.
- Diferencias entre el ITBIS declarado y el ITBIS facturado.

### Problema 5.3: Dificultad para atender requerimientos de la DGII

Cuando la DGII solicita información (auditorías, verificaciones, cruces de información), el proceso de respuesta es lento y laborioso:

- Búsqueda manual de documentos solicitados en archivos dispersos.
- Reconstrucción de información que puede estar incompleta.
- Riesgo de no localizar documentos requeridos.
- Tiempos de respuesta que pueden exceder los plazos legales.

---

## Categoría 6: Problemas en la gestión del conocimiento organizacional

### Problema 6.1: Dependencia de personal clave

El conocimiento sobre los procesos, la ubicación de archivos, las tarifas, las condiciones especiales de clientes y los procedimientos de facturación está concentrado en pocas personas:

- Si estas personas se ausentan (vacaciones, enfermedad, renuncia), la operación se ve seriamente afectada.
- No existe documentación formal de procedimientos que permita la capacitación rápida de nuevos colaboradores.
- El proceso de inducción de personal nuevo es largo y depende de transmisión oral del conocimiento.

### Problema 6.2: Pérdida de información en transiciones de personal

Cuando un colaborador deja la empresa, se pierde:

- Conocimiento tácito sobre clientes, sus preferencias y particularidades.
- Información sobre acuerdos especiales o condiciones negociadas.
- Historial de comunicaciones y contexto de situaciones pendientes.
- Criterios y prácticas informales desarrolladas con la experiencia.

---

## Categoría 7: Problemas en la capacidad analítica y de gestión

### Problema 7.1: Ausencia de indicadores de desempeño (KPI)

No se calculan ni monitorean de forma sistemática indicadores clave como:

- Volumen de facturación diaria, semanal, mensual y acumulada.
- Tiempo promedio de elaboración de documentos comerciales.
- Tasa de error en documentos (porcentaje que requiere corrección).
- Días promedio de cobro (DSO - Days Sales Outstanding).
- Concentración de ingresos por cliente (dependencia de clientes principales).
- Tendencias de crecimiento o decrecimiento por tipo de servicio.

### Problema 7.2: Incapacidad de generar reportes gerenciales oportunos

La gerencia no dispone de herramientas que le permitan:

- Visualizar el estado de la facturación y la cobranza en tiempo real.
- Comparar el desempeño actual con períodos anteriores.
- Identificar desviaciones que requieran atención inmediata.
- Proyectar flujos de efectivo con base en la cartera pendiente.
- Tomar decisiones informadas sobre crédito, descuentos y negociaciones.

### Problema 7.3: Dificultad para identificar oportunidades y riesgos

Sin información analítica, la empresa carece de visibilidad para:

- Detectar clientes con alto potencial de crecimiento.
- Identificar servicios más rentables versus servicios con bajo margen.
- Reconocer patrones estacionales que afectan la demanda.
- Anticipar problemas de liquidez por concentración de vencimientos.
- Evaluar el impacto de cambios en precios o condiciones comerciales.

---

## Actores afectados por la situación problemática

El conjunto de problemas descritos afecta de manera diferenciada a los siguientes actores:

### Personal administrativo y de facturación (10-15 colaboradores):
- Sobrecarga de trabajo por procesos manuales ineficientes.
- Frustración por herramientas inadecuadas que dificultan su labor.
- Estrés por la presión de responder rápidamente sin los medios necesarios.
- Exposición a errores que generan señalamientos y retrabajo.
- Limitada posibilidad de desarrollo profesional al estar absorbidos por tareas operativas.

### Gerencia y dirección de la empresa:
- Falta de información consolidada para la planificación estratégica.
- Incertidumbre sobre el estado real de la facturación y la cobranza.
- Dificultad para evaluar el desempeño del área administrativa.
- Limitada capacidad de control interno y detección de irregularidades.
- Exposición a riesgos fiscales y operativos no cuantificados.

### Clientes de ALITO GROUP SRL:
- Demoras en la recepción de cotizaciones y facturas.
- Posibles errores en documentos que requieren corrección y retrabajo.
- Dificultad para obtener estados de cuenta cuando los necesitan.
- Percepción de falta de profesionalismo en la gestión administrativa.
- Experiencia de servicio que no está a la altura de la calidad técnica ofrecida.

### Área contable y fiscal:
- Dificultad para conciliar información de facturación con registros contables.
- Riesgo de errores en declaraciones de impuestos por información incompleta o incorrecta.
- Carga de trabajo adicional para corregir inconsistencias detectadas tardíamente.
- Exposición a observaciones y sanciones de la DGII.

### La empresa como entidad (perspectiva institucional):
- Riesgo reputacional por errores en documentos comerciales.
- Exposición a sanciones fiscales que afectan el patrimonio.
- Limitación del potencial de crecimiento por procesos que no escalan.
- Desventaja competitiva frente a empresas con procesos más eficientes.
- Pérdida de oportunidades de negocio por lentitud en la respuesta comercial.

---

## Consecuencias directas de la situación problemática

Si la situación problemática no se aborda mediante una solución integral, las consecuencias previsibles incluyen:

1. **Incremento progresivo de los tiempos de procesamiento:** A medida que el volumen de operaciones crezca, los tiempos manuales se multiplicarán de manera no lineal, generando cuellos de botella cada vez más severos.

2. **Aumento de la tasa de errores:** La presión por procesar más transacciones en menos tiempo inevitablemente incrementará la frecuencia de errores, con sus costos asociados de corrección.

3. **Deterioro del flujo de caja:** Las demoras en facturación y las deficiencias en seguimiento de cobranza se traducirán en ciclos de cobro más largos y mayor capital inmovilizado en cuentas por cobrar.

4. **Exposición creciente a sanciones fiscales:** Los errores en NCF e ITBIS, si no se controlan, podrán acumularse hasta generar observaciones significativas en auditorías de la DGII.

5. **Pérdida de clientes por insatisfacción:** Clientes que experimenten repetidamente demoras o errores podrán optar por proveedores que ofrezcan una experiencia administrativa superior.

6. **Rotación de personal administrativo:** La frustración y el estrés causados por herramientas inadecuadas podrán provocar la salida de colaboradores valiosos, con la consiguiente pérdida de conocimiento institucional.

7. **Imposibilidad de escalar las operaciones:** El crecimiento comercial de la empresa estará limitado por la capacidad de los procesos administrativos manuales, que no pueden expandirse sin incrementos proporcionales (o mayores) en personal y tiempo.

---

## Síntesis del problema central

En síntesis, ALITO GROUP SRL enfrenta una situación problemática multidimensional caracterizada por:

- La **ausencia de un sistema integrado de facturación** que centralice la información y automatice los procesos documentales.
- La **carencia de controles automatizados** para la gestión de NCF, cálculo de impuestos y validación de datos.
- La **dispersión de información crítica** en archivos locales sin respaldo, trazabilidad ni control de acceso.
- La **inexistencia de herramientas analíticas** que proporcionen visibilidad gerencial y apoyen la toma de decisiones.
- La **vulnerabilidad operativa** derivada de la dependencia de procesos manuales y de personal clave.

Esta problemática afecta transversalmente la eficiencia operativa, el cumplimiento normativo, la experiencia del cliente, la gestión financiera y la capacidad de crecimiento sostenible de la empresa. La magnitud y articulación de estos problemas fundamenta la necesidad de una solución tecnológica integral que aborde de manera coordinada todas las dimensiones identificadas.
