# Anexos Técnicos de Prestación de Servicios (Statements of Work - SOW)
**Colección de SOWs Específicos para los 6 Servicios Clave del Negocio**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento contiene las plantillas formales de los **Anexos Técnicos o Declaraciones de Trabajo (SOW)** para cada uno de los 6 servicios principales de tu catálogo. Cada SOW se acopla directamente al Contrato Marco de Prestación de Servicios, definiendo los alcances, accesos, hitos y SLAs de forma específica.

---

## ESTRUCTURA DE INTEGRACIÓN CONTRACTUAL
Cada contrato enviado al cliente estará compuesto por:
1.  **Contrato Marco (MSA):** Bases legales de responsabilidad, mora y propiedad intelectual ([CONTRATO_PRESTACION_SERVICIOS_PEN.md](file:///d:/Proyectos%20personales/Mi%20perfil%20laboral/DOCUMENTACION_FINANCIERA_PEN/CONTRATO_PRESTACION_SERVICIOS_PEN.md)).
2.  **Anexo Técnico (SOW):** Uno de los siguientes documentos específicos de alcance según el plan contratado.

---

### ANEXO TÉCNICO C.1: Reingeniería Lógica y Migración de Automatizaciones a n8n
**SOW ID:** SOW-C1-[Año]-[Correlativo]

#### 1. Alcance Técnico y Entregables
*   **Auditoría y Mapeo Lógico:** Auditoría y documentación técnica visual (Miro/Excalidraw) de hasta cinco (5) flujos lógicos activos en las plataformas origen (Zapier o Make).
*   **Despliegue de Entorno Dedicado:** Configuración y hardening de un servidor VPS Linux (Ubuntu) en el proveedor del Cliente (Hetzner, DigitalOcean o AWS), instalando n8n bajo contenedores Docker aislados, base de datos PostgreSQL dedicada y certificado de seguridad SSL Let's Encrypt.
*   **Reingeniería y Migración:** Reconstrucción optimizada de los 5 flujos en n8n, utilizando scripting (JavaScript/Node.js) para consolidar tareas y minimizar llamadas innecesarias a APIs.
*   **Resiliencia Operativa:** Implementación de flujos de backup automáticos diarios cifrados hacia un bucket S3/Cloudflare R2 y alertas inmediatas a Slack/WhatsApp en caso de fallos lógicos.
*   **Entrega:** Video interactivo de Loom (10 min) detallando la operatividad de los flujos y entrega de credenciales.

#### 2. Requerimientos de Accesos (A cargo del Cliente)
*   Credenciales de solo lectura de la cuenta de Zapier/Make origen.
*   Acceso de administrador al panel de control del hosting/VPS para configuración DNS y Docker.
*   API Keys y credenciales de autenticación activas para las herramientas integradas en los flujos.

#### 3. Cronograma e Hitos de Pago (Setup Fee)
*   **Hito 1 (Inicio):** 50% de anticipo. Se inicia la fase de auditoría y despliegue del VPS.
*   **Hito 2 (Entrega):** 50% restante tras la ejecución del Shadow Run paralelo (7 días útiles) confirmando cero discrepancias de datos.

---

### ANEXO TÉCNICO C.2: Plataforma Web, Tienda Virtual o Academia LMS
**SOW ID:** SOW-C2-[Año]-[Correlativo]

#### 1. Alcance Técnico y Entregables
*   **Instalación y Cache de Servidor:** Configuración del CMS WordPress en el hosting del Cliente (Hostinger/cPanel), aplicando optimización técnica de velocidad (WPO) mediante compresión Gzip, almacenamiento en caché a nivel de base de datos y optimización de recursos estáticos.
*   **Maquetación de Interfaces UX/UI:** Configuración del tema base, tema hijo (*child theme*) e interfaces responsivas a medida mediante constructores visuales (Hello Elementor / Astra).
*   **Motor Transaccional / LMS:** Configuración del catálogo y carrito de compras (WooCommerce) o del sistema de cursos y membresías (LearnDash/TutorLMS).
*   **Pasarela de Pagos:** Integración segura de pasarelas locales en Perú (Culqi, Niubiz) o globales (Stripe, PayPal) en entorno sandbox y pase a producción.
*   **SEO Técnico:** Configuración de redirecciones HTTPS forzosas, sitemap XML, indexación en Google Search Console y optimización técnica de velocidad de carga superior a 90 puntos en móviles (PageSpeed).

#### 2. Requerimientos de Accesos (A cargo del Cliente)
*   Accesos de administrador al panel de cPanel/Hostinger.
*   Credenciales de acceso al proveedor de dominio (GoDaddy, Namecheap, punto.pe).
*   Credenciales en entorno de producción de las pasarelas de pago.

#### 3. Cronograma e Hitos de Pago (Setup Fee)
*   **Hito 1 (Inicio):** 50% de anticipo. Se inician los trabajos de maquetación y diseño de bases de datos.
*   **Hito 2 (Entrega):** 50% restante a la firma del acta de conformidad tras pruebas exitosas de compra/registro.

---

### ANEXO TÉCNICO B.1: Orquestación de Leads y Canales Corporativos
**SOW ID:** SOW-B1-[Año]-[Correlativo]

#### 1. Alcance Técnico y Entregables
*   **Licenciamiento Silhouette OS:** Integración de la consola web propietaria **Silhouette OS** bajo el subdominio y marca del Cliente.
*   **Despliegue de Silhouette Brain:** Configuración del motor de procesamiento semántico en n8n para auditar leads entrantes, evaluar el ajuste con el Perfil de Cliente Ideal (ICP) y asignar un score inteligente (0-100).
*   **Integración de API Conversacional:** Vinculación de la API oficial de WhatsApp Business (Meta Cloud API) para disparar respuestas automáticas de perfilamiento en menos de 30 segundos.
*   **Sincronización de CRM:** Conexión y enrutamiento dinámico de leads calificados hacia el CRM del Cliente (HubSpot, Pipedrive o Salesforce), enviando alertas inmediatas de leads calificados a Slack/WhatsApp.
*   **Calibración Semántica:** 30 días calendario de fine-tuning de prompts y base de conocimientos de la IA para evitar alucinaciones.

#### 2. Requerimientos de Accesos (A cargo del Cliente)
*   Acceso de administrador a Meta Business Manager para verificación del número de WhatsApp oficial.
*   Accesos de administrador con permisos API al CRM de la empresa.
*   Cuenta de OpenAI Developer activa con facturación en tarjeta registrada por el Cliente.

#### 3. Cronograma e Hitos de Pago (Setup Fee)
*   **Hito 1 (Inicio):** 50% de anticipo. Se inicia la configuración del Business Manager y consola.
*   **Hito 2 (Entrega):** 50% restante al término de las pruebas de enrutamiento exitosas.

---

### ANEXO TÉCNICO B.2: Desarrollo de Aplicación Web Dedicada y Consola Operativa
**SOW ID:** SOW-B2-[Año]-[Correlativo]

#### 1. Alcance Técnico y Entregables
*   **Arquitectura Frontend:** Construcción de interfaz de usuario de página única (SPA) mediante React, TypeScript y TailwindCSS (código modular y limpio).
*   **Arquitectura Backend y Base de Datos:** Backend en Node.js/Express con base de datos PostgreSQL, implementando seguridad de datos y control de accesos basados en roles (RBAC).
*   **Consola de Administración:** Dashboard privado para gestión de usuarios, auditoría de logs y analíticas clave de negocio.
*   **Autenticación:** Implementación de tokens JWT seguros y/o Supabase Auth.
*   **Despliegue:** Configuración del repositorio GitHub y despliegue continuo (CI/CD) en Vercel, Netlify o servidores VPS propios de la empresa.

#### 2. Requerimientos de Accesos (A cargo del Cliente)
*   Acceso al repositorio de código en GitHub/GitLab.
*   Accesos de administrador a la cuenta de Supabase / AWS / DigitalOcean del Cliente.

#### 3. Cronograma e Hitos de Pago (Setup Fee)
*   **Hito 1 (Inicio):** 40% de anticipo al inicio de la fase de maquetación y diseño de bases de datos.
*   **Hito 2 (Hito Medio):** 30% a la entrega de la versión Beta funcional.
*   **Hito 3 (Entrega):** 30% restante a la firma del acta de aceptación, previo al despliegue en producción.

---

### ANEXO TÉCNICO A.1: Enjambres Autónomos de Razonamiento e Inteligencia Artificial
**SOW ID:** SOW-A1-[Año]-[Correlativo]

#### 1. Alcance Técnico y Entregables
*   **Diseño de Swarms Multi-Agente:** Desarrollo en Python del enjambre de agentes autónomos y colaborativos mediante la librería **LangGraph** (ej. agentes redactores, analistas de cumplimiento y enrutadores).
*   **Capa de Memoria Causal:** Integración de la base de datos de memoria persistente **CausalOS-Python** para asegurar la retención histórica coherente de interacciones semánticas.
*   **Infraestructura de Telemetría:** Vinculación y monitoreo del consumo de tokens y depuración de prompts con plataformas como LangSmith o Langfuse.
*   **Transferencia Tecnológica:** Taller interactivo de 4 horas impartido por Alberto Farah Blair para el equipo de desarrollo interno del Cliente sobre la mantenimiento del sistema.

#### 2. Requerimientos de Accesos (A cargo del Cliente)
*   Accesos de administrador al repositorio de código principal.
*   Credenciales de facturación activa en las plataformas de telemetría y APIs (OpenAI/Anthropic).

#### 3. Cronograma e Hitos de Pago (Setup Fee)
*   **Hito 1 (Inicio):** 50% de anticipo. Inicio de fase de modelado de agentes en sandbox.
*   **Hito 2 (Entrega):** 50% restante tras el taller de transferencia técnica y aprobación en Staging.

---

### ANEXO TÉCNICO A.2: Plataforma de Software SaaS de Alta Disponibilidad
**SOW ID:** SOW-A2-[Año]-[Correlativo]

#### 1. Alcance Técnico y Entregables
*   **Arquitectura Next.js App Router:** Desarrollo de plataforma web robusta con Server-Side Rendering (SSR) y optimización de velocidad de carga extrema.
*   **Ecosistema de Base de Datos y Docker:** Dockerización de servicios y balanceador de carga en AWS/DigitalOcean con réplicas de bases de datos de lectura.
*   **Stripe Billing:** Configuración del motor transaccional multi-tarifa de Stripe (suscripciones mensuales, por consumo, periodos de prueba y facturación basada en asientos).
*   **Suite de Testing:** Programación de pruebas automatizadas End-to-End con Playwright para asegurar estabilidad del core de negocio.

#### 2. Requerimientos de Accesos (A cargo del Cliente)
*   Acceso al entorno de producción de Stripe del Cliente.
*   Accesos de administrador a la consola de AWS o DigitalOcean empresarial.

#### 3. Cronograma e Hitos de Pago (Setup Fee)
*   **Hito 1 (Inicio):** 30% de anticipo.
*   **Hito 2 (Base de Datos e Integración Stripe):** 40% a la entrega del núcleo funcional.
*   **Hito 3 (Entrega):** 30% restante a la aprobación de la suite de pruebas automatizadas y despliegue final.
