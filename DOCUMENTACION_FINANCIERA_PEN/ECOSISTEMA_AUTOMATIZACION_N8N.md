# Ecosistema de Automatización Comercial en n8n
**Diseño de Webhooks, Integraciones de Negocio y Piloto Automático Comercial**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento detalla el diseño técnico de los enjambres de automatización en n8n para conectar tu portafolio/CMS [miweb](file:///d:/Proyectos%20personales/MiWeb) con tus finanzas, facturación y operaciones de soporte, permitiendo que tu negocio funcione en piloto automático.

---

## 1. Mapa de Integraciones en n8n

n8n actúa como el cerebro nervioso central, conectando tus diferentes servicios mediante webhooks automáticos:

```
[ Formulario miweb ] ----(Webhook)----> [ n8n Brain Engine ]
                                               |
       +-----------------------+---------------+-----------------------+
       |                       |               |                       |
[ Slack/WhatsApp ]      [ Google Sheets ]   [ Stripe/PayPal ]    [ Facturación ]
(Notificación)          (CRM Control)       (Onboarding)         (SUNAT/SPOT)
```

---

## 2. Diseños de Flujos Automatizados Clave

---

### FLUJO 1: Calificación de Leads y Alertas en Tiempo Real
*   **Disparador (Trigger):** `Webhook Node` recibe datos cuando un usuario completa el formulario de cotización en `miweb`.
*   **Paso 1 (Calificación IA):**
    *   Un nodo de OpenAI/Anthropic evalúa el mensaje, rubro, herramientas y presupuesto del lead.
    *   Determina si el lead cumple con tus precios de seguridad y si se ajusta a tus perfiles (A, B o C).
*   **Paso 2 (Enrutamiento Comercial):**
    *   *Si es calificado:* Registra el lead en tu CRM (Google Sheets o HubSpot) y envía una alerta pesada a tu WhatsApp corporativo (vía Meta Cloud API) con la propuesta sugerida generada por IA.
    *   *Si no es calificado:* Registra en la pestaña "Leads Fríos" de tu CRM y envía un correo electrónico automático de rechazo educado y derivación a recursos gratuitos.

---

### FLUJO 2: Onboarding Automático tras Pago de Adelanto
*   **Disparador (Trigger):** `Webhook Node` detecta un pago exitoso en Stripe o PayPal (o se activa manualmente en `miweb` si el cliente pagó vía transferencia local BCP/Interbank).
*   **Paso 1 (Creación de Workspace):**
    *   Crea automáticamente una carpeta en Google Drive / Dropbox para el cliente llamada `[Nombre Cliente] - Proyecto`.
    *   Crea una bóveda segura compartida en Bitwarden para que el cliente deposite sus credenciales.
*   **Paso 2 (Alta en el Portal):**
    *   Dispara una petición a `miweb` para generar la cuenta del cliente (`role = 'client'`) y asocia su WBS.
*   **Paso 3 (Bienvenida):**
    *   Envía un correo de bienvenida con las credenciales de acceso a `miweb`, el enlace al Drive y el link para agendar la sesión de Kickoff.

---

### FLUJO 3: Automatización Fiscal SUNAT (MYPE RMT)
*   **Disparador (Trigger):** Pago marcado como "Pagado" o "Por Cobrar" en el CMS.
*   **Paso 1 (Emisión de Comprobante):**
    *   Envía los datos de facturación (RUC, Razón Social, valor de venta, IGV) a tu API de facturación electrónica local (ej. Facturactiva, Nubefact o PSE homologado por SUNAT).
    *   El PSE emite la boleta/factura, la declara ante SUNAT y devuelve el PDF/XML.
*   **Paso 2 (Cálculo de Impuestos y Reservas):**
    *   Registra en tu Google Sheets financiero:
        *   `Monto Pago a Cuenta MYPE (1%)`: Total Venta × 0.01.
        *   `Fondo Reserva Renta Anual (10%)`: Utilidad Proyectada × 0.10.
        *   `Detracción (12% BN)`: Si la factura es > S/. 700 (envía correo recordando al cliente depositar al Banco de la Nación).
*   **Paso 3 (Envío al Cliente):**
    *   Carga la factura emitida directamente al perfil de cliente en `miweb` y se la envía por correo de forma adjunta.

---

## 3. Configuración y Mantenimiento de n8n

*   **Entorno:** n8n debe ejecutarse en tu propio servidor VPS (Hetzner Cloud) bajo Docker Compose para garantizar control total del tiempo de ejecución y consumo ilimitado de workflows sin pagar licencias de Zapier o Make.
*   **Seguridad de Webhooks:** Todos los endpoints de n8n expuestos a internet deben requerir firma criptográfica en el header (`X-Hub-Signature` o Bearer tokens) para evitar que terceros inyecten datos falsos a tu sistema.
*   **Backups:** Un script diario automatizado en el servidor n8n debe exportar todos los flujos de trabajo activos (JSON) y guardarlos en tu repositorio privado de GitHub.
