import express from 'express';
import memberRoutes from './member.routes.js';
import groupRoutes from './group.routes.js';
const router = express.Router();



router.use("/members", memberRoutes);

router.use("/groups", groupRoutes);
export default router;
