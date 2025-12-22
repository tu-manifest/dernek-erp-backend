// src/routes/document.routes.js
import express from 'express';
import documentController from '../controllers/document.controller.js';
import { uploadSingleDocument, handleMulterError } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Döküman CRUD işlemleri
router.post('/', uploadSingleDocument, handleMulterError, documentController.createDocument);
router.get('/', documentController.getAllDocuments);
router.get('/:id', documentController.getDocumentById);
router.get('/:id/download', documentController.downloadDocument);
router.get('/:id/view', documentController.viewDocument);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

export default router;
