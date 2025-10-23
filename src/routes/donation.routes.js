// src/routes/donation.routes.js
import express from 'express';
import donationController from '../controllers/donation.controller.js';

const router = express.Router();

router.post('/', donationController.createDonation);
router.get('/', donationController.getAllCampaigns);
router.get('/:id', donationController.getCampaignById);

export default router;