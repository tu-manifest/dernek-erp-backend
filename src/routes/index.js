// src/routes/index.js

import { Router } from 'express';
import memberRoutes from './member.routes.js';
import eventRoutes from './event.routes.js';
import groupRoutes from './group.routes.js';
import financeRoutes from './finance.routes.js';
import donationRoutes from './donation.routes.js';
import donorRoutes from './donor.routes.js';
import whatsappRoutes from './whatsapp.routes.js';
import dashboardRoutes from './dashboard.routes.js'; 
const router = Router();

router.use('/members', memberRoutes);
router.use('/events', eventRoutes);
router.use('/groups', groupRoutes);
router.use('/finance', financeRoutes);
router.use('/donations', donationRoutes);
router.use('/donors', donorRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/dashboard', dashboardRoutes); 

export default router;