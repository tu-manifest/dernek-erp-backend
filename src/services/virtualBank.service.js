// src/services/virtualBank.service.js
import db from '../models/index.js';
import campaignService from './campaign.service.js';

class VirtualBankService {
    /**
     * Sanal banka webhook'unu işle
     * Postman veya Mock Server'dan gelen ödeme bildirimini alır
     */
    async processDeposit(payload) {
        const { campaignId, amount, senderName, transactionRef } = payload;

        // Kampanya var mı kontrol et
        const campaign = await campaignService.getCampaignById(campaignId);

        // Bağış kaydı oluştur
        const donation = await this.recordDonation({
            campaignId,
            amount,
            senderName,
            transactionRef
        });

        // Kampanyanın toplanan miktarını güncelle
        await campaignService.addDonationToCampaign(campaignId, amount);

        return {
            donation,
            campaign: await campaignService.getCampaignById(campaignId)
        };
    }

    /**
     * Bağış kaydı oluştur
     */
    async recordDonation({ campaignId, amount, senderName, transactionRef, memberId = null }) {
        const donation = await db.Donation.create({
            campaignId,
            memberId,
            donationAmount: amount,
            donationDate: new Date(),
            senderName: senderName || 'Anonim Bağışçı',
            transactionRef: transactionRef || `VB-${Date.now()}`,
            source: 'Sanal Banka',
            description: `Sanal Banka üzerinden bağış alındı`
        });

        return donation;
    }

    /**
     * Kampanyaya özel bağış simülasyonu
     * Test amaçlı kullanım için
     */
    async simulateDonation(campaignId, simulationData) {
        const { amount, senderName } = simulationData;

        // Benzersiz transaction referansı oluştur
        const transactionRef = `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return this.processDeposit({
            campaignId,
            amount,
            senderName: senderName || 'Simülasyon Bağışçı',
            transactionRef
        });
    }
}

export default new VirtualBankService();
