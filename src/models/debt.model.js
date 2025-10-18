// src/models/debt.model.js 
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Debt = sequelize.define('Debt', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    // Borçlu İlişkisi (Polimorfik) - memberId veya externalDebtorId dolu olacak
    memberId: {
      type: DataTypes.UUID,
      allowNull: true, // Artık boş olabilir, çünkü ExternalDebtor olabilir
      references: {
        model: 'Members',
        key: 'id',
      }
    },
    externalDebtorId: {
        type: DataTypes.UUID,
        allowNull: true, // Dış borçlu ID'si
        references: {
            model: 'ExternalDebtors',
            key: 'id',
        }
    },
    debtorType: {
        type: DataTypes.ENUM('MEMBER', 'EXTERNAL'), // Borçlunun tipi
        allowNull: false
    },
    
    // Borç Girişi Ekranı Gereksinimleri
    debtType: {
        type: DataTypes.ENUM(
            'Etkinlik katılım ücreti', 'Materyal alım ücreti', 
            'Kiralama/tesis kullanım ücreti', 'Bağış Sözü', 
            'Kampanya Taahüdü', 'Vakıf/Hibe sözü', 
            'Tazminat Hasar bedeli', 'Sözleşme ihlali Bedeli', 
            'Devlet iadesi', 'Sigorta Hasar Bedeli', 
            'Fon Toplama etkinliği geliri', 'Ayni Bağış Değeri'
        ),
        allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Toplam borç miktarı (Vadesi gelen/gelecek)'
    },
    currency: {
        type: DataTypes.ENUM('TL', 'EUR', 'USD', 'GBP'),
        allowNull: false,
        defaultValue: 'TL'
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    
    // Tahsilat Ekranı Görüntüleme Alanı
    collectedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Bu borç için toplam tahsil edilen miktar'
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Partial', 'Paid', 'Overdue'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
  }, {
    tableName: 'Debts',
    timestamps: true,
  });

  return Debt;
};