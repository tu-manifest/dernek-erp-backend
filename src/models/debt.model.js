import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Debt = sequelize.define('Debt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'members',
      key: 'id',
    }
  },
  externalDebtorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
          model: 'ExternalDebtors',
          key: 'id',
      }
  },
  debtorType: {
      type: DataTypes.ENUM('MEMBER', 'EXTERNAL'),
      allowNull: false
  },
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
    allowNull: false
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
  collectedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
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