import express from 'express';
import {Member} from '../models/member.model.js';


export const addNewMember = async (req, res, next) => {
  // 1. Form Verilerini Alma ve Dönüştürme
  // req.body içerisindeki tüm verileri alıyoruz.
  const {
    fullName,
    tcNumber,
    birthDate,
    phoneNumber,
    email,
    address,
    membershipType,
    duesAmount,
    duesFrequency,
    paymentStatus,
    charterApproval, 
    kvkkApproval     
  } = req.body;

  // Frontend'den gelen checkbox değerlerini doğru işleme:
  // (req.body'den JSON olarak gelirse zaten boolean, ama form data olarak gelirse string olabilir)
  const isCharterApproved = charterApproval === 'true' || charterApproval === true;
  const isKvkkApproved = kvkkApproval === 'true' || kvkkApproval === true;
  
  // 2. Veritabanına Kayıt
  try {
    const newMember = await Member.create({
      fullName,
      tcNumber,
      birthDate,
      phoneNumber,
      email,
      address,
      membershipType,
      duesAmount: parseFloat(duesAmount), // Decimal türü için dönüştür
      duesFrequency,
      paymentStatus,
      charterApproval: isCharterApproved,
      kvkkApproval: isKvkkApproved,
    });

    // Başarılı yanıt
    res.status(201).json({
      success: true,
      message: 'Üyelik başvurusu başarıyla oluşturuldu.',
      member: {
          id: newMember.id,
          fullName: newMember.fullName,
          email: newMember.email,
      }
    });

  } catch (error) {
    // 3. Hata Yönetimi
    console.error("Üye kaydı sırasında hata:", error);

    // Sequelize doğrulama hatalarını yakalama (Boş alan, benzersizlik, format hataları)
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Doğrulama hatası oluştu.',
        errors: messages
      });
    }

    next(error); 
  }
};