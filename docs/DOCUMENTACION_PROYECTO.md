# Documentación Integral del Proyecto: Sistema de Facturación Cloud con IA (ALITO GROUP SRL)

## 1. Información General del Proyecto
**Título del Proyecto:** Arquitectura y desarrollo de un sistema de facturación cloud impulsado por agentes de IA para ALITO GROUP SRL, Bávaro – Punta Cana (2025).

**Contexto Académico:**
- **Institución:** Universidad Central del Este (UCE)
- **Extensión:** Punta Cana
- **Carrera:** Ingeniería de Software (implícita por el contenido)
- **Autores:** 
    - Wilbert (Matrícula: 2022-0547) [Autor principal deducido]
    - Jesus Andres Acevedo Carrasco (Matrícula: 2020-2551)
- **Asesor:** Ramon Eduardo Zorrilla Mateo
- **Fecha de Inicio:** 20 Septiembre 2025

## 2. Descripción del Problema
Actualmente, **ALITO GROUP SRL** gestiona sus procesos administrativos y financieros de manera manual utilizando hojas de cálculo (Excel). Esta dependencia ha generado problemas críticos:
- **Errores recurrentes:** Fallos en la numeración de facturas y cálculos de ITBIS (18%).
- **Riesgos Fiscales:** Inconsistencias en el manejo de Comprobantes Fiscales (NCF).
- **Ineficiencias:** Retrasos en la atención al cliente y duplicidad de datos.
- **Falta de Trazabilidad:** Información dispersa y difícil de auditar.

## 3. Solución Propuesta
Se propone el desarrollo de un **Sistema de Facturación Cloud impulsado por Agentes de Inteligencia Artificial**. La solución busca modernizar, sistematizar y centralizar la gestión de cotizaciones, facturas y estados de cuenta.

### Objetivos Clave
1.  **Automatización:** Eliminar tareas manuales repetitivas mediante agentes de IA.
2.  **Centralización:** Unificar toda la información en un repositorio cloud confiable.
3.  **Cumplimiento Fiscal:** Validación automática de NCF y cálculos de impuestos en tiempo real.
4.  **Business Intelligence:** Proveer reportes dinámicos para la toma de decisiones.

## 4. Arquitectura del Sistema
El sistema se basa en principios de arquitectura moderna para garantizar escalabilidad y robustez.

### 4.1 Principios de Diseño
- **Arquitectura Hexagonal:** Desacoplamiento total de la lógica de negocio respecto a frameworks externos, interfaces de usuario y bases de datos.
- **Microservicios / Modularidad:** Módulos independientes para:
    - **Cotización**
    - **Proformas**
    - **Facturación Fiscal**
    Cada módulo mantiene su propia lógica y persistencia, comunicándose vía APIs.
- **Enfoque Offline-First:** Capacidad de operar localmente en situaciones de baja conectividad, con sincronización automática a la nube al restablecerse la conexión.

### 4.2 Componentes Tecnológicos
- **Backend/Core:** Lógica de negocio centralizada manejando las reglas de facturación y validación.
- **Base de Datos:** Repositorio centralizado que alimenta todos los módulos funcionales.
- **Almacenamiento de Documentos:** Integración con **Google Drive** para gestión documental.
- **IA y Automatización:**
    - Agentes inteligentes para procesamiento de lenguaje natural (NLP).
    - Automatización de flujos de trabajo (validación de datos).

## 5. Canales de Interacción y Flujo de Trabajo
El sistema habilita múltiples canales de entrada para maximizar la captación de clientes y agilizar el servicio.

### 5.1 Canales de Entrada
1.  **Portal Web:** Interfaz tipo catálogo donde los clientes pueden navegar servicios y solicitar cotizaciones estructuradas.
2.  **WhatsApp Bot (Impulsado por IA):** 
    - Interfaz conversacional que acepta texto y audio.
    - La IA procesa la intención del usuario y extrae los datos necesarios para generar una cotización preliminar automáticamente.

### 5.2 Flujo de Procesos (End-to-End)
1.  **Solicitud (Request):** El cliente inicia el contacto vía Web o WhatsApp.
2.  **Generación Automática:** El sistema (o los agentes de IA) generan una cotización preliminar basada en los datos extraídos.
3.  **Validación Humana (Human-in-the-loop):** Un administrador revisa la cotización generada, ajusta precios si es necesario y aprueba el documento. Este paso es obligatorio para asegurar la calidad.
4.  **Evolución del Documento:**
    - **Cotización Aprobada** -> Se convierte en **Proforma**.
    - **Proforma Confirmada** -> Se emite la **Factura Fiscal** final con NCF válido.

## 6. Impacto Esperado
- **Operativo:** Reducción drástica de tiempos de respuesta y eliminación de errores de cálculo.
- **Empresarial:** Mejora en la imagen corporativa y confianza del cliente.
- **Tecnológico:** Implementación de vanguardia (IA + Cloud) en el sector de equipos pesados en Punta Cana.

## 7. Referencias y Bibliografía
- Normativas DGII sobre Comprobantes Fiscales.
- Documentación de Power BI y n8n (para automatización y reportes).
- Informe de Arquitectura y Flujo de Procesos (Documento interno del proyecto).
