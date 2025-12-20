// src/controllers/virtualBank.controller.js
import virtualBankService from '../services/virtualBank.service.js';

/**
 * Sanal banka webhook endpoint'i
 * Postman veya Mock Server'dan gelen ödeme bildirimlerini alır
 * POST /api/virtual-bank/webhook
 */
export const receiveDeposit = async (req, res, next) => {
    try {
        const { campaignId, amount, senderName, transactionRef } = req.body;

        // Zorunlu alan kontrolü
        if (!campaignId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'campaignId ve amount alanları zorunludur.'
            });
        }

        // Miktar kontrolü
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir miktar giriniz.'
            });
        }

        const result = await virtualBankService.processDeposit({
            campaignId,
            amount: parseFloat(amount),
            senderName,
            transactionRef
        });

        res.status(200).json({
            success: true,
            message: `${amount} TL bağış başarıyla kaydedildi.`,
            data: {
                donation: result.donation,
                campaign: {
                    id: result.campaign.id,
                    name: result.campaign.name,
                    collectedAmount: result.campaign.collectedAmount,
                    targetAmount: result.campaign.targetAmount
                }
            }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

/**
 * Kampanyaya özel bağış simülasyonu
 * Test için kullanılır - Derste butona basıp bağış simüle etmek için
 * POST /api/virtual-bank/simulate/:campaignId
 */
export const simulateDonation = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { amount, senderName } = req.body;

        // Varsayılan miktar 5 TL
        const donationAmount = amount ? parseFloat(amount) : 5;

        if (isNaN(donationAmount) || donationAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir miktar giriniz.'
            });
        }

        const result = await virtualBankService.simulateDonation(campaignId, {
            amount: donationAmount,
            senderName: senderName || 'Demo Bağışçı'
        });

        res.status(200).json({
            success: true,
            message: `🎉 ${donationAmount} TL bağış simülasyonu başarılı!`,
            data: {
                donation: result.donation,
                campaign: {
                    id: result.campaign.id,
                    name: result.campaign.name,
                    collectedAmount: result.campaign.collectedAmount,
                    targetAmount: result.campaign.targetAmount,
                    progress: `${((parseFloat(result.campaign.collectedAmount) / parseFloat(result.campaign.targetAmount)) * 100).toFixed(1)}%`
                }
            }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};
