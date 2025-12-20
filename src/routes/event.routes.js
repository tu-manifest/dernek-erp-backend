import express from 'express';
import * as eventController from '../controllers/event.controller.js';

const router = express.Router();

// CRUD işlemleri
router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Durum güncelleme
router.patch('/:id/status', eventController.updateEventStatus);

export default router;
