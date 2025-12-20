import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
};

if (!config.host || !config.username || !config.database) {
    console.error('❌ HATA: DB ortam değişkenleri eksik!', config);
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
        console.log('✅ PostgreSQL bağlantısı başarılı');
    } catch (error) {
        console.error('❌ PostgreSQL bağlantı hatası:', error.message);
        throw error;
    }
}

export default sequelize;
