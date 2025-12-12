import * as whatsappService from '../services/whatsapp.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/errorMessages.js';

// Duyuru gönderme işlemi
export const sendAnnouncement = asyncHandler(async (req, res) => {
  const { aliciListesi, mesajIcerigi } = req.body;

  if (!aliciListesi || aliciListesi.length === 0) {
    throw new AppError(ERROR_MESSAGES.WHATSAPP.RECIPIENTS_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }
  if (!mesajIcerigi) {
    throw new AppError(ERROR_MESSAGES.WHATSAPP.MESSAGE_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }
  
  const result = await whatsappService.sendAnnouncement(aliciListesi, mesajIcerigi);
  res.json({ success: true, ...result });
});

// Grup listesini çekme işlemi
export const listGroups = asyncHandler(async (req, res) => {
  const groups = await whatsappService.listGroups();
  res.json({ success: true, groups });
});

// İstemci durumunu çekme
export const getStatus = asyncHandler(async (req, res) => {
  const status = whatsappService.getStatus();
  res.json(status);
});