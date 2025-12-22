import * as budgetPlanService from '../services/budgetPlan.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { HTTP_STATUS } from '../constants/errorMessages.js';
import * as ActivityLogService from '../services/activityLog.service.js';

/**
 * Yeni Plan Oluştur
 * POST /api/budget/new
 * Mevcut yılın planını siler ve yeni plan oluşturur
 */
export const createNewPlan = asyncHandler(async (req, res) => {
    const { year, items } = req.body;

    if (!year || !items || !Array.isArray(items)) {
        throw new AppError('Yıl ve bütçe kalemleri gereklidir.', HTTP_STATUS.BAD_REQUEST);
    }

    // Items doğrulama
    for (const item of items) {
        if (!item.type || !item.category || !item.itemName) {
            throw new AppError('Her kalem için tip, kategori ve kalem adı gereklidir.', HTTP_STATUS.BAD_REQUEST);
        }
        if (!['INCOME', 'EXPENSE'].includes(item.type)) {
            throw new AppError('Tip INCOME veya EXPENSE olmalıdır.', HTTP_STATUS.BAD_REQUEST);
        }
    }

    const createdItems = await budgetPlanService.createBudgetPlan(year, items);

    // Aktivite logu
    await ActivityLogService.createLog({
        action: 'CREATE',
        entityType: 'BudgetPlan',
        entityId: year,
        entityName: `${year} Yılı Bütçe Planı`,
        adminId: req.user?.id,
        adminName: req.user?.fullName || 'Sistem',
        ipAddress: req.ip
    });

    return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: `${year} yılı için yeni bütçe planı oluşturuldu.`,
        data: { itemCount: createdItems.length }
    });
});

/**
 * Planı Kaydet
 * PUT /api/budget/save
 * Mevcut planı günceller veya yoksa oluşturur
 */
export const savePlan = asyncHandler(async (req, res) => {
    const { year, items } = req.body;

    if (!year || !items || !Array.isArray(items)) {
        throw new AppError('Yıl ve bütçe kalemleri gereklidir.', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await budgetPlanService.saveBudgetPlan(year, items);

    // Aktivite logu
    await ActivityLogService.createLog({
        action: 'UPDATE',
        entityType: 'BudgetPlan',
        entityId: year,
        entityName: `${year} Yılı Bütçe Planı`,
        adminId: req.user?.id,
        adminName: req.user?.fullName || 'Sistem',
        ipAddress: req.ip
    });

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `Bütçe planı kaydedildi. ${result.created} yeni oluşturuldu, ${result.updated} güncellendi.`,
        data: result
    });
});

/**
 * Yıllık Bütçe Planını Getir
 * GET /api/budget/:year
 */
export const getBudgetPlan = asyncHandler(async (req, res) => {
    const { year } = req.params;
    const yearInt = parseInt(year);

    if (isNaN(yearInt)) {
        throw new AppError('Geçerli bir yıl girilmelidir.', HTTP_STATUS.BAD_REQUEST);
    }

    const budgetPlan = await budgetPlanService.getBudgetPlan(yearInt);

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: budgetPlan
    });
});

/**
 * Bütçe Planı Var mı Kontrol Et
 * GET /api/budget/:year/exists
 */
export const checkBudgetPlanExists = asyncHandler(async (req, res) => {
    const { year } = req.params;
    const yearInt = parseInt(year);

    if (isNaN(yearInt)) {
        throw new AppError('Geçerli bir yıl girilmelidir.', HTTP_STATUS.BAD_REQUEST);
    }

    const exists = await budgetPlanService.hasBudgetPlan(yearInt);

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { exists }
    });
});

/**
 * Yıllık Planı Sil
 * DELETE /api/budget/:year
 */
export const deleteBudgetPlan = asyncHandler(async (req, res) => {
    const { year } = req.params;
    const yearInt = parseInt(year);

    if (isNaN(yearInt)) {
        throw new AppError('Geçerli bir yıl girilmelidir.', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await budgetPlanService.deleteYearlyPlan(yearInt);

    // Aktivite logu
    await ActivityLogService.createLog({
        action: 'DELETE',
        entityType: 'BudgetPlan',
        entityId: yearInt,
        entityName: `${yearInt} Yılı Bütçe Planı`,
        adminId: req.user?.id,
        adminName: req.user?.fullName || 'Sistem',
        ipAddress: req.ip
    });

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `${yearInt} yılı bütçe planı silindi.`,
        data: result
    });
});

/**
 * Tek Kalemi Güncelle
 * PUT /api/budget/item/:id
 */
export const updateBudgetItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedItem = await budgetPlanService.updateBudgetItem(id, req.body);

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Bütçe kalemi güncellendi.',
        data: updatedItem
    });
});

/**
 * Tek Kalemi Sil
 * DELETE /api/budget/item/:id
 */
export const deleteBudgetItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await budgetPlanService.deleteBudgetItem(id);

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        ...result
    });
});

/**
 * Mevcut Bütçe Yıllarını Getir
 * GET /api/budget/years
 */
export const getBudgetYears = asyncHandler(async (req, res) => {
    const years = await budgetPlanService.getBudgetYears();

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: years
    });
});

export default {
    createNewPlan,
    savePlan,
    getBudgetPlan,
    checkBudgetPlanExists,
    deleteBudgetPlan,
    updateBudgetItem,
    deleteBudgetItem,
    getBudgetYears
};
