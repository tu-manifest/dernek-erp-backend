// src/controllers/fixedAsset.controller.js
import fixedAssetService from '../services/fixedAsset.service.js';

class FixedAssetController {
    async createAsset(req, res) {
        try {
            const asset = await fixedAssetService.createAsset(req.body);
            res.status(201).json({ success: true, message: 'Varlık başarıyla oluşturuldu.', data: asset });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async getAllAssets(req, res) {
        try {
            const result = await fixedAssetService.getAllAssets();
            res.status(200).json({ success: true, data: result.assets, summary: result.summary });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Varlıklar getirilirken bir hata oluştu.', error: error.message });
        }
    }

    async getAssetById(req, res) {
        try {
            const asset = await fixedAssetService.getAssetById(req.params.id);
            res.status(200).json({ success: true, data: asset });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async updateAsset(req, res) {
        try {
            const asset = await fixedAssetService.updateAsset(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Varlık başarıyla güncellendi.', data: asset });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async deleteAsset(req, res) {
        try {
            const result = await fixedAssetService.deleteAsset(req.params.id);
            res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({ success: false, message: 'status alanı zorunludur.' });
            }
            const asset = await fixedAssetService.updateStatus(req.params.id, status);
            res.status(200).json({ success: true, message: 'Durum başarıyla güncellendi.', data: asset });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async getClassesAndSubClasses(req, res) {
        try {
            const result = fixedAssetService.getAssetClassesAndSubClasses();
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new FixedAssetController();
