import express from 'express';
import budgetPlanController from '../controllers/budgetPlan.controller.js';

const router = express.Router();

// Mevcut bütçe yıllarını getir
router.get('/years', budgetPlanController.getBudgetYears);

// Yeni Plan Oluştur (mevcut yılı siler ve yenisini oluşturur)
router.post('/new', budgetPlanController.createNewPlan);

// Planı Kaydet (güncelle veya oluştur)
router.put('/save', budgetPlanController.savePlan);

// Belirli yılın bütçe planını getir
router.get('/:year', budgetPlanController.getBudgetPlan);

// Bütçe planı var mı kontrol et
router.get('/:year/exists', budgetPlanController.checkBudgetPlanExists);

// Yıllık planı sil
router.delete('/:year', budgetPlanController.deleteBudgetPlan);

// Tek kalemi güncelle
router.put('/item/:id', budgetPlanController.updateBudgetItem);

// Tek kalemi sil
router.delete('/item/:id', budgetPlanController.deleteBudgetItem);

export default router;
