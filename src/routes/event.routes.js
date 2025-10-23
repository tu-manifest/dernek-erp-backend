import express from 'express';
import * as eventController from '../controllers/event.controller.js';

const router = express.Router();

router.post('/', eventController.createEvent);

export default router;