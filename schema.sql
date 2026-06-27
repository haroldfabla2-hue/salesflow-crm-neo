-- ============================================================================
-- SQL SCHEMA FOR SALESFLOW CRM (ENTERPRISE GRADE)
-- Database: PostgreSQL (with pgvector and uuid-ossp extensions)
-- Compliance: Ley N° 29733 (Protección de Datos Personales - Perú)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- 2. ENUMS DEFINITION
CREATE TYPE user_role AS ENUM ('director', 'team_leader', 'sales_agent', 'qa_auditor');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'scheduled', 'demo', 'enrolled', 'lost', 'arco_cancelled');
CREATE TYPE interaction_type AS ENUM ('call', 'whatsapp', 'email', 'meeting_notes');
CREATE TYPE audit_action AS ENUM ('read_contact_info', 'update_lead_status', 'export_database', 'login', 'arco_anonymize');

-- 3. TABLES DEFINITION

-- 3.1. SETTINGS TABLE (Tenant & Business Rules)
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) UNIQUE NOT NULL, -- RUC in Peru
    business_rules JSONB NOT NULL DEFAULT '{}'::jsonb, -- funnel stages, timeout thresholds
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.2. USERS TABLE (Operational Identities)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Argon2id hash
    role user_role NOT NULL DEFAULT 'sales_agent',
    team_id UUID, -- For Team Leader scope grouping
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.3. CONSENT LOGS TABLE (Law 29733 Proof of Consent)
CREATE TABLE IF NOT EXISTS consent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    device_id TEXT NOT NULL,
    terms_version_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of Privacy Policy terms
    accepted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.4. LEADS TABLE (Prospects - Encrypted Fields & RLS Protected)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    -- AES-256-GCM Encrypted values stored as TEXT (containing IV, Auth Tag, and Ciphertext)
    encrypted_email TEXT NOT NULL,
    encrypted_phone TEXT NOT NULL,
    status lead_status NOT NULL DEFAULT 'new',
    assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    consent_log_id UUID REFERENCES consent_logs(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.5. CALLS AND INTERACTIONS TABLE
CREATE TABLE IF NOT EXISTS calls_and_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    interaction_type interaction_type NOT NULL,
    duration_seconds INT DEFAULT 0,
    audio_recording_url TEXT, -- Secure S3 pre-signed URI
    transcript_text TEXT,
    qa_score INT CHECK (qa_score >= 0 AND qa_score <= 100),
    qa_evaluation_details JSONB, -- Checklists and audit rubrics
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.6. INTERACTION EMBEDDINGS (AI Hooks - pgvector)
CREATE TABLE IF NOT EXISTS interaction_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interaction_id UUID NOT NULL REFERENCES calls_and_interactions(id) ON DELETE CASCADE,
    embedding vector(1536) NOT NULL, -- Dimension match for text-embedding-3-small
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.7. AUDIT LOGS TABLE (Immutable Forensic Ledger)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id UUID,
    ip_address INET,
    delta_state JSONB DEFAULT '{}'::jsonb, -- Old vs New diff JSON
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. DATABASE INDEXES

-- Fast indexes for leads assignment and status
CREATE INDEX IF NOT EXISTS idx_leads_agent ON leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- HNSW Vector Index for fast semantic searches (<20ms latency)
CREATE INDEX IF NOT EXISTS idx_interaction_embeddings_vector 
ON interaction_embeddings USING hnsw (embedding vector_cosine_ops);

-- 5. CUMPLIMIENTO LEY 29733: TRIGGERS DE INMUTABILIDAD EN AUDIT_LOGS

-- Prevent updates or deletes on audit logs
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'SQL Error [29733]: La tabla audit_logs es inmutable y no permite modificaciones o eliminaciones.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_audit_logs
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- 6. CUMPLIMIENTO LEY 29733: PROCEDIMIENTO DE ANONIMIZACIÓN ARCO (CANCELACIÓN)

CREATE OR REPLACE FUNCTION arco_cancel_lead_procedure(target_lead_id UUID, executing_user_id UUID, client_ip INET)
RETURNS BOOLEAN AS $$
DECLARE
    old_email_placeholder TEXT;
END;
$$ -- Wait, let's complete the syntax correctly
DECLARE
    old_email_placeholder TEXT;
BEGIN
    -- Check if the lead exists and is active
    IF NOT EXISTS(SELECT 1 FROM leads WHERE id = target_lead_id AND status != 'arco_cancelled') THEN
        RETURN FALSE;
    END IF;

    -- Update lead to an anonymized state, destroying data but preserving metrics
    UPDATE leads
    SET 
        first_name = 'ARCO_CANCELADO',
        last_name = 'ARCO_CANCELADO',
        encrypted_email = md5(random()::text), -- Replace cipher text with non-decryptable hash noise
        encrypted_phone = md5(random()::text),
        status = 'arco_cancelled',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = target_lead_id;

    -- Purge associated recordings and transcripts to fulfill the right to be forgotten
    UPDATE calls_and_interactions
    SET 
        audio_recording_url = NULL,
        transcript_text = '[DATOS BORRADOS POR DERECHO ARCO CANCELACION]'
    WHERE lead_id = target_lead_id;

    -- Insert record into the audit log
    INSERT INTO audit_logs (actor_user_id, action, target_entity, target_id, ip_address, delta_state)
    VALUES (
        executing_user_id,
        'arco_anonymize',
        'leads',
        target_lead_id,
        client_ip,
        jsonb_build_object('lead_id', target_lead_id, 'status_before', 'active', 'status_after', 'arco_cancelled')
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 7. SEGURIDAD A NIVEL DE FILA (ROW-LEVEL SECURITY - RLS)

-- Enable RLS on Leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy helper: Get current session user parameters set by the backend pool connection
-- Set via: SET LOCAL app.current_user_id = 'uuid'; SET LOCAL app.current_user_role = 'role';
CREATE OR REPLACE FUNCTION current_user_role_setting() RETURNS VARCHAR AS $$
BEGIN
    RETURN current_setting('app.current_user_role', true);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION current_user_id_setting() RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(current_setting('app.current_user_id', true)::uuid, NULL);
END;
$$ LANGUAGE plpgsql;

-- RLS Policy: Vendedor only sees leads assigned to them.
-- Directors, QA, and Team Leaders see all (or scoped by team_id for TL, which can be extended)
CREATE POLICY policy_leads_rbac_access ON leads
    FOR ALL
    USING (
        current_user_role_setting() IN ('director', 'qa_auditor')
        OR (current_user_role_setting() = 'sales_agent' AND assigned_agent_id = current_user_id_setting())
        OR (current_user_role_setting() = 'team_leader' AND assigned_agent_id IN (
            SELECT id FROM users WHERE team_id = (SELECT team_id FROM users WHERE id = current_user_id_setting())
        ))
    );
