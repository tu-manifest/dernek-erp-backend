// src/controllers/finance.controller.js
const financeService = require('../services/finance.service');
const { isDate } = require('validator'); // Tarih kontrolü için validator kütüphanesi kullanılabilir

const handleError = (res, error) => {
  console.error(error);
  // Hata tiplerine göre özelleştirilmiş mesajlar
  const status = error.message.includes('not found') ? 404
               : error.message.includes('required') || error.message.includes('exceeds') ? 400
               : 500;
  return res.status(status).send({ message: error.message });
};

class FinanceController {
  
  // Borç Girişi
  async addDebt(req, res) {
    try {
      const { memberId, externalDebtorId, debtType, amount, currency, dueDate, description } = req.body;

      if (!debtType || !amount || !currency) {
          return res.status(400).send({ message: 'Missing required fields: debtType, amount, and currency.' });
      }
      if (!memberId && !externalDebtorId) {
          return res.status(400).send({ message: 'Debtor selection (memberId or externalDebtorId) is required.' });
      }
      if (dueDate && !isDate(dueDate)) {
          return res.status(400).send({ message: 'Invalid dueDate format.' });
      }

      const debt = await financeService.addDebt(req.body);
      return res.status(201).send(debt);
    } catch (error) {
      handleError(res, error);
    }
  }

  // Tahsilat Kaydı
  async recordCollection(req, res) {
    try {
      const { debtId, amountPaid, paymentMethod, receiptNumber, collectionDate, notes } = req.body;

      if (!debtId || !amountPaid || !paymentMethod || !collectionDate) {
        return res.status(400).send({ message: 'Missing required fields for collection.' });
      }
      if (new Date(collectionDate) > new Date()) {
          return res.status(400).send({ message: 'Collection date cannot be in the future.' });
      }
      if ((paymentMethod === 'Banka' || paymentMethod === 'Kredi Kartı') && !receiptNumber) {
          return res.status(400).send({ message: 'Receipt number is required for Bank or Credit Card payments.' });
      }

      const updatedDebt = await financeService.recordCollection(debtId, amountPaid, paymentMethod, receiptNumber, collectionDate, notes);
      return res.status(200).send({ message: 'Collection successfully recorded.', debt: updatedDebt });
    } catch (error) {
      handleError(res, error);
    }
  }

  // Borç Görüntüleme (Ana Liste)
  async getDebtList(req, res) {
    try {
        const debts = await financeService.getDebtListView();
        return res.status(200).send(debts);
    } catch (error) {
        handleError(res, error);
    }
  }
  
  // Borç Detayları ve Tahsilat Geçmişi (Modal içeriği)
  async getDebtDetails(req, res) {
    try {
      const { id } = req.params;
      const result = await financeService.getDebtDetails(id);
      return res.status(200).send(result);
    } catch (error) {
      handleError(res, error);
    }
  }
  
  // Borçlu Arama (Tahsilat ekranı için)
  async searchDebtors(req, res) {
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
  }
}

module.exports = new FinanceController();