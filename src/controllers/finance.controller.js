import * as financeService from '../services/finance.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/errorMessages.js';
import * as ActivityLogService from '../services/activityLog.service.js';

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

  // Aktivite logu oluştur
  await ActivityLogService.createLog({
    action: 'CREATE',
    entityType: 'Debt',
    entityId: debt.id,
    entityName: `${debtType} - ${amount} ${currency}`,
    adminId: req.user?.id,
    adminName: req.user?.fullName || 'Sistem',
    ipAddress: req.ip
  });

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

// Toplu Ödeme (FIFO Dağıtım)
export const bulkPayment = asyncHandler(async (req, res) => {
  const { debtorId, debtorType, totalAmount, paymentMethod, receiptNumber, collectionDate, notes } = req.body;

  if (!debtorId || !debtorType || !totalAmount || !paymentMethod || !collectionDate) {
    throw new AppError('Eksik alanlar: debtorId, debtorType, totalAmount, paymentMethod, collectionDate gerekli.', HTTP_STATUS.BAD_REQUEST);
  }

  if (!['MEMBER', 'EXTERNAL'].includes(debtorType)) {
    throw new AppError('debtorType MEMBER veya EXTERNAL olmalıdır.', HTTP_STATUS.BAD_REQUEST);
  }

  if ((paymentMethod === 'Banka' || paymentMethod === 'Kredi Kartı') && !receiptNumber) {
    throw new AppError(ERROR_MESSAGES.FINANCE.RECEIPT_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await financeService.recordBulkPayment(
    debtorId, debtorType, totalAmount, paymentMethod, receiptNumber, collectionDate, notes
  );
  return res.status(HTTP_STATUS.OK).json({ success: true, message: 'Ödeme başarıyla dağıtıldı.', data: result });
});

// Borçlu Özeti
export const getDebtorSummary = asyncHandler(async (req, res) => {
  const { type, id } = req.params;

  if (!['MEMBER', 'EXTERNAL'].includes(type)) {
    throw new AppError('type MEMBER veya EXTERNAL olmalıdır.', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await financeService.getDebtorSummary(id, type);
  return res.status(HTTP_STATUS.OK).json({ success: true, data: result });
});

// Borçlu Listesi (İsme göre gruplandırılmış)
export const getDebtorList = asyncHandler(async (req, res) => {
  const debtors = await financeService.getDebtorList();
  return res.status(HTTP_STATUS.OK).json({ success: true, data: debtors });
});

// Borç Güncelleme
export const updateDebt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedDebt = await financeService.updateDebt(id, req.body);

  // Aktivite logu oluştur
  await ActivityLogService.createLog({
    action: 'UPDATE',
    entityType: 'Debt',
    entityId: parseInt(id),
    entityName: `${updatedDebt.debtType} - ${updatedDebt.amount} ${updatedDebt.currency}`,
    adminId: req.user?.id,
    adminName: req.user?.fullName || 'Sistem',
    ipAddress: req.ip
  });

  return res.status(HTTP_STATUS.OK).json({ success: true, message: 'Borç güncellendi.', data: updatedDebt });
});

// Borç Silme
export const deleteDebt = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Silmeden önce borç bilgisini al
  const debtInfo = await financeService.getDebtDetails(id);

  const result = await financeService.deleteDebt(id);

  // Aktivite logu oluştur
  await ActivityLogService.createLog({
    action: 'DELETE',
    entityType: 'Debt',
    entityId: parseInt(id),
    entityName: `Borç #${id}`,
    adminId: req.user?.id,
    adminName: req.user?.fullName || 'Sistem',
    ipAddress: req.ip
  });

  return res.status(HTTP_STATUS.OK).json({ success: true, ...result });
});

export default {
  addDebt,
  recordCollection,
  getDebtList,
  getDebtDetails,
  searchDebtors,
  bulkPayment,
  getDebtorSummary,
  getDebtorList,
  updateDebt,
  deleteDebt
};