import express from 'express';
import memberRoutes from './member.routes.js';
import groupRoutes from './group.routes.js';
import whatsappRoutes from './whatsapp.routes.js';
import eventRoutes from './event.routes.js';
import financeRoutes from './finance.routes.js';
import donationRoutes from './donation.routes.js';
import donorRoutes from './donor.routes.js';
import authRoutes from './auth.routes.js';
import campaignRoutes from './campaign.routes.js';
import virtualBankRoutes from './virtualBank.routes.js';
import fixedAssetRoutes from './fixedAsset.routes.js';
import documentRoutes from './document.routes.js';
import settingRoutes from './setting.routes.js';
import activityLogRoutes from './activityLog.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import budgetPlanRoutes from './budgetPlan.routes.js';
import expenseRoutes from './expense.routes.js';

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/members", memberRoutes);
router.use("/groups", groupRoutes);
router.use("/whatsapp", whatsappRoutes);
router.use("/events", eventRoutes);
router.use("/finance", financeRoutes);
router.use("/donations", donationRoutes);
router.use("/donors", donorRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/virtual-bank", virtualBankRoutes);
router.use("/fixed-assets", fixedAssetRoutes);
router.use("/documents", documentRoutes);
router.use('/settings', settingRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/budget', budgetPlanRoutes);
router.use('/expenses', expenseRoutes);

export default router;


