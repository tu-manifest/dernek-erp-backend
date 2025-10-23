import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Etkinlik ismi gereklidir.' },
        notEmpty: { msg: 'Etkinlik ismi boş bırakılamaz.' },
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: 'Tarih gereklidir.' },
        isDate: true,
      }
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: { msg: 'Saat gereklidir.' },
      }
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: 'Kontenjan sayı olmalıdır.' },
        min: 1
      }
    },
    eventType: {
      type: DataTypes.ENUM('Offline', 'Online'),
      allowNull: false,
      validate: {
        notNull: { msg: 'Etkinlik türü gereklidir.' },
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Etkinlik yeri gereklidir.' },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Etkinlik açıklaması gereklidir.' },
      }
    },
  }, {
    tableName: 'events',
    timestamps: true,
  });

  Event.associate = (models) => {
    // Model ilişkileri buraya eklenecek
  };

  return Event;
};