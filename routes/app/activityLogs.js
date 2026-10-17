import express from "express";
import { logActivity, logThirdParty } from "../../controller/app/ActivityLogController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/app/activity-logs/log:
 *   post:
 *     tags: [App Activity Logs]
 *     summary: Log a new user or system event activity
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
 *                 example: 1
 *               activity_type:
 *                 type: string
 *                 example: "LOGIN"
 *               service_name:
 *                 type: string
 *                 example: "user-services"
 *               reference_id:
 *                 type: integer
 *                 example: 101
 *               description:
 *                 type: string
 *                 example: "User logged in successfully"
 *               ip_address:
 *                 type: string
 *                 example: "127.0.0.1"
 *     responses:
 *       200:
 *         description: Activity logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Activity logged successfully."
 *                 body:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 45
 */
router.post("/log", logActivity);
router.post("/", logActivity);

/**
 * @swagger
 * /api/v1/app/activity-logs/third-party:
 *   post:
 *     tags: [App Activity Logs]
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
 *                 example: "mpesa"
 *               request_url:
 *                 type: string
 *                 example: "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
 *               request_payload:
 *                 type: object
 *               response_payload:
 *                 type: object
 *               status_code:
 *                 type: integer
 *                 example: 200
 *               error_message:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Third party activity logged successfully
 */
router.post("/third-party", logThirdParty);

export default router;
