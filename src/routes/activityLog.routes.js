import express from 'express';
import * as ActivityLogController from '../controllers/activityLog.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tüm route'lar authentication gerektirir
router.use(authenticate);

// Tüm logları getir (filtreleme destekli)
// GET /api/activity-logs?page=1&limit=50&entityType=Event&action=CREATE&startDate=2025-01-01&endDate=2025-12-31
router.get('/', ActivityLogController.getAllLogs);

// İstatistikleri getir
// GET /api/activity-logs/stats
router.get('/stats', ActivityLogController.getStats);

// Son aktiviteleri getir (dashboard için)
// GET /api/activity-logs/recent?limit=10
router.get('/recent', ActivityLogController.getRecentLogs);

// Belirli bir entity için logları getir
// GET /api/activity-logs/entity/:entityType/:entityId
router.get('/entity/:entityType/:entityId', ActivityLogController.getLogsByEntity);

export default router;
