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
      type: DataTypes.ENUM('Fiziksel', 'Online'),
      allowNull: false,
      validate: {
        notNull: { msg: 'Etkinlik türü gereklidir.' },
        isIn: {
          args: [['Fiziksel', 'Online']],
          msg: 'Etkinlik türü Fiziksel veya Online olmalıdır.'
        }
      }
    },
    // Fiziksel etkinlikler için konum
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Online etkinlikler için platform
    platform: {
      type: DataTypes.ENUM('Google Meet', 'Zoom', 'Microsoft Teams', 'Youtube', 'Twitch', 'Diğer'),
      allowNull: true,
    },
    // Online etkinlikler için link
    eventLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Geçerli bir URL giriniz.' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Etkinlik durumu
    status: {
      type: DataTypes.ENUM('Planlandı', 'Tamamlandı'),
      allowNull: false,
      defaultValue: 'Planlandı',
    },
  }, {
    tableName: 'events',
    timestamps: true,
    validate: {
      // Fiziksel etkinlik için konum zorunlu
      locationRequired() {
        if (this.eventType === 'Fiziksel' && !this.location) {
          throw new Error('Fiziksel etkinlikler için konum gereklidir.');
        }
      },
      // Online etkinlik için platform ve link zorunlu
      onlineFieldsRequired() {
        if (this.eventType === 'Online') {
          if (!this.platform) {
            throw new Error('Online etkinlikler için platform seçimi gereklidir.');
          }
          if (!this.eventLink) {
            throw new Error('Online etkinlikler için etkinlik linki gereklidir.');
          }
        }
      }
    }
  });

  Event.associate = (models) => {
    // Model ilişkileri buraya eklenecek
  };

  return Event;
};