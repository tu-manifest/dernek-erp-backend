import * as whatsappService from '../services/whatsapp.service.js';

// Duyuru gönderme işlemi
export const sendAnnouncement = async (req, res) => {
    try {
        const { aliciListesi, mesajIcerigi } = req.body;

        if (!aliciListesi || aliciListesi.length === 0 || !mesajIcerigi) {
            return res.status(400).json({ success: false, message: 'Alıcı listesi veya mesaj içeriği eksik.' });
        }
        
        const result = await whatsappService.sendAnnouncement(aliciListesi, mesajIcerigi);

        res.json({ success: true, ...result });
    } catch (error) {
        // Servisten gelen "Hazır Değil" hatasını yakala
        if (error.message.includes('Hazır Değil')) {
             return res.status(503).json({ success: false, message: error.message });
        }
        console.error('Duyuru Gönderilirken Hata:', error);
        res.status(500).json({ success: false, message: 'Sunucu Hatası.' });
    }
};

// Grup listesini çekme işlemi
export const listGroups = async (req, res) => {
    try {
        const groups = await whatsappService.listGroups();
        res.json({ success: true, groups });
    } catch (error) {
        if (error.message.includes('Hazır Değil')) {
             return res.status(503).json({ success: false, message: error.message });
        }
        console.error('Grup Listesi Çekilirken Hata:', error);
        res.status(500).json({ success: false, message: 'Sunucu Hatası.' });
    }
};

// İstemci durumunu çekme
export const getStatus = async (req, res) => {
    const status = whatsappService.getStatus();
    res.json(status);
};