import express from 'express';
import { register, login, getMe, getAllAdmins, getAdmin, updateAdmin, deleteAdmin } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register - Yeni yönetici kaydı
router.post("/register", register);

// POST /api/auth/login - Giriş yap
router.post("/login", login);

// GET /api/auth/me - Mevcut kullanıcı bilgisi (protected)
router.get("/me", authenticate, getMe);

// --- Yönetici Yönetimi Endpoint'leri ---

// GET /api/auth/admins - Tüm yöneticileri listele (protected)
router.get("/admins", authenticate, getAllAdmins);

// GET /api/auth/admins/:id - Belirli yönetici bilgisi (protected)
router.get("/admins/:id", authenticate, getAdmin);

// PUT /api/auth/admins/:id - Yönetici bilgilerini güncelle (protected)
router.put("/admins/:id", authenticate, updateAdmin);

// DELETE /api/auth/admins/:id - Yöneticiyi sil (protected)
router.delete("/admins/:id", authenticate, deleteAdmin);

export default router;
