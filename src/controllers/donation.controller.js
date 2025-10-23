// src/controllers/donation.controller.js
import donationService from '../services/donation.service.js';

class DonationController {
  async createDonation(req, res) {
    try {
      const donation = await donationService.createDonation(req.body);
      res.status(201).json({ success: true, message: 'Bağış başarıyla oluşturuldu.', data: donation });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Bağış oluşturulurken bir hata oluştu.', error: error.message });
    }
  }

  async getAllCampaigns(req, res) {
    try {
      const campaigns = await donationService.getAllCampaigns();
      res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Kampanyalar getirilirken bir hata oluştu.', error: error.message });
    }
  }

  async getCampaignById(req, res) {
    try {
      const campaign = await donationService.getCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Kampanya bulunamadı.' });
      }
      res.status(200).json({ success: true, data: campaign });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Kampanya getirilirken bir hata oluştu.', error: error.message });
    }
  }
}

export default new DonationController();