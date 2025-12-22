// src/services/document.service.js
import db from '../models/index.js';

class DocumentService {
    /**
     * Yeni döküman oluştur
     */
    async createDocument(data, file) {
        if (!file) {
            const error = new Error('Dosya yüklenmedi.');
            error.statusCode = 400;
            throw error;
        }

        if (!data.name || !data.category) {
            const error = new Error('Döküman adı ve kategori zorunludur.');
            error.statusCode = 400;
            throw error;
        }

        const document = await db.Document.create({
            name: data.name,
            category: data.category,
            description: data.description || null,
            file: file.buffer,
            fileName: file.originalname,
            fileMimeType: file.mimetype,
            fileSize: file.size
        });

        // Dosya içeriğini response'dan çıkar
        const { file: fileData, ...documentWithoutFile } = document.toJSON();
        return documentWithoutFile;
    }

    /**
     * Tüm dökümanları listele (opsiyonel kategori filtresi)
     */
    async getAllDocuments(category = null) {
        const whereClause = category ? { category } : {};

        const documents = await db.Document.findAll({
            attributes: { exclude: ['file'] }, // Dosya içeriğini hariç tut
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        return documents;
    }

    /**
     * Tek döküman detayı (dosya içeriği hariç)
     */
    async getDocumentById(id) {
        const document = await db.Document.findByPk(id, {
            attributes: { exclude: ['file'] }
        });

        if (!document) {
            const error = new Error('Döküman bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        return document;
    }

    /**
     * Dosyayı indir (binary data döner)
     */
    async downloadDocument(id) {
        const document = await db.Document.findByPk(id, {
            attributes: ['id', 'file', 'fileName', 'fileMimeType']
        });

        if (!document) {
            const error = new Error('Döküman bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        return {
            file: document.file,
            fileName: document.fileName,
            mimeType: document.fileMimeType
        };
    }

    /**
     * Döküman bilgilerini güncelle (dosya hariç - sadece meta data)
     */
    async updateDocument(id, data) {
        const document = await db.Document.findByPk(id);

        if (!document) {
            const error = new Error('Döküman bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        // Sadece izin verilen alanları güncelle
        const allowedFields = ['name', 'category', 'description'];
        const updateData = {};

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }

        await document.update(updateData);

        // Dosya içeriğini response'dan çıkar
        const { file, ...documentWithoutFile } = document.toJSON();
        return documentWithoutFile;
    }

    /**
     * Dökümanı sil
     */
    async deleteDocument(id) {
        const document = await db.Document.findByPk(id);

        if (!document) {
            const error = new Error('Döküman bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        await document.destroy();
        return { message: 'Döküman başarıyla silindi.' };
    }
}

export default new DocumentService();
