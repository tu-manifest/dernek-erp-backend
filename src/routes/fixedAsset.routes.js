// src/routes/fixedAsset.routes.js
import express from 'express';
import fixedAssetController from '../controllers/fixedAsset.controller.js';
import { uploadSingleImage, handleMulterError } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Sınıf ve alt sınıf listesi (form için)
router.get('/classes', fixedAssetController.getClassesAndSubClasses);

// CRUD işlemleri
router.post('/', fixedAssetController.createAsset);
router.get('/', fixedAssetController.getAllAssets);
router.get('/:id', fixedAssetController.getAssetById);
router.put('/:id', fixedAssetController.updateAsset);
router.delete('/:id', fixedAssetController.deleteAsset);

// Durum güncelleme
router.patch('/:id/status', fixedAssetController.updateStatus);

// Resim işlemleri
router.post('/:id/image', uploadSingleImage, handleMulterError, fixedAssetController.uploadImage);
router.get('/:id/image', fixedAssetController.getImage);
router.delete('/:id/image', fixedAssetController.deleteImage);

export default router;
