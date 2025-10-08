
import * as Memberservice from '../services/member.service.js';


export const addNewMember = async (req, res, next) => {
    try {
        const newMember = await Memberservice.addNewMember(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Üyelik başvurusu başarıyla oluşturuldu.',
            member: newMember
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