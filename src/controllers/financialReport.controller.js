// src/controllers/financialReport.controller.js
import { getFinancialReport } from '../services/financialReport.service.js';

/**
 * Finansal rapor verilerini getir
 * GET /api/financial-report
 * Query params: year (optional, default: current year)
 */
export const getFinancialReportHandler = async (req, res) => {
    try {
        const { year } = req.query;
        const reportYear = year ? parseInt(year) : new Date().getFullYear();

        const reportData = await getFinancialReport(reportYear);

        res.status(200).json({
            success: true,
            data: reportData
        });
    } catch (error) {
        console.error('Financial report error:', error);
        res.status(500).json({
            success: false,
            message: 'Finansal rapor verileri alınırken bir hata oluştu.',
            error: error.message
        });
    }
};
