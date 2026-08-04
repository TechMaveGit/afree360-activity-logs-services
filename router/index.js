import express from "express";
import adminActivityLogs from "../routes/admin/activityLogs.js";
import internalActivityLogs from "../routes/internal/activityLogs.js";

const router = express.Router();

router.use("/admin/activity-logs", adminActivityLogs);
router.use("/internal/activity-logs", internalActivityLogs);

export default router;
