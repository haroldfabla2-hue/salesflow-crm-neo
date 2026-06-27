# Protocolos Operativos y Flujos de Trabajo por Servicio (SOP)
**Manual de Ejecución, Entregables y Aseguramiento de Calidad (QA)**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento define las **fichas técnicas operativas** de cómo tu negocio debe ejecutar y entregar sus servicios clave. Estructurar estos pasos garantiza que puedas delegar tareas al programador Junior y QA de forma repetible y predecible, manteniendo la alta calidad técnica.

---

## 1. Mapeo de Servicios Basados en Proyectos Reales

Para dar consistencia al modelo, mapeamos los servicios de tu catálogo con proyectos reales que ya has ejecutado con éxito:

*   **Migración Zapier/Make a n8n (C.1):** Mapeado con proyectos como `boomeranginternacional.com` (Migración de flujos).
*   **Automatización Simple (C.2.A):** Mapeado con integraciones de reservas como en `bijoume.shop` (Integración de sistema de bookeo).
*   **Web WordPress / E-Commerce (C.2.B):** Mapeado con `bijoueme.com` (Tienda online) y `Nuestras Casas` (Catálogo/Web de muebles).
*   **Web Corporativa / Landing (C.2.C):** Mapeado con `djhediger.albertofarah.com` (Sitio web DJ) y `Virako Travel` (Creación).
*   **Mantenimiento SLA Técnico (RET.B):** Mapeado con tareas recurrentes de `Yarnalia` (Actualización de contenido, subida de blogs y free patterns).

---

## 2. Protocolos de Ejecución Paso a Paso

---

### PROTOCOLO C.1: Migración Zapier/Make a n8n
*   **Responsables:** Junior (Implementación: 6h) | Alberto (Arquitectura y QA: 3h)
*   **Fase 1: Auditoría de Flujos (Alberto - 1h)**
    1.  Solicitar accesos de solo lectura a la cuenta de Zapier/Make del cliente.
    2.  Mapear los webhooks, conectores y lógica de datos actual en un esquema visual.
    3.  Asegurar que las APIs y endpoints del cliente estén vigentes.
*   **Fase 2: Setup del Servidor n8n (Alberto - 1h)**
    1.  Desplegar instancia n8n en el VPS del cliente (Hetzner / DigitalOcean) usando Docker Compose con Postgres como base de datos.
    2.  Configurar subdominio (ej. `n8n.cliente.com`) con certificado SSL (Let's Encrypt).
    3.  Configurar backups automáticos cifrados diarios a R2 o AWS S3.
*   **Fase 3: Desarrollo y Reconstrucción (Junior - 5h)**
    1.  Reconstruir los flujos mapeados dentro de n8n.
    2.  Optimizar usando JavaScript (nodos Code) para reducir el consumo de ejecuciones.
    3.  Hacer pruebas controladas con datos de prueba (sandbox).
*   **Fase 4: Testing y QA (Alberto - 1h)**
    1.  Verificar manejo de errores (nodos Error Trigger) y alertas automáticas a Slack/WhatsApp si falla un flujo.
    2.  Realizar pruebas de carga y validar consistencia de datos en el destino.
*   **Fase 5: Pase a Producción y Entrega (Junior - 1h)**
    1.  Apagar los Zaps en Zapier y encender los flujos en n8n de forma simultánea.
    2.  Grabar video Loom de 10 min explicando los flujos y entregar documentación técnica básica.

---

### PROTOCOLO C.2.B: WordPress Web / LMS / E-Commerce (WooCommerce Stack)
*   **Responsables:** Junior (Maquetación y Configuración: 10h) | Alberto (Arquitectura: 3h) | QA (1h)
*   **Fase 1: Planificación y Setup de Entorno (Alberto - 1h)**
    1.  Crear base de datos limpia y configurar WordPress en hosting Hostinger/cPanel (ej. como hiciste con `nuestrascasasaqp.com` o `bijoueme.com`).
    2.  Instalar plantilla base optimizada y tema hijo (Astra, Hello Elementor).
*   **Fase 2: Diseño y Maquetación (Junior - 8h)**
    1.  Configurar el Grid, paleta de colores HSL y tipografía global.
    2.  Estructurar el catálogo de productos (WooCommerce) o cursos (LearnDash).
    3.  Integrar pasarela de pago (PayPal/Stripe para internacional, o Culqi/Niubiz para Perú) y pruebas en sandbox.
*   **Fase 3: Optimización y Plugins (Junior - 2h)**
    1.  Configurar caché a nivel de servidor y plugin de optimización (ej. WP Rocket / LiteSpeed Cache).
    2.  Instalar y configurar plugins de seguridad (Wordfence) y copias de seguridad (UpdraftPlus).
*   **Fase 4: Pruebas de QA y Performance (QA y Alberto - 2h)**
    1.  Probar flujo completo de compra o registro de alumno.
    2.  Auditar velocidad con GTMetrix/PageSpeed (Meta: >90 en móviles).
    3.  Verificar indexación y sitemap en Google Search Console.
*   **Fase 5: Entrega (Alberto - 1h)**
    1.  Crear cuentas con permisos de "Editor" para el cliente y realizar la sesión de entrega.

---

### PROTOCOLO C.2.C: Web Corporativa / Landing Simple
*   **Responsables:** Junior (Maquetación: 6h) | Alberto (Supervisión: 2h)
*   **Fase 1: Definición (Alberto - 1h)**
    1.  Alinear el mapa del sitio (Inicio, Nosotros, Servicios, Contacto).
    2.  Definir copy e imágenes base.
*   **Fase 2: Desarrollo Web (Junior - 5h)**
    1.  Montar la landing en Elementor Pro o bloques nativos Gutenberg.
    2.  Conectar formularios de contacto hacia correo corporativo o webhook de n8n.
*   **Fase 3: QA de Responsive (Junior - 1h)**
    1.  Verificar visualización correcta en iPhone, tablets y pantallas de escritorio.
*   **Fase 4: Despliegue (Alberto - 1h)**
    1.  Vincular DNS y apuntar dominio a Hostinger.
    2.  Instalar certificado SSL gratuito y forzar redirección HTTPS.

---

### PROTOCOLO RET.B: Mantenimiento Técnico SLA (Mensual)
*   **Responsables:** Junior (Actualizaciones y Tickets: 2h) | Alberto (Supervisión y Reportes: 1h)
*   **Actividades Semanales (Junior - 0.5h/semana):**
    1.  Ejecutar copias de seguridad completas de archivos y base de datos antes de cualquier cambio.
    2.  Actualizar plugins, temas y el Core de WordPress de forma segura.
    3.  Limpiar spam en comentarios y optimizar base de datos (tablas transitorias).
*   **Gestión de Contenidos (Junior - Bajo Demanda):**
    1.  Subir entradas de blog optimizadas para SEO (títulos, meta descripciones, etiquetas Alt).
    2.  Subir archivos descargables o actualizar fichas de productos (ej. el flujo de subir blogs y free patterns usado en `Yarnalia`).
*   **Monitoreo y Alertas (Automatizado):**
    1.  Monitorear caídas de servidor vía UptimeRobot.
    2.  Recibir alertas de seguridad de Wordfence.
*   **Reporte Mensual (Alberto - 1h):**
    1.  Enviar reporte en PDF al cliente resumiendo actualizaciones, copias de seguridad y estado de salud del sitio.

---

## 3. Listas de Verificación de Calidad (Checklists de QA)

Antes de marcar un proyecto como finalizado en [miweb](file:///d:/Proyectos%20personales/MiWeb), el QA o Alberto deben validar los siguientes puntos:

### Checklist Técnico Web
*   [ ] **SSL Activo:** El sitio fuerza HTTPS y no tiene contenido mixto.
*   [ ] **Favicon e Iconos:** Favicon personalizado configurado y visible.
*   [ ] **Optimización Móvil:** Menú móvil funcional, fuentes legibles sin zoom.
*   [ ] **Formularios de Contacto:** Se enviaron correos de prueba y los webhooks conectaron exitosamente con el CRM.
*   [ ] **Páginas de Error:** Página 404 personalizada activa.

### Checklist de Automatización e IA
*   [ ] **Backups Activos:** El flujo de backup diario a la nube está activo y verificado (se descargó y probó un backup).
*   [ ] **Manejo de Errores:** Todos los nodos críticos en n8n tienen rutas alternativas en caso de caída de API.
*   [ ] **Límites de Tokens:** Modelos de IA configurados con parámetros de `max_tokens` para evitar facturaciones excesivas.
