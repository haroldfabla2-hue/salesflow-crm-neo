# Análisis de Costos Unitarios (ACU) por Servicio en Soles (PEN)
**Costeo Detallado de Ruptura (Break-Even) y Precios de Seguridad (Modelo RMT, TDABC y WBS)**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento desglosa analíticamente cuánto le cuesta a tu negocio entregar **una sola unidad** de cada uno de los 13 servicios de tu portafolio, incorporando las tasas impositivas del **Régimen MYPE Tributario (RMT)** de la SUNAT, detracciones del 12% y la metodología de estimación paramétrica basada en la **Estructura de Desglose del Trabajo (WBS / EDT)**.

---

## 1. Metodología de Estimación de MOD y Overhead
Para garantizar precisión total, el costo de cada servicio se divide en:
*   **MOD (Mano de Obra Directa):** Calculado a partir de la estimación de horas por tarea de WBS, asignando el rol correspondiente (Alberto: S/. 93.75/h, Junior: S/. 30.00/h, QA: S/. 22.50/h).
*   **MID (Materiales Directos):** Licencias de software y consumo de tokens de APIs en pruebas.
*   **CIF (Overhead Indirecto - TDABC):** Total de horas estimadas en el WBS × **Tasa de Absorción de Costos Indirectos (TACI)** de **S/. 11.10 PEN/hora**.
*   **CVT (Costos de Transacción):** Coeficiente de fricción bancaria y pasarelas del **8.5%** sobre la base (MOD + MID + CIF).

### Ejemplo de Estructura WBS de Estimación (Para un Proyecto Mediano)
En la hoja **Calculadora WBS** de tu Excel, cada proyecto se desglosa por tareas para hallar el costo exacto:

| ID | Fase / Entregable | Actividad del Software | Rol Responsable | Horas | Tarifa MOD | Total MOD | Overhead CIF |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | Levantamiento | Arquitectura y mockup | Alberto | 6 | S/. 93.75 | S/. 562.50 | S/. 66.60 |
| 2 | Frontend SPA | Maquetación React/TS | Junior | 15 | S/. 30.00 | S/. 450.00 | S/. 166.50 |
| 3 | Base de Datos | Esquemas Postgres/Supabase | Junior | 8 | S/. 30.00 | S/. 240.00 | S/. 88.80 |
| 4 | Backend API | Lógica en Node.js/Python | Alberto | 10 | S/. 93.75 | S/. 937.50 | S/. 111.00 |
| 5 | Silhouette Brain | Enjambres en n8n e IA | Alberto | 12 | S/. 93.75 | S/. 1,125.00 | S/. 133.20 |
| 6 | WhatsApp API | Webhook Meta Cloud API | Junior | 8 | S/. 30.00 | S/. 240.00 | S/. 88.80 |
| 7 | Pruebas de QA | Testing y calibración prompts | QA | 10 | S/. 22.50 | S/. 225.00 | S/. 111.00 |
| 8 | Despliegue | Docker y hosting en VPS | Alberto | 4 | S/. 93.75 | S/. 375.00 | S/. 44.40 |
| 9 | Documentación | Manual y video Loom | Junior | 4 | S/. 30.00 | S/. 120.00 | S/. 44.40 |
| 10 | Soporte | Bugs de puesta en marcha | QA | 5 | S/. 22.50 | S/. 112.50 | S/. 55.50 |
| | **Totales** | | | **82h** | | **S/. 4,387.50** | **S/. 910.20** |

---

## 2. Tablas de ACU de los 13 Servicios Base (PEN)

A continuación, se presentan las tablas de costos unitarios consolidados para tus servicios. Todas las fórmulas están automatizadas e interconectadas en la pestaña **ACU de Servicios** de tu libro de Excel.

---

### C.1: Migración Zapier/Make a n8n
*Descripción: Auditoría y migración técnica de 5 a 8 flujos activos hacia n8n en un VPS propio.*
*   **MOD:** Alberto (3h = S/. 281.25) | Junior (6h = S/. 180.00) = **S/. 461.25 PEN**
*   **MID:** VPS Hetzner S/. 20.63 + Tokens S/. 0.11 = **S/. 20.74 PEN**
*   **CIF (TDABC):** 9 horas totales × S/. 11.10 PEN/h = **S/. 99.90 PEN**
*   **CVT (8.5%):** S/. 49.46 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 631.35 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 789.19 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 5,625.00 – S/. 6,750.00 PEN**

---

### C.2.A: Automatización Simple (Integración de 3 Apps)
*Descripción: Integración básica de 3 herramientas mediante webhooks o n8n (ej. Stripe a Sheets a Slack).*
*   **MOD:** Alberto (1h = S/. 93.75) | Junior (3h = S/. 90.00) = **S/. 183.75 PEN**
*   **MID:** S/. 0.00 PEN
*   **CIF (TDABC):** 4 horas totales × S/. 11.10 PEN/h = **S/. 44.40 PEN**
*   **CVT (8.5%):** S/. 19.39 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 247.54 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 309.43 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 1,875.00 – S/. 3,000.00 PEN**

---

### B.1: Lead Triage & Canales Silhouette (Silhouette OS Core)
*Descripción: Sistema autónomo de enrutamiento y calificación semántica de leads integrando la API oficial de WhatsApp y CRM.*
*   **MOD:** Alberto (10h = S/. 937.50) | Junior (15h = S/. 450.00) | QA (3h = S/. 67.50) = **S/. 1,455.00 PEN**
*   **MID:** VPS S/. 20.63 + WhatsApp API S/. 75.00 = **S/. 95.63 PEN**
*   **CIF (TDABC):** 28 horas totales × S/. 11.10 PEN/h = **S/. 310.80 PEN**
*   **CVT (8.5%):** S/. 158.22 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 2,019.65 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 2,524.56 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 13,125.00 – S/. 16,875.00 PEN**

---

### A.1: LangGraph Swarms & Memoria (CausalOS B2B)
*Descripción: Arquitectura multi-agente en Python (LangGraph) con capa de memoria causal persistente para procesos empresariales.*
*   **MOD:** Alberto (25h = S/. 2,343.75) | Junior (25h = S/. 750.00) | QA (5h = S/. 112.50) = **S/. 3,206.25 PEN**
*   **MID:** VPS Staging Pesado = **S/. 56.25 PEN**
*   **CIF (TDABC):** 55 horas totales × S/. 11.10 PEN/h = **S/. 610.50 PEN**
*   **CVT (8.5%):** S/. 329.20 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 4,202.20 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 5,252.76 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 31,875.00 – S/. 45,000.00 PEN**

---

### C.2.B: WordPress Web / LMS / E-Commerce
*Descripción: Tienda virtual WooCommerce o plataforma de e-learning autogestionable (LearnDash) configurada desde cero.*
*   **MOD:** Alberto (3h = S/. 281.25) | Junior (10h = S/. 300.00) | QA (1h = S/. 22.50) = **S/. 603.75 PEN**
*   **MID:** VPS S/. 20.63 + Plugins Premium S/. 450.00 = **S/. 470.63 PEN**
*   **CIF (TDABC):** 14 horas totales × S/. 11.10 PEN/h = **S/. 155.40 PEN**
*   **CVT (8.5%):** S/. 104.53 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 1,334.31 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 1,667.89 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 5,625.00 – S/. 9,375.00 PEN**

---

### C.2.C: Web Corporativa / Landing Simple
*Descripción: Sitio web institucional informativo o Landing Page de hasta 5 secciones.*
*   **MOD:** Alberto (2h = S/. 187.50) | Junior (6h = S/. 180.00) = **S/. 367.50 PEN**
*   **MID:** VPS S/. 20.63 + Dominio/Tema S/. 129.38 = **S/. 150.00 PEN**
*   **CIF (TDABC):** 8 horas totales × S/. 11.10 PEN/h = **S/. 88.80 PEN**
*   **CVT (8.5%):** S/. 51.54 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 657.84 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 822.29 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 3,000.00 – S/. 4,500.00 PEN**

---

### B.2: Aplicación Web Personalizada (React / TypeScript SPA)
*Descripción: Interfaz a medida en React, backend en Node.js/Python y base de datos relacional/NoSQL.*
*   **MOD:** Alberto (10h = S/. 937.50) | Junior (20h = S/. 600.00) | QA (4h = S/. 90.00) = **S/. 1,627.50 PEN**
*   **MID:** VPS S/. 20.63 + DB Supabase S/. 56.25 = **S/. 76.88 PEN**
*   **CIF (TDABC):** 34 horas totales × S/. 11.10 PEN/h = **S/. 377.40 PEN**
*   **CVT (8.5%):** S/. 176.95 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 2,258.73 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 2,823.41 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 15,000.00 – S/. 24,375.00 PEN**

---

### RET.B: Mantenimiento Técnico Básico (SLA mensual)
*Descripción: Respaldo, monitoreo de caídas de servidor y actualizaciones de plugins mensuales.*
*   **MOD:** Alberto (1h = S/. 93.75) | Junior (2h = S/. 60.00) = **S/. 153.75 PEN**
*   **MID:** VPS Shared = **S/. 11.25 PEN**
*   **CIF (TDABC):** **S/. 60.00 PEN**
*   **CVT (8.5%):** S/. 19.12 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 244.12 PEN/mes**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 305.16 PEN/mes**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 562.50 – S/. 937.50 PEN/mes**

---

### RET.A: Mantenimiento IA/SaaS (mensual)
*Descripción: Ajuste de prompts de IA, calibración de enjambres y soporte técnico reactivo de 24 horas.*
*   **MOD:** Alberto (2h = S/. 187.50) | Junior (3h = S/. 90.00) = **S/. 277.50 PEN**
*   **MID:** VPS Dedicado Staging = **S/. 37.50 PEN**
*   **CIF (TDABC):** **S/. 120.00 PEN**
*   **CVT (8.5%):** S/. 36.97 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 471.97 PEN/mes**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 589.97 PEN/mes**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 1,500.00 – S/. 2,250.00 PEN/mes**

---

### A.2: Plataforma Web SaaS Completa (Next.js SSR / Stripe)
*Descripción: Desarrollo enterprise Next.js, backend Dockerizado, suscripciones recurrentes y base de datos con réplica.*
*   **MOD:** Alberto (25h = S/. 2,343.75) | Junior (40h = S/. 1,200.00) | QA (8h = S/. 180.00) = **S/. 3,723.75 PEN**
*   **MID:** DB Postgres RDS S/. 131.25 + Servidores S/. 75.00 = **S/. 206.25 PEN**
*   **CIF (TDABC):** 73 horas totales × S/. 11.10 PEN/h = **S/. 810.30 PEN**
*   **CVT (8.5%):** S/. 402.93 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 5,143.23 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 6,429.03 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 37,500.00 – S/. 93,750.00 PEN**

---

### B.2.B: Software Corporativo Custom (ERP / CRM a medida)
*Descripción: Aplicación interna para empresas, control de usuarios, base de datos privada, reportes e inventarios.*
*   **MOD:** Alberto (20h = S/. 1,875.00) | Junior (30h = S/. 900.00) | QA (6h = S/. 135.00) = **S/. 2,910.00 PEN**
*   **MID:** DB Staging S/. 75.00 + Servidores S/. 56.25 = **S/. 131.25 PEN**
*   **CIF (TDABC):** 56 horas totales × S/. 11.10 PEN/h = **S/. 621.60 PEN**
*   **CVT (8.5%):** S/. 311.34 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 3,974.19 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 4,967.74 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 16,875.00 – S/. 30,000.00 PEN**

---

### B.2.C: Implementación de Software de Terceros (HubSpot / CRM)
*Descripción: Auditoría de ventas, estructuración de pipelines y automatización nativa de CRM comercial.*
*   **MOD:** Alberto (4h = S/. 375.00) | Junior (6h = S/. 180.00) = **S/. 555.00 PEN**
*   **MID:** S/. 0.00 PEN
*   **CIF (TDABC):** 10 horas totales × S/. 11.10 PEN/h = **S/. 111.00 PEN**
*   **CVT (8.5%):** S/. 56.61 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 722.61 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 903.26 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 4,500.00 – S/. 7,500.00 PEN**

---

### CON.1: Consultoría IA & Prompt Engineering
*Descripción: Auditoría de cuellos de botella y mapas de arquitectura de automatización corporativa.*
*   **MOD:** Alberto (5h = S/. 468.75) = **S/. 468.75 PEN**
*   **MID:** S/. 0.00 PEN
*   **CIF (TDABC):** 5 horas totales × S/. 11.10 PEN/h = **S/. 55.50 PEN**
*   **CVT (8.5%):** S/. 44.56 PEN
*   **Costo Unitario Total (Break-Even Real):** **S/. 568.81 PEN**
*   **Precio Mínimo de Seguridad (Margen 20%):** **S/. 711.01 PEN**
*   **Precio de Venta Sugerido (Rango Comercial):** **S/. 3,000.00 – S/. 5,625.00 PEN**

---

## Tabla Resumen de Costos y Seguridad (PEN)

| ID | Nombre del Servicio | Break-Even Real | Precio Mínimo Seguridad | Venta Sugerida (Rango PEN) | Margen a Sugerido |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **C.1** | Migración Zapier a n8n | S/. 631.35 | **S/. 789.19** | S/. 5,625.00 – S/. 6,750.00 | 790% - 970% |
| **C.2.A** | Automatización Simple | S/. 247.54 | **S/. 309.43** | S/. 1,875.00 – S/. 3,000.00 | 660% - 1110% |
| **B.1** | Silhouette OS Lead Triage | S/. 2,019.65 | **S/. 2,524.56** | S/. 13,125.00 – S/. 16,875.00 | 550% - 735% |
| **A.1** | LangGraph Swarms & Memory | S/. 4,202.20 | **S/. 5,252.76** | S/. 31,875.00 – S/. 45,000.00 | 660% - 970% |
| **C.2.B** | WordPress Web / LMS / Shop | S/. 1,334.31 | **S/. 1,667.89** | S/. 5,625.00 – S/. 9,375.00 | 320% - 600% |
| **C.2.C** | Web Corporativa / Landing | S/. 657.84 | **S/. 822.29** | S/. 3,000.00 – S/. 4,500.00 | 355% - 580% |
| **B.2** | App Web React/TS (SPA) | S/. 2,258.73 | **S/. 2,823.41** | S/. 15,000.00 – S/. 24,375.00 | 560% - 980% |
| **RET.B** | Mantenimiento Básico (SLA) | S/. 244.12 | **S/. 305.16** | S/. 562.50 – S/. 937.50 | 130% - 280% |
| **RET.A** | Mantenimiento IA/SaaS (Adv) | S/. 471.97 | **S/. 589.97** | S/. 1,500.00 – S/. 2,250.00 | 215% - 375% |
| **A.2** | SaaS Completo Next.js | S/. 5,143.23 | **S/. 6,429.03** | S/. 37,500.00 – S/. 93,750.00 | 630% - 1720% |
| **B.2.B** | Software Corp Custom ERP | S/. 3,974.19 | **S/. 4,967.74** | S/. 16,875.00 – S/. 30,000.00 | 325% - 655% |
| **B.2.C** | Onboarding CRM HubSpot | S/. 722.61 | **S/. 903.26** | S/. 4,500.00 – S/. 7,500.00 | 520% - 930% |
| **CON.1** | Consultoría IA & Prompts | S/. 568.81 | **S/. 711.01** | S/. 3,000.00 – S/. 5,625.00 | 425% - 890% |
