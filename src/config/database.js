import { Sequelize } from 'sequelize';

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
        
        // Model ilişkilerini import et
        await import('../models/index.js');
        
        // Modelleri otomatik olarak senkronize et (tabloyu oluştur/güncelle).
        await sequelize.sync({ alter: true }); 
        console.log('✅ Veritabanı tabloları senkronize edildi.');

    } catch (error) {
        console.error('❌ Veritabanı bağlantısı veya senkronizasyonu BAŞARISIZ oldu:', error.message);
    }
}

connectDatabase();

// sequelize nesnesini dışa aktarıyoruz
export default sequelize;