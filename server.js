import app from './app.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server çalışıyor: http://192.168.1.37:${PORT}`);
});