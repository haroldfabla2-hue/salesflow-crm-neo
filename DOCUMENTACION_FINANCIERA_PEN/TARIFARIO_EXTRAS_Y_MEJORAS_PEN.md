# Tarifario de Adicionales, Extras y Mejoras en Soles (PEN)
**Análisis de Costos Unitarios (ACU) y Precios de Venta Sugeridos para Adicionales**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento establece el tarifario oficial de los componentes adicionales (Upsells/Extras) que puedes añadir a tus proyectos base, aplicando los nuevos coeficientes del Régimen MYPE Tributario (RMT), detracciones del 12% y la metodología TDABC para el costeo de capacidad.

---

## Estructura del Tarifario de Adicionales

Para cada extra definimos su alcance técnico y su costo unitario estructurado en:
*   **MOD (Mano de Obra Directa):** Horas hombre valoradas al costo interno real (Alberto: S/. 93.75/h, Junior: S/. 30.00/h, QA: S/. 22.50/h).
*   **MID (Materiales Directos):** Licencias o consumo de APIs específicas del adicional.
*   **CIF (Costos Indirectos - TDABC):** Prorrateo del overhead mensual multiplicando las horas totales del extra por la Tasa de Absorción de Costos Indirectos (TACI) de **S/. 11.10 PEN/hora**.
*   **CVT (Costos de Transacción):** Pérdidas financieras estimadas al recibir y retirar fondos en Perú (8.5%).

---

## Catálogo de Adicionales (ACU & Precios Su### EX-1: Idioma Adicional (Multilenguaje)
*   *Alcance:* Traducción técnica de menús, componentes y flujos lógicos de bases de datos. Configuración de plugins multilenguaje (WPML) o librerías React (i18next).
*   **Análisis de Costos (ACU):**
    *   *MOD:* Alberto (1 hora = S/. 93.75) | Junior (2 horas = S/. 60.00) = S/. 153.75 PEN
    *   *MID:* API de traducción automática (Deepl/OpenAI): S/. 7.50 PEN
    *   *CIF (TDABC):* 3 horas totales × S/. 11.10 PEN = S/. 33.30 PEN
    *   *CVT (8.5%):* S/. 16.54 PEN
    *   **Costo Unitario Total (Break-Even Real):** **S/. 211.09 PEN**
    *   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 263.86 PEN**
*   **Precio de Venta Setup (Pago Único):** **S/. 1,125.00 PEN**
*   **Mantenimiento Mensual Recurrente:** **S/. 75.00 PEN/mes**

---

### EX-2: Conexión a Pasarela Local (Perú - Culqi/Niubiz/PagoEfectivo)
*   *Alcance:* Configuración y pruebas de transacciones reales integrando la pasarela de pago local del Perú. Incluye firma criptográfica de peticiones y enrutamiento a cuentas bancarias nacionales.
*   **Análisis de Costos (ACU):**
    *   *MOD:* Alberto (1 hora = S/. 93.75) | Junior (4 horas = S/. 120.00) = S/. 213.75 PEN
    *   *MID:* S/. 0.00 PEN
    *   *CIF (TDABC):* 5 horas totales × S/. 11.10 PEN = S/. 55.50 PEN
    *   *CVT (8.5%):* S/. 22.89 PEN
    *   **Costo Unitario Total (Break-Even Real):** **S/. 292.14 PEN**
    *   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 365.17 PEN**
*   **Precio de Venta Setup (Pago Único):** **S/. 750.00 PEN**
*   **Mantenimiento Mensual Recurrente:** **S/. 0.00 PEN** (Mantenimiento integrado en el retainer general).

---

### EX-3: Canal de WhatsApp / Meta Extra
*   *Alcance:* Integración de un número de teléfono o flujo conversacional adicional en la plataforma Meta Cloud API. Configuración de plantillas interactivas extras aprobadas por Meta.
*   **Análisis de Costos (ACU):**
    *   *MOD:* Alberto (1 hora = S/. 93.75) | Junior (2 horas = S/. 60.00) = S/. 153.75 PEN
    *   *MID:* Licencia Sandbox y pruebas de WhatsApp: S/. 15.00 PEN
    *   *CIF (TDABC):* 3 horas totales × S/. 11.10 PEN = S/. 33.30 PEN
    *   *CVT (8.5%):* S/. 17.17 PEN
    *   **Costo Unitario Total (Break-Even Real):** **S/. 219.22 PEN**
    *   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 274.03 PEN**
*   **Precio de Venta Setup (Pago Único):** **S/. 750.00 PEN**
*   **Mantenimiento Mensual Recurrente:** **S/. 75.00 PEN/mes**

---

### EX-4: Flujo Extra de n8n / Automatización Adicional
*   *Alcance:* Integración de una herramienta extra no contemplada en el alcance base (ej. añadir un canal de Telegram o Slack adicional en un flujo de lead management).
*   **Análisis de Costos (ACU):**
    *   *MOD:* Alberto (1 hora = S/. 93.75) | Junior (2 horas = S/. 60.00) = S/. 153.75 PEN
    *   *MID:* S/. 0.00 PEN
    *   *CIF (TDABC):* 3 horas totales × S/. 11.10 PEN = S/. 33.30 PEN
    *   *CVT (8.5%):* S/. 15.90 PEN
    *   **Costo Unitario Total (Break-Even Real):** **S/. 202.95 PEN**
    *   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 253.69 PEN**
*   **Precio de Venta Setup (Pago Único):** **S/. 562.50 PEN**
*   **Mantenimiento Mensual Recurrente:** **S/. 37.50 PEN/mes**

---

### EX-5: Optimización de Velocidad (WPO - Web Performance)
*   *Alcance:* Auditoría de Core Web Vitals, minificación de CSS/JS, optimización y compresión automatizada de imágenes (WebP), configuración de CDN (Cloudflare) y almacenamiento de caché.
*   **Análisis de Costos (ACU):**
    *   *MOD:* Alberto (1 hora = S/. 93.75) | Junior (4 horas = S/. 120.00) = S/. 213.75 PEN
    *   *MID:* Licencia premium de plugin de optimización (ej. WP Rocket): S/. 75.00 PEN
    *   *CIF (TDABC):* 5 horas totales × S/. 11.10 PEN = S/. 55.50 PEN
    *   *CVT (8.5%):* S/. 29.26 PEN
    *   **Costo Unitario Total (Break-Even Real):** **S/. 373.51 PEN**
    *   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 466.89 PEN**
*   **Precio de Venta Setup (Pago Único):** **S/. 937.50 PEN**
*   **Mantenimiento Mensual Recurrente:** **S/. 0.00 PEN**

---

### EX-6: Panel de Reportes Analíticos con IA
*   *Alcance:* Creación y maquetación de una sección de visualización avanzada dentro de Silhouette OS para monitorear métricas, tasas de conversión de leads e informes predictivos generados por el modelo de IA.
*   **Análisis de Costos (ACU):**
    *   *MOD:* Alberto (5 horas = S/. 468.75) | Junior (10 horas = S/. 300.00) | QA (2 horas = S/. 45.00) = S/. 813.75 PEN
    *   *MID:* Licencias de librerías de gráficos e hosting analítico: S/. 37.50 PEN
    *   *CIF (TDABC):* 17 horas totales × S/. 11.10 PEN = S/. 188.70 PEN
    *   *CVT (8.5%):* S/. 88.40 PEN
    *   **Costo Unitario Total (Break-Even Real):** **S/. 1,128.35 PEN**
    *   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 1,410.43 PEN**
*   **Precio de Venta Setup (Pago Único):** **S/. 2,250.00 PEN**
*   **Mantenimiento Mensual Recurrente:** **S/. 150.00 PEN/mes**

---

### EX-7: Capacitación Técnica Extra (por hora)
*   *Alcance:* Talleres de transferencia de conocimiento, capacitación de personal técnico adicional o soporte consultivo en vivo más allá de las horas de transferencia incluidas en el contrato.
*   **Análisis de Costos (ACU):**
    *   *MOD:* Alberto (1 hora de consultoría en vivo) = S/. 93.75 PEN
    *   *MID:* S/. 0.00 PEN
    *   *CIF (TDABC):* 1 hora total × S/. 11.10 PEN = S/. 11.10 PEN
    *   *CVT (8.5%):* S/. 8.91 PEN
    *   **Costo Unitario Total (Break-Even Real):** **S/. 113.76 PEN**
    *   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 142.20 PEN**
*   **Precio de Venta (Tarifa Horaria):** **S/. 150.00 PEN/hora**
*   **Mantenimiento Mensual Recurrente:** **S/. 0.00 PEN**

---

### EX-8: Dominio y SSL Corporativo Setup
*   *Alcance:* Vinculación de DNS seguro, configuración de registros (A, CNAME, MX, TXT) para correo profesional, adquisición y renovación automatizada del certificado SSL.
*   **Análisis de Costos (ACU):**
    *   *MOD:* Junior (1 hora de soporte técnico) = S/. 30.00 PEN
    *   *MID:* S/. 0.00 PEN (El costo de la compra del dominio lo asume la tarjeta del cliente)
    *   *CIF (TDABC):* 1 hora total × S/. 11.10 PEN = S/. 11.10 PEN
    *   *CVT (8.5%):* S/. 3.49 PEN
    *   **Costo Unitario Total (Break-Even Real):** **S/. 44.59 PEN**
    *   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 55.74 PEN**
*   **Precio de Venta Setup (Pago Único):** **S/. 150.00 PEN**
*   **Mantenimiento Mensual Recurrente:** **S/. 0.00 PEN**

---

## Tabla Resumen de Adicionales (Soles PEN)

| ID Extra | Adicional / Mejora | Break-Even Real | Precio Seguridad | Venta Sugerida Setup | Mantenimiento Mensual |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **EX-1** | Idioma Adicional | S/. 211.09 | S/. 263.86 | **S/. 1,125.00** | S/. 75.00/mes |
| **EX-2** | Conexión a Pasarela Local | S/. 292.14 | S/. 365.17 | **S/. 750.00** | S/. 0.00 |
| **EX-3** | Módulo WhatsApp Extra | S/. 219.22 | S/. 274.03 | **S/. 750.00** | S/. 75.00/mes |
| **EX-4** | Flujo Extra n8n | S/. 202.95 | S/. 253.69 | **S/. 562.50** | S/. 37.50/mes |
| **EX-5** | Optimización de Velocidad | S/. 373.51 | S/. 466.89 | **S/. 937.50** | S/. 0.00 |
| **EX-6** | Reportes Analíticos IA | S/. 1,128.35 | S/. 1,410.43 | **S/. 2,250.00** | S/. 150.00/mes |
| **EX-7** | Capacitación Técnica Extra | S/. 113.76 | S/. 142.20 | **S/. 150.00/h** | S/. 0.00 |
| **EX-8** | Dominio y SSL Setup | S/. 44.59 | S/. 55.74 | **S/. 150.00** | S/. 0.00 |
