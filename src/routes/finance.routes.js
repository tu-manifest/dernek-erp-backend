
import express from 'express';
import financeController from '../controllers/finance.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tüm finance route'ları için authentication gerekli
router.use(authenticate);

// Borç Girişi Ekranı (Üye/Dış Borçlu ekleme)
router.post('/debt', financeController.addDebt);

// Borç Görüntüleme Ekranı (Ana Liste)
router.get('/debt', financeController.getDebtList);

// Borç Detayları (Detay Gör butonu için modal verisi)
router.get('/debt/:id', financeController.getDebtDetails);

// Borç Güncelleme
router.put('/debt/:id', financeController.updateDebt);

// Borç Silme
router.delete('/debt/:id', financeController.deleteDebt);

// Tahsilat Kaydı Ekranı (Kategorik - tek borca ödeme)
router.post('/collection', financeController.recordCollection);

// Toplu Ödeme (Miktarsal - FIFO dağıtım)
router.post('/collection/bulk', financeController.bulkPayment);

// Borçlu Arama (3. harf sonrası)
router.get('/debtor/search', financeController.searchDebtors);

// Borçlu Özeti (toplam borç, ödenen, kalan)
router.get('/debtor/:type/:id/summary', financeController.getDebtorSummary);

// Borçlu Listesi (İsme göre gruplandırılmış)
router.get('/debtors', financeController.getDebtorList);

export default router;