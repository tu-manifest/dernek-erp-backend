import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  associationName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Varsayılan Dernek Adı'
  },
  presidentName: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  email: DataTypes.STRING,
  taxNumber: DataTypes.STRING,
  foundationYear: DataTypes.STRING,
  address: DataTypes.TEXT,
  website: DataTypes.STRING
}, {
  timestamps: true
});

export default Setting;