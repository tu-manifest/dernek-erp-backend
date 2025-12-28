// src/routes/campaign.routes.js
import express from 'express';
import * as campaignController from '../controllers/campaign.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tüm campaign route'ları için authentication gerekli
router.use(authenticate);

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
