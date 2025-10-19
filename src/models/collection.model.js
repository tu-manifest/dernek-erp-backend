import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Collection = sequelize.define('Collection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  debtId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Debts',
      key: 'id',
    }
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Yapılan ödeme miktarı'
  },
  collectionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Tahsilatın yapıldığı tarih'
  },
  paymentMethod: {
    type: DataTypes.ENUM('Banka', 'Kasa', 'Kredi Kartı', 'Diğer'),
    allowNull: false,
    comment: 'Tahsilatın şekli (Radio butonları)'
  },
  receiptNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Banka/Kredi Kartı için dekont numarası'
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Açıklama (Opsiyonel)'
  }
}, {
  tableName: 'Collections',
  timestamps: true,
});