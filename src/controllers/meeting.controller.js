import * as MeetingService from '../services/meeting.service.js';
import * as ActivityLogService from '../services/activityLog.service.js';

/**
 * Yeni toplantı oluştur
 * POST /api/meetings
 */
export const createMeeting = async (req, res, next) => {
    try {
        const newMeeting = await MeetingService.createMeeting(req.body);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'CREATE',
            entityType: 'Meeting',
            entityId: newMeeting.id,
            entityName: newMeeting.title,
            adminId: req.user?.id,
            adminName: req.user?.fullName,
            ipAddress: req.ip,
        });

        res.status(201).json({
            success: true,
            message: 'Toplantı başarıyla oluşturuldu.',
            data: newMeeting,
        });
    } catch (error) {
        if (error.statusCode === 400) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
            const messages = error.errors ? error.errors.map(err => err.message) : [error.message];
            return res.status(400).json({
                success: false,
                message: 'Doğrulama hatası oluştu.',
                errors: messages,
            });
        }
        next(error);
    }
};

/**
 * Tüm toplantıları getir
 * GET /api/meetings
 */
export const getAllMeetings = async (req, res, next) => {
    try {
        // Query parametreleri varsa filtrelenmiş liste getir
        const { status, meetingType, meetingFormat, startDate, endDate, search } = req.query;

        let meetings;
        if (status || meetingType || meetingFormat || startDate || endDate || search) {
            meetings = await MeetingService.getFilteredMeetings({
                status,
                meetingType,
                meetingFormat,
                startDate,
                endDate,
                search,
            });
        } else {
            meetings = await MeetingService.getAllMeetings();
        }

        // Dashboard istatistiklerini al
        const stats = await MeetingService.getDashboardStats();

        res.status(200).json({
            success: true,
            count: meetings.length,
            stats: {
                totalMeetings: stats.totalMeetings,
                plannedMeetings: stats.plannedMeetings,
                completedMeetings: stats.completedMeetings,
                cancelledMeetings: stats.cancelledMeetings,
                onlineMeetings: stats.onlineMeetings,
                physicalMeetings: stats.physicalMeetings,
                byMeetingType: stats.byMeetingType,
            },
            upcomingMeetings: stats.upcomingMeetings,
            data: meetings,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ID'ye göre toplantı getir
 * GET /api/meetings/:id
 */
export const getMeetingById = async (req, res, next) => {
    try {
        const meeting = await MeetingService.getMeetingById(req.params.id);

        res.status(200).json({
            success: true,
            data: meeting,
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * Toplantı güncelle
 * PUT /api/meetings/:id
 */
export const updateMeeting = async (req, res, next) => {
    try {
        const updatedMeeting = await MeetingService.updateMeeting(req.params.id, req.body);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'UPDATE',
            entityType: 'Meeting',
            entityId: updatedMeeting.id,
            entityName: updatedMeeting.title,
            adminId: req.user?.id,
            adminName: req.user?.fullName,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Toplantı başarıyla güncellendi.',
            data: updatedMeeting,
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
            const messages = error.errors ? error.errors.map(err => err.message) : [error.message];
            return res.status(400).json({
                success: false,
                message: 'Doğrulama hatası oluştu.',
                errors: messages,
            });
        }
        next(error);
    }
};

/**
 * Toplantı sil
 * DELETE /api/meetings/:id
 */
export const deleteMeeting = async (req, res, next) => {
    try {
        // Silmeden önce toplantı bilgisini al
        const meeting = await MeetingService.getMeetingById(req.params.id);
        const meetingTitle = meeting.title;

        await MeetingService.deleteMeeting(req.params.id);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'DELETE',
            entityType: 'Meeting',
            entityId: parseInt(req.params.id),
            entityName: meetingTitle,
            adminId: req.user?.id,
            adminName: req.user?.fullName,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Toplantı başarıyla silindi.',
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * Toplantı durumunu güncelle
 * PATCH /api/meetings/:id/status
 */
export const updateMeetingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const validStatuses = ['Planlandı', 'Tamamlandı', 'İptal Edildi'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Geçerli bir durum belirtiniz. (${validStatuses.join(', ')})`,
            });
        }

        const updatedMeeting = await MeetingService.updateMeetingStatus(req.params.id, status);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'UPDATE',
            entityType: 'Meeting',
            entityId: updatedMeeting.id,
            entityName: `${updatedMeeting.title} - Durum: ${status}`,
            adminId: req.user?.id,
            adminName: req.user?.fullName,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Toplantı durumu başarıyla güncellendi.',
            data: updatedMeeting,
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};
