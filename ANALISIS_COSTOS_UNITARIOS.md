# Análisis de Costos Unitarios (ACU) por Servicio
**Modelo de Costo de Ruptura (Break-Even) y Definición de Precios de Seguridad**
*Desarrollado para Alberto Farah Blair*

Este documento desglosa de manera analítica y unitaria cuánto le cuesta a tu negocio entregar **una sola unidad** de cada servicio. Si cobras por debajo del **Costo Unitario Total (Break-Even)** de cada tabla, estarás perdiendo dinero de tu bolsillo.

---

## Estructura del Análisis de Costo Unitario (ACU)
Para cada servicio calculamos:
1.  **Mano de Obra Directa (MOD):** Tu tiempo y el del equipo valorados a costos internos reales ($25/h Alberto, $8/h Junior, $6/h QA).
2.  **Materiales e Infraestructura Directos (MID):** Servidores de desarrollo, licencias de software específicas del proyecto.
3.  **Costos Variables de Transacción y APIs (CVT):** Comisión de PayPal e Interbank/Ligo (8.5% del costo base) y tokens consumidos en la etapa de pruebas del proyecto.
4.  **Costos Indirectos Asignados (CIF):** Asignación de tus costos fijos mensuales (Servicios domésticos, VPS propio, amortización de laptop, contador). Asumimos una capacidad de **2 proyectos al mes**, por lo que asignamos el 50% de los gastos fijos mensuales ($160.33 / 2 = **$80.17 USD** por proyecto). Para los retainers mensuales de mantenimiento, asignamos una fracción menor del overhead.

---

## 1. CATEGORÍA: AUTOMATIZACIÓN DE PROCESOS E IA

### Servicio C.1: Migración Zapier/Make a n8n
*Descripción: Auditoría y migración de 5 a 8 flujos de automatización a un servidor n8n propio.*
*   **Mano de Obra (MOD):** Alberto (5h × $25) = $125 | Junior (12h × $8) = $96 | QA (3h × $6) = $18. **(Total MOD: $239.00 USD)**
*   **Materiales (MID):** VPS Hetzner Temporal = $5.50 USD | Tokens = $0.03 USD.
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $27.50 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$352.20 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$422.64 USD** | **S/. 1,584.90 PEN**
*   **Precio de Venta Sugerido:** **$1,500 – $1,800 USD** | **S/. 5,625 – S/. 6,750 PEN**

### Servicio C.2.A: Automatización Simple (Integración de 3 Apps)
*Descripción: Integración básica de 3 herramientas mediante webhook (ej. Stripe a Sheets a Slack).*
*   **Mano de Obra (MOD):** Alberto (2h × $25) = $50 | Junior (6h × $8) = $48 | QA (2h × $6) = $12. **(Total MOD: $110.00 USD)**
*   **Materiales (MID):** $0.00 USD.
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $9.35 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$199.52 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$239.42 USD** | **S/. 897.83 PEN**
*   **Precio de Venta Sugerido:** **$500 – $800 USD** | **S/. 1,875 – S/. 3,000 PEN**

### Servicio B.1: Silhouette OS Lead Triage (IA + CRM + WhatsApp)
*Descripción: Sistema de automatización de leads con enrutamiento de IA e integración WhatsApp API.*
*   **Mano de Obra (MOD):** Alberto (15h × $25) = $375 | Junior (22h × $8) = $176 | QA (8h × $6) = $48. **(Total MOD: $599.00 USD)**
*   **Materiales (MID):** VPS Staging = $5.50 | Sandbox WhatsApp API = $20. **(Total MID: $25.50 USD)**
*   **Comisión/APIs (CVT):** PayPal = $60.31 | Tokens OpenAI (GPT-4o) = $12.50. **(Total CVT: $72.81 USD)**
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$777.48 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$932.98 USD** | **S/. 3,498.68 PEN**
*   **Precio de Venta Sugerido:** **$3,500 – $4,500 USD** | **S/. 13,125 – S/. 16,875 PEN**

### Servicio A.1: Enjambres Multi-Agente & Memoria (LangGraph B2B)
*Descripción: Orquestación multi-agente robusta con capa de memoria causal (CausalOS).*
*   **Mano de Obra (MOD):** Alberto (35h × $25) = $875 | Junior (35h × $8) = $280 | QA (10h × $6) = $60. **(Total MOD: $1,215.00 USD)**
*   **Materiales (MID):** VPS Staging Pesado = $15.00 USD.
*   **Comisión/APIs (CVT):** PayPal = $118.15 | Tokens OpenAI/Claude = $45.00. **(Total CVT: $163.15 USD)**
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$1,473.32 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$1,767.98 USD** | **S/. 6,629.93 PEN**
*   **Precio de Venta Sugerido:** **$8,500 – $12,000 USD** | **S/. 31,875 – S/. 45,000 PEN**

---

## 2. CATEGORÍA: DESARROLLO WEB (WORDPRESS & REACT)

### Servicio C.2.B: WordPress Web / LMS / E-Commerce
*Descripción: Sitio web, tienda virtual (WooCommerce) o academia LMS en WordPress.*
*   **Mano de Obra (MOD):** Alberto (5h × $25) = $125 | Junior (16h × $8) = $128 | QA (4h × $6) = $24. **(Total MOD: $277.00 USD)**
*   **Materiales (MID):** VPS Hetzner Temporal = $5.50 | Licencias Plugins/Tema = $120. **(Total MID: $125.50 USD)**
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $41.03 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$523.70 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$628.44 USD** | **S/. 2,356.65 PEN**
*   **Precio de Venta Sugerido:** **$1,500 – $2,500 USD** | **S/. 5,625 – S/. 9,375 PEN**

### Servicio C.2.C: Web Corporativa Informativa / Landing Page Simple
*Descripción: Sitio web estático o landing page en WordPress/HTML de hasta 5 secciones.*
*   **Mano de Obra (MOD):** Alberto (3h × $25) = $75 | Junior (12h × $8) = $96 | QA (2h × $6) = $12. **(Total MOD: $183.00 USD)**
*   **Materiales (MID):** VPS / Hosting de pruebas = $5.50 | Dominio/Plantilla = $34.50. **(Total MID: $40.00 USD)**
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $18.96 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$322.13 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$386.56 USD** | **S/. 1,449.60 PEN**
*   **Precio de Venta Sugerido:** **$800 – $1,200 USD** | **S/. 3,000 – S/. 4,500 PEN**

### Servicio B.2: Aplicación Web Personalizada (React / TypeScript SPA)
*Descripción: Frontend React, base de datos Postgres/Mongo y API básica.*
*   **Mano de Obra (MOD):** Alberto (15h × $25) = $525 | Junior (28h × $8) = $224 | QA (7h × $6) = $42. **(Total MOD: $791.00 USD)**
*   **Materiales (MID):** VPS Staging = $5.50 | Hosting Database = $15. **(Total MID: $20.50 USD)**
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $63.04 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$804.71 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$965.65 USD** | **S/. 3,621.19 PEN**
*   **Precio de Venta Sugerido:** **$4,000 – $6,500 USD** | **S/. 15,000 – S/. 24,375 PEN**

---

## 3. CATEGORÍA: MANTENIMIENTO TÉCNICO Y SOPORTE (RETAINERS)

### Servicio RET.B: Mantenimiento Técnico Básico (SLA mensual)
*Descripción: Backups, actualizaciones de plugins de WP/n8n, y monitoreo de caídas de servidor.*
*   **Mano de Obra (MOD):** Alberto (1h × $25) = $25 | Junior (2h × $8) = $16. **(Total MOD: $41.00 USD)**
*   **Materiales (MID):** VPS Share = $3.00 USD.
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $3.74 USD.
*   **Overhead Asignado (CIF):** 10% del overhead mensual prorrateado = $16.00 USD.
*   **Costo Unitario Total (Break-Even):** **$63.74 USD/mes**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$76.49 USD/mes** | **S/. 286.83 PEN/mes**
*   **Precio de Venta Sugerido:** **$150 – $250 USD/mes** | **S/. 562 – S/. 937 PEN/mes**

### Servicio RET.A: Mantenimiento Avanzado de IA / SaaS (mensual)
*   **Mano de Obra (MOD):** Alberto (3h × $25) = $75 | Junior (4h × $8) = $32 | QA (1h × $6) = $6. **(Total MOD: $113.00 USD)**
*   **Materiales (MID):** VPS share = $10.00 USD.
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $10.46 USD.
*   **Overhead Asignado (CIF):** 20% del overhead mensual prorrateado = $32.00 USD.
*   **Costo Unitario Total (Break-Even):** **$165.46 USD/mes**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$198.55 USD/mes** | **S/. 744.57 PEN/mes**
*   **Precio de Venta Sugerido:** **$400 – $600 USD/mes** | **S/. 1,500 – S/. 2,250 PEN/mes**

---

## 4. CATEGORÍA: SOFTWARE CORPORATIVO E IMPLEMENTACIONES

### Servicio A.2: Plataforma Web SaaS Completa (Next.js SSR / Stripe Billing)
*Descripción: Next.js frontend, backend, Stripe Billing e infraestructuras en la nube (Docker).*
*   **Mano de Obra (MOD):** Alberto (40h × $25) = $1,000 | Junior (65h × $8) = $520 | QA (15h × $6) = $90. **(Total MOD: $1,610.00 USD)**
*   **Materiales (MID):** Database = $35.00 | Hosting staging = $20.00. **(Total MID: $55.00 USD)**
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $156.40 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$1,901.57 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$2,281.88 USD** | **S/. 8,557.05 PEN**
*   **Precio de Venta Sugerido:** **$10,000 – $25,000 USD** | **S/. 37,500 – S/. 93,750 PEN**

### Servicio B.2.B: Software Corporativo Custom (ERP / CRM / Intranet a medida)
*Descripción: Sistema interno corporativo con roles de usuario, base de datos y reportes.*
*   **Mano de Obra (MOD):** Alberto (30h × $25) = $750 | Junior (50h × $8) = $400 | QA (15h × $6) = $90. **(Total MOD: $1,240.00 USD)**
*   **Materiales (MID):** Database = $20.00 | Servidor staging = $15.00. **(Total MID: $35.00 USD)**
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $108.38 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$1,463.55 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$1,756.26 USD** | **S/. 6,585.98 PEN**
*   **Precio de Venta Sugerido:** **$4,500 – $8,000 USD** | **S/. 16,875 – S/. 30,000 PEN**

### Servicio B.2.C: Implementación de Software de Terceros (CRM HubSpot/ActiveCampaign)
*   **Mano de Obra (MOD):** Alberto (8h × $25) = $200 | Junior (10h × $8) = $80 | QA (3h × $6) = $18. **(Total MOD: $298.00 USD)**
*   **Materiales (MID):** $0.00 USD.
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $25.33 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$403.50 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$484.20 USD** | **S/. 1,815.75 PEN**
*   **Precio de Venta Sugerido:** **$1,200 – $2,000 USD** | **S/. 4,500 – S/. 7,500 PEN**

---

## 5. CATEGORÍA: OTROS (CONSULTORÍA)

### Servicio CON.1: Consultoría de Procesos e Ingeniería de Prompts
*Descripción: Auditoría de cuellos de botella y mapas de arquitectura de IA.*
*   **Mano de Obra (MOD):** Alberto (10h × $25) = **$250.00 USD**.
*   **Materiales (MID):** $0.00 USD.
*   **Comisión Pasarela (CVT):** PayPal (8.5% de base) = $21.25 USD.
*   **Overhead Asignado (CIF):** $80.17 USD.
*   **Costo Unitario Total (Break-Even):** **$351.42 USD**
*   **Precio Mínimo de Seguridad (+20% Contingencia):** **$421.70 USD** | **S/. 1,581.39 PEN**
*   **Precio de Venta Sugerido:** **$800 – $1,500 USD** | **S/. 3,000 – S/. 5,625 PEN**

---

## Resumen Ejecutivo de Precios de Seguridad (La Regla de No Pérdida)

| ID Servicio | Nombre Comercial | Break-Even Neto | Precio Mínimo de Seguridad | Margen a Precio Sugerido |
| :---: | :--- | :---: | :---: | :---: |
| **C.1** | Migración Zapier a n8n | $352.20 USD | **$422.64 USD** *(S/. 1,585 PEN)* | +250% |
| **C.2.A** | Automatización Simple (3 Apps) | $199.52 USD | **$239.42 USD** *(S/. 898 PEN)* | +230% |
| **B.1** | Silhouette OS Lead Triage | $777.48 USD | **$932.98 USD** *(S/. 3,499 PEN)* | +275% |
| **A.1** | LangGraph Swarms & Memory | $1,473.32 USD | **$1,767.98 USD** *(S/. 6,630 PEN)* | +380% |
| **C.2.B** | WordPress Web / E-Commerce / LMS | $523.70 USD | **$628.44 USD** *(S/. 2,357 PEN)* | +240% |
| **C.2.C** | Web Corporativa / Landing Simple | $322.13 USD | **$386.56 USD** *(S/. 1,450 PEN)* | +210% |
| **B.2** | App Web React/TS (Medium SPA) | $804.71 USD | **$965.65 USD** *(S/. 3,621 PEN)* | +315% |
| **RET.B** | Mantenimiento Básico (Mensual) | $63.74 USD | **$76.49 USD** *(S/. 287 PEN)* | +220% |
| **RET.A** | Mantenimiento IA/SaaS (Mensual) | $165.46 USD | **$198.55 USD** *(S/. 745 PEN)* | +200% |
| **A.2** | SaaS Completo Next.js | $1,901.57 USD | **$2,281.88 USD** *(S/. 8,557 PEN)* | +780% |
| **B.2.B** | Software Corporativo Custom ERP | $1,463.55 USD | **$1,756.26 USD** *(S/. 6,586 PEN)* | +250% |
| **B.2.C** | Implementación CRM HubSpot/AC | $403.50 USD | **$484.20 USD** *(S/. 1,816 PEN)* | +310% |
| **CON.1** | Consultoría IA & Prompt Eng. | $351.42 USD | **$421.70 USD** *(S/. 1,581 PEN)* | +220% |
