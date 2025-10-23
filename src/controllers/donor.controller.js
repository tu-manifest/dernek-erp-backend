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
      const donors = await donorService.getAllDonors();
      res.status(200).json({ success: true, data: donors });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Bağışçılar getirilirken bir hata oluştu.', error: error.message });
    }
  }
}

export default new DonorController();