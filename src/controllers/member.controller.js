import * as Memberservice from '../services/member.service.js';
import * as ActivityLogService from '../services/activityLog.service.js';

// CREATE - Yeni üye ekle (mevcut)
export const addNewMember = async (req, res, next) => {
    try {
        const newMember = await Memberservice.addNewMember(req.body);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'CREATE',
            entityType: 'Member',
            entityId: newMember.id,
            entityName: newMember.fullName,
            adminId: req.user?.id,
            adminName: req.user?.fullName,
            ipAddress: req.ip
        });

        res.status(201).json({
            success: true,
            message: 'Üyelik başvurusu başarıyla oluşturuldu.',
            member: newMember
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

// READ - Tüm üyeleri getir
export const getAllMembers = async (req, res, next) => {
    try {
        const members = await Memberservice.getAllMembers();
        res.status(200).json({
            success: true,
            message: 'Üyeler başarıyla getirildi.',
            count: members.length,
            members: members
        });
    } catch (error) {
        next(error);
    }
};

// READ - ID'ye göre üye getir
export const getMemberById = async (req, res, next) => {
    try {
        const member = await Memberservice.getMemberById(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Üye başarıyla getirildi.',
            member: member
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

// UPDATE - Üye güncelle
export const updateMember = async (req, res, next) => {
    try {
        const updatedMember = await Memberservice.updateMember(req.params.id, req.body);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'UPDATE',
            entityType: 'Member',
            entityId: updatedMember.id,
            entityName: updatedMember.fullName,
            adminId: req.user?.id,
            adminName: req.user?.fullName,
            ipAddress: req.ip
        });

        res.status(200).json({
            success: true,
            message: 'Üye başarıyla güncellendi.',
            member: updatedMember
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
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

// DELETE - Üye kalıcı olarak sil
export const deleteMember = async (req, res, next) => {
    try {
        const result = await Memberservice.deleteMember(req.params.id);

        // Aktivite logu oluştur
        await ActivityLogService.createLog({
            action: 'DELETE',
            entityType: 'Member',
            entityId: result.id,
            entityName: result.fullName,
            adminId: req.user?.id,
            adminName: req.user?.fullName,
            ipAddress: req.ip
        });

        res.status(200).json({
            success: true,
            message: result.message,
            deletedMember: {
                id: result.id,
                fullName: result.fullName,
                email: result.email
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

// SEARCH - Üye arama
export const searchMembers = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Arama terimi (q) parametresi gereklidir.'
            });
        }

        const members = await Memberservice.searchMembers(q);
        res.status(200).json({
            success: true,
            message: 'Arama sonuçları başarıyla getirildi.',
            count: members.length,
            searchTerm: q,
            members: members
        });
    } catch (error) {
        next(error);
    }
};