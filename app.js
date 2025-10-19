import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sequelize from './src/config/database.js'; // pool yerine sequelize
import routes from './src/routes/index.js';
import { initializeClient } from './src/utils/whatsappClient.js'; // named import

const app = express();

// 1️⃣ CORS en üstte, helmet'ten ÖNCE olsun
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.1.37:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// 2️⃣ Helmet (CORS'tan sonra)
app.use(helmet());

// 3️⃣ JSON parser
app.use(express.json());

// 4️⃣ Rotalar
app.use('/api', routes);

// 5️⃣ WHATSAPP ÇALIŞTIRMA
initializeClient();

// 6️⃣ Sequelize bağlantı testi
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize veritabanı bağlantısı başarılı!');
  })
  .catch(err => {
    console.error('❌ Veritabanı bağlantısı başarısız:', err);
  });

export default app;