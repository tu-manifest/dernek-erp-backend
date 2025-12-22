// src/controllers/dashboard.controller.js
import db from '../models/index.js';
import { Op } from 'sequelize';

const { Member, Event, Document, Collection, Donation } = db;

/**
 * Dashboard istatistiklerini getir
 * GET /api/dashboard/stats
 */
export const getDashboardStats = async (req, res) => {
    try {
        // 1. Toplam üye sayısı
        const totalMembers = await Member.count();

        // 2. Aktif etkinlik sayısı (Planlandı durumunda olanlar)
        const activeEvents = await Event.count({
            where: {
                status: 'Planlandı'
            }
        });

        // 3. Toplam döküman sayısı
        const totalDocuments = await Document.count();

        // 4. Aylık gelir hesaplama (Bu ayın tahsilatları + bağışları)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // Tahsilatlar (Collections) - bu ay
        const monthlyCollections = await Collection.sum('amountPaid', {
            where: {
                collectionDate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        }) || 0;

        // Bağışlar (Donations) - bu ay
        const monthlyDonations = await Donation.sum('donationAmount', {
            where: {
                donationDate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        }) || 0;

        // Toplam aylık gelir
        const monthlyIncome = parseFloat(monthlyCollections) + parseFloat(monthlyDonations);

        res.status(200).json({
            success: true,
            data: {
                totalMembers,
                activeEvents,
                totalDocuments,
                monthlyIncome: parseFloat(monthlyIncome.toFixed(2)),
                period: {
                    month: now.toLocaleString('tr-TR', { month: 'long' }),
                    year: now.getFullYear()
                }
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Dashboard istatistikleri alınırken bir hata oluştu.',
            error: error.message
        });
    }
};
