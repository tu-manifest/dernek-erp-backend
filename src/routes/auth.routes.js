import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register - Yeni yönetici kaydı
router.post("/register", register);

// POST /api/auth/login - Giriş yap
router.post("/login", login);

// GET /api/auth/me - Mevcut kullanıcı bilgisi (protected)
router.get("/me", authenticate, getMe);

export default router;
