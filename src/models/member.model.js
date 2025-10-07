import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Member = sequelize.define('Member', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
});