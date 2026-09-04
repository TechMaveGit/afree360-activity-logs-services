import { Queue } from "bullmq";
import logger from "../logger/logger.js";
import dotenv from "dotenv";
dotenv.config();

const parseRedisConnection = () => {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  try {
    const parsed = new URL(redisUrl);
    return {
      host: parsed.hostname || "127.0.0.1",
      port: parseInt(parsed.port || "6379", 10),
      ...(parsed.password ? { password: parsed.password } : {}),
      maxRetriesPerRequest: null,
    };
  } catch (err) {
    return { host: "127.0.0.1", port: 6379, maxRetriesPerRequest: null };
  }
};

const connection = parseRedisConnection();

export const notificationQueue = new Queue("afree360-notification-events", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const publishEvent = async (eventName, payload) => {
  try {
    const job = await notificationQueue.add(eventName, {
      eventName,
      payload,
      timestamp: new Date().toISOString(),
    });
    logger.info(`[BULLMQ] Successfully queued event from activity-logs: ${eventName} (Job ID: ${job.id})`);
    return { success: true, jobId: job.id };
  } catch (error) {
    logger.error(`[BULLMQ] Failed to queue event ${eventName}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export default { notificationQueue, publishEvent };
