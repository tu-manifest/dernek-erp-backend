import db from '../models/index.js';
import { Op } from 'sequelize';

const Event = db.Event;

/**
 * Geçmiş etkinliklerin durumunu otomatik güncelle
 */
export const updateExpiredEvents = async () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS formatı

  // Tarihi geçmiş VEYA bugün ama saati geçmiş etkinlikleri güncelle
  await Event.update(
    { status: 'Tamamlandı' },
    {
      where: {
        status: 'Planlandı',
        [Op.or]: [
          // Tarihi geçmiş olanlar
          { date: { [Op.lt]: today } },
          // Bugün ama saati geçmiş olanlar
          {
            date: today,
            time: { [Op.lt]: currentTime }
          }
        ]
      }
    }
  );
};

/**
 * Yeni etkinlik oluştur
 */
export const createEvent = async (eventData) => {
  // Geçmiş tarih kontrolü
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0];

  const eventDate = eventData.date;
  const eventTime = eventData.time;

  // Geçmiş tarih kontrolü
  if (eventDate < today) {
    const error = new Error('Geçmiş bir tarihe etkinlik oluşturamazsınız. Yalnızca ileri bir tarihte etkinlik planlayabilirsiniz.');
    error.statusCode = 400;
    throw error;
  }

  // Bugün ise saat kontrolü
  if (eventDate === today && eventTime < currentTime) {
    const error = new Error('Geçmiş bir saate etkinlik oluşturamazsınız. Yalnızca ileri bir saatte etkinlik planlayabilirsiniz.');
    error.statusCode = 400;
    throw error;
  }

  const newEvent = await Event.create(eventData);
  return newEvent;
};

/**
 * Tüm etkinlikleri getir
 */
export const getAllEvents = async () => {
  // Önce geçmiş etkinliklerin durumunu güncelle
  await updateExpiredEvents();

  const events = await Event.findAll({
    order: [['date', 'ASC'], ['time', 'ASC']],
  });
  return events;
};

/**
 * ID'ye göre etkinlik getir
 */
export const getEventById = async (id) => {
  const event = await Event.findByPk(id);
  if (!event) {
    const error = new Error('Etkinlik bulunamadı.');
    error.statusCode = 404;
    throw error;
  }
  return event;
};

/**
 * Etkinlik güncelle
 */
export const updateEvent = async (id, eventData) => {
  const event = await Event.findByPk(id);
  if (!event) {
    const error = new Error('Etkinlik bulunamadı.');
    error.statusCode = 404;
    throw error;
  }

  await event.update(eventData);
  return event;
};

/**
 * Etkinlik sil
 */
export const deleteEvent = async (id) => {
  const event = await Event.findByPk(id);
  if (!event) {
    const error = new Error('Etkinlik bulunamadı.');
    error.statusCode = 404;
    throw error;
  }

  await event.destroy();
  return { message: 'Etkinlik başarıyla silindi.' };
};

/**
 * Dashboard istatistikleri
 */
export const getDashboardStats = async () => {
  const today = new Date().toISOString().split('T')[0];

  // Toplam etkinlik sayısı
  const totalEvents = await Event.count();

  // Planlanan etkinlikler (bugün veya sonrası)
  const plannedEvents = await Event.count({
    where: {
      status: 'Planlandı',
    }
  });

  // Tamamlanan etkinlikler
  const completedEvents = await Event.count({
    where: {
      status: 'Tamamlandı',
    }
  });

  // Online etkinlikler
  const onlineEvents = await Event.count({
    where: {
      eventType: 'Online',
    }
  });

  // Fiziksel (Offline) etkinlikler
  const offlineEvents = await Event.count({
    where: {
      eventType: 'Fiziksel',
    }
  });

  // Yaklaşan etkinlikler (bugün ve sonrası, planlandı durumunda)
  const upcomingEvents = await Event.findAll({
    where: {
      date: {
        [Op.gte]: today
      },
      status: 'Planlandı'
    },
    order: [['date', 'ASC'], ['time', 'ASC']],
    limit: 5
  });

  return {
    totalEvents,
    plannedEvents,
    completedEvents,
    onlineEvents,
    offlineEvents,
    upcomingEvents
  };
};

/**
 * Etkinlik durumunu güncelle
 */
export const updateEventStatus = async (id, status) => {
  const event = await Event.findByPk(id);
  if (!event) {
    const error = new Error('Etkinlik bulunamadı.');
    error.statusCode = 404;
    throw error;
  }

  await event.update({ status });
  return event;
};

/**
 * Filtrelenmiş etkinlik listesi
 */
export const getFilteredEvents = async (filters) => {
  // Önce geçmiş etkinliklerin durumunu güncelle
  await updateExpiredEvents();

  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.eventType) {
    where.eventType = filters.eventType;
  }

  if (filters.startDate && filters.endDate) {
    where.date = {
      [Op.between]: [filters.startDate, filters.endDate]
    };
  } else if (filters.startDate) {
    where.date = {
      [Op.gte]: filters.startDate
    };
  } else if (filters.endDate) {
    where.date = {
      [Op.lte]: filters.endDate
    };
  }

  const events = await Event.findAll({
    where,
    order: [['date', 'ASC'], ['time', 'ASC']],
  });

  return events;
};