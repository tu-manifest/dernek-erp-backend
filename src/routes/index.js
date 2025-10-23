import express from 'express';
import memberRoutes from './member.routes.js';
import groupRoutes from './group.routes.js';
import whatsappRoutes from './whatsapp.routes.js';
import eventRoutes from './event.routes.js';
import financeRoutes from './finance.routes.js';
import donationRoutes from './donation.routes.js';
import donorRoutes from './donor.routes.js';

const router = express.Router();

router.use("/members", memberRoutes);
router.use("/groups", groupRoutes);
router.use("/whatsapp", whatsappRoutes);
router.use("/events", eventRoutes);
router.use("/finance", financeRoutes);
router.use("/donations", donationRoutes);
router.use("/donors", donorRoutes);

export default router;
