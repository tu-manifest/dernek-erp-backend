// src/controllers/document.controller.js
import documentService from '../services/document.service.js';

class DocumentController {
    async createDocument(req, res) {
        try {
            const document = await documentService.createDocument(req.body, req.file);
            res.status(201).json({ success: true, message: 'Döküman başarıyla yüklendi.', data: document });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async getAllDocuments(req, res) {
        try {
            const { category } = req.query;
            const documents = await documentService.getAllDocuments(category);
            res.status(200).json({ success: true, data: documents });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Dökümanlar getirilirken bir hata oluştu.', error: error.message });
        }
    }

    async getDocumentById(req, res) {
        try {
            const document = await documentService.getDocumentById(req.params.id);
            res.status(200).json({ success: true, data: document });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async downloadDocument(req, res) {
        try {
            const result = await documentService.downloadDocument(req.params.id);

            // Content-Disposition header ile dosya adını belirt (indirme zorla)
            res.set('Content-Type', result.mimeType);
            res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(result.fileName)}"`);
            res.set('Cache-Control', 'public, max-age=86400');
            res.send(result.file);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async viewDocument(req, res) {
        try {
            const result = await documentService.viewDocument(req.params.id);

            // inline görüntüleme - tarayıcıda açılır
            res.set('Content-Type', result.mimeType);
            res.set('Content-Disposition', `inline; filename="${encodeURIComponent(result.fileName)}"`);
            res.set('Cache-Control', 'public, max-age=86400');
            res.send(result.file);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async updateDocument(req, res) {
        try {
            const document = await documentService.updateDocument(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Döküman başarıyla güncellendi.', data: document });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async deleteDocument(req, res) {
        try {
            const result = await documentService.deleteDocument(req.params.id);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ success: false, message: error.message });
        }
    }
}

export default new DocumentController();
