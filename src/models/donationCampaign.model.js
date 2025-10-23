// src/models/donation.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DonationCampaign = sequelize.define('DonationCampaign', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'Genel Bağış',
        'Sosyal Destek',
        'Kurban',
        'Eğitim',
        'Su',
        'Sağlık',
        'Afet Yardım',
        'Zekat'
      ),
      allowNull: false,
    },
    targetAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iban: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return DonationCampaign;
};