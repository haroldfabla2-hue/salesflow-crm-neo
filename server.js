/**
 * ============================================================================
 * EXTREMELY ROBUST EXPRESS SERVER FOR SALESFLOW CRM (PRODUCTION READY)
 * Compliance: Ley N° 29733 (Privacy & Security by Design)
 * Tech Stack: Express, JWT, Bcrypt, Postgres (RLS & pgvector)
 * ============================================================================
 */

const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');
const cryptoUtil = require('./crypto_util');
const ingestionUtil = require('./ingestion_util');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_sign_key_change_in_production_2026';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------------------------------
// MIDDLEWARES
// ----------------------------------------------------------------------------

/**
 * Validates JWT authorization header and injects session data in request.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token de sesión requerido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado.' });
        }
        req.user = user; // { id: UUID, role: string, name: string }
        next();
    });
}

/**
 * Restricts route access to specific roles.
 * @param {Array} roles Allowed roles
 */
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'No tienes permisos suficientes para realizar esta acción.' });
        }
        next();
    };
}

// ----------------------------------------------------------------------------
// ROUTES: AUTHENTICATION
// ----------------------------------------------------------------------------

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos.' });
    }

    try {
        const userRes = await db.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
        if (userRes.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        const user = userRes.rows[0];
        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Audit login
        await db.query(
            `INSERT INTO audit_logs (actor_user_id, action, target_entity, target_id, ip_address, delta_state) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [user.id, 'login', 'users', user.id, req.ip, JSON.stringify({ role: user.role })]
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ----------------------------------------------------------------------------
// ROUTES: LEADS (RLS PROTECTED & ENCRYPTED)
// ----------------------------------------------------------------------------

app.get('/api/leads', authenticateToken, async (req, res) => {
    try {
        // Query utilizing RLS session parameter
        const leadsRes = await db.queryWithSession(
            `SELECT l.id, l.first_name, l.last_name, l.encrypted_email, l.encrypted_phone, l.status, l.assigned_agent_id, u.name as agent_name, l.created_at 
             FROM leads l 
             LEFT JOIN users u ON l.assigned_agent_id = u.id 
             ORDER BY l.created_at DESC`,
            [],
            req.user
        );

        // Decrypt and optionally mask contact fields based on user role
        const decryptedLeads = leadsRes.rows.map(lead => {
            let email = 'N/A';
            let phone = 'N/A';
            
            try {
                // Decrypt AES-256-GCM
                const rawEmail = cryptoUtil.decrypt(lead.encrypted_email);
                const rawPhone = cryptoUtil.decrypt(lead.encrypted_phone);
                
                // Mask if active role is sales agent (data masking at application layer)
                if (req.user.role === 'sales_agent') {
                    email = cryptoUtil.maskData(rawEmail, 'email');
                    phone = cryptoUtil.maskData(rawPhone, 'phone');
                } else {
                    email = rawEmail;
                    phone = rawPhone;
                }
            } catch (decErr) {
                console.error(`Error decrypting lead ${lead.id}:`, decErr.message);
                email = '[Cifrado Corrupto o Destruido]';
                phone = '[Cifrado Corrupto o Destruido]';
            }

            return {
                id: lead.id,
                firstName: lead.first_name,
                lastName: lead.last_name,
                email,
                phone,
                status: lead.status,
                agentId: lead.assigned_agent_id,
                agentName: lead.agent_name || 'Sin Asignar',
                date: lead.created_at.toISOString().split('T')[0]
            };
        });

        // Audit the read action
        await db.query(
            `INSERT INTO audit_logs (actor_user_id, action, target_entity, target_id, ip_address, delta_state) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                req.user.id,
                'read_contact_info',
                'leads',
                null,
                req.ip,
                JSON.stringify({ 
                    retrieved_count: decryptedLeads.length, 
                    masking_applied: req.user.role === 'sales_agent' 
                })
            ]
        );

        res.json(decryptedLeads);

    } catch (err) {
        console.error('Error fetching leads:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/leads', authenticateToken, requireRole(['director', 'team_leader']), async (req, res) => {
    const { firstName, lastName, email, phone, status, assignedAgentId } = req.body;

    if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    try {
        // Create a simulated consent log to respect Law 29733
        const consentRes = await db.query(
            `INSERT INTO consent_logs (ip_address, device_id, terms_version_hash) 
             VALUES ($1, $2, $3) RETURNING id`,
            [req.ip, req.headers['user-agent'] || 'Unknown Device', 'terms_v1_salesflow_active']
        );
        const consentId = consentRes.rows[0].id;

        // Encrypt fields using AES-256-GCM
        const encEmail = cryptoUtil.encrypt(email);
        const encPhone = cryptoUtil.encrypt(phone);

        const newLead = await db.query(
            `INSERT INTO leads (first_name, last_name, encrypted_email, encrypted_phone, status, assigned_agent_id, consent_log_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [firstName, lastName, encEmail, encPhone, status || 'new', assignedAgentId || null, consentId]
        );

        // Audit
        await db.query(
            `INSERT INTO audit_logs (actor_user_id, action, target_entity, target_id, ip_address, delta_state) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [req.user.id, 'update_lead_status', 'leads', newLead.rows[0].id, req.ip, JSON.stringify({ action: 'create_lead' })]
        );

        res.status(201).json({ id: newLead.rows[0].id, message: 'Lead creado con encriptación exitosa.' });

    } catch (err) {
        console.error('Error creating lead:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.put('/api/leads/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, assignedAgentId } = req.body;

    try {
        // Fetch old values for audit logging
        const oldLeadRes = await db.queryWithSession('SELECT status, assigned_agent_id FROM leads WHERE id = $1', [id], req.user);
        if (oldLeadRes.rows.length === 0) {
            return res.status(404).json({ error: 'Lead no encontrado o fuera de tu alcance RLS.' });
        }

        const oldLead = oldLeadRes.rows[0];

        // Execute update in session context
        await db.queryWithSession(
            `UPDATE leads 
             SET status = COALESCE($1, status), assigned_agent_id = COALESCE($2, assigned_agent_id), updated_at = CURRENT_TIMESTAMP 
             WHERE id = $3`,
            [status || null, assignedAgentId || null, id],
            req.user
        );

        // Audit update
        await db.query(
            `INSERT INTO audit_logs (actor_user_id, action, target_entity, target_id, ip_address, delta_state) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                req.user.id,
                'update_lead_status',
                'leads',
                id,
                req.ip,
                JSON.stringify({ 
                    old_status: oldLead.status, 
                    new_status: status || oldLead.status,
                    old_agent: oldLead.assigned_agent_id,
                    new_agent: assignedAgentId || oldLead.assigned_agent_id
                })
            ]
        );

        res.json({ message: 'Lead actualizado correctamente.' });

    } catch (err) {
        console.error('Error updating lead:', err);
        res.status(500).json({ error: 'Error interno del servidor o RLS block.' });
    }
});

// Law 29733: ARCO cancellation endpoint (calls the DB procedure)
app.post('/api/leads/:id/arco-cancel', authenticateToken, requireRole(['director']), async (req, res) => {
    const { id } = req.params;

    try {
        const cancelRes = await db.query(
            'SELECT arco_cancel_lead_procedure($1, $2, $3) as success',
            [id, req.user.id, req.ip]
        );

        if (cancelRes.rows[0].success) {
            res.json({ message: 'Derecho ARCO ejecutado. El lead ha sido anonimizado de forma irreversible.' });
        } else {
            res.status(400).json({ error: 'No se pudo anonimizar el lead. Quizá ya fue cancelado o no existe.' });
        }
    } catch (err) {
        console.error('Error en ARCO cancel:', err);
        res.status(500).json({ error: 'Error interno en servidor.' });
    }
});

// ----------------------------------------------------------------------------
// ROUTES: INTERACTIONS & QA
// ----------------------------------------------------------------------------

app.get('/api/interactions', authenticateToken, requireRole(['director', 'qa_auditor']), async (req, res) => {
    try {
        const callsRes = await db.query(
            `SELECT c.id, c.lead_id, l.first_name, l.last_name, c.agent_id, u.name as agent_name, c.interaction_type, c.duration_seconds, c.audio_recording_url, c.transcript_text, c.qa_score, c.qa_evaluation_details, c.created_at 
             FROM calls_and_interactions c
             JOIN leads l ON c.lead_id = l.id
             JOIN users u ON c.agent_id = u.id
             ORDER BY c.created_at DESC`
        );

        const calls = callsRes.rows.map(c => ({
            id: c.id,
            leadName: `${c.first_name} ${c.last_name}`,
            agentName: c.agent_name,
            duration: c.duration_seconds,
            audioUrl: c.audio_recording_url,
            transcript: c.transcript_text,
            score: c.qa_score,
            evaluated: c.qa_score !== null,
            rubric: c.qa_evaluation_details || {},
            date: c.created_at.toISOString().split('T')[0]
        }));

        res.json(calls);
    } catch (err) {
        console.error('Error fetching interactions:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/interactions/ingest', authenticateToken, async (req, res) => {
    const { payload, sourceType } = req.body;

    try {
        // Normalize using ingestion utility
        const normalized = ingestionUtil.normalizeCall(payload, sourceType);
        const qaEligibility = ingestionUtil.evaluateQAEligibility(normalized);

        const newCall = await db.query(
            `INSERT INTO calls_and_interactions (lead_id, agent_id, interaction_type, duration_seconds, audio_recording_url, transcript_text) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [
                normalized.lead_id,
                normalized.agent_id,
                'call',
                normalized.duration_seconds,
                normalized.audio_recording_url,
                normalized.transcript_text
            ]
        );

        res.status(201).json({
            id: newCall.rows[0].id,
            qa_eligible: qaEligibility.eligible,
            qa_reason: qaEligibility.reason,
            message: 'Llamada integrada exitosamente.'
        });

    } catch (err) {
        console.error('Error ingesting call:', err.message);
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/interactions/:id/qa-evaluate', authenticateToken, requireRole(['director', 'qa_auditor']), async (req, res) => {
    const { id } = req.params;
    const { score, evaluationDetails } = req.body;

    if (score === undefined || score < 0 || score > 100) {
        return res.status(400).json({ error: 'Puntuación QA inválida (debe estar entre 0 y 100).' });
    }

    try {
        const updateRes = await db.query(
            `UPDATE calls_and_interactions 
             SET qa_score = $1, qa_evaluation_details = $2 
             WHERE id = $3 RETURNING lead_id`,
            [score, JSON.stringify(evaluationDetails || {}), id]
        );

        if (updateRes.rows.length === 0) {
            return res.status(404).json({ error: 'Llamada no encontrada.' });
        }

        const leadId = updateRes.rows[0].lead_id;

        // Propagate score to lead primary record
        await db.query('UPDATE leads SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [leadId]);

        // Audit the evaluation
        await db.query(
            `INSERT INTO audit_logs (actor_user_id, action, target_entity, target_id, ip_address, delta_state) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                req.user.id,
                'update_lead_status',
                'calls_and_interactions',
                id,
                req.ip,
                JSON.stringify({ action: 'qa_evaluate', score })
            ]
        );

        res.json({ message: 'Evaluación QA registrada y auditada.' });

    } catch (err) {
        console.error('Error evaluating call:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ----------------------------------------------------------------------------
// ROUTES: AUDIT LOGS & METRICS
// ----------------------------------------------------------------------------

app.get('/api/audit-logs', authenticateToken, requireRole(['director']), async (req, res) => {
    try {
        const logsRes = await db.query(
            `SELECT a.id, u.name as actor_name, u.role as actor_role, a.action, a.target_entity, a.target_id, a.ip_address, a.delta_state, a.created_at 
             FROM audit_logs a
             LEFT JOIN users u ON a.actor_user_id = u.id
             ORDER BY a.created_at DESC LIMIT 100`
        );

        const logs = logsRes.rows.map(l => ({
            id: parseInt(l.id, 10),
            actor: l.actor_name || 'Sistema/Anónimo',
            role: l.actor_role || 'system',
            action: l.action,
            target: `${l.target_entity} [${l.target_id || 'N/A'}]`,
            ip: l.ip_address || '0.0.0.0',
            date: l.created_at.toTimeString().split(' ')[0],
            delta: l.delta_state ? JSON.stringify(l.delta_state) : 'Sin detalles'
        }));

        res.json(logs);
    } catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.get('/api/metrics', authenticateToken, requireRole(['director', 'team_leader']), async (req, res) => {
    try {
        const leadsRes = await db.query('SELECT status FROM leads');
        const counts = { new: 0, contacted: 0, scheduled: 0, enrolled: 0, lost: 0, arco_cancelled: 0 };
        
        leadsRes.rows.forEach(l => {
            if (counts[l.status] !== undefined) counts[l.status]++;
        });

        const totalLeads = leadsRes.rows.length;
        const wonCount = counts.enrolled;
        const conversionRate = totalLeads > 0 ? (wonCount / totalLeads * 100).toFixed(1) : 0;
        const totalIncome = wonCount * 2000; // S/. 2000 per enrollment average

        res.json({
            totalLeads,
            counts,
            conversionRate: `${conversionRate}%`,
            totalIncome: `S/. ${totalIncome.toLocaleString()} PEN`,
            cac: 'S/. 125.40 PEN',
            forecast: `S/. ${(totalLeads * 0.16 * 2000).toFixed(0)} PEN`
        });

    } catch (err) {
        console.error('Error loading metrics:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ----------------------------------------------------------------------------
// WEBSOCKETS & ASYNCHRONOUS QUEUES SETUP
// ----------------------------------------------------------------------------

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*", // En producción real, restringir a orígenes específicos
        methods: ["GET", "POST"]
    }
});

// Compartir la instancia de io globalmente en Express
app.set('io', io);

// Middleware de autenticación para WebSockets
io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
        return next(new Error('Acceso denegado. Token de autenticación de Socket requerido.'));
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return next(new Error('Token de Socket inválido o expirado.'));
        }
        socket.user = user;
        next();
    });
});

io.on('connection', (socket) => {
    console.log(`🔌 Asesor conectado a Socket.io: ${socket.user.name} (${socket.user.role})`);
    
    // Unir al asesor a salas privadas basadas en ID y en su Rol para difusión selectiva de eventos
    socket.join(`user:${socket.user.id}`);
    socket.join(`role:${socket.user.role}`);

    socket.on('disconnect', () => {
        console.log(`🔌 Asesor desconectado: ${socket.user.name}`);
    });
});

// Importar el gestor de colas y configurar un Worker de pruebas
const queueManager = require('./queue');

queueManager.registerWorker('whatsapp_ingestion_queue', async (job) => {
    console.log(`[Worker Ingesta] Procesando mensaje entrante de: ${job.data.from}`);
    // Aquí implementaremos el parseo real y WebSockets en el Sprint 2
    
    // Emitir confirmación en tiempo real al rol de ventas
    io.to('role:sales_agent').to('role:director').emit('new_message_alert', {
        from: job.data.from,
        preview: job.data.message
    });
});

// Ruta de prueba para verificar el funcionamiento de las colas y WebSockets
app.post('/api/test-queue', authenticateToken, async (req, res) => {
    const { from, message } = req.body;
    try {
        await queueManager.addJob('whatsapp_ingestion_queue', 'test_message_job', {
            from: from || 'Sistema de Pruebas',
            message: message || '¡Hola! Este es un mensaje asíncrono.'
        });
        res.json({ success: true, message: 'Trabajo encolado exitosamente.' });
    } catch (err) {
        console.error('Error encolando trabajo de prueba:', err);
        res.status(500).json({ error: 'Error al procesar la cola.' });
    }
});

// Fallback to static web client
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server (using http server instance instead of express app directly)
server.listen(PORT, () => {
    console.log(`======================================================================`);
    console.log(`   Servidor de SALESFLOW CRM corriendo en el puerto ${PORT}          `);
    console.log(`   Modo: Producción Real (WebSocket & BullMQ Habilitados)             `);
    console.log(`   Conexión Redis: ${queueManager.useRedis() ? 'ONLINE (BullMQ)' : 'OFFLINE (Fallback en Memoria)'} `);
    console.log(`======================================================================`);
});

