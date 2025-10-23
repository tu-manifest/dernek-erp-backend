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
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Donor;
};