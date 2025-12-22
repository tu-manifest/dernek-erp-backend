import Setting from '../models/setting.model.js';

// Ayarları Getir (Yoksa otomatik oluşturur)
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({
        associationName: "Dernek Adınızı Giriniz"
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Ayarlar getirilemedi.", error: error.message });
  }
};

// Ayarları Güncelle
export const updateSettings = async (req, res) => {
  try {
    const { 
      associationName, 
      presidentName, 
      phoneNumber, 
      email, 
      taxNumber, 
      foundationYear, 
      address, 
      website 
    } = req.body;

    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      await settings.update({
        associationName,
        presidentName,
        phoneNumber,
        email,
        taxNumber,
        foundationYear,
        address,
        website
      });
    }

    res.status(200).json({ message: "Ayarlar başarıyla güncellendi.", data: settings });
  } catch (error) {
    res.status(500).json({ message: "Ayarlar güncellenemedi.", error: error.message });
  }
};