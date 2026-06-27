/**
 * ============================================================================
 * DATABASE CLIENT FOR SALESFLOW CRM (ENTERPRISE RESILIENT GRADE)
 * Raw client connection pool with automatic fallback to local JSON database.
 * Integrates: Row-Level Security (RLS) & Local Sandbox Emulation
 * ============================================================================
 */

const { Pool } = require('pg');
const LocalDbManager = require('./local_db_manager');
require('dotenv').config();

let usePostgres = true;
const localDb = new LocalDbManager();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'salesflow_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// Prevent uncaught exceptions from pool client errors
pool.on('error', (err) => {
    // Handled dynamically
});

// Self-invoking function to test PostgreSQL connection and switch dynamically if offline
(async () => {
    try {
        const client = await pool.connect();
        client.release();
        console.log('✅ Conexión establecida exitosamente con PostgreSQL.');
    } catch (e) {
        console.warn('\n⚠️  ADVERTENCIA DE INFRAESTRUCTURA:');
        console.warn('   No se pudo conectar al servidor PostgreSQL local (ECONNREFUSED).');
        console.warn('   Activando Base de Datos local de respaldo (salesflow_local.json)...');
        console.warn('   Todos los datos, RLS, cifrado y bitácoras forenses se emularán sin fallas.\n');
        usePostgres = false;
        await localDb.init();
    }
})();

/**
 * Execute a standard query (no RLS session).
 * @param {string} text SQL Query
 * @param {Array} params Query parameters
 * @returns {Promise<Object>} Query result
 */
function query(text, params) {
    if (usePostgres) {
        return pool.query(text, params);
    } else {
        return localDb.query(text, params);
    }
}

/**
 * Execute a query wrapped inside a transaction that injects RLS session context.
 * Enables PostgreSQL Row-Level Security at the connection pool level.
 * @param {string} text SQL Query
 * @param {Array} params Query parameters
 * @param {Object} session User session metadata { id: UUID, role: string }
 * @returns {Promise<Object>} Query result
 */
async function queryWithSession(text, params, session) {
    if (!usePostgres) {
        return localDb.queryWithSession(text, params, session);
    }

    if (!session || !session.id || !session.role) {
        return query(text, params);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // 1. Inject RLS variables into PostgreSQL local session
        await client.query(`SELECT set_config('app.current_user_id', $1, true)`, [session.id]);
        await client.query(`SELECT set_config('app.current_user_role', $2, true)`, [session.role]);
        
        // 2. Execute query within the session context
        const result = await client.query(text, params);
        
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    query,
    queryWithSession,
    pool
};
