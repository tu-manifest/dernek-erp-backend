// src/services/financialReport.service.js
import { Op } from 'sequelize';
import db from '../models/index.js';

const { Collection, Donation, Expense, FixedAsset, BudgetPlanItem } = db;

/**
 * Belirli bir ay için gelir hesapla (Tahsilatlar + Bağışlar)
 */
const getMonthlyIncome = async (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // Tahsilatlar
    const collections = await Collection.sum('amountPaid', {
        where: {
            collectionDate: { [Op.between]: [startDate, endDate] }
        }
    }) || 0;

    // Bağışlar
    const donations = await Donation.sum('donationAmount', {
        where: {
            donationDate: { [Op.between]: [startDate, endDate] }
        }
    }) || 0;

    return parseFloat(collections) + parseFloat(donations);
};

/**
 * Belirli bir ay için gider hesapla
 */
const getMonthlyExpense = async (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const expenses = await Expense.sum('amount', {
        where: {
            expenseDate: { [Op.between]: [startDate, endDate] },
            currency: 'TRY'
        }
    }) || 0;

    return parseFloat(expenses);
};

/**
 * Aylık net bakiye ve önceki ayla karşılaştırma
 */
export const getMonthlyBalanceComparison = async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Bu ay
    const currentIncome = await getMonthlyIncome(currentYear, currentMonth);
    const currentExpense = await getMonthlyExpense(currentYear, currentMonth);
    const currentBalance = currentIncome - currentExpense;

    // Önceki ay
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const prevIncome = await getMonthlyIncome(prevYear, prevMonth);
    const prevExpense = await getMonthlyExpense(prevYear, prevMonth);
    const prevBalance = prevIncome - prevExpense;

    // Değişim hesapla
    const changeAmount = currentBalance - prevBalance;
    const changePercent = prevBalance !== 0
        ? ((changeAmount / Math.abs(prevBalance)) * 100)
        : (currentBalance !== 0 ? 100 : 0);

    return {
        current: Math.round(currentBalance * 100) / 100,
        previousMonth: Math.round(prevBalance * 100) / 100,
        changeAmount: Math.round(changeAmount * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100
    };
};

/**
 * Net çalışma sermayesi hesapla
 * Dönen Varlıklar (Tahsilatlar + Bağışlar) - Kısa Vadeli Yükümlülükler (Giderler)
 */
export const getNetWorkingCapital = async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    // Dönen Varlıklar: Bu yılki tahsilatlar
    const collections = await Collection.sum('amountPaid', {
        where: {
            collectionDate: { [Op.between]: [startOfYear, endOfYear] }
        }
    }) || 0;

    // Dönen Varlıklar: Bu yılki bağışlar
    const donations = await Donation.sum('donationAmount', {
        where: {
            donationDate: { [Op.between]: [startOfYear, endOfYear] }
        }
    }) || 0;

    // Dönen Varlıklar Toplamı
    const currentAssets = parseFloat(collections) + parseFloat(donations);

    // Kısa Vadeli Yükümlülükler: Bu yılki giderler
    const expenses = await Expense.sum('amount', {
        where: {
            expenseDate: { [Op.between]: [startOfYear, endOfYear] },
            currency: 'TRY'
        }
    }) || 0;

    const currentLiabilities = parseFloat(expenses);

    // Net Çalışma Sermayesi = Dönen Varlıklar - Kısa Vadeli Yükümlülükler
    const netWorkingCapital = currentAssets - currentLiabilities;

    return {
        currentAssets: Math.round(currentAssets * 100) / 100,
        currentLiabilities: Math.round(currentLiabilities * 100) / 100,
        netWorkingCapital: Math.round(netWorkingCapital * 100) / 100
    };
};

/**
 * Toplam gelir ve gider + en yüksek kalemler
 */
export const getSummaryWithTopCategories = async (year) => {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    // Toplam gelirler
    const totalCollections = await Collection.sum('amountPaid', {
        where: {
            collectionDate: { [Op.between]: [startOfYear, endOfYear] }
        }
    }) || 0;

    const totalDonations = await Donation.sum('donationAmount', {
        where: {
            donationDate: { [Op.between]: [startOfYear, endOfYear] }
        }
    }) || 0;

    const totalIncome = parseFloat(totalCollections) + parseFloat(totalDonations);

    // Toplam giderler
    const totalExpense = await Expense.sum('amount', {
        where: {
            expenseDate: { [Op.between]: [startOfYear, endOfYear] },
            currency: 'TRY'
        }
    }) || 0;

    // En yüksek gelir kaynağı (tahsilat mı bağış mı)
    const incomeCategories = [
        { name: 'Tahsilatlar', amount: parseFloat(totalCollections) },
        { name: 'Bağışlar', amount: parseFloat(totalDonations) }
    ];
    const topIncomeCategory = incomeCategories.sort((a, b) => b.amount - a.amount)[0];

    // En yüksek gider kategorisi
    const expenseByCategory = await Expense.findAll({
        attributes: [
            'mainCategory',
            [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total']
        ],
        where: {
            expenseDate: { [Op.between]: [startOfYear, endOfYear] },
            currency: 'TRY'
        },
        group: ['mainCategory'],
        order: [[db.sequelize.fn('SUM', db.sequelize.col('amount')), 'DESC']],
        limit: 1,
        raw: true
    });

    const topExpenseCategory = expenseByCategory.length > 0
        ? { name: expenseByCategory[0].mainCategory, amount: parseFloat(expenseByCategory[0].total) }
        : { name: '-', amount: 0 };

    return {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpense: Math.round(parseFloat(totalExpense) * 100) / 100,
        topIncomeCategory,
        topExpenseCategory
    };
};

/**
 * Son 12 aylık finansal trend
 */
export const getMonthlyTrend = async () => {
    const now = new Date();
    const result = [];

    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth();

        const income = await getMonthlyIncome(year, month);
        const expense = await getMonthlyExpense(year, month);
        const balance = income - expense;

        const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
        const monthNameTR = date.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });

        result.push({
            month: monthStr,
            monthName: monthNameTR,
            income: Math.round(income * 100) / 100,
            expense: Math.round(expense * 100) / 100,
            balance: Math.round(balance * 100) / 100
        });
    }

    return result;
};

/**
 * Bu ay içerisinde kalem bazlı gelir ve gider detayları
 */
export const getCurrentMonthBreakdown = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Gider detayları - kategori bazlı
    const expenseBreakdown = await Expense.findAll({
        attributes: [
            'mainCategory',
            'subCategory',
            [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'amount']
        ],
        where: {
            expenseDate: { [Op.between]: [startOfMonth, endOfMonth] },
            currency: 'TRY'
        },
        group: ['mainCategory', 'subCategory'],
        order: [[db.sequelize.fn('SUM', db.sequelize.col('amount')), 'DESC']],
        raw: true
    });

    // Tahsilat detayları - borç tipi bazlı
    const collectionBreakdown = await db.sequelize.query(`
        SELECT d."debtType" as category, 'Tahsilat' as "subCategory", SUM(c."amountPaid") as amount
        FROM "Collections" c
        JOIN "Debts" d ON c."debtId" = d.id
        WHERE c."collectionDate" BETWEEN :startDate AND :endDate
        GROUP BY d."debtType"
        ORDER BY SUM(c."amountPaid") DESC
    `, {
        replacements: { startDate: startOfMonth, endDate: endOfMonth },
        type: db.sequelize.QueryTypes.SELECT
    });

    // Bağış detayları - kampanya bazlı
    const donationBreakdown = await db.sequelize.query(`
        SELECT 
            COALESCE(dc.name, 'Genel Bağış') as category,
            'Bağış' as "subCategory",
            SUM(d."donationAmount") as amount
        FROM "Donations" d
        LEFT JOIN "DonationCampaigns" dc ON d."campaignId" = dc.id
        WHERE d."donationDate" BETWEEN :startDate AND :endDate
        GROUP BY dc.name
        ORDER BY SUM(d."donationAmount") DESC
    `, {
        replacements: { startDate: startOfMonth, endDate: endOfMonth },
        type: db.sequelize.QueryTypes.SELECT
    });

    // Gelir kaynaklarını birleştir
    const incomeBreakdown = [
        ...collectionBreakdown.map(item => ({
            category: item.category,
            subCategory: item.subCategory,
            amount: parseFloat(item.amount) || 0
        })),
        ...donationBreakdown.map(item => ({
            category: item.category,
            subCategory: item.subCategory,
            amount: parseFloat(item.amount) || 0
        }))
    ];

    return {
        income: incomeBreakdown,
        expense: expenseBreakdown.map(item => ({
            category: item.mainCategory,
            subCategory: item.subCategory,
            amount: parseFloat(item.amount) || 0
        }))
    };
};

/**
 * Sabit varlık özeti (Toplam defter değeri + Bu yılki amortisman)
 */
export const getFixedAssetSummary = async () => {
    const assets = await FixedAsset.findAll({
        attributes: ['costValue', 'salvageValue', 'depreciationRate', 'depreciationStartDate'],
        where: { status: 'Kullanımda' }
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    let totalBookValue = 0;
    let currentYearDepreciation = 0;

    for (const asset of assets) {
        const costValue = parseFloat(asset.costValue);
        const salvageValue = parseFloat(asset.salvageValue) || 0;
        const depreciationRate = parseFloat(asset.depreciationRate);
        const startDate = new Date(asset.depreciationStartDate);

        // Yıllık amortisman = (Maliyet - Hurda) × Oran%
        const yearlyDepreciation = (costValue - salvageValue) * (depreciationRate / 100);

        // Birikmiş amortisman hesapla
        const diffTime = now - startDate;
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

        if (diffYears > 0) {
            let accumulatedDepreciation = yearlyDepreciation * diffYears;
            const maxDepreciation = costValue - salvageValue;

            if (accumulatedDepreciation > maxDepreciation) {
                accumulatedDepreciation = maxDepreciation;
            }

            const netBookValue = costValue - accumulatedDepreciation;
            totalBookValue += netBookValue;

            // Bu yıl içinde başlamış mı kontrol et
            if (startDate.getFullYear() <= currentYear) {
                // Bu yılki amortisman = min(yıllık amortisman, kalan değer)
                const remainingValue = costValue - accumulatedDepreciation + yearlyDepreciation;
                const thisYearDep = Math.min(yearlyDepreciation, remainingValue - salvageValue);
                if (thisYearDep > 0) {
                    currentYearDepreciation += thisYearDep;
                }
            }
        } else {
            totalBookValue += costValue;
        }
    }

    return {
        totalBookValue: Math.round(totalBookValue * 100) / 100,
        currentYearDepreciation: Math.round(currentYearDepreciation * 100) / 100,
        totalAssets: assets.length
    };
};

/**
 * Yıllık bütçe uyum tablosu
 */
export const getBudgetCompliance = async (year) => {
    // Bütçe kalemlerini getir
    const budgetItems = await BudgetPlanItem.findAll({
        where: { year },
        order: [['type', 'ASC'], ['category', 'ASC'], ['itemName', 'ASC']]
    });

    if (budgetItems.length === 0) {
        return [];
    }

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    // Gerçekleşen gelirler
    const actualCollections = await Collection.sum('amountPaid', {
        where: {
            collectionDate: { [Op.between]: [startOfYear, endOfYear] }
        }
    }) || 0;

    const actualDonations = await Donation.sum('donationAmount', {
        where: {
            donationDate: { [Op.between]: [startOfYear, endOfYear] }
        }
    }) || 0;

    // Kategori bazlı gerçekleşen giderler
    const actualExpensesByCategory = await Expense.findAll({
        attributes: [
            'mainCategory',
            [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total']
        ],
        where: {
            expenseDate: { [Op.between]: [startOfYear, endOfYear] },
            currency: 'TRY'
        },
        group: ['mainCategory'],
        raw: true
    });

    const expenseMap = {};
    for (const exp of actualExpensesByCategory) {
        expenseMap[exp.mainCategory] = parseFloat(exp.total);
    }

    // Bütçe kalemlerini uyum bilgisiyle döndür
    const result = budgetItems.map(item => {
        const planned = parseFloat(item.amount);
        let actual = 0;

        if (item.type === 'INCOME') {
            // Gelir kalemleri için basit eşleştirme
            if (item.category.toLowerCase().includes('bağış') || item.itemName.toLowerCase().includes('bağış')) {
                actual = parseFloat(actualDonations);
            } else if (item.category.toLowerCase().includes('tahsilat') || item.itemName.toLowerCase().includes('aidat')) {
                actual = parseFloat(actualCollections);
            }
        } else {
            // Gider kalemleri için kategori eşleştirme
            actual = expenseMap[item.category] || 0;
        }

        const compliancePercent = planned > 0
            ? Math.round((actual / planned) * 10000) / 100
            : (actual > 0 ? 100 : 0);

        return {
            id: item.id,
            type: item.type,
            category: item.category,
            itemName: item.itemName,
            planned: Math.round(planned * 100) / 100,
            actual: Math.round(actual * 100) / 100,
            difference: Math.round((actual - planned) * 100) / 100,
            compliancePercent
        };
    });

    return result;
};

/**
 * Ana finansal rapor fonksiyonu - tüm verileri birleştirir
 */
export const getFinancialReport = async (year = null) => {
    const now = new Date();
    const reportYear = year || now.getFullYear();

    const [
        monthlyBalance,
        netWorkingCapital,
        summary,
        monthlyTrend,
        currentMonthBreakdown,
        fixedAssetSummary,
        budgetCompliance
    ] = await Promise.all([
        getMonthlyBalanceComparison(),
        getNetWorkingCapital(),
        getSummaryWithTopCategories(reportYear),
        getMonthlyTrend(),
        getCurrentMonthBreakdown(),
        getFixedAssetSummary(),
        getBudgetCompliance(reportYear)
    ]);

    return {
        monthlyBalance,
        netWorkingCapital,
        summary,
        monthlyTrend,
        currentMonthBreakdown,
        fixedAssetSummary,
        budgetCompliance,
        period: {
            currentMonth: now.toLocaleString('tr-TR', { month: 'long', year: 'numeric' }),
            year: reportYear
        }
    };
};

export default {
    getMonthlyBalanceComparison,
    getNetWorkingCapital,
    getSummaryWithTopCategories,
    getMonthlyTrend,
    getCurrentMonthBreakdown,
    getFixedAssetSummary,
    getBudgetCompliance,
    getFinancialReport
};
