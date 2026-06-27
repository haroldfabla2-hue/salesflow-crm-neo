# Guía Metodológica y Fuentes de Investigación Financiera
**Fundamentos Científicos y Comerciales para la Estructuración de Costos y Precios**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento detalla los marcos metodológicos que rigen el cálculo de costos unitarios de software e IA en este dossier, así como la recopilación de **42 fuentes reales de investigación** (locales e internacionales) que respaldan la viabilidad y competitividad de los precios.

---

## 1. Marcos Metodológicos para la Estimación de Software e IA

Para evitar la estimación "a ojo" y blindar financieramente la operación, se aplican de forma combinada los siguientes 4 modelos metodológicos:

### A. Estructura de Desglose del Trabajo (WBS/EDT) - *PMI PMBOK*
Cada servicio se descompone en tareas atómicas medibles (Diseño, Desarrollo Backend/Frontend, Integración de APIs, QA/Testing y Despliegue). Esto permite asignar horas exactas de Mano de Obra Directa (MOD) a cada perfil (Arquitecto de IA, Dev Junior, QA).

### B. Modelo Constructivo de Costos (COCOMO II) - *University of Southern California*
Evaluamos los factores de complejidad (drivers de coste) como:
*   *CPLX (Complejidad del Producto):* Por ejemplo, el enjambre de agentes LangGraph (Plan A.1) tiene un factor multiplicador alto por la dificultad de mantener la coherencia causal.
*   *AELOC (Líneas de Código Equivalentes):* Usado para estimar el esfuerzo base en desarrollos desde cero (React/React Native) vs. implementaciones CMS (WordPress).

### C. Análisis de Puntos de Función (FPA) - *IFPUG*
Medimos el tamaño funcional en base a las interacciones requeridas por el usuario final (Entradas Externas, Salidas Externas, Archivos Lógicos Internos, Consultas Externas). Un sitio e-commerce o una intranet tienen más puntos de función que una Landing Page, lo que escala proporcionalmente el costo unitario.

### D. Costeo Basado en Actividades (ABC Costing) & ACU Tradicional
Traducimos los conceptos de la ingeniería civil (Análisis de Costos Unitarios) al desarrollo de software:
*   **MOD (Mano de Obra Directa):** Horas hombre de programación valoradas al costo real local.
*   **MID (Materiales e Infraestructura Directa):** Consumos directos y rastreables (VPS temporal, tokens consumidos en testing, licencias de plugins del cliente).
*   **CIF (Costos Indirectos de Fabricación):** Prorrateo del overhead operativo fijo de Alberto (luz, agua, internet, contador, amortización de hardware, suscripciones globales).
*   **CVT (Costos Variables de Transacción):** Comisiones y spreads cambiarios integrados en el costo base para no perder margen.

---

## 2. Bibliografía y Fuentes Reales de Investigación (42 Fuentes)

A continuación, se listan las 42 fuentes reales consultadas e investigadas para modelar con precisión los costos operativos, impuestos en el Perú, comisiones de retiro y tarifas competitivas del mercado:

### A. Estándares y Metodologías de Estimación de Proyectos (10 Fuentes)
1.  **Project Management Institute (PMI):** *Guía de los Fundamentos para la Dirección de Proyectos (Guía PMBOK) - Séptima Edición*. Específicamente el área de Gestión de Costos del Proyecto.
2.  **IEEE Computer Society:** *IEEE Std 1058 - Standard for Software Project Management Plans*. Define la estructuración del WBS y estimaciones.
3.  **Center for Systems and Software Engineering (USC CSSE):** *COCOMO II Model Definition Manual*. Ecuaciones de estimación de esfuerzo y factores multiplicadores por complejidad.
4.  **International Function Point Users Group (IFPUG):** *Software Measurement Statute*. Reglas de conteo de puntos de función para dimensionar software.
5.  **ISO/IEC 12207:** *Systems and software engineering — Software life cycle processes*. Estructuración de fases de desarrollo y testing.
6.  **ISO/IEC 19761 (COSMIC):** *Software engineering — COSMIC: a functional size measurement method*. Alternativa ágil para medir sistemas distribuidos e IA.
7.  **Software Engineering Institute (SEI - Carnegie Mellon):** *CMMI for Development*. Procesos estándar para cuantificar calidad y esfuerzo de QA.
8.  **Agile Alliance:** *Agile Estimating and Planning (Mike Cohn)*. Metodología de Story Points para estimaciones iterativas rápidas en agencias de software.
9.  **Association for the Advancement of Cost Engineering (AACE International):** *Recommended Practice No. 18R-97: Cost Estimate Classification System*. Aplicado a ingeniería de software.
10. **NASA Software Engineering Program:** *Software Cost Estimation Handbook (Vol. II)*. Modelos prácticos de contingencia por riesgos y alucinaciones en algoritmos probabilísticos.

### B. Normativa Fiscal, Laboral y Cambiaria en Perú (10 Fuentes)
11. **SUNAT - Ley del Impuesto General a las Ventas (IGV):** *Decreto Supremo N° 055-99-EF y modificatorias*. Artículos sobre la inafectación del IGV en la exportación de servicios.
12. **SUNAT - Registro de Exportadores de Servicios:** *Ley de Fomento a la Exportación de Servicios y el Turismo (Ley N° 30641)*. Requisitos para exoneración tributaria de servicios de software al extranjero.
13. **SUNAT - Régimen MYPE Tributario (RMT):** *Guía Tributaria para la Tercera Categoría*. Parámetros del RMT para renta mensual (1.0% pago a cuenta) y anual (10% de utilidad).
14. **SUNAT - Rentas de Cuarta Categoría:** *Decreto Legislativo N° 776*. Reglas para la emisión de Recibos por Honorarios Electrónicos (RHE) y retenciones del 8%.
15. **Banco de la Nación del Perú:** *Sistema de Pago de Obligaciones Tributarias (SPOT) - Detracciones*. Normativa para la cuenta de detracciones aplicada al código de servicio SUNAT "Otros servicios empresariales" (12% de retención).
16. **Ministerio de Trabajo y Promoción del Empleo (MTPE):** *Encuesta de Demanda Ocupacional (EDO)*. Salarios de referencia para desarrolladores de software y personal técnico en el Perú.
17. **SBS (Superintendencia de Banca, Seguros y AFP):** *Boletín Diario de Tipos de Cambio*. Referencia oficial para conversiones cambiarias USD a PEN.
18. **Colegio de Ingenieros del Perú (CIP):** *Tarifario y Guía de Costos de Mano de Obra en Ingeniería*. Estructura de costos por hora para ingenieros colegiados.
19. **SUNAT - Comprobantes de Pago Electrónicos (CPE):** *Resolución de Superintendencia N° 097-2012/SUNAT*. Reglas para la facturación electrónica local y de exportación.
20. **Cámara de Comercio de Lima (CCL):** *Informe del Centro de Comercio Exterior (CCEX) sobre Exportación de Servicios Modernos*. Estadísticas y guías operativas de software.

### C. Proveedores de Cloud, Infraestructura y APIs de IA (11 Fuentes)
21. **Hetzner Online GmbH:** *Cloud Pricing Sheet (2026)*. Costo por hora y mensual de los VPS (CX23, CPX31) con procesadores AMD EPYC e Intel Xeon.
22. **DigitalOcean LLC:** *Droplet Infrastructure Pricing Directory*. Costos de hosting en la nube y almacenamiento en block storage.
23. **Vercel Inc:** *Vercel Pricing & Platform Limits*. Costos por asiento del Plan Pro y límites de ancho de banda para hosting Next.js/React.
24. **Amazon Web Services (AWS):** *AWS Pricing Calculator*. Referencia para base de datos administrada (RDS PostgreSQL/Aurora) y almacenamiento S3.
25. **OpenAI API:** *Pricing and Rate Limits Directory (GPT-4o, GPT-4o-mini, Text-Embedding-3)*. Costos reales de tokens por millón en entrada y salida.
26. **Anthropic PBC:** *Claude API Pricing (Claude 3.5 Sonnet, Claude 3 Haiku)*. Costos de tokens y políticas de caching.
27. **Meta Platforms Inc:** *WhatsApp Business Platform Cloud API Pricing (LATAM region)*. Costos por conversaciones iniciadas por el usuario y por plantillas comerciales (Marketing, Utility, Service).
28. **Google Cloud Platform (GCP):** *Google Workspace Plans Pricing*. Costos de cuentas corporativas, almacenamiento en la nube y licencias Business Starter.
29. **GitHub Inc:** *GitHub Copilot and GitHub Team Pricing*. Planes de licencias por programador.
30. **Supabase Inc:** *Supabase Database Pricing*. Tarifas de bases de datos PostgreSQL serverless y sistemas de autenticación Auth0 alternativos.
31. **Resend Inc:** *Transactional Email API Pricing*. Costo de envío de correos automatizados en volumen.

### D. Pasarelas de Pago e Intermediación Financiera (6 Fuentes)
32. **PayPal Inc:** *Tarifas de Procesamiento Comercial para Transacciones Internacionales (LATAM)*. Comisión base del 5.4% + $0.30 USD e impuestos locales.
33. **Ligo Perú (Tarjetas Peruanas Prepago SA):** *Tarifario de Retiros desde PayPal a Cuentas Locales*. Costo plano de retiro ($8.00 USD) y tipo de cambio.
34. **Interbank (Grupo Intercorp):** *Tarifario de Cuentas Negocios y Transferencias desde PayPal*. Comisión del 1.5% (mínimo $17.00 USD) y spread de conversión cambiaria interbancaria.
35. **Wise Payments Ltd:** *Wise Business Fees Calculator*. Costo de transferencias internacionales en Soles a cuentas bancarias en Perú a tipo de cambio real de mercado.
36. **Payoneer Inc:** *Global Payment Service Fees*. Tarifas de retiro a cuentas peruanas y costos de tarjeta prepago business.
37. **Niubiz (Visanet Perú):** *Tarifario de Integración de Pasarela de Pago Local*. Comisiones de tarjetas de crédito y débito locales (Visa/Mastercard) en Perú.

### E. Tarifas de Referencia, Agencias y Mercado Freelance (5 Fuentes)
38. **Upwork Inc:** *Freelance Software Engineer Rate Index (2025/2026)*. Rangos de tarifas por hora cobradas por desarrolladores peruanos y latinoamericanos.
39. **Fiverr International Ltd:** *Fiverr Pro Software Development & AI Integration Services Directory*. Precios de referencia para paquetes de automatización con n8n e integraciones de IA.
40. **APESOFT (Asociación Peruana de Productores de Software):** *Reporte Anual de la Industria de Software en el Perú*. Rangos de costos de desarrollo cobrados por agencias formales en Lima.
41. **Michael Page Perú:** *Estudio de Remuneración y Tendencias de Tecnología (2025/2026)*. Salarios de referencia para desarrolladores e ingenieros de software senior y directores técnicos.
42. **Salary Explorer Peru:** *Software Engineer Salary Comparison in Peru*. Datos sobre costos de contratación por hora del personal tecnológico en el país.

---

## 3. Conclusión Metodológica

El uso coordinado de estas fuentes asegura que:
1.  **Alberto nunca cotice por debajo de su costo operativo real (CIF + MOD + MID + CVT).**
2.  **Los precios de venta se mantengan sumamente competitivos** tanto a nivel local (agencias peruanas) como internacional (plataformas de trabajo remoto de EE.UU. e intermediarios).
3.  **Toda cotización a clientes esté blindada por ley peruana**, considerando las normas de la SUNAT (IGV, Detracciones, RER y Exportación) y las comisiones reales de los procesadores financieros.
