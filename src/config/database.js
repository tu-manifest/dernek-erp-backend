import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DATABASE_HOST || 'localhost', // 'localhost' yerine DB_HOST'u okumalı
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  dialect: 'postgres',
};

if (!config.host || !config.username) {
    console.error("❌ HATA: DB bağlantı bilgileri ortam değişkenlerinden yüklenemedi.");
}

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
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