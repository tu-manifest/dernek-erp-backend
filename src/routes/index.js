import express from 'express';
import memberRoutes from './member.routes.js';
import groupRoutes from './group.routes.js';
import whatsappRoutes from './whatsapp.routes.js';
const router = express.Router();

const memberRoutes = require('./member.routes');
const groupRoutes = require('./group.routes');
const financeRoutes = require('./finance.routes'); // YENİ: Finans Rotasını İçeri Aktar

module.exports = (app) => {
  app.use('/api/members', memberRoutes);
  app.use('/api/groups', groupRoutes);
  app.use('/api/finance', financeRoutes); // YENİ: Finans Rotasını /api/finance altına bağla
};

router.use("/members", memberRoutes);

router.use("/groups", groupRoutes);
router.use("/whatsapp", whatsappRoutes);
export default router;
