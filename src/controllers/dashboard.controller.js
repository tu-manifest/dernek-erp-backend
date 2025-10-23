// src/controllers/dashboard.controller.js
const dashboardService = require('../services/dashboard.service');

class DashboardController {
    // GET /api/dashboard isteğini karşılar
    async getMetrics(req, res) {
        try {
            const metrics = await dashboardService.getDashboardMetrics();
            return res.status(200).send({
                success: true,
                data: metrics
            });
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            // Hata olursa 500 kodu döndür
            return res.status(500).send({ 
                success: false, 
                message: 'Internal Server Error while fetching dashboard data.' 
            });
        }
    }
}

module.exports = new DashboardController();