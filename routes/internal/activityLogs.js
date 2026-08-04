import express from "express";
import { logActivity, logThirdParty } from "../../controller/internal/ActivityLogController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/internal/activity-logs/log:
 *   post:
 *     tags: [Internal Activity Logs]
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

/**
 * @swagger
 * /api/v1/internal/activity-logs/third-party:
 *   post:
 *     tags: [Internal Activity Logs]
 *     summary: Log third party API integration payloads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider_name
 *             properties:
 *               provider_name:
 *                 type: string
 *               request_url:
 *                 type: string
 *               request_payload:
 *                 type: object
 *               response_payload:
 *                 type: object
 *               status_code:
 *                 type: integer
 *               error_message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Third party activity logged successfully
 */
router.post("/third-party", logThirdParty);

export default router;
