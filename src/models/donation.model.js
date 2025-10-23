// src/models/donation.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Donation = sequelize.define('Donation', {
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    donationAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    donationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Donation.associate = (models) => {
    Donation.belongsTo(models.Member, {
      foreignKey: 'memberId',
      as: 'member'
    });
  };

  return Donation;
};