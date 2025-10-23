// src/routes/donor.routes.js
import express from 'express';
import donorController from '../controllers/donor.controller.js';

const router = express.Router();

router.post('/', donorController.createDonor);
router.get('/', donorController.getAllDonors);

export default router;