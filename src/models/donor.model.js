// src/models/donor.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Donor = sequelize.define('Donor', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Kişi', 'Kurum'),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Donor.associate = (models) => {
    Donor.hasMany(models.Donation, {
      foreignKey: 'donorId',
      as: 'donations'
    });
  };

  return Donor;
};