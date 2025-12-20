import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sequelize from './src/config/database.js';
import routes from './src/routes/index.js';
import models from './src/models/index.js';
import { initializeClient, setSocketIO } from './src/utils/whatsappClient.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';

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

// 5️⃣ 404 Handler (Rotalardan sonra)
app.use(notFoundHandler);

app.use(errorHandler);

// 7️⃣ Socket.IO'yu export et (server.js'den set edilecek)
export const setupWhatsApp = (io) => {
  setSocketIO(io);
  initializeClient();
};

// 8️⃣ Sequelize bağlantı testi
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize veritabanı bağlantısı başarılı!');
    return models.sequelize.sync({ alter: true })
  })
  .catch(err => {
    console.error('❌ Veritabanı bağlantısı başarısız:', err);
  });

export default app;