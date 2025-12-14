import * as AuthService from '../services/auth.service.js';

/**
 * POST /api/auth/register
 * Yeni yönetici kaydı oluşturur
 */
export const register = async (req, res, next) => {
    try {
        const newAdmin = await AuthService.register(req.body);

        res.status(201).json({
            success: true,
            message: 'Yönetici kaydı başarıyla oluşturuldu.',
            admin: newAdmin,
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Doğrulama hatası oluştu.',
                errors: messages,
            });
        }
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * POST /api/auth/login
 * E-posta ve şifre ile giriş yapar
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validasyon
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'E-posta ve şifre gereklidir.',
            });
        }

        const result = await AuthService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'Giriş başarılı.',
            admin: result.admin,
            token: result.token,
            expiresIn: result.expiresIn,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * GET /api/auth/me
 * Mevcut giriş yapmış yönetici bilgisini getirir
 */
export const getMe = async (req, res, next) => {
    try {
        // req.user middleware tarafından ekleniyor
        const admin = await AuthService.getAdminById(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Yönetici bilgisi başarıyla getirildi.',
            admin,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};
