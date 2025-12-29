// src/controllers/expense.controller.js
import expenseService from '../services/expense.service.js';

class ExpenseController {
    /**
     * Yeni gider oluştur
     * POST /api/expenses
     */
    async createExpense(req, res) {
        try {
            const adminInfo = {
                adminId: req.user?.id,
                adminName: req.user?.fullName,
                ipAddress: req.ip
            };

            const expense = await expenseService.createExpense(req.body, req.file, adminInfo);
            res.status(201).json({
                success: true,
                message: 'Gider başarıyla oluşturuldu.',
                data: expense
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Tüm giderleri listele (istatistiklerle birlikte)
     * GET /api/expenses
     */
    async getAllExpenses(req, res) {
        try {
            const result = await expenseService.getAllExpenses(req.query);
            res.status(200).json({
                success: true,
                data: result.expenses,
                pagination: result.pagination,
                stats: result.stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Giderler getirilirken bir hata oluştu.',
                error: error.message
            });
        }
    }

    /**
     * Tek gider detayı
     * GET /api/expenses/:id
     */
    async getExpenseById(req, res) {
        try {
            const expense = await expenseService.getExpenseById(req.params.id);
            res.status(200).json({
                success: true,
                data: expense
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Gider güncelle
     * PUT /api/expenses/:id
     */
    async updateExpense(req, res) {
        try {
            const adminInfo = {
                adminId: req.user?.id,
                adminName: req.user?.fullName,
                ipAddress: req.ip
            };

            const expense = await expenseService.updateExpense(req.params.id, req.body, adminInfo);
            res.status(200).json({
                success: true,
                message: 'Gider başarıyla güncellendi.',
                data: expense
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Gider sil
     * DELETE /api/expenses/:id
     */
    async deleteExpense(req, res) {
        try {
            const adminInfo = {
                adminId: req.user?.id,
                adminName: req.user?.fullName,
                ipAddress: req.ip
            };

            const result = await expenseService.deleteExpense(req.params.id, adminInfo);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Gider belgesini görüntüle (inline)
     * GET /api/expenses/:id/document/view
     */
    async viewDocument(req, res) {
        try {
            const result = await expenseService.viewExpenseDocument(req.params.id);

            res.set('Content-Type', result.mimeType);
            res.set('Content-Disposition', `inline; filename="${encodeURIComponent(result.fileName)}"`);
            res.set('Cache-Control', 'public, max-age=86400');
            res.send(result.file);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Gider belgesini indir
     * GET /api/expenses/:id/document/download
     */
    async downloadDocument(req, res) {
        try {
            const result = await expenseService.downloadExpenseDocument(req.params.id);

            res.set('Content-Type', result.mimeType);
            res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(result.fileName)}"`);
            res.set('Cache-Control', 'public, max-age=86400');
            res.send(result.file);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

}

export default new ExpenseController();
