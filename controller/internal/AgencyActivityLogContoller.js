import { error400, success, } from "../../helper/response.js";
import ActivityLogRepository from "../../repositories/internal/AgencyActivityResitory.js";
import logger from "../../logger/logger.js";

export const logActivity = async (req, res) => {
  try {
    const { user_id, activity_type, service_name, reference_id, description, ip_address } = req.body;

    const client_ip = ip_address || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    const data = {
      user_id: user_id || null,
      activity_type,
      service_name,
      reference_id: reference_id || null,
      description: description || null,
      ip_address: client_ip || null
    };
     console.log(data)
    const id = await ActivityLogRepository.createActivityLog(data);
    return success(res, "Activity logged successfully.", { id });
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error logging activity: ${error.message}`);
    return error400(res, "Failed to log activity.");
  }
};

export const getAgencyActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, user_id } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const result = await ActivityLogRepository.getAgencyActivityLogs({
      page: parsedPage,
      limit: parsedLimit,
      user_id: user_id ? parseInt(user_id) : undefined
    });

    return success(res, "Admin activity logs retrieved successfully.", result);
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error fetching admin logs: ${error.message}`);
    return error400(res, "Failed to retrieve admin activity logs.");
  }
};

export const updateAgencyActivityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    
    const successFlag = await ActivityLogRepository.updateAgencyActivityStatus(id, is_active);

    return success(res, "Activity status updated successfully.");
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error updating activity status: ${error.message}`);
    return error400(res, "Failed to update activity status.");
  }
};


