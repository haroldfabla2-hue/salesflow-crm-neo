/**
 * ============================================================================
 * RESILIENT LOCAL DATABASE FALLBACK FOR SALESFLOW CRM (PRACTICAL B2B GRADE)
 * Purpose: Simulates PostgreSQL queries and RLS filtering using JSON persistence.
 * Guarantees that the app runs out-of-the-box (zero configuration) if PG is offline.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cryptoUtil = require('./crypto_util');

const DB_FILE = path.join(__dirname, 'salesflow_local.json');

class LocalDbManager {
    constructor() {
        this.data = {
            settings: [],
            users: [],
            consent_logs: [],
            leads: [],
            calls_and_interactions: [],
            audit_logs: [],
            omni_conversations: [],
            omni_messages: []
        };
    }

    async init() {
        if (fs.existsSync(DB_FILE)) {
            try {
                const loaded = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                this.data = {
                    settings: loaded.settings || [],
                    users: loaded.users || [],
                    consent_logs: loaded.consent_logs || [],
                    leads: loaded.leads || [],
                    calls_and_interactions: loaded.calls_and_interactions || [],
                    audit_logs: loaded.audit_logs || [],
                    omni_conversations: loaded.omni_conversations || [],
                    omni_messages: loaded.omni_messages || []
                };
                console.log('✅ Base de datos local cargada desde salesflow_local.json');
                return;
            } catch (e) {
                console.warn('⚠️ Base de datos local corrupta. Re-inicializando...');
            }
        }
        await this.seed();
    }

    save() {
        fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    }

    async seed() {
        console.log('Sembrando base de datos local de respaldo...');
        
        // 1. Settings
        this.data.settings = [{
            id: 'set-1',
            business_name: 'Ideas Campus',
            tax_id: '20123456789',
            business_rules: { funnel_stages: ["new", "contacted", "scheduled", "enrolled", "lost"] }
        }];

        // 2. Users (Bcrypt hashed)
        const salt = bcrypt.genSaltSync(10);
        this.data.users = [
            { id: 'usr-1', name: 'Director Ejecutivo', email: 'director@ideas.pe', password_hash: bcrypt.hashSync('director123', salt), role: 'director', is_active: true },
            { id: 'usr-2', name: 'Jefe de Ventas', email: 'leader@ideas.pe', password_hash: bcrypt.hashSync('leader123', salt), role: 'team_leader', is_active: true, team_id: 'team-sales' },
            { id: 'usr-3', name: 'Alberto Farah', email: 'agent@ideas.pe', password_hash: bcrypt.hashSync('agent123', salt), role: 'sales_agent', is_active: true, team_id: 'team-sales' },
            { id: 'usr-4', name: 'Auditor QA', email: 'qa@ideas.pe', password_hash: bcrypt.hashSync('qa123', salt), role: 'qa_auditor', is_active: true }
        ];

        // 3. Consent
        this.data.consent_logs = [{
            id: 'con-1',
            ip_address: '200.48.56.12',
            device_id: 'Mozilla/5.0 (Windows NT 10.0)',
            terms_version_hash: '8b5cf6a83022_privacy_policy_v1',
            accepted_at: new Date().toISOString()
        }];

        // 4. Leads (Encrypted AES-256-GCM)
        const leadsRaw = [
            { id: 'lead-1', first: 'Juan', last: 'Pérez', email: 'j.perez@ideas.edu.pe', phone: '+51 987654321', status: 'new', agentId: 'usr-3' },
            { id: 'lead-2', first: 'Maria', last: 'Rodríguez', email: 'm.rod@gmail.com', phone: '+51 999888777', status: 'contacted', agentId: 'usr-2' },
            { id: 'lead-3', first: 'Carlos', last: 'Fuentes', email: 'c.fuentes@outlook.com', phone: '+51 912345678', status: 'scheduled', agentId: 'usr-3' },
            { id: 'lead-4', first: 'Ana', last: 'Gómez', email: 'ana.gomez@gmail.com', phone: '+51 933221100', status: 'enrolled', agentId: 'usr-2' }
        ];

        this.data.leads = leadsRaw.map(l => ({
            id: l.id,
            first_name: l.first,
            last_name: l.last,
            encrypted_email: cryptoUtil.encrypt(l.email),
            encrypted_phone: cryptoUtil.encrypt(l.phone),
            status: l.status,
            assigned_agent_id: l.agentId,
            consent_log_id: 'con-1',
            created_at: new Date().toISOString()
        }));

        // 5. Calls & Interactions
        this.data.calls_and_interactions = [
            { id: 'call-1', lead_id: 'lead-1', agent_id: 'usr-3', interaction_type: 'call', duration_seconds: 125, audio_recording_url: 'demo.mp3', transcript_text: 'Hola, buenas tardes, llamo de Ideas Campus...', qa_score: 92, qa_evaluation_details: { chkSaludo: true, chkLey: true, chkObj: true }, created_at: new Date().toISOString() },
            { id: 'call-2', lead_id: 'lead-2', agent_id: 'usr-2', interaction_type: 'call', duration_seconds: 84, audio_recording_url: 'demo2.mp3', transcript_text: 'Sí, estoy interesada en el curso de automatización...', qa_score: null, qa_evaluation_details: {}, created_at: new Date().toISOString() },
            { id: 'call-3', lead_id: 'lead-3', agent_id: 'usr-3', interaction_type: 'call', duration_seconds: 210, audio_recording_url: 'demo3.mp3', transcript_text: 'De acuerdo, agendemos la presentación para mañana...', qa_score: null, qa_evaluation_details: {}, created_at: new Date().toISOString() }
        ];

        this.save();
        console.log('✅ Base de datos local sembrada exitosamente.');
    }

    async query(text, params = []) {
        const sql = text.trim().toLowerCase();

        // 1. SELECT FROM users (Login check)
        if (sql.startsWith('select * from users where email = $1')) {
            const user = this.data.users.find(u => u.email === params[0] && u.is_active);
            return { rows: user ? [user] : [] };
        }

        // 2. INSERT INTO audit_logs (Immutable logs)
        if (sql.startsWith('insert into audit_logs')) {
            const newLog = {
                id: this.data.audit_logs.length + 101,
                actor_user_id: params[0],
                action: params[1],
                target_entity: params[2],
                target_id: params[3],
                ip_address: params[4],
                delta_state: typeof params[5] === 'string' ? JSON.parse(params[5]) : params[5],
                created_at: new Date()
            };
            this.data.audit_logs.unshift(newLog);
            this.save();
            return { rows: [newLog] };
        }

        // 3. SELECT FROM audit_logs
        if (sql.startsWith('select a.id, u.name as actor_name')) {
            const logs = this.data.audit_logs.map(l => {
                const user = this.data.users.find(u => u.id === l.actor_user_id);
                return {
                    id: l.id,
                    actor_name: user ? user.name : 'System',
                    actor_role: user ? user.role : 'system',
                    action: l.action,
                    target_entity: l.target_entity,
                    target_id: l.target_id,
                    ip_address: l.ip_address,
                    delta_state: l.delta_state,
                    created_at: l.created_at
                };
            });
            return { rows: logs };
        }

        // 4. SELECT FROM settings
        if (sql.includes('from settings')) {
            return { rows: this.data.settings };
        }

        // 5. INSERT INTO consent_logs
        if (sql.startsWith('insert into consent_logs')) {
            const newConsent = {
                id: 'con-' + (this.data.consent_logs.length + 1),
                ip_address: params[0],
                device_id: params[1],
                terms_version_hash: params[2],
                accepted_at: new Date().toISOString()
            };
            this.data.consent_logs.push(newConsent);
            this.save();
            return { rows: [newConsent] };
        }

        // 6. INSERT INTO leads
        if (sql.startsWith('insert into leads')) {
            const newLead = {
                id: 'lead-' + (this.data.leads.length + 1),
                first_name: params[0],
                last_name: params[1],
                encrypted_email: params[2],
                encrypted_phone: params[3],
                status: params[4] || 'new',
                assigned_agent_id: params[5],
                consent_log_id: params[6],
                created_at: new Date()
            };
            this.data.leads.push(newLead);
            this.save();
            return { rows: [newLead] };
        }

        // 7. SELECT FROM calls_and_interactions
        if (sql.startsWith('select c.id, c.lead_id')) {
            const calls = this.data.calls_and_interactions.map(c => {
                const lead = this.data.leads.find(l => l.id === c.lead_id);
                const agent = this.data.users.find(u => u.id === c.agent_id);
                return {
                    id: c.id,
                    lead_id: c.lead_id,
                    first_name: lead ? lead.first_name : 'ARCO',
                    last_name: lead ? lead.last_name : 'CANCELADO',
                    agent_id: c.agent_id,
                    agent_name: agent ? agent.name : 'Unknown',
                    interaction_type: c.interaction_type,
                    duration_seconds: c.duration_seconds,
                    audio_recording_url: c.audio_recording_url,
                    transcript_text: c.transcript_text,
                    qa_score: c.qa_score,
                    qa_evaluation_details: c.qa_evaluation_details,
                    created_at: new Date(c.created_at)
                };
            });
            return { rows: calls };
        }

        // 8. UPDATE calls_and_interactions (QA Evaluation)
        if (sql.startsWith('update calls_and_interactions')) {
            const call = this.data.calls_and_interactions.find(c => c.id === params[2]);
            if (call) {
                call.qa_score = params[0];
                call.qa_evaluation_details = typeof params[1] === 'string' ? JSON.parse(params[1]) : params[1];
                this.save();
                return { rows: [{ lead_id: call.lead_id }] };
            }
            return { rows: [] };
        }

        // 9. INSERT INTO calls_and_interactions
        if (sql.startsWith('insert into calls_and_interactions')) {
            const newCall = {
                id: 'call-' + (this.data.calls_and_interactions.length + 1),
                lead_id: params[0],
                agent_id: params[1],
                interaction_type: 'call',
                duration_seconds: params[3],
                audio_recording_url: params[4],
                transcript_text: params[5],
                qa_score: null,
                qa_evaluation_details: {},
                created_at: new Date().toISOString()
            };
            this.data.calls_and_interactions.push(newCall);
            this.save();
            return { rows: [newCall] };
        }

        // 10. SELECT leads (generic query mapper)
        if (sql.includes('from leads') && !sql.includes('from leads l')) {
            if (sql.includes('where id = $1')) {
                const lead = this.data.leads.find(l => l.id === params[0]);
                return { rows: lead ? [lead] : [] };
            }
            if (sql === 'select status from leads') {
                return { rows: this.data.leads.map(l => ({ status: l.status })) };
            }
            return { rows: this.data.leads };
        }

        // 11. ARCO procedure simulator
        if (sql.includes('select arco_cancel_lead_procedure')) {
            const leadId = params[0];
            const lead = this.data.leads.find(l => l.id === leadId);
            if (lead && lead.status !== 'arco_cancelled') {
                lead.first_name = 'ARCO_CANCELADO';
                lead.last_name = 'ARCO_CANCELADO';
                lead.encrypted_email = 'arco_anonymized_noise';
                lead.encrypted_phone = 'arco_anonymized_noise';
                lead.status = 'arco_cancelled';
                
                // Clear audio URLs for this lead
                this.data.calls_and_interactions.forEach(c => {
                    if (c.lead_id === leadId) {
                        c.audio_recording_url = null;
                        c.transcript_text = '[DATOS BORRADOS POR DERECHO ARCO CANCELACION]';
                    }
                });

                // Insert audit log
                const newLog = {
                    id: this.data.audit_logs.length + 101,
                    actor_user_id: params[1],
                    action: 'arco_anonymize',
                    target_entity: 'leads',
                    target_id: leadId,
                    ip_address: params[2],
                    delta_state: { lead_id: leadId, status: 'arco_cancelled' },
                    created_at: new Date()
                };
                this.data.audit_logs.unshift(newLog);
                
                this.save();
                return { rows: [{ success: true }] };
            }
            return { rows: [{ success: false }] };
        }

        // 12. SELECT FROM omni_conversations
        if (sql.includes('from omni_conversations')) {
            if (sql.includes('where lead_id = $1')) {
                const convs = this.data.omni_conversations.filter(c => c.lead_id === params[0]);
                return { rows: convs };
            }
            if (sql.includes('where id = $1')) {
                const convs = this.data.omni_conversations.filter(c => c.id === params[0]);
                return { rows: convs };
            }
            return { rows: this.data.omni_conversations };
        }

        // 13. SELECT FROM omni_messages
        if (sql.includes('from omni_messages')) {
            if (sql.includes('where conversation_id = $1')) {
                const msgs = this.data.omni_messages.filter(m => m.conversation_id === params[0]);
                msgs.sort((a, b) => a.id.localeCompare(b.id));
                return { rows: msgs };
            }
            return { rows: this.data.omni_messages };
        }

        // 14. INSERT INTO omni_conversations
        if (sql.startsWith('insert into omni_conversations')) {
            const newConv = {
                id: params[0],
                lead_id: params[1],
                channel_type: params[2] || 'whatsapp',
                is_active: true,
                last_message_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            };
            this.data.omni_conversations.push(newConv);
            this.save();
            return { rows: [newConv] };
        }

        // 15. INSERT INTO omni_messages
        if (sql.startsWith('insert into omni_messages')) {
            const newMsg = {
                id: params[0],
                conversation_id: params[1],
                sender_type: params[2],
                payload: typeof params[3] === 'string' ? JSON.parse(params[3]) : params[3],
                delivery_status: params[4] || 'sent',
                created_at: new Date().toISOString()
            };
            this.data.omni_messages.push(newMsg);
            this.save();
            return { rows: [newMsg] };
        }

        // 16. UPDATE omni_conversations
        if (sql.startsWith('update omni_conversations')) {
            const conv = this.data.omni_conversations.find(c => c.id === params[1]);
            if (conv) {
                conv.last_message_at = params[0] || new Date().toISOString();
                this.save();
                return { rows: [conv] };
            }
            return { rows: [] };
        }

        return { rows: [] };
    }

    async queryWithSession(text, params = [], session) {
        const sql = text.trim().toLowerCase();

        // SELECT FROM leads with RLS simulation
        if (sql.includes('from leads l')) {
            let filteredLeads = this.data.leads;
            
            // Apply RLS filter rules!
            if (session.role === 'sales_agent') {
                // RLS: Sales agent only sees leads assigned to them!
                filteredLeads = this.data.leads.filter(l => l.assigned_agent_id === session.id);
            } else if (session.role === 'team_leader') {
                // RLS: Team Leader sees their team leads
                const teamAgentIds = this.data.users
                    .filter(u => u.team_id === 'team-sales')
                    .map(u => u.id);
                filteredLeads = this.data.leads.filter(l => teamAgentIds.includes(l.assigned_agent_id));
            }

            const rows = filteredLeads.map(l => {
                const agent = this.data.users.find(u => u.id === l.assigned_agent_id);
                return {
                    id: l.id,
                    first_name: l.first_name,
                    last_name: l.last_name,
                    encrypted_email: l.encrypted_email,
                    encrypted_phone: l.encrypted_phone,
                    status: l.status,
                    assigned_agent_id: l.assigned_agent_id,
                    agent_name: agent ? agent.name : null,
                    created_at: new Date(l.created_at)
                };
            });
            return { rows };
        }

        // UPDATE leads
        if (sql.startsWith('update leads')) {
            const lead = this.data.leads.find(l => l.id === params[2]);
            if (lead) {
                // Apply update parameters
                if (params[0] !== undefined) lead.status = params[0];
                if (params[1] !== undefined) lead.assigned_agent_id = params[1];
                lead.updated_at = new Date().toISOString();
                this.save();
                return { rows: [lead] };
            }
            return { rows: [] };
        }

        // SELECT FROM omni_conversations with RLS simulation inherited from leads
        if (sql.includes('from omni_conversations')) {
            let allowedLeadIds = [];
            if (session.role === 'sales_agent') {
                allowedLeadIds = this.data.leads.filter(l => l.assigned_agent_id === session.id).map(l => l.id);
            } else if (session.role === 'team_leader') {
                const teamAgentIds = this.data.users.filter(u => u.team_id === 'team-sales').map(u => u.id);
                allowedLeadIds = this.data.leads.filter(l => teamAgentIds.includes(l.assigned_agent_id)).map(l => l.id);
            } else {
                allowedLeadIds = this.data.leads.map(l => l.id); // Directors & QA see all
            }

            let filteredConvs = this.data.omni_conversations.filter(c => allowedLeadIds.includes(c.lead_id));
            if (sql.includes('where lead_id = $1')) {
                filteredConvs = filteredConvs.filter(c => c.lead_id === params[0]);
            }
            if (sql.includes('where id = $1')) {
                filteredConvs = filteredConvs.filter(c => c.id === params[0]);
            }
            return { rows: filteredConvs };
        }

        // SELECT FROM omni_messages with RLS simulation inherited from conversations
        if (sql.includes('from omni_messages')) {
            let allowedLeadIds = [];
            if (session.role === 'sales_agent') {
                allowedLeadIds = this.data.leads.filter(l => l.assigned_agent_id === session.id).map(l => l.id);
            } else if (session.role === 'team_leader') {
                const teamAgentIds = this.data.users.filter(u => u.team_id === 'team-sales').map(u => u.id);
                allowedLeadIds = this.data.leads.filter(l => teamAgentIds.includes(l.assigned_agent_id)).map(l => l.id);
            } else {
                allowedLeadIds = this.data.leads.map(l => l.id);
            }
            const allowedConvIds = this.data.omni_conversations.filter(c => allowedLeadIds.includes(c.lead_id)).map(c => c.id);

            let filteredMsgs = this.data.omni_messages.filter(m => allowedConvIds.includes(m.conversation_id));
            if (sql.includes('where conversation_id = $1')) {
                filteredMsgs = filteredMsgs.filter(m => m.conversation_id === params[0]);
            }
            filteredMsgs.sort((a, b) => a.id.localeCompare(b.id));
            return { rows: filteredMsgs };
        }

        return this.query(text, params);
    }
}

module.exports = LocalDbManager;
