// src/routes/finance.routes.js
const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');

// Borç Girişi Ekranı (Üye/Dış Borçlu ekleme)
router.post('/debt', financeController.addDebt);

// Borç Görüntüleme Ekranı (Ana Liste)
router.get('/debt', financeController.getDebtList);

// Borç Detayları (Detay Gör butonu için modal verisi)
router.get('/debt/:id', financeController.getDebtDetails);

// Tahsilat Kaydı Ekranı (Tahsilat işlemi kaydetme)
router.post('/collection', financeController.recordCollection);

// Tahsilat Ekranı için Borçlu Arama (3. harf sonrası çekme)
router.get('/debtor/search', financeController.searchDebtors);

module.exports = router;