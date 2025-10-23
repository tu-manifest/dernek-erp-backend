import * as EventService from '../services/event.service.js';

export const createEvent = async (req, res, next) => {
    try {
        const newEvent = await EventService.createEvent(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Etkinlik başarıyla oluşturuldu.',
            event: newEvent
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
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