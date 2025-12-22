import * as EventService from '../services/event.service.js';
import * as ActivityLogService from '../services/activityLog.service.js';

/**
 * Yeni etkinlik oluştur
 * POST /api/events
 */
export const createEvent = async (req, res, next) => {
    try {
        const newEvent = await EventService.createEvent(req.body);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'CREATE',
            entityType: 'Event',
            entityId: newEvent.id,
            entityName: newEvent.eventName,
            adminId: req.user?.id,
            adminName: req.user?.fullName || 'Sistem',
            ipAddress: req.ip
        });

        res.status(201).json({
            success: true,
            message: 'Etkinlik başarıyla oluşturuldu.',
            data: newEvent
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
            const messages = error.errors ? error.errors.map(err => err.message) : [error.message];
            return res.status(400).json({
                success: false,
                message: 'Doğrulama hatası oluştu.',
                errors: messages
            });
        }
        next(error);
    }
};

/**
 * Tüm etkinlikleri getir
 * GET /api/events
 */
export const getAllEvents = async (req, res, next) => {
    try {
        // Query parametreleri varsa filtrelenmiş liste getir
        const { status, eventType, startDate, endDate } = req.query;

        let events;
        if (status || eventType || startDate || endDate) {
            events = await EventService.getFilteredEvents({ status, eventType, startDate, endDate });
        } else {
            events = await EventService.getAllEvents();
        }

        // Dashboard istatistiklerini al
        const stats = await EventService.getDashboardStats();

        res.status(200).json({
            success: true,
            count: events.length,
            stats: {
                totalEvents: stats.totalEvents,
                plannedEvents: stats.plannedEvents,
                completedEvents: stats.completedEvents,
                onlineEvents: stats.onlineEvents,
                offlineEvents: stats.offlineEvents
            },
            data: events
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ID'ye göre etkinlik getir
 * GET /api/events/:id
 */
export const getEventById = async (req, res, next) => {
    try {
        const event = await EventService.getEventById(req.params.id);

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

/**
 * Etkinlik güncelle
 * PUT /api/events/:id
 */
export const updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await EventService.updateEvent(req.params.id, req.body);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'UPDATE',
            entityType: 'Event',
            entityId: updatedEvent.id,
            entityName: updatedEvent.eventName,
            adminId: req.user?.id,
            adminName: req.user?.fullName || 'Sistem',
            ipAddress: req.ip
        });

        res.status(200).json({
            success: true,
            message: 'Etkinlik başarıyla güncellendi.',
            data: updatedEvent
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
            const messages = error.errors ? error.errors.map(err => err.message) : [error.message];
            return res.status(400).json({
                success: false,
                message: 'Doğrulama hatası oluştu.',
                errors: messages
            });
        }
        next(error);
    }
};

/**
 * Etkinlik sil
 * DELETE /api/events/:id
 */
export const deleteEvent = async (req, res, next) => {
    try {
        // Silmeden önce etkinlik bilgisini al
        const event = await EventService.getEventById(req.params.id);
        const eventName = event.eventName;

        await EventService.deleteEvent(req.params.id);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'DELETE',
            entityType: 'Event',
            entityId: parseInt(req.params.id),
            entityName: eventName,
            adminId: req.user?.id,
            adminName: req.user?.fullName || 'Sistem',
            ipAddress: req.ip
        });

        res.status(200).json({
            success: true,
            message: 'Etkinlik başarıyla silindi.'
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};


/**
 * Etkinlik durumunu güncelle
 * PATCH /api/events/:id/status
 */
export const updateEventStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status || !['Planlandı', 'Tamamlandı'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir durum belirtiniz. (Planlandı veya Tamamlandı)'
            });
        }

        const updatedEvent = await EventService.updateEventStatus(req.params.id, status);

        res.status(200).json({
            success: true,
            message: 'Etkinlik durumu başarıyla güncellendi.',
            data: updatedEvent
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};
