// models/Member.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Üyelik Başvuru Formu verilerini temsil eden Sequelize Modeli.
 */
export const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  
  // --- Kişisel Bilgiler ---
  fullName: { // Ad ve Soyad
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Ad ve soyad gereklidir.' },
      notEmpty: { msg: 'Ad ve soyad boş bırakılamaz.' },
      len: [3, 255], // En az 3 karakter (frontend'deki kural)
    }
  },
  tcNumber: { // T.C. Kimlik Numarası
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true, // T.C. Kimlik No benzersiz olmalı
    validate: {
      notNull: { msg: 'T.C. kimlik numarası gereklidir.' },
      isNumeric: true,
      len: [11, 11],
      // Frontend'deki özel doğrulama kuralı için:
      // Sequelize'de TC No algoritmasını doğrulamak yerine,
      // benzersizlik ve format kontrolü (11 hane) yeterli kabul edilebilir.
      // Detaylı algoritma kontrolü genellikle backend servislerinde yapılır.
    }
  },
  birthDate: { // Doğum Tarihi (Yaş kontrolü frontend'de yapılıyor)
    type: DataTypes.DATEONLY, // Sadece tarih bilgisi
    allowNull: false,
    validate: {
      notNull: { msg: 'Doğum tarihi gereklidir.' },
      isDate: true,
      // Yaş kontrolü (18 yaş üstü) isteğe bağlı olarak buraya da eklenebilir.
    }
  },
  membershipType: { // Üyelik Türü (active, honorary, supporting, student)
    type: DataTypes.ENUM('active', 'honorary', 'supporting', 'student'),
    allowNull: false,
    validate: {
      notNull: { msg: 'Üyelik türü seçiniz.' },
    }
  },

  // --- İletişim Bilgileri ---
  phoneNumber: { // Telefon Numarası
    type: DataTypes.STRING(20), // +90 555 123 45 67 gibi bir format için yeterli
    allowNull: false,
    validate: {
      notNull: { msg: 'Telefon numarası gereklidir.' },
      // Regex kontrolü burada yapılabilir veya sadece format kontrolü ile yetinilebilir
    }
  },
  email: { // E-posta Adresi
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'E-posta adresi gereklidir.' },
      isEmail: true,
    }
  },
  address: { // Adres
    type: DataTypes.TEXT, // Uzun adresler için TEXT tipi daha uygun
    allowNull: false,
    validate: {
      notNull: { msg: 'Adres bilgisi gereklidir.' },
      len: [10, 1000], // En az 10 karakter (frontend'deki kural)
    }
  },
  
  // --- Üyelik Detayları / Aidat ---
  applicationDate: { // Başvuru Tarihi (Otomatik olarak atanıyor)
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  duesAmount: { // Aidat Miktarı (TL)
    type: DataTypes.DECIMAL(10, 2), // Para birimi için ondalıklı sayı
    allowNull: false,
    validate: {
      notNull: { msg: 'Aidat miktarı gereklidir.' },
      isFloat: true,
      min: 0.01, // 0'dan büyük olmalıdır (frontend'deki kural)
    }
  },
  duesFrequency: { // Ödeme Sıklığı (monthly, quarterly, annual)
    type: DataTypes.ENUM('monthly', 'quarterly', 'annual'),
    allowNull: false,
    validate: {
      notNull: { msg: 'Ödeme sıklığı seçiniz.' },
    }
  },
  paymentStatus: { // Ödeme Durumu (pending, paid, overdue)
    type: DataTypes.ENUM('pending', 'paid', 'overdue'),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      notNull: { msg: 'Ödeme durumu seçiniz.' },
    }
  },


  // --- Onaylar ---
  charterApproval: { // Dernek Tüzüğü Onayı
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  kvkkApproval: { // KVKK Onayı
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  // Model seçenekleri
  tableName: 'members', // Veritabanı tablosu adı
  timestamps: true, // createdAt ve updatedAt alanları ekler
});