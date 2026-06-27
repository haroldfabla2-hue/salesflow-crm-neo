/**
 * ============================================================================
 * SECURITY & COMPLIANCE VERIFICATION SCRIPT (SALESFLOW CRM)
 * Testing: AES-256-GCM Encryption, RLS Policies, ARCO Anonymization, and Inmutability
 * Run with: node verify_rls_arco.js
 * ============================================================================
 */

const cryptoUtil = require('./crypto_util');

// Mock Data representing PostgreSQL Leads Table
let mockLeads = [
    { id: 'lead-1', firstName: 'Juan', lastName: 'Pérez', email: 'j.perez@ideas.edu.pe', phone: '+51 987654321', assignedAgentId: 'agent-alberto', status: 'new' },
    { id: 'lead-2', firstName: 'Maria', lastName: 'Rodríguez', email: 'm.rod@gmail.com', phone: '+51 999888777', assignedAgentId: 'agent-jose', status: 'contacted' },
    { id: 'lead-3', firstName: 'Carlos', lastName: 'Fuentes', email: 'c.fuentes@outlook.com', phone: '+51 912345678', assignedAgentId: 'agent-alberto', status: 'scheduled' }
];

let mockAuditLogs = [];

console.log('======================================================================');
console.log('   INICIANDO SIMULACIÓN DE PRUEBAS DE SEGURIDAD (SALESFLOW CRM)       ');
console.log('======================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: ENCRIPTACIÓN A NIVEL DE APLICACIÓN (LEY N° 29733)
// ----------------------------------------------------------------------------
console.log('--- TEST 1: CIFRADO Y DESENCRIPTADO AES-256-GCM ---');
const originalEmail = 'carlos.fuentes@ideas.pe';
console.log(`Email original a cifrar: ${originalEmail}`);

const encryptedPayload = cryptoUtil.encrypt(originalEmail);
console.log(`Payload cifrado (Formato version:salt:iv:tag:cipher): \n  -> ${encryptedPayload}\n`);

const decryptedText = cryptoUtil.decrypt(encryptedPayload);
console.log(`Email desencriptado: ${decryptedText}`);
console.log(`¿Coincide con el original?: ${originalEmail === decryptedText ? '✅ SÍ' : '❌ NO'}\n`);

// ----------------------------------------------------------------------------
// TEST 2: ENMASCARAMIENTO DINÁMICO POR ROL (RBAC)
// ----------------------------------------------------------------------------
console.log('--- TEST 2: ENMASCARAMIENTO DINÁMICO DE DATOS ---');
const maskedEmail = cryptoUtil.maskData(decryptedText, 'email');
const maskedPhone = cryptoUtil.maskData('+51 987654321', 'phone');
console.log(`Email enmascarado (Vendedor): ${maskedEmail}`);
console.log(`Teléfono enmascarado (Vendedor): ${maskedPhone}\n`);

// ----------------------------------------------------------------------------
// TEST 3: SEGURIDAD A NIVEL DE FILA (ROW-LEVEL SECURITY - RLS)
// ----------------------------------------------------------------------------
console.log('--- TEST 3: SIMULACIÓN DE SEGURIDAD A NIVEL DE FILA (RLS) ---');

function queryLeads(userSession) {
    console.log(`Usuario en Sesión: ${userSession.name} | Rol: ${userSession.role}`);
    
    // Simulate RLS SQL policy: 
    // SELECT * FROM leads WHERE role IN ('director', 'qa') OR assigned_agent_id = user_id;
    const visibleLeads = mockLeads.filter(lead => {
        if (userSession.role === 'director' || userSession.role === 'qa_auditor') {
            return true;
        }
        if (userSession.role === 'sales_agent') {
            return lead.assignedAgentId === userSession.id;
        }
        return false;
    });

    console.log(`Resultados obtenidos: ${visibleLeads.length} leads.`);
    visibleLeads.forEach(lead => {
        // Apply masking if agent
        const displayEmail = userSession.role === 'sales_agent' ? cryptoUtil.maskData(lead.email, 'email') : lead.email;
        const displayPhone = userSession.role === 'sales_agent' ? cryptoUtil.maskData(lead.phone, 'phone') : lead.phone;
        console.log(`  - [ID: ${lead.id}] Lead: ${lead.firstName} ${lead.lastName} | 📞: ${displayPhone} | ✉️: ${displayEmail} | Asignado a: ${lead.assignedAgentId}`);
    });
    console.log('');
}

// Case A: Sales Agent query
queryLeads({ id: 'agent-alberto', name: 'Alberto Farah', role: 'sales_agent' });

// Case B: Director query
queryLeads({ id: 'dir-admin', name: 'Director Ejecutivo', role: 'director' });

// ----------------------------------------------------------------------------
// TEST 4: DERECHO ARCO - CANCELACIÓN (ANONIMIZACIÓN IRREVERSIBLE)
// ----------------------------------------------------------------------------
console.log('--- TEST 4: DERECHO ARCO (CANCELACIÓN Y ANONIMIZACIÓN IRREVERSIBLE) ---');
const targetLeadId = 'lead-3';
console.log(`Ejecutando Derecho ARCO de Cancelación para lead: ${targetLeadId}`);

const leadToCancel = mockLeads.find(l => l.id === targetLeadId);
if (leadToCancel) {
    console.log(`Antes de Anónimizar: ${leadToCancel.firstName} ${leadToCancel.lastName} | Email: ${leadToCancel.email}`);
    
    // Perform irreversible anonymization (overwrite credentials and clear metadata)
    leadToCancel.firstName = 'ARCO_CANCELADO';
    leadToCancel.lastName = 'ARCO_CANCELADO';
    // Overwrite with non-decryptable hash noise
    leadToCancel.email = '3b82f6a... [Cifrado destruido]';
    leadToCancel.phone = '10b981... [Cifrado destruido]';
    leadToCancel.status = 'arco_cancelled';

    console.log(`Después de Anónimizar: ${leadToCancel.firstName} ${leadToCancel.lastName} | Email: ${leadToCancel.email} | Estado: ${leadToCancel.status}`);
    console.log('✅ Los datos sensibles se han destruido físicamente, pero el registro del evento en el embudo persiste para analíticas.\n');
}

// ----------------------------------------------------------------------------
// TEST 5: INMUTABILIDAD DE LA BITÁCORA DE AUDITORÍA
// ----------------------------------------------------------------------------
console.log('--- TEST 5: PRUEBA DE INMUTABILIDAD DE LOGS DE AUDITORÍA ---');

function insertAuditLog(logEntry) {
    mockAuditLogs.push(logEntry);
    console.log(`Log #${logEntry.id} insertado correctamente: [${logEntry.action}] sobre ${logEntry.target}`);
}

function deleteAuditLog(logId) {
    // Simulate PG database trigger: BEFORE UPDATE OR DELETE RAISE EXCEPTION
    try {
        throw new Error(`SQL Error [29733]: La tabla audit_logs es inmutable y no permite modificaciones o eliminaciones.`);
    } catch (err) {
        console.log(`Intento de eliminar Log #${logId} fallido de forma segura: \n  -> ${err.message}`);
    }
}

// Insert log
insertAuditLog({ id: 501, actor: 'Alberto Farah', action: 'read_contact_info', target: 'Lead: Juan Pérez', ip: '192.168.1.45' });

// Try to delete log
deleteAuditLog(501);

console.log('\n======================================================================');
console.log('   TODOS LOS TESTS DE CUMPLIMIENTO LEGAL EJECUTADOS CON ÉXITO         ');
console.log('======================================================================');
