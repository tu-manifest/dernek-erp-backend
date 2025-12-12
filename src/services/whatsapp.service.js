import { isClientReady, sendMessage, getGroups, getClient } from '../utils/whatsappClient.js';
import { AppError } from '../middlewares/errorHandler.js';
import { ERROR_MESSAGES, HTTP_STATUS, formatErrorMessage } from '../constants/errorMessages.js';

/**
 * WhatsApp istemcisinin mevcut durumunu döndürür.
 */
export const getStatus = () => {
    return {
        ready: isClientReady(),
        message: isClientReady() ? 'Bağlı ve Hazır' : 'Bağlantı Bekleniyor (QR Kodu Gerekebilir)'
    };
};

/**
 * Gönderme işlemini gerçekleştirir.
 * @param {Array<string>} aliciListesi - Hedef listesi (numara veya Grup ID)
 * @param {string} mesajIcerigi - Gönderilecek mesaj
 */
export const sendAnnouncement = async (aliciListesi, mesajIcerigi) => {
    if (!isClientReady()) {
        throw new AppError(ERROR_MESSAGES.WHATSAPP.NOT_READY, HTTP_STATUS.SERVICE_UNAVAILABLE);
    }

    const gonderimSonuclari = [];

    for (const hedef of aliciListesi) {
        const result = await sendMessage(hedef, mesajIcerigi);
        gonderimSonuclari.push({ hedef, ...result });
    }

    return {
        message: `${gonderimSonuclari.length} hedefe gönderim denemesi yapıldı.`,
        sonuclar: gonderimSonuclari
    };
};

/**
 * Bağlı olunan tüm grupların listesini çeker.
 */
export const listGroups = async () => {
    if (!isClientReady()) {
        throw new AppError(ERROR_MESSAGES.WHATSAPP.NOT_READY, HTTP_STATUS.SERVICE_UNAVAILABLE);
    }
    return await getGroups();
};