import express from 'express';
import memberRoutes from './member.routes.js';
import groupRoutes from './group.routes.js';
const router = express.Router();



router.use("/member", memberRoutes);
router.use("/group", groupRoutes);
export default router;
