import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Collection = sequelize.define('Collection', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    debtId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Banka', 'Kasa', 'Kredi Kartı', 'Diğer']]
      },
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

  Collection.associate = (models) => {
    Collection.belongsTo(models.Debt, {
      foreignKey: 'debtId',
      as: 'debt',
    });
  };

  return Collection;
};