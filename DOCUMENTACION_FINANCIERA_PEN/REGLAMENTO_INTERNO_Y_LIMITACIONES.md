# Reglamento Interno de Operaciones y Limitaciones del Servicio (SOP)
**Políticas de Capacidad Operativa, Canales de Soporte, SLAs e Indicadores de Rendimiento (KPIs)**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento establece las políticas internas para la gestión operativa de tu negocio. Define cómo se organiza la carga de trabajo del equipo, los límites en la atención a clientes, y las métricas de control de calidad para el programador Junior y el especialista QA, garantizando entregas de software robustas y un ambiente de trabajo libre de burnout.

---

## 1. Capacidad Operativa y Reglas de Concurrencia

Para mantener los estándares de calidad técnica altos, la capacidad mensual de la agencia se calcula en base a **160 horas laborales mensuales por persona**:
*   **Alberto (Arquitecto de Soluciones Senior / QA Lead):** 160 horas/mes (Tasa de Costo Directo: S/. 93.75/h).
*   **Programador Junior:** 160 horas/mes (Tasa de Costo Directo: S/. 30.00/h).
*   **Especialista QA (Garantía de Calidad):** 60 horas/mes (Tasa de Costo Directo: S/. 22.50/h).

### A. Consumo Estimado de Horas por Tipo de Proyecto
*   **Tier C (Migraciones n8n básicas / Sitios WordPress simples):**
    *   Alberto (5h) + Junior (12-16h) + QA (3-4h) = **Total ~20-25h de ingeniería**.
*   **Tier B (Lead Triage / Integración ERP / Apps Web React TS):**
    *   Alberto (15h) + Junior (22-28h) + QA (7-8h) = **Total ~45-51h de ingeniería**.
*   **Tier A (Enjambres LangGraph / Plataformas SaaS Next.js):**
    *   Alberto (35-40h) + Junior (35-65h) + QA (10-15h) = **Total ~80-120h de ingeniería**.

### B. Matriz de Concurrencia Mensual Máxima
El cuello de botella de la agencia está dictado por las horas de ejecución del Junior y la capacidad de revisión/arquitectura de Alberto. Para asegurar la viabilidad de los cronogramas, no se debe sobrepasar el 100% de la capacidad de ningún rol.

Se establecen los siguientes límites de concurrencia de proyectos activos al mes:

| Configuración Operativa | Proyectos Tier A | Proyectos Tier B | Proyectos Tier C | Carga de Trabajo del Equipo |
| :--- | :---: | :---: | :---: | :--- |
| **Escenario 1 (Foco en Alto Ticket)** | 1 | 1 | 1 | **Óptima:** Capacidad ocupada al 80%. Deja margen para soporte reactivo y consultorías de descubrimiento. |
| **Escenario 2 (Foco en Volumen)** | 0 | 2 | 4 | **Estable:** Foco en desarrollo WordPress y migraciones n8n de escala media. |
| **Escenario 3 (Límite Técnico)** | 1 | 2 | 0 | **Límite Operativo:** El Junior opera al 95% de su capacidad. No se aceptan nuevos proyectos hasta cerrar hitos. |
| **Escenario 4 (Sobrecarga)** | 2 | 1 | 0 | **Crítica (Prohibida):** Excede el tiempo disponible de Alberto para QA y supervisión de arquitectura. |

---

## 2. Canales de Comunicación y SLA (Acuerdo de Nivel de Servicio)

Para optimizar el tiempo técnico de los desarrolladores y evitar la fragmentación de la información, se establecen canales rígidos de comunicación con el cliente.

### A. Canales Oficiales vs. Canales Excluidos
*   **Canales Autorizados:**
    *   *Slack / Discord (Mensajería diaria):* Para consultas del día a día, alertas y bloqueos de avance.
    *   *Correo Electrónico (Comercial):* Para envío de actas de conformidad, propuestas de cambio de alcance, contratos y facturas.
    *   *Portal miweb (Notion / Jira integrado):* Canal exclusivo para la creación y seguimiento de tickets de soporte técnico e incidencias de software.
*   **Exclusión de WhatsApp para Soporte Técnico:** Queda estrictamente prohibido que el cliente reporte fallas del sistema o bugs vía WhatsApp.
    *   *Justificación:* WhatsApp no genera un historial ordenado del error, impide la asignación estructurada de tareas al Junior/QA, rompe el flujo de concentración del desarrollador y fomenta expectativas de respuesta fuera del horario laboral.

### B. Niveles de SLA ante Incidencias Técnicas (Horario de Oficina: L-V 9:00 AM - 6:00 PM)

Toda incidencia registrada en el portal `miweb` se clasificará por su nivel de gravedad, aplicando los siguientes tiempos de respuesta garantizados:

1.  **Severidad 1 (Bloqueante - Sistema Caído):** El flujo principal está detenido (ej. n8n no procesa pagos, el servidor VPS está offline).
    *   *Tiempo de Respuesta:* **Menos de 4 horas hábiles**.
    *   *Tiempo de Resolución Promedio:* Menos de 8 horas hábiles.
2.  **Severidad 2 (Grave - Fallo de Módulo):** El sistema funciona, pero una parte importante falla (ej. los leads se guardan en el CRM, pero la alerta de WhatsApp no se envía).
    *   *Tiempo de Respuesta:* **Menos de 12 horas hábiles**.
    *   *Tiempo de Resolución Promedio:* Menos de 24 horas hábiles.
3.  **Severidad 3 (Menor - Consulta / Estética):** Dudas sobre la interfaz, cambios visuales menores o solicitudes de nuevos campos de datos.
    *   *Tiempo de Respuesta:* **Menos de 48 horas hábiles**.
    *   *Tiempo de Resolución Promedio:* Agendado para el sprint de la siguiente semana.

---

## 3. Aislamiento de Entornos de Software y Control de Código (SOP Técnico)

El desarrollo en plataformas de automatización como n8n exige el mismo rigor que la ingeniería de software tradicional. Para evitar despliegues accidentales en producción, se establecen las siguientes reglas:

### A. Aislamiento Acorazado de Entornos (Multi-environment Setup)
1.  **Entorno de Desarrollo/Staging:** Una instancia segregada de n8n para pruebas, emulación y modelado de datos usando información de prueba (sandbox).
2.  **Entorno de Producción:** Una instancia dedicada y aislada corriendo sobre Docker que contiene los datos vivos del cliente. Queda estrictamente prohibido editar o refactorizar flujos lógicos directamente en esta instancia de Producción.

### B. Inviolabilidad de Variables de Entorno (.env)
Queda terminantemente prohibido inyectar tokens de acceso, contraseñas de bases de datos o claves de API (API Keys) en texto plano directamente dentro de la interfaz visual de n8n. Toda credencial sensible debe ser cargada mediante variables de entorno referenciadas dinámicamente en el servidor (archivos `.env`), garantizando que la instancia de desarrollo apunte a APIs mock y la de producción a credenciales reales de forma automática.

### C. Proceso de Code Review y Promoción de Versiones (Git Flow)
1.  El desarrollador junior programa el flujo en la instancia de **Desarrollo**.
2.  Utilizando Source Control, realiza un `push` de los cambios en formato JSON a una rama secundaria (ej. `feature/woocommerce-sync`).
3.  El Líder Técnico (Alberto) realiza un **Code Review** exhaustivo en GitHub/GitLab, verificando:
    *   La arquitectura de manejo de errores (nodos Error Trigger).
    *   Eficiencia en ciclos (evitando bucles infinitos que saturen la memoria del VPS).
    *   Ausencia de credenciales expuestas.
4.  Tras la aprobación formal del Pull Request, se realiza el `merge` en la rama `main`.
5.  La instancia de **Producción** ejecuta un `pull` de los cambios y asigna dinámicamente las credenciales de entorno seguras.

---

## 4. Indicadores Clave de Rendimiento (KPIs) de Desarrollo y QA

Basado en métricas DORA y el modelo SPACE, se definen los siguientes KPIs cuantitativos para evaluar el rendimiento de los colaboradores técnicos remotos.

### A. KPIs del Programador Junior

1.  **Tiempo de Ciclo (Cycle Time):** El lapso cronológico neto transcurrido desde el primer commit del junior hasta que la tarea es probada y promovida a producción. Su objetivo es medir cuellos de botella de desarrollo y mitigar la fricción operativa.
2.  **Tasa de Desviación Temporal (DTT):** Desviación entre el tiempo real consumido en desarrollo frente al WBS estimado inicialmente.
    $$\text{DTT} = \frac{|\text{Horas Reales} - \text{Horas Estimadas}|}{\text{Horas Estimadas}} \times 100 \le 15\%$$
3.  **Tasa de Defectos Escapados (Defect Escape Rate):** Porcentaje de flujos con errores de lógica que logran pasar a producción en comparación con los detectados en sandbox. El objetivo para un Junior es inferior al **10%**.
    $$\text{Tasa Defectos Escapados} = \frac{\text{Bugs en Producción}}{\text{Bugs en Staging + Bugs en Producción}} \times 100 \le 10\%$$
4.  **Tasa de Volatilidad del Código (Code Churn):** Frecuencia con la que el junior reescribe o descarta código días después de haberlo entregado como "finalizado". Un churn elevado indica incomprensión de requerimientos.

---

### B. KPIs del Especialista QA (Quality Assurance)

1.  **Tasa de Escape de Bugs (Bug Leakage Rate):** Porcentaje de fallos críticos reportados por el cliente una vez entregado el sistema, sobre los bugs detectados. El objetivo de la agencia es mantenerlo por debajo del **5%**.
    $$\text{Escape de Bugs} = \frac{\text{Bugs Reportados por Cliente}}{\text{Bugs Totales Detectados (QA + Cliente)}} \times 100 < 5\%$$
2.  **Tiempo Medio de Recuperación (MTTR - Mean Time To Recovery):** Tiempo de respuesta y despliegue de parches ante fallos críticos en producción. Mide la destreza del QA e ingenieros para leer logs y restablecer servicios de forma rápida.
3.  **Estructura del Reporte de Fallos:** El 100% de los tickets de error generados por el QA en `miweb` deben contener:
    *   Pasos detallados de reproducción.
    *   Datos de entrada exactos (payload JSON de prueba).
    *   Consola/Logs de error del servidor.
    *   Grabación en Loom del bug.
4.  **Tasa de Re-apertura de Bugs:** Porcentaje de bugs que habiendo sido reportados como "corregidos" por el Junior, fallan la validación de QA y deben abrirse nuevamente. Debe ser inferior al **10%**.
