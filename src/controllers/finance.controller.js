import * as financeService from '../services/finance.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/errorMessages.js';

// Borç Girişi
export const addDebt = asyncHandler(async (req, res) => {
  const { memberId, externalDebtorId, debtType, amount, currency, dueDate, description } = req.body;

  if (!debtType || !amount || !currency) {
    throw new AppError(ERROR_MESSAGES.FINANCE.DEBT_TYPE_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }
  if (!memberId && !externalDebtorId) {
    throw new AppError(ERROR_MESSAGES.FINANCE.DEBTOR_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const debt = await financeService.addDebt(req.body);
  return res.status(HTTP_STATUS.CREATED).json({ success: true, data: debt });
});

// Tahsilat Kaydı
export const recordCollection = asyncHandler(async (req, res) => {
  const { debtId, amountPaid, paymentMethod, receiptNumber, collectionDate, notes } = req.body;

  if (!debtId || !amountPaid || !paymentMethod || !collectionDate) {
    throw new AppError(ERROR_MESSAGES.FINANCE.COLLECTION_REQUIRED_FIELDS, HTTP_STATUS.BAD_REQUEST);
  }
  if ((paymentMethod === 'Banka' || paymentMethod === 'Kredi Kartı') && !receiptNumber) {
    throw new AppError(ERROR_MESSAGES.FINANCE.RECEIPT_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const updatedDebt = await financeService.recordCollection(debtId, amountPaid, paymentMethod, receiptNumber, collectionDate, notes);
  return res.status(HTTP_STATUS.OK).json({ success: true, message: 'Tahsilat başarıyla kaydedildi.', data: updatedDebt });
});

// Borç Görüntüleme (Ana Liste)
export const getDebtList = asyncHandler(async (req, res) => {
  const debts = await financeService.getDebtListView();
  return res.status(HTTP_STATUS.OK).json({ success: true, data: debts });
});

// Borç Detayları ve Tahsilat Geçmişi (Modal içeriği)
export const getDebtDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await financeService.getDebtDetails(id);
  return res.status(HTTP_STATUS.OK).json({ success: true, data: result });
});

// Borçlu Arama (Tahsilat ekranı için)
export const searchDebtors = asyncHandler(async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm.length < 3) {
    throw new AppError(ERROR_MESSAGES.FINANCE.SEARCH_MIN_LENGTH, HTTP_STATUS.BAD_REQUEST);
  }
  
  const debtors = await financeService.searchDebtors(searchTerm);
  return res.status(HTTP_STATUS.OK).json({ success: true, data: debtors });
});

export default {
  addDebt,
  recordCollection,
  getDebtList,
  getDebtDetails,
  searchDebtors
};