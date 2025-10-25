import { Sequelize } from 'sequelize';

// ✅ ÖNERİLEN: ORTAM DEĞİŞKENLERİNİ OKU
const DB_CONFIG = {
    host: process.env.DB_HOST, 
    // Kullanıcı adı
    user: process.env.DB_USER, 
    // Şifre
    password: process.env.DB_PASSWORD, 
    // Veritabanı adı
    database: process.env.DB_NAME, 
    // Port
    port: process.env.DB_PORT || 5432, 
};

// Değişkenlerinizin yüklendiğinden emin olmak için bir kontrol ekleyebilirsiniz
if (!DB_CONFIG.host || !DB_CONFIG.user) {
    console.error("❌ HATA: DB bağlantı bilgileri (DB_HOST, DB_USER, vb.) ortam değişkenlerinden yüklenemedi.");
    // Geliştirme ortamında çalışıyorsanız buradan çıkmak yerine default değer kullanabilirsiniz.
    // Ancak canlı ortamda hata fırlatmak en güvenlisidir.
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
        // dialectOptions: {
        //     ssl: {
        //         require: true,
        //         rejectUnauthorized: false 
        //     }
        // }
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