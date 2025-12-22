import { Op } from 'sequelize';
import db from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import { ERROR_MESSAGES, HTTP_STATUS, formatErrorMessage } from '../constants/errorMessages.js';

/**
 * Tüm borçluları (Üye ve Dış Borçluları) arama
 */
export const searchDebtors = async (searchTerm) => {
  const members = await db.Member.findAll({
    attributes: ['id', 'fullName'],
    where: {
      fullName: { [Op.iLike]: `%${searchTerm}%` }
    },
    limit: 10
  });

  const externalDebtors = await db.ExternalDebtor.findAll({
    attributes: ['id', 'name'],
    where: {
      name: { [Op.iLike]: `%${searchTerm}%` }
    },
    limit: 10
  });

  return [
    ...members.map(m => ({ id: m.id, fullName: m.fullName, type: 'MEMBER' })),
    ...externalDebtors.map(e => ({ id: e.id, fullName: e.name, type: 'EXTERNAL' }))
  ];
};

/**
 * Benzersiz borçlu listesi (isme özel gruplandırma)
 * Her borçlu için toplam borç, ödenen ve kalan bilgisi döner
 */
export const getDebtorList = async () => {
  // Tüm borçları çek
  const debts = await db.Debt.findAll({
    include: [
      { model: db.Member, as: 'member', attributes: ['id', 'fullName'] },
      { model: db.ExternalDebtor, as: 'externalDebtor', attributes: ['id', 'name', 'isInstitution'] }
    ]
  });

  // Borçluları grupla
  const debtorMap = new Map();

  for (const debt of debts) {
    const key = debt.debtorType === 'MEMBER'
      ? `MEMBER-${debt.memberId}`
      : `EXTERNAL-${debt.externalDebtorId}`;

    if (!debtorMap.has(key)) {
      const name = debt.debtorType === 'MEMBER'
        ? (debt.member ? debt.member.fullName : 'Bilinmiyor')
        : (debt.externalDebtor ? debt.externalDebtor.name : 'Bilinmiyor');

      const isInstitution = debt.debtorType === 'EXTERNAL' && debt.externalDebtor
        ? debt.externalDebtor.isInstitution
        : false;

      debtorMap.set(key, {
        id: debt.debtorType === 'MEMBER' ? debt.memberId : debt.externalDebtorId,
        name,
        type: debt.debtorType,
        isInstitution,
        totalDebt: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        debtCount: 0
      });
    }

    const debtor = debtorMap.get(key);
    const amount = parseFloat(debt.amount);
    const collected = parseFloat(debt.collectedAmount);

    debtor.totalDebt += amount;
    debtor.totalPaid += collected;
    debtor.totalOutstanding += (amount - collected);
    debtor.debtCount++;
  }

  // Map'i array'e çevir ve sırala
  return Array.from(debtorMap.values()).sort((a, b) => b.totalOutstanding - a.totalOutstanding);
};

/**
 * Borç detaylarını ve tahsilat geçmişini çeker
 */
export const getDebtDetails = async (debtId) => {
  const debt = await db.Debt.findByPk(debtId, {
    include: [
      { model: db.Member, as: 'member', attributes: ['fullName', 'email'] },
      { model: db.ExternalDebtor, as: 'externalDebtor', attributes: ['name', 'isInstitution'] },
      { model: db.Collection, as: 'collections' }
    ]
  });

  if (!debt) {
    throw new AppError(ERROR_MESSAGES.FINANCE.DEBT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const debtorName = debt.debtorType === 'MEMBER'
    ? debt.member ? debt.member.fullName : 'Üye Bulunamadı'
    : debt.externalDebtor ? debt.externalDebtor.name : 'Dış Borçlu Bulunamadı';

  const unpaidDebts = await db.Debt.findAll({
    where: {
      [debt.debtorType === 'MEMBER' ? 'memberId' : 'externalDebtorId']:
        debt.debtorType === 'MEMBER' ? debt.memberId : debt.externalDebtorId,
      status: { [Op.not]: 'Paid' }
    },
    attributes: ['id', 'debtType', 'amount', 'currency', 'collectedAmount']
  });

  return {
    debtDetails: debt.toJSON(),
    debtorName,
    unpaidDebts
  };
};

/**
 * Borç Girişi
 */
export const addDebt = async (data) => {
  if (data.memberId && data.externalDebtorId) {
    throw new AppError(ERROR_MESSAGES.FINANCE.BOTH_DEBTOR_NOT_ALLOWED, HTTP_STATUS.BAD_REQUEST);
  }

  let debtorType;
  if (data.memberId) {
    debtorType = 'MEMBER';
  } else if (data.externalDebtorId) {
    debtorType = 'EXTERNAL';
  } else {
    throw new AppError(ERROR_MESSAGES.FINANCE.DEBTOR_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  return db.Debt.create({
    ...data,
    debtorType,
    collectedAmount: 0.00,
    status: 'Pending'
  });
};

/**
 * Tahsilat işlemi kaydeder
 */
export const recordCollection = async (debtId, amountPaid, paymentMethod, receiptNumber, collectionDate, notes) => {
  const debt = await db.Debt.findByPk(debtId);

  if (!debt) {
    throw new AppError(ERROR_MESSAGES.FINANCE.DEBT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const outstandingAmount = parseFloat(debt.amount) - parseFloat(debt.collectedAmount);

  if (parseFloat(amountPaid) > outstandingAmount) {
    const message = formatErrorMessage(ERROR_MESSAGES.FINANCE.PAYMENT_EXCEEDS_DEBT, {
      amountPaid,
      outstanding: outstandingAmount.toFixed(2)
    });
    throw new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }

  await db.Collection.create({
    debtId,
    amountPaid,
    paymentMethod,
    receiptNumber: paymentMethod === 'Banka' || paymentMethod === 'Kredi Kartı' ? receiptNumber : null,
    collectionDate,
    notes
  });

  const newCollectedAmount = parseFloat(debt.collectedAmount) + parseFloat(amountPaid);
  let newStatus = 'Partial';

  if (newCollectedAmount >= parseFloat(debt.amount)) {
    newStatus = 'Paid';
  } else if (newCollectedAmount === 0) {
    newStatus = 'Pending';
  }

  await debt.update({
    collectedAmount: newCollectedAmount,
    status: newStatus
  });

  return debt;
};

/**
 * Borç listesini getirir
 */
export const getDebtListView = async () => {
  return db.Debt.findAll({
    include: [
      { model: db.Member, as: 'member', attributes: ['fullName'] },
      { model: db.ExternalDebtor, as: 'externalDebtor', attributes: ['name'] }
    ],
    order: [['dueDate', 'ASC']]
  });
};

/**
 * Genel Bağış Kampanyasını bulur veya oluşturur
 */
const getOrCreateGeneralCampaign = async () => {
  let campaign = await db.DonationCampaign.findOne({
    where: { name: 'Genel Bağış Kasası' }
  });

  if (!campaign) {
    campaign = await db.DonationCampaign.create({
      name: 'Genel Bağış Kasası',
      type: 'Genel Bağış',
      targetAmount: 99999999.99,
      collectedAmount: 0,
      description: 'Sistem kampanyası - Kampanyasız bağışlar ve borç fazlası ödemeler için genel kasa.',
      duration: 'Süresiz',
      iban: 'TR00 0000 0000 0000 0000 0000 00',
      status: 'Aktif'
    });
  }

  return campaign;
};

/**
 * Fazla ödemeyi bağış olarak kaydeder
 */
const recordOverpaymentAsDonation = async (debtorId, debtorType, amount, paymentMethod, transactionRef) => {
  const campaign = await getOrCreateGeneralCampaign();

  const donationData = {
    campaignId: campaign.id,
    donationAmount: amount,
    donationDate: new Date(),
    description: 'Borç fazlası ödemeden otomatik bağış',
    source: paymentMethod === 'Banka' ? 'Banka' : 'Manuel',
    transactionRef
  };

  // Borçlu tipine göre bağışçı ata
  if (debtorType === 'MEMBER') {
    donationData.memberId = debtorId;
  }

  const donation = await db.Donation.create(donationData);

  // Kampanya toplam tutarını güncelle
  await campaign.update({
    collectedAmount: parseFloat(campaign.collectedAmount) + parseFloat(amount)
  });

  return donation;
};

/**
 * Miktarsal (Toplu) Ödeme - FIFO Dağıtım
 * Borçluya yapılan ödemeyi açık borçlara vadesi yakın olandan başlayarak dağıtır
 */
export const recordBulkPayment = async (debtorId, debtorType, totalAmount, paymentMethod, receiptNumber, collectionDate, notes) => {
  const debtorField = debtorType === 'MEMBER' ? 'memberId' : 'externalDebtorId';

  // Açık borçları FIFO sırasıyla getir (vadesi en yakın önce)
  const openDebts = await db.Debt.findAll({
    where: {
      [debtorField]: debtorId,
      status: { [Op.not]: 'Paid' }
    },
    order: [['dueDate', 'ASC'], ['createdAt', 'ASC']]
  });

  if (openDebts.length === 0) {
    throw new AppError(ERROR_MESSAGES.FINANCE.NO_OUTSTANDING_DEBTS, HTTP_STATUS.BAD_REQUEST);
  }

  // Toplam kalan borcu hesapla
  const totalOutstanding = openDebts.reduce((sum, debt) => {
    return sum + (parseFloat(debt.amount) - parseFloat(debt.collectedAmount));
  }, 0);

  let remainingPayment = parseFloat(totalAmount);
  const distributions = [];

  // Borçlara FIFO olarak dağıt
  for (const debt of openDebts) {
    if (remainingPayment <= 0) break;

    const outstanding = parseFloat(debt.amount) - parseFloat(debt.collectedAmount);
    const paymentForThisDebt = Math.min(remainingPayment, outstanding);

    // Collection kaydı oluştur
    await db.Collection.create({
      debtId: debt.id,
      amountPaid: paymentForThisDebt,
      paymentMethod,
      receiptNumber: (paymentMethod === 'Banka' || paymentMethod === 'Kredi Kartı') ? receiptNumber : null,
      collectionDate,
      notes: notes || 'Toplu ödeme dağıtımı'
    });

    // Borcu güncelle
    const newCollectedAmount = parseFloat(debt.collectedAmount) + paymentForThisDebt;
    let newStatus = 'Partial';
    if (newCollectedAmount >= parseFloat(debt.amount)) {
      newStatus = 'Paid';
    }

    await debt.update({
      collectedAmount: newCollectedAmount,
      status: newStatus
    });

    distributions.push({
      debtId: debt.id,
      debtType: debt.debtType,
      paidAmount: paymentForThisDebt,
      newStatus
    });

    remainingPayment -= paymentForThisDebt;
  }

  // Fazla ödeme varsa bağış olarak kaydet
  let donationCreated = null;
  if (remainingPayment > 0) {
    donationCreated = await recordOverpaymentAsDonation(
      debtorId,
      debtorType,
      remainingPayment,
      paymentMethod,
      receiptNumber
    );
  }

  return {
    totalPaid: parseFloat(totalAmount),
    distributedToDebts: parseFloat(totalAmount) - remainingPayment,
    convertedToDonation: remainingPayment,
    distributions,
    donation: donationCreated ? { id: donationCreated.id, amount: remainingPayment } : null
  };
};

/**
 * Borçlu özeti - toplam borç, ödenen, kalan
 */
export const getDebtorSummary = async (debtorId, debtorType) => {
  const debtorField = debtorType === 'MEMBER' ? 'memberId' : 'externalDebtorId';

  const debts = await db.Debt.findAll({
    where: { [debtorField]: debtorId },
    attributes: ['id', 'debtType', 'amount', 'collectedAmount', 'status', 'dueDate', 'currency']
  });

  const summary = debts.reduce((acc, debt) => {
    const amount = parseFloat(debt.amount);
    const collected = parseFloat(debt.collectedAmount);
    const outstanding = amount - collected;

    acc.totalDebt += amount;
    acc.totalPaid += collected;
    acc.totalOutstanding += outstanding;

    if (debt.status !== 'Paid') {
      acc.openDebtsCount++;
    }

    return acc;
  }, {
    totalDebt: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    openDebtsCount: 0
  });

  // Borçlu bilgilerini getir
  let debtorInfo = null;
  if (debtorType === 'MEMBER') {
    debtorInfo = await db.Member.findByPk(debtorId, { attributes: ['id', 'fullName', 'email', 'phoneNumber'] });
  } else {
    debtorInfo = await db.ExternalDebtor.findByPk(debtorId, { attributes: ['id', 'name', 'contactInfo', 'isInstitution'] });
  }

  return {
    debtor: debtorInfo,
    debtorType,
    summary,
    debts
  };
};

/**
 * Borç güncelleme
 */
export const updateDebt = async (debtId, updateData) => {
  const debt = await db.Debt.findByPk(debtId);

  if (!debt) {
    throw new AppError(ERROR_MESSAGES.FINANCE.DEBT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Ödeme yapılmış borç güncellenemez (güvenlik)
  if (parseFloat(debt.collectedAmount) > 0 && updateData.amount !== undefined) {
    throw new AppError('Ödeme yapılmış borçların tutarı değiştirilemez.', HTTP_STATUS.BAD_REQUEST);
  }

  const allowedFields = ['debtType', 'amount', 'currency', 'dueDate', 'description'];
  const filteredData = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  await debt.update(filteredData);
  return debt;
};

/**
 * Borç silme
 */
export const deleteDebt = async (debtId) => {
  const debt = await db.Debt.findByPk(debtId, {
    include: [{ model: db.Collection, as: 'collections' }]
  });

  if (!debt) {
    throw new AppError(ERROR_MESSAGES.FINANCE.DEBT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Ödeme yapılmış borç silinemez
  if (parseFloat(debt.collectedAmount) > 0) {
    throw new AppError('Ödeme yapılmış borçlar silinemez.', HTTP_STATUS.BAD_REQUEST);
  }

  await debt.destroy();
  return { message: 'Borç başarıyla silindi.' };
};