/**
 * Admin Kullanıcı Seeder
 * Uygulama başlatıldığında varsayılan admin kullanıcılarını oluşturur.
 * Kullanıcı zaten varsa atlanır (email unique kontrolü).
 */

import bcrypt from 'bcrypt';
import db from '../models/index.js';

const SALT_ROUNDS = 10;

// Varsayılan admin kullanıcıları
const defaultAdmins = [
    {
        fullName: 'Kübra Köse',
        email: 'kübra@derp.com',
        phone: '5551234567',
        password: 'kübraköse15',
    },
    {
        fullName: 'Batu Çelik',
        email: 'batu@derp.com',
        phone: '5551234568',
        password: 'batucelik15',
    },
    {
        fullName: 'Berat Aksoy',
        email: 'berat@derp.com',
        phone: '5551234569',
        password: 'berataksoy15',
    },
    {
        fullName: 'Numan Dirican',
        email: 'numan@derp.com',
        phone: '5551234570',
        password: 'numandirican15',
    },
    {
        fullName: 'Nisa Kursun',
        email: 'nisa@derp.com',
        phone: '5551234571',
        password: 'nisakursun15',
    },
];

/**
 * Varsayılan admin kullanıcılarını oluşturur
 * Zaten varsa atlanır (idempotent)
 */
export const seedAdmins = async () => {
    console.log('🌱 Admin seed işlemi başlatılıyor...');

    const Admin = db.Admin;
    let createdCount = 0;
    let skippedCount = 0;

    for (const adminData of defaultAdmins) {
        try {
            // E-posta zaten var mı kontrol et
            const existingAdmin = await Admin.findOne({ where: { email: adminData.email } });

            if (existingAdmin) {
                console.log(`   ⏭️  ${adminData.email} zaten mevcut, atlanıyor...`);
                skippedCount++;
                continue;
            }

            // Şifreyi hashle
            const hashedPassword = await bcrypt.hash(adminData.password, SALT_ROUNDS);

            // Tüm yetkilerle admin oluştur
            await Admin.create({
                fullName: adminData.fullName,
                email: adminData.email,
                phone: adminData.phone,
                password: hashedPassword,
                notes: 'Otomatik oluşturulan varsayılan hesap',
                // Tüm yetkiler aktif
                canManageMembers: true,
                canManageDonations: true,
                canManageAdmins: true,
                canManageEvents: true,
                canManageMeetings: true,
                canManageSocialMedia: true,
                canManageFinance: true,
                canManageDocuments: true,
                isActive: true,
            });

            console.log(`   ✅ ${adminData.email} oluşturuldu`);
            createdCount++;
        } catch (error) {
            console.error(`   ❌ ${adminData.email} oluşturulurken hata:`, error.message);
        }
    }

    console.log(`🌱 Admin seed tamamlandı: ${createdCount} yeni, ${skippedCount} atlandı`);
};

export default seedAdmins;
