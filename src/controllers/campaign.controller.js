// src/controllers/campaign.controller.js
import campaignService from '../services/campaign.service.js';

/**
 * Yeni kampanya oluştur
 * POST /api/campaigns
 */
export const createCampaign = async (req, res, next) => {
    try {
        const campaign = await campaignService.createCampaign(req.body);

        res.status(201).json({
            success: true,
            message: 'Kampanya başarıyla oluşturuldu.',
            data: campaign
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
            const messages = error.errors ? error.errors.map(err => err.message) : [error.message];
            return res.status(400).json({
                success: false,
                message: 'Doğrulama hatası oluştu.',
                errors: messages
            });
        }
        next(error);
    }
};

/**
 * Tüm kampanyaları getir
 * GET /api/campaigns
 */
export const getAllCampaigns = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getAllCampaigns();
        const stats = await campaignService.getDashboardStats();

        res.status(200).json({
            success: true,
            count: campaigns.length,
            stats,
            data: campaigns
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ID'ye göre kampanya getir
 * GET /api/campaigns/:id
 */
export const getCampaignById = async (req, res, next) => {
    try {
        const campaign = await campaignService.getCampaignById(req.params.id);

        res.status(200).json({
            success: true,
            data: campaign
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
 * Kampanya güncelle
 * PUT /api/campaigns/:id
 */
export const updateCampaign = async (req, res, next) => {
    try {
        const campaign = await campaignService.updateCampaign(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Kampanya başarıyla güncellendi.',
            data: campaign
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
            const messages = error.errors ? error.errors.map(err => err.message) : [error.message];
            return res.status(400).json({
                success: false,
                message: 'Doğrulama hatası oluştu.',
                errors: messages
            });
        }
        next(error);
    }
};

/**
 * Kampanya sil
 * DELETE /api/campaigns/:id
 */
export const deleteCampaign = async (req, res, next) => {
    try {
        await campaignService.deleteCampaign(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Kampanya başarıyla silindi.'
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
 * Kampanya durumunu güncelle
 * PATCH /api/campaigns/:id/status
 */
export const updateCampaignStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status || !['Aktif', 'Tamamlandı', 'Durduruldu'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir durum belirtiniz. (Aktif, Tamamlandı veya Durduruldu)'
            });
        }

        const campaign = await campaignService.updateCampaignStatus(req.params.id, status);

        res.status(200).json({
            success: true,
            message: 'Kampanya durumu başarıyla güncellendi.',
            data: campaign
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
 * Kampanyanın bağışlarını getir
 * GET /api/campaigns/:id/donations
 */
export const getCampaignDonations = async (req, res, next) => {
    try {
        const donations = await campaignService.getCampaignDonations(req.params.id);

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
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
