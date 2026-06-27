# Estructura de Gastos, Impuestos y Overhead en Soles (PEN)
**Costos Fijos, Amortizaciones, Régimen Fiscal y Retiros para RUC 10 MYPE**
*Estructura de Negocio Localizada en Soles (PEN) para Alberto Farah Blair*

Este documento detalla la estructura completa de los gastos operativos, capacidad laboral y obligaciones fiscales que afectan tu negocio en el Perú. Todo cálculo está basado en un tipo de cambio estable de **S/. 3.75 PEN por USD**.

---

## 1. Capacidad Laboral Útil y Facturable (TDABC)

Para evitar pérdidas por subestimación del esfuerzo, aplicamos el marco contable **Time-Driven Activity-Based Costing (TDABC)** para definir la capacidad real y la tasa horaria de costo base.

### A. Cálculo de Capacidad Operativa Real
No todas las horas del mes son facturables. Un profesional independiente dedica tiempo a prospección comercial, elaboración de propuestas, administración y capacitación. Estipulamos una **Tasa de Utilización Facturable del 60%**:

*   **Días del Año:** 365 días.
*   **Fines de Semana:** 104 días.
*   **Feriados Nacionales (Perú):** 16 días.
*   **Vacaciones / Descanso anual:** 15 días.
*   **Días de Reserva (Enfermedad/Imprevistos):** 5 días.
*   **Días Laborables Anuales Disponibles:** 365 − 104 − 16 − 15 − 5 = **225 días**.
*   **Horas Diarias Laborables:** 8 horas.
*   **Horas Totales al Año:** 225 días × 8 horas = 1,800 horas.
*   **Capacidad Facturable Real Anual (60%):** 1,800 horas × 60% = **1,080 horas útiles facturables al año**.
*   **Capacidad Facturable Mensual Promedio:** 1,080 horas / 12 meses = **90 horas facturables al mes**.

---

## 2. Gastos Operativos Fijos Mensuales (Overhead de la Agencia)

Estos son los costos estructurales fijos mensuales para la operación de la agencia:

| Concepto / Recurso | Frecuencia | Costo Mensual (PEN) | Detalle y Justificación Técnica |
| :--- | :---: | :---: | :--- |
| **VPS de Desarrollo (Hetzner)** | Mensual | S/. 225.00 PEN | VPS de pruebas interno ($60.00 USD/mes) |
| **ChatGPT Plus / Claude Pro** | Mensual | S/. 75.00 PEN | Licencia para asistencia técnica y código ($20.00 USD/mes) |
| **Google Workspace & One** | Mensual | S/. 33.75 PEN | Correo corporativo y almacenamiento Drive ($9.00 USD/mes) |
| **Asesoría Contable / Contador** | Mensual | S/. 375.00 PEN | Liquidación de impuestos mensuales de RMT ante la SUNAT |
| **Servicios del Hogar (50% prorr.)** | Mensual | S/. 140.00 PEN | Internet de alta velocidad (S/. 70), Luz (S/. 40), Agua (S/. 30) de la oficina en casa |
| **Depreciación Laptop (25% SUNAT)** | Mensual | S/. 75.00 PEN | Laptop de S/. 3,600 depreciada linealmente a 4 años contables |
| **Fondo de Ahorro Laptop (Financiero)** | Mensual | S/. 75.00 PEN | Diferencial para renovar el equipo a los 2 años reales de uso |
| **Total Overhead Mensual** | | **S/. 998.75 PEN** | **Equivalente a $266.33 USD/mes** |

### Tasa de Absorción de Costos Indirectos (TACI) por Hora
Aplicando la metodología **TDABC**, dividimos el total de costos indirectos mensuales (Overhead) entre tu capacidad facturable mensual para obtener el costo indirecto por hora de desarrollo:
$$\text{TACI} = \frac{\text{S/. 998.75 PEN/mes}}{\text{90 horas facturables/mes}} = \mathbf{\text{S/. 11.10 PEN por hora}}$$

*   *Uso:* Por cada hora de ingeniería que cotices a un cliente, el modelo de Excel añadirá automáticamente **S/. 11.10 PEN** al costo base del proyecto para financiar el mantenimiento operativo de tu agencia.

---

## 3. Fricción Financiera y Comisiones de Pago (Gross-Up)

Recibir dinero del extranjero tiene un costo por tipo de cambio y pasarela. Para neutralizar esta pérdida, la hoja de cálculo aplica la fórmula matemática de **Gross-Up** para sobrefacturar la comisión al cliente internacional:

$$\text{Monto a Cobrar} = \frac{\text{Precio Neto Requerido} + \text{Tarifa Fija Transaccional}}{1 - \text{Porcentaje de Fricción}}$$

Para un cobro donde requieres un neto líquido de **S/. 3,750.00 PEN ($1,000.00 USD)**:

*   **Vía PayPal (Fricción del 8.5% + $0.30 USD de tarifa fija):**
    *   *Fórmula:* `=(3750 + 0.30 * 3.75) / (1 - 0.085)` = **S/. 4,110.52 PEN**.
    *   Al cobrar S/. 4,110.52 PEN en la proforma, las comisiones te descontarán S/. 360.52 PEN y recibirás exactamente tus **S/. 3,750.00 PEN** netos.
*   **Vía Wise Business (Fricción del 0.2%):**
    *   *Fórmula:* `=3750 / (1 - 0.002)` = **S/. 3,757.52 PEN**.
    *   *Recomendación:* Prioriza el uso de Wise Business para cobros internacionales por su baja fricción bancaria.

---

## 4. Régimen Tributario SUNAT para Persona Natural con Negocio (RUC 10)

### Régimen MYPE Tributario (RMT) - *Obligatorio por CIIU 62*
SUNAT excluye explícitamente las actividades de programación de sistemas, consultoría informática y diseño/arquitectura de software (División CIIU 62) del Régimen Especial de Renta (RER). Debes tributar bajo el **Régimen MYPE Tributario (RMT)**:

1.  **Pagos a Cuenta Mensuales (Impuesto a la Renta):**
    *   Pagas mensualmente a la SUNAT el **1.0% de tus ingresos netos facturados** (ventas netas sin IGV) siempre que tus ingresos anuales acumulados sean inferiores a 300 UIT (S/. 1,545,000 PEN en 2026).
2.  **Regularización Anual (Impuesto a la Renta progresivo):**
    *   Tributas sobre la utilidad neta (Ingresos netos menos gastos justificados y deducibles):
        *   **10% de impuesto** por la utilidad neta obtenida hasta las primeras 15 UIT (S/. 77,250 PEN).
        *   **29.5% de impuesto** por la utilidad neta que exceda las 15 UIT.
    *   *Reserva Operativa:* Tu calculadora de Excel reserva automáticamente el **10% de la utilidad de cada proyecto** como fondo de contingencia para la regularización anual (marzo/abril del año siguiente), protegiendo tu liquidez.
3.  **Libros Contables Mínimos:**
    *   Registro de Ventas, Registro de Compras y Libro Diario de Formato Simplificado (hasta 150 UIT).

### Impuesto General a las Ventas (IGV)
*   **Clientes Locales (Perú):** Se adiciona el **18% de IGV** obligatorio al valor neto del servicio.
*   **Clientes Internacionales (Exportación):** Tasa del **0% (Inafecto)**. Requiere que estés registrado previamente en el *Registro de Exportadores de Servicios* de la SUNAT y emitas la factura como exportador de servicios moderna.

### Sistema de Detracciones (SPOT) - Código 022
*   Para proyectos con clientes en Perú, los servicios de programación y consultoría informática califican en el Código 022 (Otros Servicios Empresariales) con una tasa de detracción del **12%** (modificada al alza desde el 10% por RS N° 071-2018/SUNAT).
*   Se activa automáticamente si el total facturado con IGV supera los **S/. 700.00 PEN**. El cliente deposita el 12% en tu cuenta de detracciones del Banco de la Nación (recaudación tributaria) y te paga el 88% restante.

---

## 5. Metas de Facturación y Sueldo Neto Objetivo (Soles PEN)

Estructuramos tu flujo de caja real bajo el régimen **RMT** (1% pago a cuenta mensual + 10% reserva anual de renta sobre utilidad) y una comisión promedio de pasarela del 8.5%:

### Meta 1: Sueldo Neto de S/. 2,000.00 PEN/mes
*   **Sueldo Neto de Alberto:** S/. 2,000.00 PEN.
*   **Overhead de la Agencia:** S/. 998.75 PEN.
*   **Pago a Cuenta SUNAT RMT (1%):** S/. 32.87 PEN.
*   **Reserva de Regularización Anual RMT (10% de utilidad):** S/. 200.00 PEN.
*   **Pérdida Pasarelas (8.5%):** S/. 279.37 PEN.
*   **Facturación Bruta Requerida:** **S/. 3,510.99 PEN/mes** *(Equivalente a $936.26 USD/mes)*.

### Meta 2: Sueldo Neto de S/. 5,000.00 PEN/mes
*   **Sueldo Neto de Alberto:** S/. 5,000.00 PEN.
*   **Overhead de la Agencia:** S/. 998.75 PEN.
*   **Pago a Cuenta SUNAT RMT (1%):** S/. 66.20 PEN.
*   **Reserva de Regularización Anual RMT (10% de utilidad):** S/. 500.00 PEN.
*   **Pérdida Pasarelas (8.5%):** S/. 562.70 PEN.
*   **Facturación Bruta Requerida:** **S/. 7,127.65 PEN/mes** *(Equivalente a $1,900.71 USD/mes)*.

### Meta 3: Sueldo Neto de S/. 7,500.00 PEN/mes (Con 2 colaboradores Part-Time)
*   **Sueldo Neto de Alberto:** S/. 7,500.00 PEN.
*   **Overhead de la Agencia (Aumentado por licencias de equipo):** S/. 1,623.75 PEN.
*   **Nómina de Apoyo (Costo de Junior y QA Part-Time):** S/. 3,300.00 PEN.
*   **Pago a Cuenta SUNAT RMT (1%):** S/. 156.20 PEN.
*   **Reserva de Regularización Anual RMT (10% de utilidad):** S/. 750.00 PEN.
*   **Pérdida Pasarelas (8.5%):** S/. 1,327.70 PEN.
*   **Facturación Bruta Requerida:** **S/. 14,657.65 PEN/mes** *(Equivalente a $3,908.71 USD/mes)*.
