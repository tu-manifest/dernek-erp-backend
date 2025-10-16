import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pool from './src/config/database.js';
import routes from './src/routes/index.js';

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

// 5️⃣ Bağlantı testi
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Veritabanı bağlantısı BAŞARISIZ:', err);
  else console.log('Veritabanı bağlantısı BAŞARILI:', res.rows[0].now);
});

export default app;