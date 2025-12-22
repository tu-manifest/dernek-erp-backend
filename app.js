import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sequelize from './src/config/database.js';
import routes from './src/routes/index.js';
import models from './src/models/index.js';
import { initializeClient, setSocketIO } from './src/utils/whatsappClient.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';
import { seedAdmins } from './src/seeders/adminSeeder.js';

const app = express();

// 1️⃣ CORS - Frontend'den gelen isteklere izin ver
app.use(cors({
  origin: true, // Tüm origin'lere izin ver (production'da spesifik URL kullanın)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// 2️⃣ Helmet - Güvenlik başlıkları (CORS ile uyumlu)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
}));

// 3️⃣ JSON parser
app.use(express.json());

// 4️⃣ Rotalar
app.use('/api', routes);

// 5️⃣ 404 Handler (Rotalardan sonra)
app.use(notFoundHandler);

app.use(errorHandler);

// 7️⃣ Socket.IO'yu export et (server.js'den set edilecek)
export const setupWhatsApp = (io) => {
  setSocketIO(io);
  initializeClient();
};

// 8️⃣ Sequelize bağlantı testi ve veritabanı senkronizasyonu
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize veritabanı bağlantısı başarılı!');
    return models.sequelize.sync({ alter: true })
  })
  .then(() => {
    console.log('✅ Veritabanı senkronizasyonu tamamlandı');
  })
  .catch(err => {
    console.error('⚠️ Veritabanı senkronizasyonu sırasında hata (devam ediliyor):', err.message);
  })
  .finally(async () => {
    // 9️⃣ Varsayılan admin kullanıcılarını oluştur (sync başarılı veya başarısız olsa da çalışır)
    try {
      await seedAdmins();
    } catch (seedErr) {
      console.error('❌ Admin seed hatası:', seedErr.message);
    }
  });

export default app;