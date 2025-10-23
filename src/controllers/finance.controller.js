import * as financeService from '../services/finance.service.js';

const handleError = (res, error) => {
  console.error(error);
  const status = error.message.includes('not found') ? 404
               : error.message.includes('required') || error.message.includes('exceeds') ? 400
               : 500;
  return res.status(status).send({ message: error.message });
};

// Borç Girişi
export const addDebt = async (req, res) => {
  try {
    const { memberId, externalDebtorId, debtType, amount, currency, dueDate, description } = req.body;

    if (!debtType || !amount || !currency) {
        return res.status(400).send({ message: 'Missing required fields: debtType, amount, and currency.' });
    }
    if (!memberId && !externalDebtorId) {
        return res.status(400).send({ message: 'Debtor selection (memberId or externalDebtorId) is required.' });
    }

    const debt = await financeService.addDebt(req.body);
    return res.status(201).send(debt);
  } catch (error) {
    handleError(res, error);
  }
};

// Tahsilat Kaydı
export const recordCollection = async (req, res) => {
  try {
    const { debtId, amountPaid, paymentMethod, receiptNumber, collectionDate, notes } = req.body;

    if (!debtId || !amountPaid || !paymentMethod || !collectionDate) {
      return res.status(400).send({ message: 'Missing required fields for collection.' });
    }
    if ((paymentMethod === 'Banka' || paymentMethod === 'Kredi Kartı') && !receiptNumber) {
        return res.status(400).send({ message: 'Receipt number is required for Bank or Credit Card payments.' });
    }

    const updatedDebt = await financeService.recordCollection(debtId, amountPaid, paymentMethod, receiptNumber, collectionDate, notes);
    return res.status(200).send({ message: 'Collection successfully recorded.', debt: updatedDebt });
  } catch (error) {
    handleError(res, error);
  }
};

// Borç Görüntüleme (Ana Liste)
export const getDebtList = async (req, res) => {
  try {
      const debts = await financeService.getDebtListView();
      return res.status(200).send(debts);
  } catch (error) {
      handleError(res, error);
  }
};

// Borç Detayları ve Tahsilat Geçmişi (Modal içeriği)
export const getDebtDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await financeService.getDebtDetails(id);
    return res.status(200).send(result);
  } catch (error) {
    handleError(res, error);
  }
};

// Borçlu Arama (Tahsilat ekranı için)
export const searchDebtors = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm || searchTerm.length < 3) {
        return res.status(400).send({ message: 'Search term must be at least 3 characters.' });
    }
    
    const debtors = await financeService.searchDebtors(searchTerm);
    return res.status(200).send(debtors);
  } catch (error) {
    handleError(res, error);
  }
};

export default {
  addDebt,
  recordCollection,
  getDebtList,
  getDebtDetails,
  searchDebtors
};