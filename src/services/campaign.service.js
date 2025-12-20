// src/services/campaign.service.js
import db from '../models/index.js';
import { Op } from 'sequelize';

class CampaignService {
    /**
     * Yeni kampanya oluştur
     */
    async createCampaign(campaignData) {
        const campaign = await db.DonationCampaign.create(campaignData);
        return campaign;
    }

    /**
     * Tüm kampanyaları getir
     */
    async getAllCampaigns() {
        const campaigns = await db.DonationCampaign.findAll({
            order: [['createdAt', 'DESC']]
        });
        return campaigns;
    }

    /**
     * ID'ye göre kampanya getir
     */
    async getCampaignById(id) {
        const campaign = await db.DonationCampaign.findByPk(id);
        if (!campaign) {
            const error = new Error('Kampanya bulunamadı.');
            error.statusCode = 404;
            throw error;
        }
        return campaign;
    }

    /**
     * Kampanya güncelle
     */
    async updateCampaign(id, updateData) {
        const campaign = await this.getCampaignById(id);
        await campaign.update(updateData);
        return campaign;
    }

    /**
     * Kampanya sil
     */
    async deleteCampaign(id) {
        const campaign = await this.getCampaignById(id);
        await campaign.destroy();
        return true;
    }

    /**
     * Kampanya durumunu güncelle
     */
    async updateCampaignStatus(id, status) {
        const campaign = await this.getCampaignById(id);
        await campaign.update({ status });
        return campaign;
    }

    /**
     * Dashboard istatistiklerini getir
     */
    async getDashboardStats() {
        const totalCampaigns = await db.DonationCampaign.count();
        const activeCampaigns = await db.DonationCampaign.count({
            where: { status: 'Aktif' }
        });
        const completedCampaigns = await db.DonationCampaign.count({
            where: { status: 'Tamamlandı' }
        });
        const stoppedCampaigns = await db.DonationCampaign.count({
            where: { status: 'Durduruldu' }
        });

        // Toplam hedef ve toplanan tutarlar
        const totals = await db.DonationCampaign.findOne({
            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('targetAmount')), 'totalTarget'],
                [db.sequelize.fn('SUM', db.sequelize.col('collectedAmount')), 'totalCollected']
            ],
            raw: true
        });

        return {
            totalCampaigns,
            activeCampaigns,
            completedCampaigns,
            stoppedCampaigns,
            totalTarget: parseFloat(totals.totalTarget) || 0,
            totalCollected: parseFloat(totals.totalCollected) || 0
        };
    }

    /**
     * Kampanyaya bağış ekle ve collectedAmount güncelle
     */
    async addDonationToCampaign(campaignId, amount) {
        const campaign = await this.getCampaignById(campaignId);
        const newCollectedAmount = parseFloat(campaign.collectedAmount) + parseFloat(amount);
        await campaign.update({ collectedAmount: newCollectedAmount });
        return campaign;
    }

    /**
     * Kampanyanın bağışlarını getir
     */
    async getCampaignDonations(campaignId) {
        await this.getCampaignById(campaignId); // Kampanya var mı kontrol
        const donations = await db.Donation.findAll({
            where: { campaignId },
            order: [['donationDate', 'DESC']],
            include: [
                {
                    model: db.Member,
                    as: 'member',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ]
        });
        return donations;
    }
}

export default new CampaignService();
