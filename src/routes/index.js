// src/routes/index.js
const memberRoutes = require('./member.routes');
const groupRoutes = require('./group.routes');
const financeRoutes = require('./finance.routes'); 
const whatsappRoutes = require('./whatsapp.routes');
const dashboardRoutes = require('./dashboard.routes');

// Bu dosya, Express uygulamasını (app) alır ve tüm rotaları ona bağlar.
module.exports = (app) => {
  // Tüm rotalarınızın başlangıcına '/api' önekini ekler
  app.use('/api/members', memberRoutes);
  app.use('/api/groups', groupRoutes);
  app.use('/api/finance', financeRoutes); 
  app.use('/api/whatsapp', whatsappRoutes);
  app.use('/api/dashboard', dashboardRoutes); 
};