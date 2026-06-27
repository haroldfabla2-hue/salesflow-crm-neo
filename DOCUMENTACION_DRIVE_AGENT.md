# Documentación: Agente de Google Drive & Gmail (Silhouette Brain)

Este documento registra la existencia, ubicación y forma de uso del **Agente de Google Drive y Gmail** personalizado de Alberto Farah, para asegurar que cualquier agente de desarrollo mantenga el contexto de este sistema operativo en este espacio de trabajo.

---

## 📍 Ubicación del Proyecto

El agente y sus bases de datos asociadas están ubicados en la ruta local:
*   `C:\Users\USER\Documents\antigravity\hopeful-noether`

---

## 🛠️ Arquitectura y Componentes

El agente implementa un cerebro en capas (**Silhouette Brain**) utilizando una base de datos SQLite local para el almacenamiento de memoria persistente y semántica.

1.  **Orquestador Principal (`drive_agent.py`):**
    *   Gestiona las conexiones y llamadas a las APIs de Google: Google Drive, Docs, Sheets, Slides, Calendar, Gmail (lectura y envío) y Contacts (People API).
2.  **Cerebro Multicapa (`drive_brain.py`):**
    *   **Capa 1 (Working Memory):** Caché en memoria RAM (con fallback a Redis local si está disponible).
    *   **Capa 2 (Medium Memory):** Historial de acciones y sincronización de metadatos en SQLite.
    *   **Capa 3 (Long Memory):** Búsqueda semántica usando embeddings basados en TF-IDF con normalización L2 generados localmente en `vocab.json`.
    *   **Capa 4 (Deep Memory):** Grafo relacional para mapear conexiones semánticas y estructuras de carpetas en SQLite.

### 🔑 Autenticación y Perfiles

El sistema soporta dos perfiles mediante archivos de token OAuth separados:
*   **Perfil Personal (Por Defecto / Recomendado):**
    *   Base de datos: `drive_brain.db` (o `drive_brain_personal.db`)
    *   Tokens: `token.json` y `credentials.json`
*   **Perfil Brandistry:**
    *   Base de datos: `drive_brain_brandistry.db`
    *   Tokens: `token_brandistry.json` y `credentials_brandistry.json`

---

## 🚀 Comandos Comunes de Uso (CLI)

Para ejecutar cualquiera de estos comandos, abre una terminal en el directorio `C:\Users\USER\Documents\antigravity\hopeful-noether` y asegúrate de usar el perfil correspondiente.

### 1. Operaciones de Gmail
*   **Buscar correos no leídos (Perfil Personal):**
    ```powershell
    python drive_agent.py --profile personal gmail search -q "is:unread" --limit 10
    ```
*   **Enviar un correo electrónico:**
    ```powershell
    python drive_agent.py --profile personal gmail send -to "destinatario@mail.com" -s "Asunto del Correo" -b "Cuerpo del mensaje..."
    ```

### 2. Sincronización y Memoria
*   **Sincronizar metadatos de Drive:**
    ```powershell
    python drive_agent.py --profile personal sync -n 100 --summarize
    ```
*   **Buscar en el contexto multicapa:**
    ```powershell
    python drive_agent.py --profile personal context "Buscar información de reuniones"
    ```
*   **Búsqueda semántica en Long Memory:**
    ```powershell
    python drive_agent.py --profile personal semantic "conceptos o temas de interés"
    ```

### 3. Operaciones de Google Sheets
*   **Leer un rango específico:**
    ```powershell
    python drive_agent.py --profile personal sheet read -t "NombrePestaña" -r "A1:C10" -id "SPREADSHEET_ID"
    ```
*   **Anexar filas en formato JSON:**
    ```powershell
    python drive_agent.py --profile personal sheet append -t "Pestaña" -v "[['Dato1', 'Dato2']]" -id "SPREADSHEET_ID"
    ```
