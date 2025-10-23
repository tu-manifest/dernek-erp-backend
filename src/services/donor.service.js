// src/services/donor.service.js
import db from '../models/index.js';

class DonorService {
  async createDonor(donorData) {
    const donor = await db.Donor.create(donorData);
    return donor;
  }

  async getAllDonors() {
    const donors = await db.Donor.findAll();
    return donors;
  }
}

export default new DonorService();