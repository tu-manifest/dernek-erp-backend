import * as AuthService from '../services/auth.service.js';

/**
 * JWT Token doğrulama middleware'i
 * Authorization header'dan Bearer token'ı alır ve doğrular
 */
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Erişim tokeni gereklidir.',
            });
        }

        // Bearer token formatını kontrol et
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token formatı. Bearer token bekleniyor.',
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token bulunamadı.',
            });
        }

        // Token'ı doğrula
        const decoded = AuthService.verifyToken(token);

        // Kullanıcı bilgisini request'e ekle
        req.user = decoded;

        next();
    } catch (error) {
        if (error.statusCode === 401) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * Modül yetkisi kontrol middleware'i
 * @param {string} permission - Kontrol edilecek yetki adı
 * @returns {Function} Middleware fonksiyonu
 */
export const authorize = (permission) => {
    return async (req, res, next) => {
        try {
            // Önce authenticate middleware'inin çalışmış olması gerekiyor
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Önce giriş yapmalısınız.',
                });
            }

            // Admin bilgisini getir
            const admin = await AuthService.getAdminById(req.user.id);

            // Yetkiyi kontrol et
            if (!admin.permissions[permission]) {
                return res.status(403).json({
                    success: false,
                    message: 'Bu işlem için yetkiniz bulunmamaktadır.',
                });
            }

            next();
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
};
