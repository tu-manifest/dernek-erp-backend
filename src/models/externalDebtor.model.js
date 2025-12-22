import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExternalDebtor = sequelize.define('ExternalDebtor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Kurum Adı veya Şahıs Adı/Soyadı'
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isInstitution: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Kurum ise true, şahıs ise false'
    }
  }, {
    tableName: 'ExternalDebtors',
    timestamps: true,
  });

  return ExternalDebtor;
};