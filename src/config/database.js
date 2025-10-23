import { Sequelize } from 'sequelize';

const DB_CONFIG = {
    user: 'dernekuser',
    password: 'dernekpass',
    host: 'postgres_db',
    database: 'dernek_erp_db',
    port: 5432,
};

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
        throw error; // Hatanın yukarıya fırlatılması
    }
}

export default sequelize;