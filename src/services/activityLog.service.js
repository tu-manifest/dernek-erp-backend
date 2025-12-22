import db from '../models/index.js';
import { Op } from 'sequelize';

const ActivityLog = db.ActivityLog;

/**
 * Yeni aktivite logu oluştur
 * @param {Object} data - Log verisi
 * @param {string} data.action - İşlem türü (CREATE, UPDATE, DELETE)
 * @param {string} data.entityType - Entity türü
 * @param {number} data.entityId - Entity ID
 * @param {string} data.entityName - Görüntülenecek isim
 * @param {number} data.adminId - Admin ID
 * @param {string} data.adminName - Admin adı
 * @param {Object} data.details - Değişiklik detayları
 * @param {string} data.ipAddress - IP adresi
 */
export const createLog = async (data) => {
    try {
        const log = await ActivityLog.create({
            action: data.action,
            entityType: data.entityType,
            entityId: data.entityId,
            entityName: data.entityName,
            adminId: data.adminId,
            adminName: data.adminName || 'Sistem',
            details: data.details,
            ipAddress: data.ipAddress,
        });
        return log;
    } catch (error) {
        // Log oluşturma hatası ana işlemi etkilememeli
        console.error('Aktivite logu oluşturulurken hata:', error.message);
        return null;
    }
};

/**
 * Tüm logları getir (filtreleme ve pagination destekli)
 * @param {Object} filters - Filtre parametreleri
 */
export const getAllLogs = async (filters = {}) => {
    const where = {};
    const { page = 1, limit = 50, entityType, action, adminId, startDate, endDate } = filters;

    if (entityType) {
        where.entityType = entityType;
    }

    if (action) {
        where.action = action;
    }

    if (adminId) {
        where.adminId = adminId;
    }

    if (startDate && endDate) {
        where.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        };
    } else if (startDate) {
        where.createdAt = {
            [Op.gte]: new Date(startDate)
        };
    } else if (endDate) {
        where.createdAt = {
            [Op.lte]: new Date(endDate)
        };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ActivityLog.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
    });

    return {
        logs: rows,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
        }
    };
};

/**
 * Belirli bir entity için logları getir
 */
export const getLogsByEntity = async (entityType, entityId) => {
    const logs = await ActivityLog.findAll({
        where: {
            entityType,
            entityId,
        },
        order: [['createdAt', 'DESC']],
    });
    return logs;
};

/**
 * Belirli bir admin için logları getir
 */
export const getLogsByAdmin = async (adminId, limit = 50) => {
    const logs = await ActivityLog.findAll({
        where: { adminId },
        order: [['createdAt', 'DESC']],
        limit,
    });
    return logs;
};

/**
 * Dashboard için son aktiviteleri getir
 */
export const getRecentLogs = async (limit = 10) => {
    const logs = await ActivityLog.findAll({
        order: [['createdAt', 'DESC']],
        limit,
    });
    return logs;
};

/**
 * İstatistikleri getir
 */
export const getStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, todayCount, createCount, updateCount, deleteCount] = await Promise.all([
        ActivityLog.count(),
        ActivityLog.count({ where: { createdAt: { [Op.gte]: today } } }),
        ActivityLog.count({ where: { action: 'CREATE' } }),
        ActivityLog.count({ where: { action: 'UPDATE' } }),
        ActivityLog.count({ where: { action: 'DELETE' } }),
    ]);

    return {
        total,
        today: todayCount,
        byAction: {
            create: createCount,
            update: updateCount,
            delete: deleteCount,
        }
    };
};
