// src/models/donation.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Donation = sequelize.define('Donation', {
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionRef: {
      type: DataTypes.STRING,
      allowNull: true
    },
    source: {
      type: DataTypes.ENUM('Manuel', 'Banka', 'Sanal Banka'),
      allowNull: false,
      defaultValue: 'Manuel'
    }
  });

  Donation.associate = (models) => {
    Donation.belongsTo(models.Member, {
      foreignKey: 'memberId',
      as: 'member'
    });
    Donation.belongsTo(models.DonationCampaign, {
      foreignKey: 'campaignId',
      as: 'campaign'
    });
    Donation.belongsTo(models.Donor, {
      foreignKey: 'donorId',
      as: 'donor'
    });
  };

  return Donation;
};