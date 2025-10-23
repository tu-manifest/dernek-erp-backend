// src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// GET /api/dashboard rotası
router.get('/', dashboardController.getMetrics);

module.exports = router;