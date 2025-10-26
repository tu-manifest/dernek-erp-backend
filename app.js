import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sequelize from './src/config/database.js';
import routes from './src/routes/index.js';
import { initializeClient, setSocketIO } from './src/utils/whatsappClient.js';

const app = express();

// 1️⃣ CORS
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// 2️⃣ Helmet
app.use(helmet());

// 3️⃣ JSON parser
app.use(express.json());

// 4️⃣ Rotalar
app.use('/api', routes);

// 5️⃣ Socket.IO'yu export et (server.js'den set edilecek)
export const setupWhatsApp = (io) => {
    setSocketIO(io);
    initializeClient();
};

// 6️⃣ Sequelize bağlantı testi
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize veritabanı bağlantısı başarılı!');
  })
  .catch(err => {
    console.error('❌ Veritabanı bağlantısı başarısız:', err);
  });

export default app;