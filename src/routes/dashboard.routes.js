// src/routes/dashboard.routes.js
import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Dashboard istatistiklerini getir
router.get('/stats', authenticate, getDashboardStats);

export default router;

