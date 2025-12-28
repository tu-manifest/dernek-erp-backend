import express from 'express';
import * as meetingController from '../controllers/meeting.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tüm meeting route'ları için authentication gerekli
router.use(authenticate);

// CRUD işlemleri (toplantı yönetimi yetkisi gerekli)
router.post('/', authorize('canManageMeetings'), meetingController.createMeeting);
router.get('/', meetingController.getAllMeetings);
router.get('/:id', meetingController.getMeetingById);
router.put('/:id', authorize('canManageMeetings'), meetingController.updateMeeting);
router.delete('/:id', authorize('canManageMeetings'), meetingController.deleteMeeting);

// Durum güncelleme
router.patch('/:id/status', authorize('canManageMeetings'), meetingController.updateMeetingStatus);

export default router;
