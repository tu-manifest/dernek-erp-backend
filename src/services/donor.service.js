// src/services/donor.service.js
import db from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

class DonorService {
  async createDonor(donorData) {
    const donor = await db.Donor.create(donorData);
    return donor;
  }

  async getDonorById(id) {
    const donor = await db.Donor.findByPk(id);
    if (!donor) {
      const error = new Error('Bağışçı bulunamadı.');
      error.statusCode = 404;
      throw error;
    }
    return donor;
  }

  async updateDonor(id, donorData) {
    const donor = await this.getDonorById(id);
    await donor.update(donorData);
    return donor;
  }

  async deleteDonor(id) {
    const donor = await this.getDonorById(id);
    await donor.destroy();
    return { message: 'Bağışçı başarıyla silindi.' };
  }

  async getAllDonors() {
    // Bağışçıları istatistiklerle birlikte getir
    const donors = await db.Donor.findAll({
      include: [{
        model: db.Donation,
        as: 'donations',
        attributes: []
      }],
      attributes: {
        include: [
          [fn('COALESCE', fn('SUM', col('donations.donationAmount')), 0), 'totalDonation'],
          [fn('COUNT', col('donations.id')), 'donationCount'],
          [fn('MAX', col('donations.donationDate')), 'lastDonationDate']
        ]
      },
      group: ['Donor.id'],
      raw: false
    });

    // Dashboard istatistikleri hesapla
    const stats = await this.getDashboardStats();

    return {
      donors: donors.map(donor => {
        const plainDonor = donor.toJSON();
        return {
          id: plainDonor.id,
          name: plainDonor.name,
          type: plainDonor.type,
          email: plainDonor.email,
          phone: plainDonor.phone,
          totalDonation: parseFloat(plainDonor.totalDonation) || 0,
          donationCount: parseInt(plainDonor.donationCount) || 0,
          lastDonationDate: plainDonor.lastDonationDate,
          createdAt: plainDonor.createdAt,
          updatedAt: plainDonor.updatedAt
        };
      }),
      stats
    };
  }

  async getDashboardStats() {
    const totalDonors = await db.Donor.count();
    const individualDonors = await db.Donor.count({ where: { type: 'Kişi' } });
    const corporateDonors = await db.Donor.count({ where: { type: 'Kurum' } });

    // Dış bağışçılara ait toplam bağış miktarı
    const totalDonationResult = await db.Donation.sum('donationAmount', {
      where: {
        donorId: {
          [Op.not]: null
        }
      }
    });

    return {
      totalDonors,
      individualDonors,
      corporateDonors,
      totalDonationAmount: parseFloat(totalDonationResult) || 0
    };
  }
}

export default new DonorService();