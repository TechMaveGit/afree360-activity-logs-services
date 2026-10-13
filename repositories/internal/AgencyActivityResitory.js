import db from '../../config/db.js';
import logger from '../../logger/logger.js';

export const checkUserType = async (user_id) => {
  try {
    let user;
    try {
      user = await db('users').where('id', user_id).select('user_type').first();
    } catch {
      user = await db('afree360_user_service_db.users').where('id', user_id).select('user_type').first();
    }

    if (!user || user.user_type !== 'agency') {
      throw 'Only agency user_type is allowed.';
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const createActivityLog = async (data) => {
  try {
    
    if (!data.user_id) {
      throw 'user_id is required.';
    }

    await checkUserType(data.user_id);

    if (!data.activity_type || !data.service_name) {
      throw 'activity_type and service_name are required.';
    }

    const insertPayload = {
      user_id: Number(data.user_id),
      activity_type: data.activity_type,
      service_name: data.service_name,
      reference_id: data.reference_id ? Number(data.reference_id) : null,
      description: data.description || null,
      ip_address: data.ip_address || data.client_ip || null
    };

    const [id] = await db('activity_logs').insert(insertPayload);
    return id;
  } catch (error) {
    if (!error.status) {
      logger.error(`[AgencyActivityRepo] Failed to create log: ${error.message || error}`);
    }
    throw error;
  }
};

export const getAgencyActivityLogs = async (params = {}) => {
  try {
    const { page = 1, limit = 10, user_id } = params;
    const offset = (page - 1) * limit;

    let query = db('activity_logs').select('*').where('is_active', true);

    if (user_id) {
      query = query.where('user_id', user_id);
    }

    const logs = await query.clone().orderBy('created_at', 'desc').limit(limit).offset(offset);
    const [{ total }] = await query.clone().clearSelect().count('* as total');

    return {
      logs,
      pagination: {
        total: parseInt(total) || 0,
        page,
        limit,
        totalPages: Math.ceil((parseInt(total) || 0) / limit)
      }
    };
  } catch (error) {
    logger.error(`[ActivityLogRepo] Failed to fetch admin logs: ${error.message || error}`);
    throw error;
  }
};

export const updateAgencyActivityStatus = async (id, isActive) => {
  try {
    if (isActive === undefined) {
      throw 'is_active field is required.';
    }

    const updatedRows = await db('activity_logs').where('id', id).update({ is_active: isActive });

    return updatedRows > 0;
  } catch (error) {
    logger.error(`[ActivityLogRepo] Failed to update status: ${error.message || error}`);
    throw error;
  }
};

export default {
  checkUserType,
  createActivityLog,
  getAgencyActivityLogs,
  updateAgencyActivityStatus
};