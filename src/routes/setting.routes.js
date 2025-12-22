import express from 'express';
import { getSettings, updateSettings } from '../controllers/setting.controller.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;