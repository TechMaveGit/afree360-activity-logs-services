import express from 'express';
import { logActivity } from '../../controller/corporate/ActivityLogController.js';

const router = express.Router();
router.post('/log', logActivity);

export default router;
