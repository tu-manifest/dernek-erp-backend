import db from '../models/index.js';
import { Op } from 'sequelize';

const Meeting = db.Meeting;

/**
 * Geçmiş toplantıların durumunu otomatik güncelle
 */
export const updateExpiredMeetings = async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS formatı

    // Tarihi geçmiş VEYA bugün ama bitiş saati geçmiş toplantıları güncelle
    await Meeting.update(
        { status: 'Tamamlandı' },
        {
            where: {
                status: 'Planlandı',
                [Op.or]: [
                    // Tarihi geçmiş olanlar
                    { date: { [Op.lt]: today } },
                    // Bugün ama bitiş saati geçmiş olanlar
                    {
                        date: today,
                        endTime: { [Op.lt]: currentTime },
                    },
                ],
            },
        }
    );
};

/**
 * Yeni toplantı oluştur
 * @param {Object} meetingData - Toplantı verileri
 * @returns {Promise<Object>} Oluşturulan toplantı
 */
export const createMeeting = async (meetingData) => {
    // Geçmiş tarih kontrolü
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    const meetingDate = meetingData.date;
    const meetingStartTime = meetingData.startTime;

    // Geçmiş tarih kontrolü
    if (meetingDate < today) {
        const error = new Error('Geçmiş bir tarihe toplantı oluşturamazsınız. Yalnızca ileri bir tarihte toplantı planlayabilirsiniz.');
        error.statusCode = 400;
        throw error;
    }

    // Bugün ise saat kontrolü
    if (meetingDate === today && meetingStartTime < currentTime) {
        const error = new Error('Geçmiş bir saate toplantı oluşturamazsınız. Yalnızca ileri bir saatte toplantı planlayabilirsiniz.');
        error.statusCode = 400;
        throw error;
    }

    const newMeeting = await Meeting.create(meetingData);
    return newMeeting;
};

/**
 * Tüm toplantıları getir
 * @returns {Promise<Array>} Toplantı listesi
 */
export const getAllMeetings = async () => {
    // Önce geçmiş toplantıların durumunu güncelle
    await updateExpiredMeetings();

    const meetings = await Meeting.findAll({
        order: [['date', 'ASC'], ['startTime', 'ASC']],
    });
    return meetings;
};

/**
 * ID'ye göre toplantı getir
 * @param {number} id - Toplantı ID'si
 * @returns {Promise<Object>} Toplantı
 */
export const getMeetingById = async (id) => {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
        const error = new Error('Toplantı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }
    return meeting;
};

/**
 * Toplantı güncelle
 * @param {number} id - Toplantı ID'si
 * @param {Object} meetingData - Güncellenecek veriler
 * @returns {Promise<Object>} Güncellenmiş toplantı
 */
export const updateMeeting = async (id, meetingData) => {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
        const error = new Error('Toplantı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    await meeting.update(meetingData);
    return meeting;
};

/**
 * Toplantı sil
 * @param {number} id - Toplantı ID'si
 * @returns {Promise<Object>} Silme sonucu
 */
export const deleteMeeting = async (id) => {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
        const error = new Error('Toplantı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    await meeting.destroy();
    return { message: 'Toplantı başarıyla silindi.' };
};

/**
 * Toplantı durumunu güncelle
 * @param {number} id - Toplantı ID'si
 * @param {string} status - Yeni durum
 * @returns {Promise<Object>} Güncellenmiş toplantı
 */
export const updateMeetingStatus = async (id, status) => {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
        const error = new Error('Toplantı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    await meeting.update({ status });
    return meeting;
};

/**
 * Dashboard istatistikleri
 * @returns {Promise<Object>} İstatistikler
 */
export const getDashboardStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Toplam toplantı sayısı
    const totalMeetings = await Meeting.count();

    // Planlanan toplantılar
    const plannedMeetings = await Meeting.count({
        where: {
            status: 'Planlandı',
        },
    });

    // Tamamlanan toplantılar
    const completedMeetings = await Meeting.count({
        where: {
            status: 'Tamamlandı',
        },
    });

    // İptal edilen toplantılar
    const cancelledMeetings = await Meeting.count({
        where: {
            status: 'İptal Edildi',
        },
    });

    // Çevrimiçi toplantılar
    const onlineMeetings = await Meeting.count({
        where: {
            meetingFormat: 'Çevrimiçi',
        },
    });

    // Fiziksel toplantılar
    const physicalMeetings = await Meeting.count({
        where: {
            meetingFormat: 'Fiziksel',
        },
    });

    // Toplantı türlerine göre dağılım
    const byMeetingType = await Meeting.findAll({
        attributes: [
            'meetingType',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        ],
        group: ['meetingType'],
    });

    // Yaklaşan toplantılar (bugün ve sonrası, planlandı durumunda)
    const upcomingMeetings = await Meeting.findAll({
        where: {
            date: {
                [Op.gte]: today,
            },
            status: 'Planlandı',
        },
        order: [['date', 'ASC'], ['startTime', 'ASC']],
        limit: 5,
    });

    return {
        totalMeetings,
        plannedMeetings,
        completedMeetings,
        cancelledMeetings,
        onlineMeetings,
        physicalMeetings,
        byMeetingType,
        upcomingMeetings,
    };
};

/**
 * Filtrelenmiş toplantı listesi
 * @param {Object} filters - Filtre parametreleri
 * @returns {Promise<Array>} Filtrelenmiş toplantılar
 */
export const getFilteredMeetings = async (filters) => {
    // Önce geçmiş toplantıların durumunu güncelle
    await updateExpiredMeetings();

    const where = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.meetingType) {
        where.meetingType = filters.meetingType;
    }

    if (filters.meetingFormat) {
        where.meetingFormat = filters.meetingFormat;
    }

    if (filters.startDate && filters.endDate) {
        where.date = {
            [Op.between]: [filters.startDate, filters.endDate],
        };
    } else if (filters.startDate) {
        where.date = {
            [Op.gte]: filters.startDate,
        };
    } else if (filters.endDate) {
        where.date = {
            [Op.lte]: filters.endDate,
        };
    }

    // Arama (başlık veya gündem)
    if (filters.search) {
        where[Op.or] = [
            { title: { [Op.iLike]: `%${filters.search}%` } },
            { agenda: { [Op.iLike]: `%${filters.search}%` } },
        ];
    }

    const meetings = await Meeting.findAll({
        where,
        order: [['date', 'ASC'], ['startTime', 'ASC']],
    });

    return meetings;
};
