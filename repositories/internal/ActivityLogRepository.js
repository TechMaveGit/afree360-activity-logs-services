import db from '../../config/db.js';
import logger from '../../logger/logger.js';

export const createActivityLog = async (data) => {
  try {
    const [id] = await db('activity_logs').insert(data);
    return id;
  } catch (error) {
    logger.error(`[ActivityLogRepo] Failed to create log: ${error.message}`);
    throw error;
  }
};

export const createThirdPartyLog = async (data) => {
  try {
    const [id] = await db('third_party_logs').insert({
      provider_name: data.provider_name,
      request_url: data.request_url || null,
      request_payload: typeof data.request_payload === 'object' ? JSON.stringify(data.request_payload) : data.request_payload || null,
      response_payload: typeof data.response_payload === 'object' ? JSON.stringify(data.response_payload) : data.response_payload || null,
      status_code: data.status_code || null,
      error_message: data.error_message || null
    });
    return id;
  } catch (error) {
    logger.error(`[ActivityLogRepo] Failed to create third party log: ${error.message}`);
    throw error;
  }
};

export default {
  createActivityLog,
  createThirdPartyLog
};
