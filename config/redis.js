import { createClient } from "redis";
import logger from "../logger/logger.js";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
  }
});

redisClient.on("error", (err) => {
  logger.error(`[REDIS] Activity Logs Redis Error: ${err.message}`);
});

redisClient.on('connect', () => {
  logger.info('[REDIS] Activity Logs Service successfully connected to Redis');
});

// Non-blocking graceful startup
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error(`[REDIS] Initial connection failed: ${err.message}`);
  }
})();

export const getCache = async (key) => {
  if (!redisClient.isOpen) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.warn(`[REDIS] Failed to get cache for ${key}: ${error.message}`);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 300) => {
  if (!redisClient.isOpen) return;
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    logger.warn(`[REDIS] Failed to set cache for ${key}: ${error.message}`);
  }
};

export const clearCachePattern = async (pattern) => {
  if (!redisClient.isOpen) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`[REDIS] Successfully cleared ${keys.length} keys matching pattern: ${pattern}`);
    }
  } catch (error) {
    logger.warn(`[REDIS] Failed to clear cache pattern ${pattern}: ${error.message}`);
  }
};

export default redisClient;
