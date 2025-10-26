// src/controllers/dashboard.controller.js

import dashboardService from '../services/dashboard.service.js';

class DashboardController {
  
  async getDashboardStats(req, res) {
    try {
      const stats = await dashboardService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'İstatistikler alınamadı.', error: error.message });
    }
  }

}

export default new DashboardController();