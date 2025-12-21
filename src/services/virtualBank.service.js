// src/services/virtualBank.service.js
import db from '../models/index.js';
import campaignService from './campaign.service.js';

class VirtualBankService {
    /**
     * Sanal banka webhook'unu işle
     * Postman veya Mock Server'dan gelen ödeme bildirimini alır
     */
    async processDeposit(payload) {
        const { campaignId, amount, senderName, transactionRef, description } = payload;

        // Kampanya var mı kontrol et
        const campaign = await campaignService.getCampaignById(campaignId);

        // Description'dan donor ID'si çıkar (sadece sayı ise)
        let donorId = null;
        let donor = null;
        let matchConfidence = 'none'; // none, partial, full

        if (description && /^\d+$/.test(description.trim())) {
            const potentialDonorId = parseInt(description.trim(), 10);
            donor = await db.Donor.findByPk(potentialDonorId);
            if (donor) {
                donorId = potentialDonorId;

                // SenderName ile donor adını karşılaştır
                if (senderName) {
                    const normalizedSenderName = senderName.toLowerCase().trim();
                    const normalizedDonorName = donor.name.toLowerCase().trim();

                    if (normalizedSenderName === normalizedDonorName) {
                        // Tam eşleşme
                        matchConfidence = 'full';
                    } else if (normalizedSenderName.includes(normalizedDonorName) ||
                        normalizedDonorName.includes(normalizedSenderName)) {
                        // Kısmi eşleşme (biri diğerini içeriyor)
                        matchConfidence = 'partial';
                    } else {
                        // ID eşleşti ama isim farklı
                        matchConfidence = 'id_only';
                    }
                } else {
                    // SenderName yok, sadece ID ile eşleşti
                    matchConfidence = 'id_only';
                }
            }
        }

        // Bağış kaydı oluştur
        const donation = await this.recordDonation({
            campaignId,
            amount,
            senderName,
            transactionRef,
            description,
            donorId
        });

        // Kampanyanın toplanan miktarını güncelle
        await campaignService.addDonationToCampaign(campaignId, amount);

        return {
            donation,
            campaign: await campaignService.getCampaignById(campaignId),
            donorMatched: donorId !== null,
            matchConfidence,
            matchedDonor: donor ? { id: donor.id, name: donor.name, type: donor.type } : null
        };
    }

    /**
     * Bağış kaydı oluştur
     */
    async recordDonation({ campaignId, amount, senderName, transactionRef, memberId = null, description = null, donorId = null }) {
        const donation = await db.Donation.create({
            campaignId,
            memberId,
            donorId,
            donationAmount: amount,
            donationDate: new Date(),
            senderName: senderName || 'Anonim Bağışçı',
            transactionRef: transactionRef || `VB-${Date.now()}`,
            source: 'Sanal Banka',
            description: description || 'Sanal Banka üzerinden bağış alındı'
        });

        return donation;
    }

    /**
     * Kampanyaya özel bağış simülasyonu
     * Test amaçlı kullanım için
     */
    async simulateDonation(campaignId, simulationData) {
        const { amount, senderName, description } = simulationData;

        // Benzersiz transaction referansı oluştur
        const transactionRef = `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return this.processDeposit({
            campaignId,
            amount,
            senderName: senderName || 'Simülasyon Bağışçı',
            transactionRef,
            description
        });
    }
}

export default new VirtualBankService();
