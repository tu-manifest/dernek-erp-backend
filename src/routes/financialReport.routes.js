// src/routes/financialReport.routes.js
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { getFinancialReportHandler } from '../controllers/financialReport.controller.js';

const router = express.Router();

/**
 * @route   GET /api/financial-report
 * @desc    Finansal rapor verilerini getir
 * @access  Private
 * @query   year - Rapor yılı (opsiyonel, varsayılan: mevcut yıl)
 */
router.get('/', authenticate, getFinancialReportHandler);

export default router;
