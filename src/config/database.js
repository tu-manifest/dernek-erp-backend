// config/database.js (YENİ Sürüm: Sequelize kullanacak)

import { Sequelize } from 'sequelize';
// pg kütüphanesini artık doğrudan kullanmıyoruz, Sequelize hallediyor.

const DB_CONFIG = {
    user: 'dernekuser',
    password: 'dernekpass',
    host: 'db',
    database: 'dernek_erp_db',
    port: 5432,
};

// Sequelize örneğini (instance) oluşturma
const sequelize = new Sequelize(
    DB_CONFIG.database,
    DB_CONFIG.user,
    DB_CONFIG.password,
    {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        dialect: 'postgres', // PostgreSQL kullanacağımızı belirtiyoruz
        logging: false, // Konsolda SQL sorgularının gösterilip gösterilmeyeceği
    }
);

// Bağlantıyı Test Etme
async function connectDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Sequelize bağlantısı (PostgreSQL) başarılı!');
        
        // Modelleri otomatik olarak senkronize et (tabloyu oluştur/güncelle).
        // DİKKAT: Gerçek uygulamalarda 'alter: true' veya 'force: true' 
        // yerine migration kullanılması önerilir!
        await sequelize.sync({ alter: true }); 
        console.log('✅ Veritabanı tabloları senkronize edildi.');

    } catch (error) {
        console.error('❌ Veritabanı bağlantısı veya senkronizasyonu BAŞARISIZ oldu:', error.message);
        // Uygulamanın başlatılmasını engellemek için hata fırlatabilirsiniz
        // process.exit(1);
    }
}

connectDatabase();

// sequelize nesnesini dışa aktarıyoruz
export default sequelize;