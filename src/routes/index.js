import express from 'express';
import memberRoutes from './member.routes.js';
import groupRoutes from './group.routes.js';
import whatsappRoutes from './whatsapp.routes.js';
const router = express.Router();



router.use("/members", memberRoutes);

router.use("/groups", groupRoutes);
router.use("/whatsapp", whatsappRoutes);
export default router;
