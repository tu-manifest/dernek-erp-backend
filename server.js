import app, { setupWhatsApp } from './app.js'; // setupWhatsApp'ı import et
import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.1.37:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('✅ Yeni bir client bağlandı:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client bağlantısı kesildi:', socket.id);
  });
});

// WhatsApp Client'ı Socket.IO ile başlat
setupWhatsApp(io);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server çalışıyor: http://192.168.1.37:${PORT}`);
  console.log(`✅ Socket.IO aktif`);
});