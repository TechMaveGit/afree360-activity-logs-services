import express from "express";
import { getAgencyActivityLogs, logActivity, updateAgencyActivityStatus } from "../../controller/internal/AgencyActivityLogContoller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/agency/activity-logs:
 *   get:
 *     tags: [Agency Activity Logs]
 *     summary: Retrieve activity logs for an agency user
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Agency activity logs retrieved successfully
 */
router.get("/", getAgencyActivityLogs);

/**
 * @swagger
 * /api/v1/agency/activity-logs/status/{id}:
 *   put:
 *     tags: [Agency Activity Logs]
 *     summary: Update an agency activity log status
 *     security:
 *       - bearerAuth: []
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
 *             required: [is_active]
 *             properties:
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Agency activity status updated successfully
 */
router.put("/status/:id", updateAgencyActivityStatus);

/**
 * @swagger
 * /api/v1/agency/activity-logs/log:
 *   post:
 *     tags: [Agency Activity Logs]
 *     summary: Log a new system event activity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activity_type
 *               - service_name
 *             properties:
 *               user_id:
 *                 type: integer
 *               activity_type:
 *                 type: string
 *               service_name:
 *                 type: string
 *               reference_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               ip_address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity logged successfully
 */
router.post("/log", logActivity);

export default router;