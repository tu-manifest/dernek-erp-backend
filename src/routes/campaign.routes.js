// src/routes/campaign.routes.js
import express from 'express';
import * as campaignController from '../controllers/campaign.controller.js';

const router = express.Router();

// CRUD işlemleri
router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);

// Durum güncelleme
router.patch('/:id/status', campaignController.updateCampaignStatus);

// Kampanyanın bağışlarını getir
router.get('/:id/donations', campaignController.getCampaignDonations);

export default router;
