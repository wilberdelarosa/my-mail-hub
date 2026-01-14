# Propuesta Técnica: Arquitectura del Sistema de Facturación

## 1.0 Introducción y Visión Estratégica

El proceso actual de facturación, caracterizado por su naturaleza manual, representa una barrera significativa para la agilidad y precisión operativa. La dependencia de la comunicación verbal, la transcripción de datos y el envío manual de documentos consume un tiempo valioso y abre la puerta a errores que pueden impactar tanto la eficiencia interna como la percepción del cliente. Para superar estos desafíos, se propone el desarrollo de un sistema de facturación moderno, diseñado para ser una solución automatizada, resiliente y centrada en el usuario, que optimice radicalmente el ciclo completo desde la solicitud de una cotización hasta la emisión de la factura fiscal.

Para materializar esta visión, hemos seleccionado una **arquitectura de software dual** que fusiona los principios de **Microservicios** con la  **Arquitectura Hexagonal** . Esta combinación estratégica se ha elegido para alcanzar tres objetivos fundamentales: independencia de los módulos, flexibilidad para la integración de canales y alta resiliencia del sistema. La arquitectura de Microservicios nos da  **resiliencia a nivel de servicio** , mientras que la Arquitectura Hexagonal nos da  **resiliencia a nivel de canal** , aislando el núcleo de negocio de los puntos de entrada y salida. Juntas, crean un sistema robusto en múltiples dimensiones.

A continuación, se detalla el primer pilar de nuestro diseño: la arquitectura orientada a microservicios.

## 2.0 Arquitectura Orientada a Microservicios: Módulos Independientes y Resilientes

La adopción de una arquitectura de microservicios es una decisión estratégica para gestionar la complejidad y construir un sistema robusto. Este enfoque consiste en descomponer el sistema monolítico en un conjunto de servicios más pequeños, autónomos y altamente especializados, cada uno enfocado en una única capacidad de negocio. Esta separación no solo simplifica el desarrollo y el mantenimiento, sino que también mejora la escalabilidad individual de cada componente y, de manera crucial, garantiza que el fallo de un servicio no provoque una caída general del sistema.

Hemos identificado tres microservicios principales que encapsulan las funciones de negocio clave:

| Microservicio                      | Responsabilidad Principal                                                                                                                                                                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Servicio de Cotización**  | Recibe solicitudes desde los canales web y WhatsApp. Genera cotizaciones automáticas, gestiona su aprobación por parte del personal y administra su ciclo de vida (aprobada, rechazada o expirada), asegurando que los precios se mantengan actualizados.                         |
| **Servicio de Proforma**     | Da seguimiento a la entrega real de productos y servicios contra una cotización aprobada. Su función es registrar los avances diarios (ej. metros de material entregado, horas de equipo utilizadas) y validar que se ha cumplido lo pactado antes de proceder a la facturación. |
| **Servicio de Facturación** | Gestiona el proceso final de facturación, que se activa tras la finalización de la proforma y la confirmación del pago. Es responsable de la asignación de Números de Comprobante Fiscal (NFC) y la generación del documento final para el cliente.                           |

Estos servicios se comunican a través de **APIs (Interfaces de Programación de Aplicaciones)** ligeras y desacopladas, que definen contratos de servicio explícitos. Este mecanismo asegura un bajo acoplamiento, permitiendo que si el `Servicio de Cotización` experimentara una interrupción, los servicios de `Proforma` y `Facturación` (incluida la capacidad de facturación manual) sigan operativos, evitando la corrupción de datos y la paralización del flujo de trabajo.

Esta independencia de servicios es poderosa, pero para que sea verdaderamente efectiva, cada microservicio debe ser agnóstico a cómo se le invoca o qué tecnologías utiliza. Este desafío de aislamiento es precisamente lo que resuelve nuestro segundo pilar arquitectónico: la Arquitectura Hexagonal.

## 3.0 Arquitectura Hexagonal: Aislamiento de la Lógica de Negocio

La Arquitectura Hexagonal, también conocida como Puertos y Adaptadores, es el segundo pilar de nuestro diseño. Su valor estratégico radica en su capacidad para **separar la lógica central de la aplicación (el "hexágono") de las tecnologías e infraestructuras externas (los "adaptadores")** a través de un principio de  **inversión de dependencias** . Esto significa que el núcleo del negocio —las reglas, los cálculos y los flujos de trabajo— permanece completamente agnóstico a cómo los usuarios interactúan con el sistema, dónde se almacenan los datos o qué servicios de mensajería se utilizan. Este aislamiento hace que el sistema sea más fácil de probar, mantener y adaptar a futuros cambios tecnológicos.

### Adaptadores de Entrada (Impulsores)

Estos adaptadores son los mecanismos que inician una acción en el sistema. Para nuestro proyecto, hemos definido los siguientes:

* **Adaptador Web:** Una interfaz de usuario completa que presenta catálogos de productos y formularios. Permite tanto a clientes como al personal interno generar y gestionar solicitudes de cotización de manera intuitiva.
* **Adaptador de WhatsApp:** Un bot conversacional automatizado que guía a los clientes a través de un flujo de preguntas y respuestas para solicitar una cotización. Recolecta exactamente los mismos datos que el portal web, ofreciendo un canal de comunicación alternativo y ágil.
* **Adaptador de Operaciones Manuales:** Interfaces internas diseñadas para que los agentes de la empresa puedan registrar clientes o generar cotizaciones y facturas directamente en el sistema. Este adaptador actúa como un respaldo crucial, garantizando la continuidad operativa si los canales automatizados fallan.

### Adaptadores de Salida (Impulsados)

Estos adaptadores son los componentes que el sistema utiliza para comunicarse con servicios externos y ejecutar acciones en el mundo exterior.

* **Adaptador de Base de Datos:** Los canales externos (Web, WhatsApp) escriben las solicitudes iniciales en una base de datos centralizada de "entrada". Desde allí, cada microservicio extrae los datos relevantes y los procesa en su propia base de datos o conjunto de tablas de dominio, garantizando así un estricto aislamiento de datos.
* **Adaptador de Notificaciones:** Se integrará con plataformas de automatización como **N8N** para enviar comunicaciones automáticas a los clientes. Estas notificaciones informarán sobre el estado de sus proformas, enviarán recordatorios de pago y confirmarán la recepción de facturas a través de correo electrónico y WhatsApp.
* **Adaptador de Almacenamiento de Archivos:** Para optimizar el rendimiento y evitar la sobrecarga de la base de datos, el sistema almacena  *datos estructurados* , no archivos binarios (blobs). Los documentos (PDFs) se generan bajo demanda, y un adaptador se encarga de enviarlos directamente al cliente o de almacenarlos en un servicio externo (ej. Google Drive), tratando la generación de archivos como una tarea de la capa de presentación.

La combinación de estos patrones arquitectónicos se materializa en un flujo de trabajo coherente y automatizado que abarca todo el ciclo de vida de la facturación.

## 4.0 Flujo de Proceso Integral: Desde la Cotización hasta la Factura

Esta sección ilustra el recorrido completo de una transacción dentro de la arquitectura propuesta, demostrando cómo los microservicios, puertos y adaptadores trabajan en conjunto para ejecutar el proceso de negocio de manera eficiente y automatizada.

1. **Recepción y Creación de la Cotización** : El proceso comienza cuando un cliente inicia una solicitud a través del **Adaptador Web** o el  **Adaptador de WhatsApp** . Los datos del pedido son recolectados y enviados a una base de datos centralizada de entrada. Desde allí, el **Servicio de Cotización** toma esta información, genera un borrador de cotización y lo presenta en un panel de control interno para que un empleado lo revise y apruebe.
2. **Aprobación y Ciclo de Vida de la Cotización** : Una vez que el empleado aprueba la cotización, el sistema notifica al cliente y almacena permanentemente los **datos** de la cotización, no el archivo PDF, para fines de auditoría. Si una cotización es rechazada o expira (tras 15-30 días), su número queda invalidado. Esta expiración es una regla de negocio necesaria para protegerse de las fluctuaciones de precios del mercado. Aunque invalidada, el registro de datos se conserva para el historial.
3. **Seguimiento con la Proforma** : Con la cotización aprobada, el trabajo puede comenzar. El **Servicio de Proforma** se activa, vinculándose a la cotización correspondiente. El personal de operaciones registra en el sistema las entregas parciales y el trabajo realizado. La plataforma recalcula los saldos pendientes en tiempo real (ej. "tras una entrega, el sistema recalcula el saldo pendiente a 260m de material y 8 horas de equipo"). El cliente recibe notificaciones automáticas sobre las actualizaciones de la proforma, manteniéndolo informado del progreso.
4. **Verificación de Pago y Generación de Factura** : Cuando la proforma se completa, indicando que todo lo cotizado ha sido entregado, el sistema pasa a la fase de pago. Una vez que el pago es registrado y validado, se activa el  **Servicio de Facturación** . Para evitar la emisión de documentos fiscales incorrectos, se implementa un proceso de validación de tres pasos que le da al usuario la oportunidad de revisar y retroceder si detecta un error. La factura final se crea utilizando los datos consolidados de la proforma, asegurando que el documento refleje con precisión el servicio prestado.

Este flujo estructurado garantiza la trazabilidad y la integridad de los datos, pero su robustez se ve reforzada por la capacidad del sistema para manejar interrupciones en la conectividad.

## 5.0 Resiliencia y Operación en Modo Offline

La continuidad del negocio es un requisito crítico. Por ello, la capacidad de operar en modo offline es una característica fundamental de esta arquitectura, diseñada para que el sistema siga funcionando de manera transparente para el usuario, incluso con conexiones a internet intermitentes o nulas, evitando así la pérdida de datos y la interrupción de las tareas diarias.

Cuando se pierde la conexión a internet, la aplicación cliente continúa operando con normalidad, guardando todas las transacciones generadas (nuevas cotizaciones, registros de proforma) en una base de datos local. Este proceso es análogo a realizar "commits" en un repositorio de código local de Git, donde el trabajo se almacena de forma segura antes de ser sincronizado con el servidor central.

Al restablecerse la conexión, la aplicación detecta automáticamente la disponibilidad del servidor. Antes de enviar los datos locales, realiza una petición al servidor para consultar la última secuencia numérica utilizada (por ejemplo, la última cotización registrada en el sistema central fue la `N° 150`).

Esta consulta es clave para la estrategia de resolución de conflictos. Con la secuencia actual del servidor en mano (`150`), la aplicación local reasigna los números de secuencia a sus transacciones pendientes (ej. `151`, `152`, etc.), garantizando que no se produzcan duplicados o colisiones. Una vez reasignados los identificadores, los datos locales se envían al servidor central en una cola de solicitudes para ser procesados, manteniendo la integridad y consistencia de los datos en todo momento.

Este enfoque de sincronización garantiza una operación robusta y confiable, protegiendo al negocio contra las fallas de conectividad.

## 6.0 Conclusión: Justificación de la Arquitectura Propuesta

La arquitectura propuesta, basada en una combinación estratégica de **Microservicios** y  **Arquitectura Hexagonal** , ha sido diseñada para transformar el proceso de facturación actual en un sistema moderno, eficiente y resiliente. Al descomponer la complejidad en módulos manejables y aislar la lógica de negocio de la tecnología externa, creamos una solución que no solo resuelve los desafíos operativos actuales, sino que también establece una base sólida y flexible para el crecimiento futuro.

Las ventajas clave de este diseño se pueden resumir en los siguientes puntos:

* **Modularidad y Mantenibilidad:** La separación en microservicios facilita el desarrollo, las pruebas y las actualizaciones de componentes individuales sin afectar el resto del sistema, reduciendo riesgos y acelerando la entrega de nuevas funcionalidades.
* **Flexibilidad y Escalabilidad:** La Arquitectura Hexagonal permite integrar sin esfuerzo nuevos canales de cliente (como una futura aplicación móvil) o cambiar tecnologías subyacentes (como bases de datos o servicios de notificación) sin tener que modificar la lógica de negocio principal.
* **Alta Disponibilidad y Resiliencia:** La independencia de los servicios, junto con una robusta capacidad de operación offline, garantiza que el sistema permanezca funcional y confiable ante fallos técnicos o de conectividad, asegurando la continuidad del negocio.
* **Alineación con el Negocio:** El diseño refleja directamente el flujo de trabajo de la empresa, automatizando tareas críticas, proporcionando visibilidad completa del proceso y ofreciendo una plataforma tecnológica capaz de evolucionar junto con las necesidades del negocio.
