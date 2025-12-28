// src/services/expense.service.js
import db from '../models/index.js';
import { createLog } from './activityLog.service.js';
import { Op } from 'sequelize';

class ExpenseService {
    /**
     * Yeni gider oluştur
     */
    async createExpense(data, file, adminInfo) {
        // Zorunlu alan kontrolleri
        if (!data.mainCategory || !data.subCategory) {
            const error = new Error('Ana kategori ve alt kategori zorunludur.');
            error.statusCode = 400;
            throw error;
        }

        if (!data.amount || isNaN(parseFloat(data.amount))) {
            const error = new Error('Geçerli bir tutar girilmelidir.');
            error.statusCode = 400;
            throw error;
        }

        if (!data.expenseDate) {
            const error = new Error('Gider tarihi zorunludur.');
            error.statusCode = 400;
            throw error;
        }

        if (!data.paymentMethod) {
            const error = new Error('Ödeme yöntemi zorunludur.');
            error.statusCode = 400;
            throw error;
        }

        const expenseData = {
            mainCategory: data.mainCategory,
            subCategory: data.subCategory,
            amount: parseFloat(data.amount),
            currency: data.currency || 'TRY',
            expenseDate: data.expenseDate,
            paymentMethod: data.paymentMethod,
            invoiceNumber: data.invoiceNumber || null,
            supplierName: data.supplierName || null,
            department: data.department || null,
            description: data.description || null,
            isRecurring: data.isRecurring === 'true' || data.isRecurring === true
        };

        // Dosya varsa ekle
        if (file) {
            expenseData.file = file.buffer;
            expenseData.fileName = file.originalname;
            expenseData.fileMimeType = file.mimetype;
            expenseData.fileSize = file.size;
        }

        const expense = await db.Expense.create(expenseData);

        // Activity log oluştur
        await createLog({
            action: 'CREATE',
            entityType: 'Expense',
            entityId: expense.id,
            entityName: `${expense.mainCategory} - ${expense.subCategory} (${expense.amount} ${expense.currency})`,
            adminId: adminInfo?.adminId,
            adminName: adminInfo?.adminName,
            details: {
                mainCategory: expense.mainCategory,
                subCategory: expense.subCategory,
                amount: expense.amount,
                currency: expense.currency,
                expenseDate: expense.expenseDate,
                paymentMethod: expense.paymentMethod
            },
            ipAddress: adminInfo?.ipAddress
        });

        // Dosya içeriğini response'dan çıkar
        const { file: fileData, ...expenseWithoutFile } = expense.toJSON();
        return {
            ...expenseWithoutFile,
            hasDocument: !!fileData
        };
    }

    /**
     * Tüm giderleri listele (filtreleme + pagination + istatistikler)
     */
    async getAllExpenses(filters = {}) {
        const where = {};
        const {
            page = 1,
            limit = 20,
            mainCategory,
            subCategory,
            paymentMethod,
            startDate,
            endDate,
            isRecurring,
            search
        } = filters;

        if (mainCategory) {
            where.mainCategory = mainCategory;
        }

        if (subCategory) {
            where.subCategory = subCategory;
        }

        if (paymentMethod) {
            where.paymentMethod = paymentMethod;
        }

        if (isRecurring !== undefined) {
            where.isRecurring = isRecurring === 'true' || isRecurring === true;
        }

        if (startDate && endDate) {
            where.expenseDate = {
                [Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            where.expenseDate = {
                [Op.gte]: startDate
            };
        } else if (endDate) {
            where.expenseDate = {
                [Op.lte]: endDate
            };
        }

        if (search) {
            where[Op.or] = [
                { supplierName: { [Op.iLike]: `%${search}%` } },
                { invoiceNumber: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        // İstatistikler için tarihler
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // Paralel olarak hem listeyi hem istatistikleri çek
        const [
            expenseData,
            monthlyTotal,
            yearlyTotal,
            totalAmount,
            byPaymentMethod,
            byCategory
        ] = await Promise.all([
            // Gider listesi
            db.Expense.findAndCountAll({
                attributes: { exclude: ['file'] },
                where,
                order: [['expenseDate', 'DESC'], ['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            }),

            // Bu ayki toplam tutar (TRY)
            db.Expense.sum('amount', {
                where: {
                    expenseDate: { [Op.gte]: startOfMonth },
                    currency: 'TRY'
                }
            }),

            // Bu yılki toplam tutar (TRY)
            db.Expense.sum('amount', {
                where: {
                    expenseDate: { [Op.gte]: startOfYear },
                    currency: 'TRY'
                }
            }),

            // Tüm zamanların toplam tutarı (TRY)
            db.Expense.sum('amount', {
                where: { currency: 'TRY' }
            }),

            // Ödeme yöntemine göre dağılım
            db.Expense.findAll({
                attributes: [
                    'paymentMethod',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
                    [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total']
                ],
                where: { currency: 'TRY' },
                group: ['paymentMethod'],
                raw: true
            }),

            // Kategoriye göre dağılım
            db.Expense.findAll({
                attributes: [
                    'mainCategory',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
                    [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total']
                ],
                where: { currency: 'TRY' },
                group: ['mainCategory'],
                raw: true
            })
        ]);

        const { count, rows } = expenseData;

        // hasDocument alanı ekle
        const expenses = rows.map(expense => {
            const exp = expense.toJSON();
            return {
                ...exp,
                hasDocument: !!exp.fileName
            };
        });

        return {
            expenses,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            },
            stats: {
                totalExpenses: count,
                totalAmount: totalAmount || 0,
                monthlyTotal: monthlyTotal || 0,
                yearlyTotal: yearlyTotal || 0,
                byPaymentMethod,
                byCategory
            }
        };
    }

    /**
     * Tek gider detayı (dosya içeriği hariç)
     */
    async getExpenseById(id) {
        const expense = await db.Expense.findByPk(id, {
            attributes: { exclude: ['file'] }
        });

        if (!expense) {
            const error = new Error('Gider bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const exp = expense.toJSON();
        return {
            ...exp,
            hasDocument: !!exp.fileName
        };
    }

    /**
     * Gider güncelle
     */
    async updateExpense(id, data, adminInfo) {
        const expense = await db.Expense.findByPk(id);

        if (!expense) {
            const error = new Error('Gider bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        // Güncellenebilir alanlar
        const allowedFields = [
            'mainCategory', 'subCategory', 'amount', 'currency',
            'expenseDate', 'paymentMethod', 'invoiceNumber',
            'supplierName', 'department', 'description', 'isRecurring'
        ];

        const updateData = {};
        const changes = {};

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                const oldValue = expense[field];
                let newValue = data[field];

                // Boolean dönüşümü
                if (field === 'isRecurring') {
                    newValue = newValue === 'true' || newValue === true;
                }

                // Amount için parseFloat
                if (field === 'amount') {
                    newValue = parseFloat(newValue);
                }

                if (oldValue !== newValue) {
                    changes[field] = { old: oldValue, new: newValue };
                    updateData[field] = newValue;
                }
            }
        }

        if (Object.keys(updateData).length > 0) {
            await expense.update(updateData);

            // Activity log oluştur
            await createLog({
                action: 'UPDATE',
                entityType: 'Expense',
                entityId: expense.id,
                entityName: `${expense.mainCategory} - ${expense.subCategory}`,
                adminId: adminInfo?.adminId,
                adminName: adminInfo?.adminName,
                details: { changes },
                ipAddress: adminInfo?.ipAddress
            });
        }

        const { file, ...expenseWithoutFile } = expense.toJSON();
        return {
            ...expenseWithoutFile,
            hasDocument: !!expense.fileName
        };
    }

    /**
     * Gider sil
     */
    async deleteExpense(id, adminInfo) {
        const expense = await db.Expense.findByPk(id);

        if (!expense) {
            const error = new Error('Gider bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const expenseInfo = {
            mainCategory: expense.mainCategory,
            subCategory: expense.subCategory,
            amount: expense.amount,
            currency: expense.currency
        };

        await expense.destroy();

        // Activity log oluştur
        await createLog({
            action: 'DELETE',
            entityType: 'Expense',
            entityId: id,
            entityName: `${expenseInfo.mainCategory} - ${expenseInfo.subCategory} (${expenseInfo.amount} ${expenseInfo.currency})`,
            adminId: adminInfo?.adminId,
            adminName: adminInfo?.adminName,
            details: expenseInfo,
            ipAddress: adminInfo?.ipAddress
        });

        return { message: 'Gider başarıyla silindi.' };
    }

    /**
     * Gider belgesini görüntüle (inline)
     */
    async viewExpenseDocument(id) {
        const expense = await db.Expense.findByPk(id, {
            attributes: ['id', 'file', 'fileName', 'fileMimeType']
        });

        if (!expense) {
            const error = new Error('Gider bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        if (!expense.file) {
            const error = new Error('Bu gidere ait belge bulunmamaktadır.');
            error.statusCode = 404;
            throw error;
        }

        return {
            file: expense.file,
            fileName: expense.fileName,
            mimeType: expense.fileMimeType
        };
    }

    /**
     * Gider belgesini indir
     */
    async downloadExpenseDocument(id) {
        return this.viewExpenseDocument(id);
    }
}

export default new ExpenseService();
