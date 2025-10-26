// src/routes/dashboard.routes.js

import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

// GET /api/dashboard/stats adresine istek geldiğinde
// dashboardController'daki getDashboardStats fonksiyonunu çalıştır.
router.get('/stats', dashboardController.getDashboardStats);

export default router;