import * as ActivityLogService from '../services/activityLog.service.js';

/**
 * Tüm logları getir (filtreleme ve pagination destekli)
 * GET /api/activity-logs
 */
export const getAllLogs = async (req, res, next) => {
    try {
        const { page, limit, entityType, action, adminId, startDate, endDate } = req.query;

        const result = await ActivityLogService.getAllLogs({
            page,
            limit,
            entityType,
            action,
            adminId,
            startDate,
            endDate,
        });

        // displayMessage'ı response'a ekle
        const logsWithMessage = result.logs.map(log => ({
            ...log.toJSON(),
            displayMessage: log.displayMessage,
        }));

        res.status(200).json({
            success: true,
            data: logsWithMessage,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Belirli bir entity için logları getir
 * GET /api/activity-logs/entity/:entityType/:entityId
 */
export const getLogsByEntity = async (req, res, next) => {
    try {
        const { entityType, entityId } = req.params;

        const logs = await ActivityLogService.getLogsByEntity(entityType, parseInt(entityId));

        const logsWithMessage = logs.map(log => ({
            ...log.toJSON(),
            displayMessage: log.displayMessage,
        }));

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logsWithMessage,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Son aktiviteleri getir (dashboard için)
 * GET /api/activity-logs/recent
 */
export const getRecentLogs = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;

        const logs = await ActivityLogService.getRecentLogs(parseInt(limit));

        const logsWithMessage = logs.map(log => ({
            ...log.toJSON(),
            displayMessage: log.displayMessage,
        }));

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logsWithMessage,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * İstatistikleri getir
 * GET /api/activity-logs/stats
 */
export const getStats = async (req, res, next) => {
    try {
        const stats = await ActivityLogService.getStats();

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};
