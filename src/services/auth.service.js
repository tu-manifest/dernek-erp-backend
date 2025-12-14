import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { Admin } = db;

const JWT_SECRET = process.env.JWT_SECRET || 'dernek-erp-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const SALT_ROUNDS = 10;

/**
 * Yeni yönetici kaydı oluşturur
 * @param {Object} adminData - Yönetici verileri
 * @returns {Object} Oluşturulan yönetici (şifre hariç)
 */
export const register = async (adminData) => {
    console.log("register service çalıştı");

    const {
        fullName,
        email,
        phone,
        password,
        notes,
        canManageMembers,
        canManageDonations,
        canManageAdmins,
        canManageEvents,
        canManageMeetings,
        canManageSocialMedia,
        canManageFinance,
        canManageDocuments,
    } = adminData;

    // E-posta kontrolü
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
        const error = new Error('Bu e-posta adresi zaten kayıtlı.');
        error.statusCode = 409;
        throw error;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Yeni admin oluştur
    const newAdmin = await Admin.create({
        fullName,
        email,
        phone,
        password: hashedPassword,
        notes: notes || null,
        canManageMembers: canManageMembers || false,
        canManageDonations: canManageDonations || false,
        canManageAdmins: canManageAdmins || false,
        canManageEvents: canManageEvents || false,
        canManageMeetings: canManageMeetings || false,
        canManageSocialMedia: canManageSocialMedia || false,
        canManageFinance: canManageFinance || false,
        canManageDocuments: canManageDocuments || false,
    });

    console.log("Yeni yönetici oluşturuldu:", newAdmin.id);

    // Şifreyi response'dan çıkar
    const adminResponse = {
        id: newAdmin.id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        phone: newAdmin.phone,
        notes: newAdmin.notes,
        permissions: {
            canManageMembers: newAdmin.canManageMembers,
            canManageDonations: newAdmin.canManageDonations,
            canManageAdmins: newAdmin.canManageAdmins,
            canManageEvents: newAdmin.canManageEvents,
            canManageMeetings: newAdmin.canManageMeetings,
            canManageSocialMedia: newAdmin.canManageSocialMedia,
            canManageFinance: newAdmin.canManageFinance,
            canManageDocuments: newAdmin.canManageDocuments,
        },
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt,
    };

    return adminResponse;
};

/**
 * E-posta ve şifre ile giriş yapar
 * @param {string} email - E-posta adresi
 * @param {string} password - Şifre
 * @returns {Object} Admin bilgisi ve JWT token
 */
export const login = async (email, password) => {
    console.log("login service çalıştı");

    // Admin'i bul
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
        const error = new Error('E-posta veya şifre hatalı.');
        error.statusCode = 401;
        throw error;
    }

    // Hesap aktif mi kontrol et
    if (!admin.isActive) {
        const error = new Error('Hesabınız aktif değil.');
        error.statusCode = 403;
        throw error;
    }

    // Şifreyi doğrula
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        const error = new Error('E-posta veya şifre hatalı.');
        error.statusCode = 401;
        throw error;
    }

    // JWT token oluştur
    const token = jwt.sign(
        {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    console.log("Giriş başarılı, admin ID:", admin.id);

    return {
        admin: {
            id: admin.id,
            fullName: admin.fullName,
            email: admin.email,
            phone: admin.phone,
            notes: admin.notes,
            permissions: {
                canManageMembers: admin.canManageMembers,
                canManageDonations: admin.canManageDonations,
                canManageAdmins: admin.canManageAdmins,
                canManageEvents: admin.canManageEvents,
                canManageMeetings: admin.canManageMeetings,
                canManageSocialMedia: admin.canManageSocialMedia,
                canManageFinance: admin.canManageFinance,
                canManageDocuments: admin.canManageDocuments,
            },
            isActive: admin.isActive,
        },
        token,
        expiresIn: JWT_EXPIRES_IN,
    };
};

/**
 * JWT token'ı doğrular
 * @param {string} token - JWT token
 * @returns {Object} Decode edilmiş token içeriği
 */
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        const err = new Error('Geçersiz veya süresi dolmuş token.');
        err.statusCode = 401;
        throw err;
    }
};

/**
 * Admin ID'sine göre admin bilgisini getirir
 * @param {number} adminId - Admin ID
 * @returns {Object} Admin bilgisi (şifre hariç)
 */
export const getAdminById = async (adminId) => {
    const admin = await Admin.findByPk(adminId, {
        attributes: { exclude: ['password'] }
    });

    if (!admin) {
        const error = new Error('Yönetici bulunamadı.');
        error.statusCode = 404;
        throw error;
    }

    return {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        notes: admin.notes,
        permissions: {
            canManageMembers: admin.canManageMembers,
            canManageDonations: admin.canManageDonations,
            canManageAdmins: admin.canManageAdmins,
            canManageEvents: admin.canManageEvents,
            canManageMeetings: admin.canManageMeetings,
            canManageSocialMedia: admin.canManageSocialMedia,
            canManageFinance: admin.canManageFinance,
            canManageDocuments: admin.canManageDocuments,
        },
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
    };
};
