// src/services/finance.service.js
const db = require('../models');
const { Op } = db.Sequelize;

class FinanceService {
  /**
   * Tüm borçluları (Üye ve Dış Borçluları) arama ve listeleme için çeker.
   * Tahsilat kaydı ekranında borçlu seçimi için kullanılır.
   */
  async searchDebtors(searchTerm) {
    const memberAttributes = ['id', [db.Sequelize.literal('CONCAT("firstName", \' \', "lastName")'), 'fullName'], [db.Sequelize.literal('\'MEMBER\''), 'type']];
    const externalAttributes = ['id', 'name', [db.Sequelize.literal('\'EXTERNAL\''), 'type']];

    // Üyelerde Ad Soyad arama
    const members = await db.Member.findAll({
      attributes: memberAttributes,
      where: {
        [Op.or]: [
          db.Sequelize.literal(`CONCAT("firstName", ' ', "lastName") ILIKE '%${searchTerm}%'`),
          // Diğer arama alanları eklenebilir (e.g., email)
        ]
      },
      limit: 10
    });

    // Dış Borçlularda İsim arama
    const externalDebtors = await db.ExternalDebtor.findAll({
      attributes: externalAttributes,
      where: {
        name: { [Op.iLike]: `%${searchTerm}%` }
      },
      limit: 10
    });

    // Karışık listeyi tek bir dizi olarak döndürür
    return [...members.map(m => ({ id: m.id, fullName: m.get('fullName'), type: 'MEMBER' })),
            ...externalDebtors.map(e => ({ id: e.id, fullName: e.name, type: 'EXTERNAL' }))];
  }

  /**
   * Borç Görüntüleme Ekranı için gerekli, borcun detaylarını ve tahsilat geçmişini çeker.
   */
  async getDebtDetails(debtId) {
    const debt = await db.Debt.findByPk(debtId, {
      include: [
        { model: db.Member, as: 'member', attributes: ['fullName', 'email'] },
        { model: db.ExternalDebtor, as: 'externalDebtor', attributes: ['name', 'isInstitution'] },
        { model: db.Collection, as: 'collections' } // Tahsilat geçmişi tablosu
      ]
    });
    
    if (!debt) {
        throw new Error('Debt not found');
    }
    
    // Borçlunun adını belirle
    const debtorName = debt.debtorType === 'MEMBER' 
                       ? debt.member ? debt.member.fullName : 'Üye Bulunamadı'
                       : debt.externalDebtor ? debt.externalDebtor.name : 'Dış Borçlu Bulunamadı';

    // Tahsilat Kaydı ekranı için uygun borçları listeler (ödeme yapılacak borç)
    const unpaidDebts = await db.Debt.findAll({
        where: {
            [debt.debtorType === 'MEMBER' ? 'memberId' : 'externalDebtorId']: debt.debtorType === 'MEMBER' ? debt.memberId : debt.externalDebtorId,
            status: { [Op.not]: 'Paid' } // Henüz tamamı ödenmemiş borçlar
        },
        attributes: ['id', 'debtType', 'amount', 'currency', 'collectedAmount']
    });

    return { 
        debtDetails: debt.toJSON(), 
        debtorName,
        unpaidDebts // Tahsilat ekranına yönlendirme için kullanılacak
    };
  }
  
  // Borç Girişi - Borç Giriş ekranı için basit oluşturma
  async addDebt(data) {
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

      return db.Debt.create({
          ...data,
          debtorType,
          collectedAmount: 0.00,
          status: 'Pending'
      });
  }

  /**
   * Tahsilat işlemi kaydeder ve ana borcun durumunu günceller.
   */
  async recordCollection(debtId, amountPaid, paymentMethod, receiptNumber, collectionDate, notes) {
    const debt = await db.Debt.findByPk(debtId);

    if (!debt) {
      throw new Error('Debt not found');
    }

    const outstandingAmount = parseFloat(debt.amount) - parseFloat(debt.collectedAmount);
    
    if (parseFloat(amountPaid) > outstandingAmount) {
        throw new Error(`Amount paid (${amountPaid}) exceeds outstanding balance (${outstandingAmount}).`);
    }

    // 1. Tahsilat kaydını oluştur
    await db.Collection.create({
        debtId,
        amountPaid,
        paymentMethod,
        receiptNumber: paymentMethod === 'Banka' || paymentMethod === 'Kredi Kartı' ? receiptNumber : null,
        collectionDate,
        notes
    });

    // 2. Ana borcu güncelle
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
  }
  
  /**
   * Borç Görüntüleme ekranı için ana liste
   */
  async getDebtListView() {
    return db.Debt.findAll({
        attributes: [
            'id', 
            'amount', 
            'currency', 
            'dueDate', 
            'status',
            // Borçlu Adını almak için karmaşık SQL ifadesi (Sequelize Literal)
            [db.Sequelize.literal(`
                CASE 
                    WHEN "Debt"."debtorType" = 'MEMBER' 
                    THEN (SELECT CONCAT(m."firstName", ' ', m."lastName") FROM "Members" AS m WHERE m.id = "Debt"."memberId") 
                    ELSE (SELECT "name" FROM "ExternalDebtors" AS ed WHERE ed.id = "Debt"."externalDebtorId") 
                END
            `), 'debtorName'],
            [db.Sequelize.literal(`
                CASE 
                    WHEN "Debt"."debtorType" = 'MEMBER' 
                    THEN 'Üye' 
                    ELSE 'Dış Kurum/Bağışçı' 
                END
            `), 'debtorCategory']
        ],
        order: [['dueDate', 'ASC']]
    });
  }
}

module.exports = new FinanceService();