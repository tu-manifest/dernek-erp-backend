import * as Groupservice from '../services/group.service.js';

// CREATE - Yeni grup ekle
export const addNewGroup = async (req, res, next) => {
    try {
        const newGroup = await Groupservice.addNewGroup(req.body);
        res.status(201).json({ 
            success: true, 
            message: 'Yeni grup başarıyla oluşturuldu.',
            group: newGroup 
        });
    } catch (error) {
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

// READ - Tüm grupları getir
export const getAllGroups = async (req, res, next) => {
    try {
        const result = await Groupservice.getAllGroups();
        res.status(200).json({
            success: true,
            message: 'Gruplar ve istatistikler başarıyla getirildi.',
            statistics: result.statistics,
            count: result.groups.length,
            groups: result.groups
        });
    } catch (error) {
        next(error);
    }
};

// READ - ID'ye göre grup getir
export const getGroupById = async (req, res, next) => {
    try {
        const group = await Groupservice.getGroupById(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Grup başarıyla getirildi.',
            group: group
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

// UPDATE - Grup güncelle (isActive durumu dahil)
export const updateGroup = async (req, res, next) => {
    try {
        const updatedGroup = await Groupservice.updateGroup(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Grup başarıyla güncellendi.',
            group: updatedGroup
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
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

// DELETE - Grup kalıcı olarak sil
export const deleteGroup = async (req, res, next) => {
    try {
        const result = await Groupservice.deleteGroup(req.params.id);
        res.status(200).json({
            success: true,
            message: result.message,
            deletedGroup: { 
                id: result.id, 
                group_name: result.group_name 
            }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};