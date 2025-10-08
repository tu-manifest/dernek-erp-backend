import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
 

export const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    tableName: 'group',
    timestamps: true
});
