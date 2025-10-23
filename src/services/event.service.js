import db from '../models/index.js';

const Event = db.Event;

export const createEvent = async (eventData) => {
  try {
    const newEvent = await Event.create(eventData);
    return newEvent;
  } catch (error) {
    console.error("Etkinlik oluşturulurken hata:", error);
    throw error;
  }
};