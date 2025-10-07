// database.js

import pkg from 'pg';
const { Pool } = pkg;

// Hostname: Lütfen bu değeri Render'daki Harici Hostname ile DEĞİŞTİRİN
const DB_CONFIG = {
  user: 'dernekuser',
  password: 'dernekpass',
  host: 'db',
  database: 'dernek_erp_db',
  port: 5432,
};

const pool = new Pool(DB_CONFIG);

// Bağlantı Kontrolü
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL bağlantısı başarılı!');
    client.release(); 
  })
  .catch(err => {
    console.error('❌ PostgreSQL bağlantısı BAŞARISIZ oldu:', err.message);

  });

export default pool;