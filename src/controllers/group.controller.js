
import * as Groupservice from '../services/group.service.js';

export const addNewGroup = async (req, res, next) => {
    try {
        const newGroup = await Groupservice.addNewGroup(req.body);
        res.status(201).json({ 
            success: true, 
            message: 'Yeni grup başarıyla oluşturuldu.',
            group: newGroup 
        });
    } catch (error) {
         // Sequelize validation hatalarını yakala
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
}
