import { success, error400, error500 } from "../../helper/response.js";
import ActivityLogRepository from "../../repositories/admin/ActivityLogRepository.js";
import logger from "../../logger/logger.js";

export const getAdminActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, user_id } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (isNaN(parsedPage) || parsedPage <= 0) {
      return error400(res, "Invalid page parameter.");
    }
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return error400(res, "Invalid limit parameter.");
    }

    const result = await ActivityLogRepository.getAdminActivityLogs({
      page: parsedPage,
      limit: parsedLimit,
      user_id: user_id ? parseInt(user_id) : undefined
    });

    return success(res, "Admin activity logs retrieved successfully.", result);
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error fetching admin logs: ${error.message}`);
    return error500(res, "Failed to retrieve admin activity logs.");
  }
};

export const updateActivityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return error400(res, "is_active field is required.");
    }

    const successFlag = await ActivityLogRepository.updateActivityStatus(id, is_active);
    if (!successFlag) {
      return error400(res, "Activity log not found or not updated.");
    }

    return success(res, "Activity status updated successfully.");
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error updating activity status: ${error.message}`);
    return error500(res, "Failed to update activity status.");
  }
};

export const getThirdPartyLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, provider_name } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (isNaN(parsedPage) || parsedPage <= 0) {
      return error400(res, "Invalid page parameter.");
    }
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return error400(res, "Invalid limit parameter.");
    }

    const result = await ActivityLogRepository.getThirdPartyLogs({
      page: parsedPage,
      limit: parsedLimit,
      provider_name
    });

    return success(res, "Third party activity logs retrieved successfully.", result);
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error fetching third party logs: ${error.message}`);
    return error500(res, "Failed to retrieve third party logs.");
  }
};

export const getActivityMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return error400(res, "startDate and endDate query parameters are required.");
    }
    const metrics = await ActivityLogRepository.getActivityMetrics(startDate, endDate);
    return success(res, "Activity metrics fetched successfully.", metrics);
  } catch (error) {
    logger.error(`[ActivityLogCtrl] Error fetching activity metrics: ${error.message}`);
    return error500(res, "Failed to retrieve activity metrics.");
  }
};
