import { validateReadBounds } from '../helper/readLimits.js';
import express from "express";
import adminActivityLogs from "../routes/admin/activityLogs.js";
import internalActivityLogs from "../routes/internal/activityLogs.js";
import agencyActivityLogs from '../routes/internal/agencyActivity.js';

const router = express.Router();
router.use('/internal', validateReadBounds);

router.use("/admin/activity-logs", adminActivityLogs);
router.use("/internal/activity-logs", internalActivityLogs);
router.use("/agency/activity-logs", agencyActivityLogs);

export default router;
