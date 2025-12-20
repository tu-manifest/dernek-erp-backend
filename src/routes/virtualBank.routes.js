// src/routes/virtualBank.routes.js
import express from 'express';
import * as virtualBankController from '../controllers/virtualBank.controller.js';

const router = express.Router();

/**
 * Sanal Banka Webhook
 * Postman veya Mock Server'dan gelen ödeme bildirimlerini alır
 * 
 * Örnek Kullanım (Postman):
 * POST /api/virtual-bank/webhook
 * Body: {
 *   "campaignId": 1,
 *   "amount": 5,
 *   "senderName": "Test Bağışçı",
 *   "transactionRef": "VB-2024-12345"
 * }
 */
router.post('/webhook', virtualBankController.receiveDeposit);

/**
 * Kampanyaya Özel Bağış Simülasyonu
 * Derste telefondan butona basıp bağış simüle etmek için
 * 
 * Örnek Kullanım:
 * POST /api/virtual-bank/simulate/1
 * Body: {
 *   "amount": 100,
 *   "senderName": "Demo Kullanıcı"
 * }
 * 
 * NOT: amount belirtilmezse varsayılan 5 TL gönderilir
 */
router.post('/simulate/:campaignId', virtualBankController.simulateDonation);

export default router;
