import { Op } from 'sequelize';
import db from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import { HTTP_STATUS } from '../constants/errorMessages.js';

/**
 * Belirli bir yıl için tüm bütçe kalemlerini siler (Yeni Plan)
 */
export const deleteYearlyPlan = async (year) => {
    const deletedCount = await db.BudgetPlanItem.destroy({
        where: { year }
    });
    return { deletedCount };
};

/**
 * Yeni bütçe planı oluşturur
 * Frontend'den gelen gelir ve gider yapılarını kaydeder
 */
export const createBudgetPlan = async (year, items) => {
    // Önce mevcut yılın planını sil
    await deleteYearlyPlan(year);

    // Yeni kalemleri oluştur
    const createdItems = [];

    for (const item of items) {
        const created = await db.BudgetPlanItem.create({
            year,
            type: item.type, // 'INCOME' veya 'EXPENSE'
            category: item.category,
            itemName: item.itemName,
            amount: item.amount || 0,
            currency: item.currency || 'TRY',
            description: item.description || null
        });
        createdItems.push(created);
    }

    return createdItems;
};

/**
 * Bütçe planını günceller (Kaydet butonu)
 * Mevcut planı günceller veya yoksa oluşturur
 */
export const saveBudgetPlan = async (year, items) => {
    const results = {
        created: 0,
        updated: 0,
        items: []
    };

    for (const item of items) {
        // Mevcut kaydı bul
        const existing = await db.BudgetPlanItem.findOne({
            where: {
                year,
                type: item.type,
                category: item.category,
                itemName: item.itemName
            }
        });

        if (existing) {
            // Güncelle
            await existing.update({
                amount: item.amount || 0,
                description: item.description || null
            });
            results.updated++;
            results.items.push(existing);
        } else {
            // Yeni oluştur
            const created = await db.BudgetPlanItem.create({
                year,
                type: item.type,
                category: item.category,
                itemName: item.itemName,
                amount: item.amount || 0,
                currency: item.currency || 'TRY',
                description: item.description || null
            });
            results.created++;
            results.items.push(created);
        }
    }

    return results;
};

/**
 * Belirli bir yılın bütçe planını getirir
 */
export const getBudgetPlan = async (year) => {
    const items = await db.BudgetPlanItem.findAll({
        where: { year },
        order: [['type', 'ASC'], ['category', 'ASC'], ['itemName', 'ASC']]
    });

    // Gelir ve giderleri ayır
    const incomeItems = items.filter(item => item.type === 'INCOME');
    const expenseItems = items.filter(item => item.type === 'EXPENSE');

    // Toplamları hesapla
    const totalIncome = incomeItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalExpense = expenseItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const balance = totalIncome - totalExpense;

    // Kategorilere göre grupla
    const groupByCategory = (items) => {
        const grouped = {};
        for (const item of items) {
            if (!grouped[item.category]) {
                grouped[item.category] = {
                    category: item.category,
                    items: [],
                    subtotal: 0
                };
            }
            grouped[item.category].items.push({
                id: item.id,
                itemName: item.itemName,
                amount: parseFloat(item.amount),
                description: item.description
            });
            grouped[item.category].subtotal += parseFloat(item.amount);
        }
        return Object.values(grouped);
    };

    return {
        year,
        income: {
            categories: groupByCategory(incomeItems),
            total: totalIncome
        },
        expense: {
            categories: groupByCategory(expenseItems),
            total: totalExpense
        },
        summary: {
            totalIncome,
            totalExpense,
            balance, // Pozitif: Fazla, Negatif: Açık
            status: balance >= 0 ? 'SURPLUS' : 'DEFICIT',
            statusText: balance >= 0
                ? `${balance.toFixed(2)} TRY Fazla`
                : `${Math.abs(balance).toFixed(2)} TRY Açık`
        }
    };
};

/**
 * Bütçe planının var olup olmadığını kontrol eder
 */
export const hasBudgetPlan = async (year) => {
    const count = await db.BudgetPlanItem.count({
        where: { year }
    });
    return count > 0;
};

/**
 * Tek bir bütçe kalemini günceller
 */
export const updateBudgetItem = async (itemId, updateData) => {
    const item = await db.BudgetPlanItem.findByPk(itemId);

    if (!item) {
        throw new AppError('Bütçe kalemi bulunamadı.', HTTP_STATUS.NOT_FOUND);
    }

    const allowedFields = ['amount', 'description'];
    const filteredData = {};

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            filteredData[field] = updateData[field];
        }
    }

    await item.update(filteredData);
    return item;
};

/**
 * Tek bir bütçe kalemini siler
 */
export const deleteBudgetItem = async (itemId) => {
    const item = await db.BudgetPlanItem.findByPk(itemId);

    if (!item) {
        throw new AppError('Bütçe kalemi bulunamadı.', HTTP_STATUS.NOT_FOUND);
    }

    await item.destroy();
    return { message: 'Bütçe kalemi silindi.' };
};

/**
 * Mevcut bütçe yıllarının listesini getirir
 */
export const getBudgetYears = async () => {
    const years = await db.BudgetPlanItem.findAll({
        attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('year')), 'year']],
        order: [['year', 'DESC']]
    });
    return years.map(y => y.year);
};
