# Estructura del CRM en Google Sheets e Integración con n8n
**Especificación de Tablas, Estados y Automatizaciones Comerciales**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento establece el diseño y la estructura del CRM liviano de tu negocio implementado en Google Sheets. n8n actuará como el motor de sincronización de datos entre este CRM, tu portal web `miweb` y tus pasarelas de pago y facturación.

---

## 1. Diseño del Libro de Google Sheets (Estructura de Pestañas)

El archivo de Google Sheets estará compuesto por tres pestañas operativas y una de control financiero:

---

### Pestaña 1: `Leads Entrantes` (Pipeline Comercial)
Registra el ingreso de clientes potenciales y la evaluación inicial de Inteligencia Artificial (Silhouette Brain).

*   **A: ID Lead** `[UUID]` (Generado automáticamente por n8n o portal web)
*   **B: Fecha Registro** `[DD/MM/AAAA HH:MM]`
*   **C: Nombre** `[Texto]`
*   **D: Empresa** `[Texto]`
*   **E: Email** `[Email]`
*   **F: WhatsApp** `[Formato Internacional: +51...]`
*   **G: País** `[PE / INT]` (Crítico para calcular IGV)
*   **H: Presupuesto Estimado (PEN)** `[Número]` (Soles)
*   **I: Stack Tecnológico** `[Texto - ej: WooCommerce, Zapier, HubSpot]`
*   **J: Tareas Mensuales Zapier** `[Número - Consumo actual del prospecto]`
*   **K: Calificación Silhouette Brain** `[A / B / C / Rechazado]`
*   **L: Score IA** `[0 a 100]` (Nivel de ajuste con el ICP)
*   **M: Estado Lead** `[Lista Validación: 'Nuevo', 'Silhouette Triage', 'Agendado', 'Propuesta Enviada', 'Ganado', 'Perdido']`
*   **N: Responsable** `[Alberto / Junior / Ninguno]`
*   **O: Fecha Próxima Acción** `[DD/MM/AAAA]`
*   **P: Notas de IA y Resumen** `[Texto - Resumen del dolor del lead y stack]`

---

### Pestaña 2: `Proyectos Activos` (Control WBS Operativo)
Sincroniza y monitorea los proyectos vigentes una vez que el Lead pasa a estado "Ganado".

*   **A: ID Proyecto** `[UUID]`
*   **B: ID Cliente** `[UUID - FK a user en miweb]`
*   **C: Nombre Proyecto** `[Texto]`
*   **D: Estado Operativo** `[Lista Validación: 'Fase 1 Discovery', 'Fase 2 Build', 'Fase 3 SLA', 'Finalizado', 'Pausado']`
*   **E: Valor Neto (PEN)** `[Número - Sin impuestos]`
*   **F: IGV (18% PEN)** `[Fórmula: =E2*0.18 (Si País es PE, sino 0)]`
*   **G: Total Facturado (PEN)** `[Fórmula: =E2+F2]`
*   **H: Detracción (12% PEN)** `[Fórmula: =SI(G2>700; G2*0.12; 0)]`
*   **I: Cuenta Corriente Neto (88%)** `[Fórmula: =G2-H2]`
*   **J: N° Factura SUNAT** `[Texto - ej: F001-0000123]`
*   **K: Estado Facturación** `[Lista Validación: 'Pendiente Emisión', 'Pendiente Pago', 'Detracción Pendiente', 'Cobrado Total']`
*   **L: Avance (%)** `[Porcentaje - Calculado por miweb basado en tareas done]`
*   **M: Fecha Inicio** `[DD/MM/AAAA]`
*   **N: Fecha Fin Proyectada** `[DD/MM/AAAA]`

---

### Pestaña 3: `Movimientos Financieros` (Libro de Caja y Provisiones SUNAT)
Monitorea los flujos de dinero entrante y saliente, calculando provisiones fiscales en soles para el Régimen MYPE Tributario (RMT).

*   **A: ID Transacción** `[UUID]`
*   **B: ID Proyecto** `[UUID]`
*   **C: Fecha Pago** `[DD/MM/AAAA]`
*   **D: Descripción** `[Texto - ej: Adelanto 50% Fase 2, Pago Retainer Mensual]`
*   **E: Tipo Movimiento** `[Ingreso / Egreso / Impuesto Prov. / Retainer]`
*   **F: Moneda** `[PEN / USD]`
*   **G: Monto Bruto Localizado (PEN)** `[Número - Convertido a soles con Tipo de Cambio oficial SBS]`
*   **H: Comisiones Pasarela (PEN)** `[Número - Comisiones PayPal o Stripe]`
*   **I: Monto Neto Caja (PEN)** `[Fórmula: =G2-H2]`
*   **J: Pago a Cuenta RMT (1% PEN)** `[Fórmula: =G2*0.01 (Provisión mensual SUNAT)]`
*   **K: Reserva Renta Anual (10% PEN)** `[Fórmula: =(G2-H2)*0.10 (Provisión para impuesto anual)]`
*   **L: Reserva IGV a Pagar (18% PEN)** `[Número - Si se facturó localmente con IGV]`

---

## 2. Lógica de Triggers y Automatizaciones en n8n

n8n ejecutará las siguientes acciones automáticas basadas en cambios de estado del Google Sheets CRM:

```
[Cambio Estado en Sheet] --(n8n Event)--> [Evaluación de Reglas] --> [Acción Externa]
```

### Automatización A: Lead Intake y Triage (Formulario a Sheet)
*   **Trigger:** webhook `POST /api/leads` desde la web `miweb` o Calendly.
*   **Acciones de n8n:**
    1.  Toma el payload JSON del formulario.
    2.  Envía la descripción técnica del lead a un nodo OpenAI (`gpt-4o-mini`).
    3.  El modelo evalúa e introduce el Score de IA (0-100) y la Calificación (`A`, `B` o `C`).
    4.  Crea una fila en la pestaña `Leads Entrantes` con estado `Nuevo`.
    5.  Si el lead es Calificación `A` (Alto Ticket) o `B` (Medio), envía una alerta a tu Slack/WhatsApp. Si es `Rechazado`, envía un correo de rechazo educado y derivación a recursos de tu blog.

### Automatización B: Generación y Envío de Propuesta
*   **Trigger:** La columna `Estado Lead` en la pestaña `Leads Entrantes` cambia a `Propuesta Enviada`.
*   **Acciones de n8n:**
    1.  n8n lee los datos de la fila (Nombre, Empresa, Presupuesto, Stack).
    2.  Utiliza una plantilla Markdown (basada en `PROPUESTA_COMERCIAL_PLANTILLA.md`) y reemplaza las variables dinámicas en un nodo `Function`.
    3.  Convierte el Markdown resultante a un PDF formal de alta calidad.
    4.  Guarda el PDF en una carpeta del Drive del cliente bajo el nombre `Propuesta Comercial - [Empresa].pdf`.
    5.  Envía un correo al cliente adjuntando el PDF de la propuesta comercial, con copia a Alberto.

### Automatización C: Cierre Ganado y Onboarding Técnico
*   **Trigger:** La columna `Estado Lead` cambia a `Ganado`.
*   **Acciones de n8n:**
    1.  n8n genera un UUID de cliente y hace un `POST` al portal web `miweb` para dar de alta al cliente en la base de datos PostgreSQL.
    2.  n8n crea la carpeta raíz del proyecto en Google Drive: `[Nombre Cliente] - Proyecto`.
    3.  n8n crea una fila en la pestaña `Proyectos Activos` arrastrando los montos financieros del lead.
    4.  Envía un correo automático al cliente con sus credenciales del portal `miweb` y el enlace cifrado para que complete el formulario de accesos (Bitwarden / Llavero seguro).
