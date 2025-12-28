// src/routes/expense.routes.js
import express from 'express';
import expenseController from '../controllers/expense.controller.js';
import { uploadSingleDocument, handleMulterError } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Gider CRUD işlemleri
router.post('/', uploadSingleDocument, handleMulterError, expenseController.createExpense);
router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

// Belge işlemleri
router.get('/:id/document/view', expenseController.viewDocument);
router.get('/:id/document/download', expenseController.downloadDocument);

export default router;
