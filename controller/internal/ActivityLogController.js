import { success, error400, error500 } from "../../helper/response.js";
import ActivityLogRepository from "../../repositories/internal/ActivityLogRepository.js";
import logger from "../../logger/logger.js";

export const logActivity = async (req, res) => {
  try {
    const { user_id, activity_type, service_name, reference_id, description, ip_address } = req.body;

    if (!activity_type || !service_name) {
      return error400(res, "activity_type and service_name are required.");
    }

    const client_ip = ip_address || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const data = {
      user_id: user_id || null,
      activity_type,
      service_name,
      reference_id: reference_id || null,
      description: description || null,
      ip_address: client_ip || null
    };

    const id = await ActivityLogRepository.createActivityLog(data);
    return success(res, "Activity logged successfully.", { id });
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error logging activity: ${error.message}`);
    return error500(res, "Failed to log activity.");
  }
};

export const logThirdParty = async (req, res) => {
  try {
    const { provider_name, request_url, request_payload, response_payload, status_code, error_message } = req.body;

    if (!provider_name) {
      return error400(res, "provider_name is required.");
    }

    const data = {
      provider_name,
      request_url,
      request_payload,
      response_payload,
      status_code,
      error_message
    };

    const id = await ActivityLogRepository.createThirdPartyLog(data);
    return success(res, "Third party activity logged successfully.", { id });
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error logging third party activity: ${error.message}`);
    return error500(res, "Failed to log third party activity.");
  }
};
