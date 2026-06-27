# Especificación de Integración del Portal CMS "miweb" con n8n
**Endpoints de API, Payloads JSON y Protocolos de Seguridad Criptográfica**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento detalla la especificación técnica de la API REST que conectará el backend del portal de tu portafolio [miweb](file:///d:/Proyectos%20personales/MiWeb) con el motor de automatización de n8n, permitiendo que la información de leads, horas hombre, proyectos y facturas se sincronice sin fisuras operativas.

---

## 1. Arquitectura de Conexión y Autenticación

Todas las peticiones HTTP que ocurran entre n8n y `miweb` deben estar protegidas para evitar que terceros inyecten datos falsos o lean información confidencial.

*   **Protocolo de Comunicación:** HTTPS obligatorio.
*   **Autenticación Base:** Bearer Tokens en el header (`Authorization: Bearer <token_seguro>`).
*   **Firma Criptográfica HMAC (Recomendado):** Para webhooks críticos, n8n firmará el cuerpo de la petición (body) con una firma digital en el header `X-Signature` usando el algoritmo **HMAC SHA-256** y una clave secreta compartida (`SHARED_SECRET_KEY`).

### Código de Validación de Firma en el Backend de miweb (Node.js Express)
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(req, res, next) {
    const signature = req.headers['x-signature'];
    if (!signature) {
        return res.status(401).json({ error: 'Firma ausente' });
    }

    const hmac = crypto.createHmac('sha256', process.env.SHARED_SECRET_KEY);
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        next();
    } else {
        res.status(403).json({ error: 'Firma inválida' });
    }
}
```

---

## 2. Definición de Endpoints de la API

---

### Endpoint 1: Captura Inicial de Leads (Web a n8n)
*   **Método:** `POST`
*   **Ruta:** `/api/v1/leads/intake`
*   **Dirección:** `miweb` (Frontend/Backend) -> n8n Webhook Node
*   **Descripción:** Registra un cliente interesado que completó el formulario de contacto o cotización en el portafolio.

#### Payload de Petición (JSON)
```json
{
  "lead_id": "8b7e234a-912c-4fb2-a1f9-d5c2d3a123bc",
  "created_at": "2026-06-18T04:30:00Z",
  "nombre": "Diego Nuñez",
  "empresa": "Bijoueme",
  "email": "pablonma99@gmail.com",
  "whatsapp": "+51999888777",
  "pais": "PE",
  "presupuesto_estimado": 5625.00,
  "stack_actual": "WordPress, WooCommerce, Zapier",
  "tareas_zapier_mensuales": 25000,
  "descripcion_problema": "Queremos automatizar la sincronización de pedidos con hojas de cálculo y WhatsApp. En Zapier pagamos mucho y se cae constantemente."
}
```

#### Código de Respuesta Esperado (HTTP 202 Accepted)
```json
{
  "status": "accepted",
  "message": "Lead recibido y enviado a Silhouette Brain para evaluación.",
  "timestamp": "2026-06-18T04:30:02Z"
}
```

---

### Endpoint 2: Sincronización de Proyectos y Tareas WBS
*   **Método:** `POST`
*   **Ruta:** `/api/v1/projects/sync`
*   **Dirección:** n8n -> `miweb` (Backend API)
*   **Descripción:** Sincroniza la tabla de proyectos y el desglose de tareas (WBS) una vez aprobada la propuesta comercial.

#### Payload de Petición (JSON)
```json
{
  "project_id": "a901f2e3-bc4d-5e6f-7a8b-9c0d1e2f3a4b",
  "client_email": "pablonma99@gmail.com",
  "project_name": "Migración Zapier a n8n - Bijoueme",
  "status": "en_desarrollo",
  "total_value_neto": 5625.00,
  "currency": "PEN",
  "wbs_tasks": [
    {
      "task_title": "Auditoría de flujos y credenciales",
      "assigned_to_role": "worker",
      "estimated_hours": 2,
      "status": "todo"
    },
    {
      "task_title": "Despliegue del VPS n8n en Hetzner",
      "assigned_to_role": "admin",
      "estimated_hours": 3,
      "status": "todo"
    },
    {
      "task_title": "Reconstrucción de flujos en n8n",
      "assigned_to_role": "worker",
      "estimated_hours": 5,
      "status": "todo"
    }
  ]
}
```

#### Código de Respuesta Esperado (HTTP 200 OK)
```json
{
  "status": "success",
  "project_id": "a901f2e3-bc4d-5e6f-7a8b-9c0d1e2f3a4b",
  "tasks_created": 3,
  "message": "Proyecto y WBS sincronizados correctamente en la base de datos."
}
```

---

### Endpoint 3: Envío de Registro de Horas (Colaboradores a CRM)
*   **Método:** `POST`
*   **Ruta:** `/api/v1/time-logs`
*   **Dirección:** `miweb` (Dashboard Trabajador) -> n8n -> Google Sheets CRM
*   **Descripción:** Registra las horas trabajadas por el Junior o QA en sus tareas y lo reporta a la pestaña financiera para calcular el costo MOD (Mano de Obra Directa) real.

#### Payload de Petición (JSON)
```json
{
  "log_id": "c78f12a3-d4e5-6f7a-8b9c-0d1e2f3a4b5c",
  "project_id": "a901f2e3-bc4d-5e6f-7a8b-9c0d1e2f3a4b",
  "user_name": "Junior Dev",
  "task_title": "Reconstrucción de flujos en n8n",
  "hours_logged": 4.5,
  "logged_at": "2026-06-18",
  "description": "Desarrollo de los nodos HTTP Request para la API de WooCommerce."
}
```

#### Código de Respuesta Esperado (HTTP 201 Created)
```json
{
  "status": "logged",
  "log_id": "c78f12a3-d4e5-6f7a-8b9c-0d1e2f3a4b5c",
  "message": "Registro de horas hombre enviado exitosamente al CRM."
}
```

---

## 3. Cifrado de Credenciales en la Base de Datos de miweb

Para cumplir con la legislación de protección de datos (LPDP de Perú y RGPD de España), las credenciales que cargue el cliente (ej. tokens de OpenAI o contraseñas de VPS) en `miweb` no pueden almacenarse en texto plano en la tabla `projects` o `users`.

### Esquema de Cifrado Simétrico AES-256-GCM (Node.js)
```javascript
const crypto = require('crypto');
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes para GCM
const SALT_LENGTH = 64;

function encrypt(text, secretKey) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secretKey, 'hex'), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Devolvemos el IV, el Tag de autenticación y el texto cifrado concatenados
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decrypt(encryptedText, secretKey) {
    const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(secretKey, 'hex'), iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}
```
*   **Regla de Seguridad:** La clave `secretKey` (de 32 bytes) debe inyectarse en el backend como una variable de entorno (`SECRET_KEY_DB`), jamás guardarse en el código de Git ni en bases de datos.
