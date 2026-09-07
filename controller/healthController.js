import db from '../config/db.js';
import redisClient from '../config/redis.js';

/**
 * Deep Microservice Health Check Endpoint (/health)
 * Checks Database connectivity, Redis state, process uptime, and memory metrics.
 */
export const checkServiceHealth = async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'DOWN';
  let dbLatency = null;
  let redisStatus = 'DOWN';
  let redisLatency = null;

  // 1. Check Database (Knex)
  try {
    const dbStart = Date.now();
    await db.raw('SELECT 1');
    dbStatus = 'UP';
    dbLatency = Date.now() - dbStart;
  } catch (err) {
    dbStatus = `DOWN (${err.message})`;
  }

  // 2. Check Redis Client (if exists)
  try {
    if (redisClient && redisClient.isOpen) {
      const redisStart = Date.now();
      const pingRes = await redisClient.ping();
      redisStatus = pingRes === 'PONG' ? 'UP' : 'DEGRADED';
      redisLatency = Date.now() - redisStart;
    } else {
      redisStatus = 'DISCONNECTED';
    }
  } catch (err) {
    redisStatus = `DOWN (${err.message})`;
  }

  const isHealthy = dbStatus === 'UP';
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    status: isHealthy ? 'UP' : 'DOWN',
    service: 'afree360-activity-logs-services',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: Date.now() - startTime,
    components: {
      database: { status: dbStatus, latencyMs: dbLatency },
      redis: { status: redisStatus, latencyMs: redisLatency }
    },
    system: {
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
      },
      nodeVersion: process.version
    }
  });
};

/**
 * Lightweight Readiness Probe Endpoint (/ready)
 */
export const checkReadiness = async (req, res) => {
  try {
    await db.raw('SELECT 1');
    return res.status(200).json({ status: 'READY', service: 'afree360-activity-logs-services' });
  } catch (err) {
    return res.status(503).json({ status: 'NOT_READY', service: 'afree360-activity-logs-services', error: err.message });
  }
};
