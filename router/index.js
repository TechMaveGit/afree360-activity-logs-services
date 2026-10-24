import { validateReadBounds } from '../helper/readLimits.js';
import express from "express";
import adminActivityLogs from "../routes/admin/activityLogs.js";
import appActivityLogs from "../routes/app/activityLogs.js";
import internalActivityLogs from "../routes/internal/activityLogs.js";
import agencyActivityLogs from '../routes/internal/agencyActivity.js';
import corporateActivityLogs from '../routes/corporate/activityLogs.js';
import iomcActivityLogs from '../routes/iomc/activityLogs.js';

const router = express.Router();
router.use('/internal', validateReadBounds);

router.use("/admin/activity-logs", adminActivityLogs);
router.use("/app/activity-logs", appActivityLogs);
router.use("/activity-logs", appActivityLogs);
router.use("/internal/activity-logs", internalActivityLogs);
router.use("/agency/activity-logs", agencyActivityLogs);
router.use("/corporate/activity-logs", corporateActivityLogs);
router.use("/iomc/activity-logs", iomcActivityLogs);

export default router;
