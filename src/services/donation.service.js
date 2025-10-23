// src/services/donation.service.js
import db from '../models/index.js';

class DonationService {
  async createDonation(donationData) {
    const donation = await db.Donation.create(donationData);
    return donation;
  }

  async getAllCampaigns() {
    const campaigns = await db.DonationCampaign.findAll();
    return campaigns;
  }

  async getCampaignById(id) {
    const campaign = await db.DonationCampaign.findByPk(id);
    return campaign;
  }
}

export default new DonationService();