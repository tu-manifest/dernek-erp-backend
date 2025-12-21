// src/routes/donor.routes.js
import express from 'express';
import donorController from '../controllers/donor.controller.js';

const router = express.Router();

router.post('/', donorController.createDonor);
router.get('/', donorController.getAllDonors);
router.get('/:id', donorController.getDonorById);
router.get('/:id/donations', donorController.getDonorDonations);
router.put('/:id', donorController.updateDonor);
router.delete('/:id', donorController.deleteDonor);

export default router;