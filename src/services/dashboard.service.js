// src/services/dashboard.service.js
const db = require('../models');
const { Op } = db.Sequelize;

class DashboardService {
    async getDashboardMetrics() {
        // --- 1. Temel Sayımlar ---
        // Üye Sayısı (Member modelinin var olduğunu biliyoruz)
        const totalMembers = await db.Member.count();

        // Etkinlik Sayısı (Event modeli olmalı, varsayımsal sayım)
        // Eğer Event modeliniz 'db.Event' değilse, doğru model adını buraya yazın.
        const totalEvents = db.Event ? await db.Event.count() : 0; 
        
        // Döküman Sayısı (Döküman modeli olmalı, varsayımsal sayım)
        // Eğer Document modeliniz 'db.Document' değilse, doğru model adını buraya yazın.
        const totalDocuments = db.Document ? await db.Document.count() : 0; 

        // --- 2. Aylık Gelir Hesaplama (Collection Modelinden) ---
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Cari ay içinde gerçekleşen tahsilatları topla (para birimine göre gruplayarak)
        const monthlyIncome = await db.Collection.findAll({
            attributes: [
                'paymentMethod', 
                [db.Sequelize.fn('SUM', db.Sequelize.col('amountPaid')), 'totalAmount']
            ],
            where: {
                collectionDate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            },
            group: ['paymentMethod'] // Geliri ödeme yöntemine göre ayırabiliriz
        });

        // --- 3. Aylık Gider ve Finansal Rapor Placeholder'ları ---
        // Aylık Gider (Numan'ın görevi tamamlanana kadar sıfır veya placeholder)
        const monthlyExpense = [{ totalAmount: 0.00, currency: 'TL', note: 'Gider modeli ve kaydı henüz tamamlanmadı.' }]; // 
        
        // Finansal Raporlar GET Datası (Kübra/Numan planlaması bitince buraya eklenecek)
        // const financialReportsData = { status: 'Planning in progress' }; [cite: 23]

        return {
            totalMembers: totalMembers,
            totalEvents: totalEvents,
            totalDocuments: totalDocuments, 
            monthlyIncome: monthlyIncome.map(item => ({
                method: item.paymentMethod,
                amount: parseFloat(item.dataValues.totalAmount)
            })),
            monthlyExpense: monthlyExpense,
            // financialReportsData: financialReportsData
        };
    }
}

module.exports = new DashboardService();