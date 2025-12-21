
import virtualBankService from '../services/virtualBank.service.js';


export const receiveDeposit = async (req, res, next) => {
    try {
        const { campaignId, amount, senderName, transactionRef, description } = req.body;

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
            transactionRef,
            description
        });

        // Eşleşme mesajı oluştur
        let matchMessage = '';
        if (result.donorMatched) {
            if (result.matchConfidence === 'full') {
                matchMessage = ` ✅ Dış bağışçı ile tam eşleşme: ${result.matchedDonor.name}`;
            } else if (result.matchConfidence === 'partial') {
                matchMessage = ` ⚠️ Dış bağışçı ile kısmi eşleşme: ${result.matchedDonor.name}`;
            } else {
                matchMessage = ` ℹ️ Dış bağışçı ID ile eşleşti: ${result.matchedDonor.name} (isim doğrulanamadı)`;
            }
        }

        res.status(200).json({
            success: true,
            message: `${amount} TL bağış başarıyla kaydedildi.${matchMessage}`,
            data: {
                donation: result.donation,
                campaign: {
                    id: result.campaign.id,
                    name: result.campaign.name,
                    collectedAmount: result.campaign.collectedAmount,
                    targetAmount: result.campaign.targetAmount
                },
                donorMatched: result.donorMatched,
                matchConfidence: result.matchConfidence,
                matchedDonor: result.matchedDonor
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

export const simulateDonation = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { amount, senderName, description } = req.body;

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
            senderName: senderName || 'Demo Bağışçı',
            description
        });

        // Eşleşme mesajı oluştur
        let matchMessage = '';
        if (result.donorMatched) {
            if (result.matchConfidence === 'full') {
                matchMessage = ` ✅ Dış bağışçı ile tam eşleşme: ${result.matchedDonor.name}`;
            } else if (result.matchConfidence === 'partial') {
                matchMessage = ` ⚠️ Dış bağışçı ile kısmi eşleşme: ${result.matchedDonor.name}`;
            } else {
                matchMessage = ` ℹ️ Dış bağışçı ID ile eşleşti: ${result.matchedDonor.name} (isim doğrulanamadı)`;
            }
        }

        res.status(200).json({
            success: true,
            message: `🎉 ${donationAmount} TL bağış simülasyonu başarılı!${matchMessage}`,
            data: {
                donation: result.donation,
                campaign: {
                    id: result.campaign.id,
                    name: result.campaign.name,
                    collectedAmount: result.campaign.collectedAmount,
                    targetAmount: result.campaign.targetAmount,
                    progress: `${((parseFloat(result.campaign.collectedAmount) / parseFloat(result.campaign.targetAmount)) * 100).toFixed(1)}%`
                },
                donorMatched: result.donorMatched,
                matchConfidence: result.matchConfidence,
                matchedDonor: result.matchedDonor
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
