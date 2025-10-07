import express from 'express';
import routes from './src/routes/index.js';
import cors from 'cors';
import  pool  from './src/config/database.js';
import helmet from 'helmet';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet()); 

app.use('/api', routes);

// İsteğe bağlı: Bağlantı testi
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Veritabanı bağlantısı BAŞARISIZ oldu:', err);
  } else {
    console.log('Veritabanı bağlantısı BAŞARILI oldu! Zaman:', res.rows[0].now);
  }
});

export default app;