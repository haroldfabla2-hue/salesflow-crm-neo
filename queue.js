/**
 * ============================================================================
 * DISTRIBUTED JOB QUEUE MANAGER FOR SALESFLOW CRM (PRODUCTION SCALE)
 * Engine: BullMQ + ioredis with Graceful In-Memory Fallback for Local Dev
 * ============================================================================
 */

const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
require('dotenv').config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let redisConnection = null;
let useRedis = false;
let warned = false;

// Queues registry
const queues = {};
const workers = {};

// Fallback registry for in-memory processing
const memoryQueueJobs = {};
const memoryWorkers = {};

// Initialize Redis client with error handling
try {
    redisConnection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        connectTimeout: 2000, // 2 seconds timeout to trigger fallback
        retryStrategy: (times) => {
            // Detener intentos de reconexión rápida si falla la primera vez en desarrollo local
            if (times > 1) return null; 
            return 1000;
        }
    });

    redisConnection.on('connect', () => {
        console.log('✅ Conexión establecida con Redis Server.');
        useRedis = true;
    });

    redisConnection.on('error', (err) => {
        if (!useRedis && !warned) {
            warned = true;
            console.warn('\n⚠️  ADVERTENCIA DE COLAS:');
            console.warn('   No se pudo conectar a Redis. Las colas BullMQ están desactivadas.');
            console.warn('   Activando Fallback en Memoria (In-Memory Queue Engine)...');
            console.warn('   Los jobs asíncronos se procesarán en memoria de manera secuencial.\n');
            useRedis = false;
        }
    });
} catch (e) {
    console.error('Error al inicializar cliente Redis:', e.message);
}

/**
 * In-Memory Fallback Queue engine to ensure the app runs offline without crash
 */
class InMemoryQueue {
    constructor(name) {
        this.name = name;
        if (!memoryQueueJobs[name]) {
            memoryQueueJobs[name] = [];
        }
    }

    async add(jobName, data) {
        const job = {
            id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: jobName,
            data,
            timestamp: Date.now()
        };
        memoryQueueJobs[this.name].push(job);
        
        // Trigger execution asynchronously
        setImmediate(async () => {
            await this.processNext();
        });
        return job;
    }

    async processNext() {
        if (memoryQueueJobs[this.name].length === 0) return;
        const job = memoryQueueJobs[this.name].shift();
        const handler = memoryWorkers[this.name];
        
        if (handler) {
            try {
                console.log(`[Queue-Memory] Procesando job '${job.name}' en cola '${this.name}'`);
                await handler(job);
                console.log(`[Queue-Memory] Job '${job.name}' finalizado exitosamente.`);
            } catch (err) {
                console.error(`[Queue-Memory] Error en job '${job.name}':`, err.message);
            }
        }
    }
}

/**
 * Register a new queue in the system
 * @param {string} queueName Unique name of the queue
 */
function registerQueue(queueName) {
    if (useRedis) {
        queues[queueName] = new Queue(queueName, { connection: redisConnection });
    } else {
        queues[queueName] = new InMemoryQueue(queueName);
    }
    return queues[queueName];
}

/**
 * Register a worker to process jobs from a queue
 * @param {string} queueName Name of the target queue
 * @param {Function} processor Async function to process the job
 */
function registerWorker(queueName, processor) {
    if (useRedis) {
        workers[queueName] = new Worker(queueName, async (job) => {
            return processor(job);
        }, { 
            connection: redisConnection,
            concurrency: 5 // Process up to 5 jobs concurrently
        });

        workers[queueName].on('completed', (job) => {
            console.log(`[Queue-BullMQ] Job ${job.id} (${job.name}) completado con éxito.`);
        });

        workers[queueName].on('failed', (job, err) => {
            console.error(`[Queue-BullMQ] Job ${job ? job.id : 'unknown'} (${job ? job.name : 'unknown'}) falló:`, err.message);
        });
    } else {
        memoryWorkers[queueName] = processor;
    }
}

/**
 * Add a job to a specific queue
 * @param {string} queueName Queue target
 * @param {string} jobName Job target description
 * @param {Object} data Context data payload
 */
async function addJob(queueName, jobName, data) {
    let queue = queues[queueName];
    if (!queue) {
        queue = registerQueue(queueName);
    }
    return await queue.add(jobName, data);
}

module.exports = {
    registerQueue,
    registerWorker,
    addJob,
    useRedis: () => useRedis
};
