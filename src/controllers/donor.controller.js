// src/controllers/donor.controller.js
import donorService from '../services/donor.service.js';

class DonorController {
  async createDonor(req, res) {
    try {
      const donor = await donorService.createDonor(req.body);
      res.status(201).json({ success: true, message: 'Bağışçı başarıyla oluşturuldu.', data: donor });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Bağışçı oluşturulurken bir hata oluştu.', error: error.message });
    }
  }

  async getAllDonors(req, res) {
    try {
      const result = await donorService.getAllDonors();
      res.status(200).json({ success: true, data: result.donors, stats: result.stats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Bağışçılar getirilirken bir hata oluştu.', error: error.message });
    }
  }

  async getDonorById(req, res) {
    try {
      const donor = await donorService.getDonorById(req.params.id);
      res.status(200).json({ success: true, data: donor });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  async updateDonor(req, res) {
    try {
      const donor = await donorService.updateDonor(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Bağışçı başarıyla güncellendi.', data: donor });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  async deleteDonor(req, res) {
    try {
      const result = await donorService.deleteDonor(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }
}

export default new DonorController();