# Documentación: Gestión de Autenticación y Tokens de Google Workspace

Este documento detalla el procedimiento para mantener la persistencia de la autenticación del Agente de Google Workspace (Gmail, Drive, Sheets, etc.) y explica cómo evitar la invalidación recurrente de los tokens de acceso.

---

## ⚠️ ¿Por qué se desvalidan los tokens de Google OAuth?

Si tu token de acceso (`token_personal.json` o `token_brandistry.json`) expira recurrentemente a los **7 días**, se debe a las políticas de seguridad de Google Cloud Console:

1. **Estado de publicación en "Testing" (Prueba):** Cuando creas un proyecto en Google Cloud Console para usar las APIs y el estado de la pantalla de consentimiento de OAuth está configurado en "Testing", Google invalida automáticamente los tokens de actualización (refresh tokens) cada 7 días.
2. **Revocación manual o cambios de seguridad:** Si cambias la contraseña de tu cuenta de Google o modificas la configuración de seguridad (como la verificación en dos pasos), Google revocará todas las sesiones y tokens activos.

---

## 🛠️ Cómo evitar que los tokens vuelvan a expirar (Solución Definitiva)

Para lograr que los tokens sean permanentes (indefinidos) y no tengas que volver a autorizar cada semana, debes cambiar el estado de la aplicación en Google Cloud:

1. Ve a la consola de Google Cloud: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Asegúrate de seleccionar el proyecto correcto (el que corresponde a tu Client ID).
3. En el menú de la izquierda, navega a **API y servicios** > **Pantalla de consentimiento de OAuth** (OAuth consent screen).
4. Bajo la sección **Estado de publicación** (Publishing status), haz clic en el botón **PUBLICAR APLICACIÓN** (Publish App).
5. Confirma la acción. La aplicación pasará del estado *Testing* al estado *In Production* (En producción).

> [!NOTE]
> Al pasar a producción, Google te mostrará una advertencia de que la app necesita ser verificada si supera los límites de usuarios de prueba (100 usuarios) o si usa scopes sensibles. Sin embargo, para uso personal y de desarrollo (1-2 usuarios), **puedes omitir la verificación de Google** y la app funcionará indefinidamente sin que expiren los tokens de actualización.

---

## 🔑 Alcance de Permisos Requeridos (Scopes Completos)

Para que el agente pueda operar de manera total sobre tu Workspace de Google, al momento de hacer login en el navegador **debes asegurarte de marcar/aprobar todas las casillas de verificación** correspondientes a los siguientes scopes:

*   `https://www.googleapis.com/auth/drive` (Gestión completa de archivos y carpetas en Drive)
*   `https://www.googleapis.com/auth/documents` (Lectura y escritura en Google Docs)
*   `https://www.googleapis.com/auth/spreadsheets` (Lectura, escritura y formato en Google Sheets)
*   `https://www.googleapis.com/auth/presentations` (Edición de diapositivas en Google Slides)
*   `https://www.googleapis.com/auth/calendar` (Programación y consulta de eventos)
*   `https://www.googleapis.com/auth/gmail.readonly` (Lectura de bandejas de entrada de Gmail)
*   `https://www.googleapis.com/auth/gmail.send` (Envío de correos electrónicos)
*   `https://www.googleapis.com/auth/gmail.modify` (Cambio de etiquetas y marcado de correos como leídos)
*   `https://www.googleapis.com/auth/contacts` (Gestión de contactos del perfil)

---

## 🚀 Proceso de Re-autenticación (Si es requerido)

Si alguna vez necesitas volver a regenerar los tokens completamente, sigue este procedimiento:

1. Abre una terminal e ingresa al directorio del agente:
   ```powershell
   cd "C:\Users\USER\Documents\antigravity\hopeful-noether"
   ```
2. Ejecuta el script de autenticación para el perfil correspondiente:
   *   **Perfil Personal (`alberto.farah.b@gmail.com`):**
       ```powershell
       python drive_auth.py personal
       ```
   *   **Perfil Brandistry (`brandistry.digital@gmail.com`):**
       ```powershell
       python drive_auth.py brandistry
       ```
3. El script iniciará un servidor local en un puerto dinámico y abrirá el navegador. **Acepta todos los permisos en la pantalla de Google**.
4. Una vez completado, el script generará y guardará de forma automática el archivo de credenciales correspondiente (`token_personal.json` o `token_brandistry.json`) en el mismo directorio.
