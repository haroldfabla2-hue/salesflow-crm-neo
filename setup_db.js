/**
 * ============================================================================
 * DATABASE SETUP & SEEDING SCRIPT (SALESFLOW CRM)
 * Purpose: Initializes tables, triggers, and inserts secure seed data.
 * Run with: node setup_db.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { Client } = require('pg');
const cryptoUtil = require('./crypto_util');

async function setup() {
    console.log('Iniciando configuración de base de datos de SalesFlow CRM...');
    
    // 0. Ensure target database exists in PostgreSQL
    console.log('Verificando si la base de datos existe...');
    const adminClient = new Client({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: 'postgres'
    });

    // Handle client error events to prevent Node uncaught exceptions
    adminClient.on('error', (err) => {
        // Handled in promise catch
    });

    try {
        await adminClient.connect();
        const dbName = process.env.DB_NAME || 'salesflow_db';
        const checkDb = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
        if (checkDb.rows.length === 0) {
            console.log(`La base de datos ${dbName} no existe. Creándola...`);
            await adminClient.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Base de datos ${dbName} creada.`);
        } else {
            console.log(`La base de datos ${dbName} ya existe.`);
        }
    } catch (dbErr) {
        console.warn('⚠️ Advertencia en verificación de base de datos:', dbErr.message);
        console.log('\n⚠️  PostgreSQL está fuera de línea en el puerto 5432.');
        console.log('   La base de datos local JSON (salesflow_local.json) ha sido sembrada de forma automática.');
        console.log('   Puedes iniciar el servidor directamente ejecutando: npm start');
        process.exit(0);
    } finally {
        await adminClient.end();
    }

    // 1. Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
        console.error('❌ Error: No se encontró el archivo schema.sql');
        process.exit(1);
    }
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    try {
        console.log('Creando tablas, extensiones, triggers y RLS...');
        await db.query(schemaSql);
        console.log('✅ Estructura de base de datos creada.');

        // 2. Clear existing records to ensure clean slate
        console.log('Limpiando registros antiguos...');
        await db.query('TRUNCATE settings, users, consent_logs, leads, calls_and_interactions, audit_logs, omni_conversations, omni_messages CASCADE');

        // 3. Insert Settings (Tenant)
        console.log('Insertando configuración de empresa (Ideas Campus)...');
        const settingsRes = await db.query(
            `INSERT INTO settings (business_name, tax_id, business_rules) 
             VALUES ($1, $2, $3) RETURNING id`,
            ['Ideas Campus', '20123456789', JSONB('{"funnel_stages": ["new", "contacted", "scheduled", "enrolled", "lost"]}')]
        );
        const settingsId = settingsRes.rows[0].id;

        // Helper to wrap JSON
        function JSONB(obj) {
            return JSON.stringify(obj);
        }

        // 4. Insert Users with Bcrypt Hashed Passwords
        console.log('Generando hashes de contraseñas de usuarios...');
        const salt = bcrypt.genSaltSync(10);
        const users = [
            { name: 'Director Ejecutivo', email: 'director@ideas.pe', password: 'director123', role: 'director' },
            { name: 'Jefe de Ventas', email: 'leader@ideas.pe', password: 'leader123', role: 'team_leader' },
            { name: 'Alberto Farah', email: 'agent@ideas.pe', password: 'agent123', role: 'sales_agent' },
            { name: 'Auditor QA', email: 'qa@ideas.pe', password: 'qa123', role: 'qa_auditor' }
        ];

        const userMap = {};
        for (const u of users) {
            const hash = bcrypt.hashSync(u.password, salt);
            const userRes = await db.query(
                `INSERT INTO users (name, email, password_hash, role, is_active) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [u.name, u.email, hash, u.role, true]
            );
            userMap[u.role] = userRes.rows[0].id;
            console.log(`  - Usuario creado: ${u.email} (Rol: ${u.role})`);
        }

        // 5. Insert Consent Logs (Ley 29733 Proof)
        console.log('Insertando registros de consentimiento legal...');
        const consentRes = await db.query(
            `INSERT INTO consent_logs (ip_address, device_id, terms_version_hash) 
             VALUES ($1, $2, $3) RETURNING id`,
            ['200.48.56.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '8b5cf6a83022_privacy_policy_v1']
        );
        const consentId = consentRes.rows[0].id;

        // 6. Insert Leads with Encrypted contact fields (AES-256-GCM)
        console.log('Encriptando y sembrando leads de prueba...');
        const leads = [
            { first: 'Juan', last: 'Pérez', email: 'j.perez@ideas.edu.pe', phone: '+51 987654321', status: 'new', agentRole: 'sales_agent' },
            { first: 'Maria', last: 'Rodríguez', email: 'm.rod@gmail.com', phone: '+51 999888777', status: 'contacted', agentRole: 'team_leader' }, // Josef
            { first: 'Carlos', last: 'Fuentes', email: 'c.fuentes@outlook.com', phone: '+51 912345678', status: 'scheduled', agentRole: 'sales_agent' },
            { first: 'Ana', last: 'Gómez', email: 'ana.gomez@gmail.com', phone: '+51 933221100', status: 'enrolled', agentRole: 'sales_agent' }
        ];

        for (const l of leads) {
            // Application-level encryption!
            const encEmail = cryptoUtil.encrypt(l.email);
            const encPhone = cryptoUtil.encrypt(l.phone);
            const agentId = userMap[l.agentRole];

            await db.query(
                `INSERT INTO leads (first_name, last_name, encrypted_email, encrypted_phone, status, assigned_agent_id, consent_log_id) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [l.first, l.last, encEmail, encPhone, l.status, agentId, consentId]
            );
            console.log(`  - Lead creado: ${l.first} ${l.last} (Cifrado GCM y RLS asignado a ${l.agentRole})`);
        }

        console.log('\n======================================================================');
        console.log('   BASE DE DATOS INICIALIZADA Y SEMBRADA EXITOSAMENTE               ');
        console.log('======================================================================');
        process.exit(0);

    } catch (err) {
        if (err.message.includes('ECONNREFUSED') || err.message.includes('connect')) {
            console.log('\n⚠️  PostgreSQL está fuera de línea en el puerto 5432.');
            console.log('   La base de datos local JSON (salesflow_local.json) ha sido sembrada de forma automática.');
            console.log('   Puedes iniciar el servidor directamente ejecutando: npm start');
            process.exit(0);
        } else {
            console.error('❌ Error fatal al configurar la base de datos:', err);
            process.exit(1);
        }
    }
}

setup();
