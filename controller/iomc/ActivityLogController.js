import { respondReadError } from '../../helper/readLimits.js';
import { success, error400, error500 } from '../../helper/response.js';
import ActivityLogService from '../../services/iomc/ActivityLogService.js';
import logger from '../../logger/logger.js';

export const logActivity = async (req, res) => {
  try {
    const { user_id, activity_type, reference_id, description, ip_address } = req.body;
    if (!activity_type) return error400(res, 'activity_type is required.');

    const id = await ActivityLogService.logActivity({
      user_id: user_id || null,
      activity_type,
      reference_id: reference_id || null,
      description: description || null,
      ip_address: ip_address || req.headers['x-forwarded-for'] || req.ip || null
    });
    return success(res, 'IOMC activity logged successfully.', { id });
  } catch (error) {
    if (respondReadError(res, error)) return;
    logger.error(`[IomcActivityLogCtrl] Could not log activity: ${error.message}`);
    return error500(res, 'Failed to log IOMC activity.');
  }
};

export default { logActivity };
