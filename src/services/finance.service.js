import { Member, Group, Debt, ExternalDebtor, Collection } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Tüm borçluları (Üye ve Dış Borçluları) arama
 */
export const searchDebtors = async (searchTerm) => {
  const members = await Member.findAll({
    attributes: ['id', 'fullName'],
    where: {
      fullName: { [Op.iLike]: `%${searchTerm}%` }
    },
    limit: 10
  });

  const externalDebtors = await ExternalDebtor.findAll({
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
 * Borç detaylarını ve tahsilat geçmişini çeker
 */
export const getDebtDetails = async (debtId) => {
  const debt = await Debt.findByPk(debtId, {
    include: [
      { model: Member, as: 'member', attributes: ['fullName', 'email'] },
      { model: ExternalDebtor, as: 'externalDebtor', attributes: ['name', 'isInstitution'] },
      { model: Collection, as: 'collections' }
    ]
  });
  
  if (!debt) {
      throw new Error('Debt not found');
  }
  
  const debtorName = debt.debtorType === 'MEMBER' 
                   ? debt.member ? debt.member.fullName : 'Üye Bulunamadı'
                   : debt.externalDebtor ? debt.externalDebtor.name : 'Dış Borçlu Bulunamadı';

  const unpaidDebts = await Debt.findAll({
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
        throw new Error("Debt must belong to either a MEMBER or an EXTERNAL debtor, not both.");
    }
    
    let debtorType;
    if (data.memberId) {
        debtorType = 'MEMBER';
    } else if (data.externalDebtorId) {
        debtorType = 'EXTERNAL';
    } else {
        throw new Error("Debtor must be selected.");
    }

    return Debt.create({
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
  const debt = await Debt.findByPk(debtId);

  if (!debt) {
    throw new Error('Debt not found');
  }

  const outstandingAmount = parseFloat(debt.amount) - parseFloat(debt.collectedAmount);
  
  if (parseFloat(amountPaid) > outstandingAmount) {
      throw new Error(`Amount paid (${amountPaid}) exceeds outstanding balance (${outstandingAmount}).`);
  }

  await Collection.create({
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
  return Debt.findAll({
      include: [
        { model: Member, as: 'member', attributes: ['fullName'] },
        { model: ExternalDebtor, as: 'externalDebtor', attributes: ['name'] }
      ],
      order: [['dueDate', 'ASC']]
  });
};