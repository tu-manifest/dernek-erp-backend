import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'dernekuser',
    password: process.env.DB_PASSWORD || 'dernekpass',
    database: process.env.DB_NAME || 'dernek_erp_db',
    port: process.env.DB_PORT || 5432,
};

if (!DB_CONFIG.host || !DB_CONFIG.user) {
    console.error("❌ HATA: DB bağlantı bilgileri ortam değişkenlerinden yüklenemedi.");
}

const sequelize = new Sequelize(
    DB_CONFIG.database,
    DB_CONFIG.user,
    DB_CONFIG.password,
    {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        dialect: 'postgres',
        logging: false,
    }
);

export async function connectDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Sequelize bağlantısı (PostgreSQL) başarılı!');
    } catch (error) {
        console.error('❌ Veritabanı bağlantısı BAŞARISIZ oldu:', error.message);
        throw error;
    }
}

export default sequelize;

// ⭐ Sequelize CLI için CommonJS export (Hybrid)
// Bu kısım sadece migration çalıştırırken kullanılır
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        development: {
            username: DB_CONFIG.user,
            password: DB_CONFIG.password,
            database: DB_CONFIG.database,
            host: DB_CONFIG.host,
            port: DB_CONFIG.port,
            dialect: 'postgres',
            logging: console.log
        },
        production: {
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: false
        }
    };
}