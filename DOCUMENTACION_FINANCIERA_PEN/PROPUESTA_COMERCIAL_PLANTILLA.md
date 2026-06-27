# Propuesta de Servicios de Automatización y Arquitectura de IA
**De: Alberto Farah Blair (AI & Automation Architect)**  
**Para: [Nombre del Cliente / Razón Social]**  
**Fecha: [Fecha Emisión]** | **Validez de Propuesta: 15 días naturales**  
**ID Propuesta:** AP-[Año]-[Correlativo]

---

## 1. Resumen Ejecutivo
En el panorama tecnológico actual, las operaciones manuales y la fragmentación de sistemas actúan como un impuesto directo sobre el margen de beneficio de las empresas. El objetivo de esta propuesta es diseñar e implementar un entorno unificado de automatización de procesos e Inteligencia Artificial (IA) para **[Nombre del Cliente]**, migrando de plataformas con facturación basada en tareas (como Zapier o Make) a una infraestructura autohospedada dedicada y de alto rendimiento basada en **n8n**.

Esto no solo reducirá sus costos fijos en licencias de software en un **70% a 90%**, sino que también permitirá escalar sus flujos operativos sin límites de volumen y bajo los más altos estándares de privacidad y seguridad de la información.

---

## 2. Objetivos del Proyecto y Casos de Uso
1.  **Reducción de Costos Operativos:** Eliminar el cobro variable por tarea de Zapier y estructurar los flujos en un VPS dedicado (Hetzner o DigitalOcean) administrado localmente.
2.  **Automatización e IA aplicada:** Implementar sistemas inteligentes de triaje de leads (clasificación y enrutamiento en segundos usando LLMs) y agentes de análisis conversacionales autónomos con almacenamiento en memoria causal.
3.  **Soberanía de Datos:** Mantener la información de los clientes dentro de servidores aislados bajo contenedores Docker, garantizando el cumplimiento normativo de privacidad (RGPD / LPDP).

---

## 3. Alcance del Proyecto: Estructura en 3 Fases

Cotizamos este proyecto bajo un modelo basado en el valor y entregables de negocio, dividido en tres fases secuenciales:

### 🌐 Fase 1: Diagnóstico y Blueprint (Descubrimiento Pagado)
Antes de escribir una sola línea de código, realizamos una auditoría profunda para garantizar una transición sin fricciones operativas.
*   **Entregables:**
    *   Inventario y mapeo completo en Miro/Excalidraw de los flujos de integración actuales.
    *   Auditoría de APIs y tokens de consumo.
    *   Diseño del plano arquitectónico técnico en n8n y esquema de base de datos relacional.
*   **Tiempo de Ejecución:** 5 a 10 días útiles.
*   **Inversión (Pago Único):** **S/. 3,750.00 PEN** *(o $1,000.00 USD para facturación internacional)*.
    *   *Nota:* Este monto se descontará del costo de la Fase 2 si se aprueba la propuesta de implementación.

---

### 🛠️ Fase 2: Implementación, Reingeniería y Shadow Run (Setup Fee)
Despliegue y programación de la infraestructura técnica basada en el Blueprint aprobado.
*   **Entregables:**
    *   Despliegue del servidor VPS (Ubuntu, Docker, Docker Compose, Postgres) con certificados SSL Let's Encrypt y copias de seguridad automáticas de base de datos.
    *   Reingeniería lógica y migración de hasta **[N° Flujos, ej. 10]** flujos operativos hacia la infraestructura dedicada de n8n.
    *   **Shadow Run (Pruebas en Paralelo):** Ejecución simultánea de los flujos en las plataformas origen y n8n durante 7 días útiles para validar la paridad e integridad de la data sin interrumpir las operaciones.
    *   Entrega de video-guía técnica en Loom y documentación técnica base.
*   **Tiempo de Ejecución:** 15 a 25 días útiles.
*   **Inversión (Pago Único):** **S/. 11,250.00 PEN** *(o $3,000.00 USD)*.
    *   *Hito de Pago:* 50% de anticipo al inicio de la Fase 2, y 50% al cierre de las pruebas en paralelo.

---

### 🛡️ Fase 3: AI-Ops, Optimización y Soporte Continuo (Retainer Mensual)
El software y las APIs operan en un entorno dinámico. Este retainer garantiza la estabilidad operativa y evolución del sistema.
*   **Entregables:**
    *   Monitoreo preventivo de caídas de servidor y alertas automáticas a Slack/WhatsApp.
    *   Actualización mensual de versiones del orquestador y parches de seguridad de Docker.
    *   Depuración y calibración de prompts y drift en modelos de lenguaje (OpenAI/Anthropic).
    *   Bolsa de **[ej. 5]** horas de soporte técnico mensual reactivo para mejoras o modificaciones.
*   **Inversión (Frecuencia Mensual):** **S/. 1,875.00 PEN/mes** *(o $500.00 USD/mes)*.
    *   *Permanencia sugerida:* 6 meses (renovable).

---

## 4. Condiciones de Facturación y Términos Comerciales

### Clientes Domiciliados en el Perú
*   **Impuesto (IGV):** Todos los precios indicados en Soles (PEN) en esta propuesta no incluyen el Impuesto General a las Ventas (IGV) del **18%**, el cual se adicionará obligatoriamente en la factura electrónica.
*   **SPOT - Detracción (12%):** Por ley (Código SUNAT 022 "Otros servicios empresariales"), este servicio está sujeto a la detracción del **12%** por superar el monto de S/. 700.00 PEN (con IGV). El Cliente se compromete a pagar el 12% en la cuenta de detracciones del Banco de la Nación de Alberto Farah Blair y el 88% restante en su cuenta corriente (BCP/Interbank), enviando el comprobante de depósito para liberar los entregables.

### Clientes en el Extranjero (Internacionales)
*   **IGV Exonerado (0%):** Al calificar como Exportación de Servicios de Software/Consultoría, la factura electrónica se emitirá exonerada de IGV (Inafecto).
*   **Pasarela de Pago:** Pagos vía PayPal o Stripe se incrementarán en un **5.5%** para cubrir las comisiones transaccionales transfronterizas (Gross-Up), a menos que el pago se realice mediante transferencia directa internacional (Wire Transfer SWIFT).

---

## 🔒 5. Cláusulas de Blindaje Operativo

### Cláusula 1: Costos de APIs y Servidores a Cargo del Cliente
El Cliente es el único responsable de contratar, mantener y pagar directamente los servicios de alojamiento VPS (Hetzner, DigitalOcean) y el consumo de tokens de APIs (OpenAI, Anthropic, Meta Business API). El Consultor configurará los accesos técnicos, pero las cuentas de facturación deben permanecer a nombre del Cliente.

### Cláusula 2: Límite de Precisión en Modelos de IA (AI Disclaimer)
El Cliente acepta que los modelos fundacionales de Inteligencia Artificial (probabilísticos) pueden generar errores lógicos o alucinaciones semánticas. El Consultor optimizará el contexto y las instrucciones (System Prompts), pero el Cliente debe mantener personal humano (Human-in-the-Loop) para validar decisiones críticas que afecten finanzas, contratos o privacidad.

### Cláusula 3: Propiedad Intelectual y Licencias base
Al liquidar el 100% de los hitos de desarrollo, el Cliente recibe la propiedad intelectual del código personalizado creado para sus flujos. Sin embargo, Alberto Farah Blair retiene los derechos patrimoniales exclusivos de sus frameworks pre-existentes y librerías de motores lógicos propietarios (incluyendo el núcleo de Silhouette OS y CausalOS-Python). El Cliente recibe una licencia de uso perpetua y no exclusiva sobre estos componentes únicamente para correr su sistema.

### Cláusula 4: Límite de Revisiones y Cambios de Alcance
Cada hito de entrega incluye hasta un máximo de dos (2) rondas de revisiones lógicas o cosméticas basadas en el Blueprint de la Fase 1. Modificaciones que alteren la estructura definida o nuevas integraciones solicitadas se cotizarán por separado o se facturarán a la tarifa por hora estándar del Consultor de **S/. 375.00 PEN/hora** (equivalente a $100.00 USD/h).

---

## ✍️ 6. Aceptación y Firma

Para proceder con el inicio de la Fase 1, ambas partes firman digitalmente esta propuesta comercial.

| Por el Cliente | Por el Consultor |
| :--- | :--- |
| **Firma:** ___________________________ | **Firma:** Alberto Farah Blair |
| **Nombre:** [Nombre Tomador] | **Nombre:** Alberto Farah Blair |
| **Cargo:** [Cargo, ej. Director] | **Cargo:** AI & Automation Architect |
| **Fecha:** ____ / ____ / ________ | **Fecha:** [Fecha Emisión] |
