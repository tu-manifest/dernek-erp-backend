import express from 'express';
import * as whatsappController from '../controllers/whatsapp.controller.js';
const router = express.Router();

// POST /api/whatsapp/send - Duyuru Gönderme
router.post('/send', whatsappController.sendAnnouncement);

// GET /api/whatsapp/groups - Grup Listesini Çekme
router.get('/groups', whatsappController.listGroups);

// GET /api/whatsapp/status - İstemci Durumunu Kontrol Etme (QR/Ready durumu için)
router.get('/status', whatsappController.getStatus);

export default router