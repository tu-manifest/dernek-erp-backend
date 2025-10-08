import  { Group } from '../models/group.model.js';

export const addNewGroup = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const newGroup = await Group.create({ name, description });

    res.status(201).json({
      success: true,
      message: 'Yeni grup başarıyla oluşturuldu.',
      group: {
        id: newGroup.id,
        name: newGroup.name,
        description: newGroup.description,
      }
    });
  } catch (error) {
    console.error("Grup kaydı sırasında hata:", error);

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