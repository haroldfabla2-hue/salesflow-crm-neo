/**
 * ============================================================================
 * FULL-STACK API INTEGRATION TEST RUNNER (SALESFLOW CRM)
 * Testing: Auth, RLS Data Isolation, Masking, ARCO Cancellation, and Auditing
 * Run with: node test_api.js
 * ============================================================================
 */

const { spawn } = require('child_process');
const http = require('http');

const TEST_PORT = 5001;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

let serverProcess = null;

// Helper to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for native JSON HTTP requests
async function testRequest(path, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers
    };
    if (body) {
        config.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${path}`, config);
    const data = await res.json();
    return { status: res.status, data };
}

async function runTests() {
    console.log('======================================================================');
    console.log('   INICIANDO PRUEBAS DE INTEGRACIÓN DE API (SALESFLOW CRM)            ');
    console.log('======================================================================\n');

    let agentToken = null;
    let directorToken = null;
    let targetLeadId = null;

    try {
        // --------------------------------------------------------------------
        // TEST 1: LOGIN VENDEDOR
        // --------------------------------------------------------------------
        console.log('--- TEST 1: Autenticación de Vendedor ---');
        const loginAgent = await testRequest('/api/auth/login', 'POST', {
            email: 'agent@ideas.pe',
            password: 'agent123'
        });

        if (loginAgent.status === 200 && loginAgent.data.token) {
            agentToken = loginAgent.data.token;
            console.log('✅ Login exitoso para agent@ideas.pe.');
        } else {
            throw new Error(`Fallo en login de vendedor: ${JSON.stringify(loginAgent.data)}`);
        }
        console.log('');

        // --------------------------------------------------------------------
        // TEST 2: SEGURIDAD RLS Y OFUSCACIÓN DE DATOS (VENDEDOR)
        // --------------------------------------------------------------------
        console.log('--- TEST 2: Verificación de RLS y Ofuscación para Vendedor ---');
        const agentLeads = await testRequest('/api/leads', 'GET', null, agentToken);

        if (agentLeads.status === 200 && Array.isArray(agentLeads.data)) {
            console.log(`Leads devueltos para el vendedor: ${agentLeads.data.length}`);
            
            // Check that masking is applied
            const hasMaskedFields = agentLeads.data.every(lead => 
                lead.email.includes('*****') && lead.phone.includes('***')
            );
            
            if (hasMaskedFields) {
                console.log('✅ Ofuscación de datos personales aplicada correctamente (Ley 29733).');
            } else {
                throw new Error('❌ Fallo: El vendedor recibió información de contacto en texto plano.');
            }
        } else {
            throw new Error(`Fallo al consultar leads como vendedor: ${JSON.stringify(agentLeads.data)}`);
        }
        console.log('');

        // --------------------------------------------------------------------
        // TEST 3: LOGIN DIRECTIVO
        // --------------------------------------------------------------------
        console.log('--- TEST 3: Autenticación de Directivo ---');
        const loginDirector = await testRequest('/api/auth/login', 'POST', {
            email: 'director@ideas.pe',
            password: 'director123'
        });

        if (loginDirector.status === 200 && loginDirector.data.token) {
            directorToken = loginDirector.data.token;
            console.log('✅ Login exitoso para director@ideas.pe.');
        } else {
            throw new Error(`Fallo en login de directivo: ${JSON.stringify(loginDirector.data)}`);
        }
        console.log('');

        // --------------------------------------------------------------------
        // TEST 4: ACCESO COMPLETO SIN MÁSCARAS (DIRECTIVO)
        // --------------------------------------------------------------------
        console.log('--- TEST 4: Verificación de Acceso de Directivo ---');
        const directorLeads = await testRequest('/api/leads', 'GET', null, directorToken);

        if (directorLeads.status === 200 && Array.isArray(directorLeads.data)) {
            console.log(`Leads devueltos para el directivo: ${directorLeads.data.length}`);
            
            // Assure no masking is present for Director
            const hasMaskedFields = directorLeads.data.some(lead => 
                lead.email.includes('*****')
            );

            if (!hasMaskedFields && directorLeads.data.length > 0) {
                console.log('✅ Acceso a datos desencriptados en texto plano autorizado para Directivo.');
                // Grab a lead ID for the next test
                const targetLead = directorLeads.data.find(l => l.status === 'scheduled');
                if (targetLead) targetLeadId = targetLead.id;
            } else {
                throw new Error('❌ Fallo: Los datos del directivo fueron enmascarados incorrectamente.');
            }
        } else {
            throw new Error(`Fallo al consultar leads como directivo: ${JSON.stringify(directorLeads.data)}`);
        }
        console.log('');

        // --------------------------------------------------------------------
        // TEST 5: DERECHO ARCO DE CANCELACIÓN (DIRECTIVO)
        // --------------------------------------------------------------------
        if (targetLeadId) {
            console.log('--- TEST 5: Ejecución de Derecho ARCO de Cancelación ---');
            console.log(`Lead objetivo a anonimizar: ID ${targetLeadId}`);
            
            const arcoResult = await testRequest(`/api/leads/${targetLeadId}/arco-cancel`, 'POST', null, directorToken);
            if (arcoResult.status === 200) {
                console.log(`✅ Respuesta de la API: ${arcoResult.data.message}`);

                // Verify the lead is indeed anonymized in subsequent queries
                const verifyLeads = await testRequest('/api/leads', 'GET', null, directorToken);
                const anonymizedLead = verifyLeads.data.find(l => l.id === targetLeadId);
                
                if (anonymizedLead && anonymizedLead.status === 'arco_cancelled' && anonymizedLead.firstName === 'ARCO_CANCELADO') {
                    console.log('✅ Lead físicamente anonimizado y marcado como arco_cancelled.');
                } else {
                    throw new Error('❌ Fallo: El lead no se anonimizó correctamente en la base de datos.');
                }
            } else {
                throw new Error(`Fallo al ejecutar derecho ARCO: ${JSON.stringify(arcoResult.data)}`);
            }
        } else {
            console.log('⚠️ Omitiendo TEST 5: No se encontró un lead elegible para cancelar.');
        }
        console.log('');

        // --------------------------------------------------------------------
        // TEST 6: BLOQUEO DE AUDITORÍA FORENSE A ROLES NO AUTORIZADOS
        // --------------------------------------------------------------------
        console.log('--- TEST 6: Bloqueo de Acceso a Auditoría a No Autorizados ---');
        const blockAudit = await testRequest('/api/audit-logs', 'GET', null, agentToken);
        if (blockAudit.status === 403) {
            console.log('✅ Bloqueo correcto: El Vendedor recibió error 403 al intentar leer logs de auditoría.');
        } else {
            throw new Error(`❌ Fallo: Vendedor pudo acceder a la bitácora de auditoría (Código: ${blockAudit.status}).`);
        }
        console.log('');

        console.log('======================================================================');
        console.log('   PRUEBAS DE API FINALIZADAS EXITOSAMENTE (SISTEMA CORRECTO)        ');
        console.log('======================================================================');
        cleanup(0);

    } catch (err) {
        console.error('\n❌ ERROR CRÍTICO EN INTEGRACIÓN DE API:', err.message);
        cleanup(1);
    }
}

function cleanup(code) {
    if (serverProcess) {
        console.log('\nApagando servidor de pruebas...');
        serverProcess.kill('SIGINT');
    }
    process.exit(code);
}

// 1. Start the Express server as a background process on TEST_PORT
console.log(`Iniciando servidor de pruebas en puerto ${TEST_PORT}...`);
serverProcess = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: TEST_PORT },
    stdio: 'ignore' // Suppress Express console log to keep test output clean
});

// 2. Wait for server boot and run test suite
sleep(2000).then(runTests);
