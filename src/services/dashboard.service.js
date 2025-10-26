// src/services/dashboard.service.js

import Member from '../models/member.model.js';
import Event from '../models/event.model.js';
import Collection from '../models/collection.model.js';
// import Document from '../models/document.model.js'; // Döküman modeli hazır olduğunda bu satırı açmalısın.

// Veritabanı fonksiyonlarını (SUM, COUNT vb.) kullanmak için sequelize'i import ediyoruz
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Bu ayın başlangıcını ve sonunu hesaplamak için
const now = new Date();
const ayinBasi = new Date(now.getFullYear(), now.getMonth(), 1);
const ayinSonu = new Date(now.getFullYear(), now.getMonth() + 1, 0);

class DashboardService {
  async getDashboardStats() {
    try {
      // ... (diğer sorgular aynı)
      
      const aylikGelir = aylikGelirData.toplamGelir || 0;

      // Numan'ın  "Gider ekleme" görevini beklerken
      // aylikGider'i geçici olarak 0 olarak ekleyebiliriz.
      const aylikGider = 0; 

      return {
        toplamUyeSayisi,
        toplamEtkinlikSayisi,
        toplamDokumanSayisi,
        aylikGelir, // <-- HATA 1: Burada virgül eksikti.
        aylikGider  // <-- HATA 2: Bu satırı eklediysen, sonrasında virgül olmamalı.
      };
    } catch (error) {
      console.error('Dashboard istatistikleri alınırken hata oluştu:', error);
      throw error;
    }
  }
}

export default new DashboardService();