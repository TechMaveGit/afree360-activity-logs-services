import express from "express";
import { getAdminActivityLogs, updateActivityStatus, getThirdPartyLogs, getActivityMetrics } from "../../controller/admin/ActivityLogController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/activity-logs:
 *   get:
 *     tags: [Admin Activity Logs]
 *     summary: Retrieve admin activity logs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin activity logs retrieved successfully
 */
router.get("/", getAdminActivityLogs);

/**
 * @swagger
 * /api/v1/admin/activity-logs/metrics:
 *   get:
 *     tags: [Admin Activity Logs]
 *     summary: Retrieve activity trends and cohort retention metrics
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity metrics retrieved successfully
 */
router.get("/metrics", getActivityMetrics);

/**
 * @swagger
 * /api/v1/admin/activity-logs/third-party:
 *   get:
 *     tags: [Admin Activity Logs]
 *     summary: Retrieve third party logging history
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: provider_name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Third party logs retrieved successfully
 */
router.get("/third-party", getThirdPartyLogs);

/**
 * @swagger
 * /api/v1/admin/activity-logs/{id}/status:
 *   put:
 *     tags: [Admin Activity Logs]
 *     summary: Enable/disable an activity log status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_active
 *             properties:
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Log status updated successfully
 */
router.put("/:id/status", updateActivityStatus);

export default router;
