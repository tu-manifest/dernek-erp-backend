import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const Group = sequelize.define('Group', {
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

  Group.associate = (models) => {
    Group.hasMany(models.Member, {
      foreignKey: 'group_id',
      as: 'members',
    });
  };

  return Group;
};
