import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Meeting = sequelize.define('Meeting', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // --- Temel Bilgiler ---
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Toplantı başlığı gereklidir.' },
        notEmpty: { msg: 'Toplantı başlığı boş bırakılamaz.' },
        len: {
          args: [3, 255],
          msg: 'Toplantı başlığı en az 3 karakter olmalıdır.',
        },
      },
    },
    meetingType: {
      type: DataTypes.ENUM('Yönetim Kurulu', 'Genel Kurul', 'Komisyon', 'Diğer'),
      allowNull: false,
      validate: {
        notNull: { msg: 'Toplantı türü gereklidir.' },
        isIn: {
          args: [['Yönetim Kurulu', 'Genel Kurul', 'Komisyon', 'Diğer']],
          msg: 'Geçerli bir toplantı türü seçiniz.',
        },
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: 'Toplantı tarihi gereklidir.' },
        isDate: { msg: 'Geçerli bir tarih giriniz.' },
      },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: { msg: 'Başlangıç saati gereklidir.' },
      },
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: { msg: 'Bitiş saati gereklidir.' },
      },
    },

    // --- Katılımcı Bilgileri ---
    participantCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: 'Katılımcı sayısı tam sayı olmalıdır.' },
        min: {
          args: [1],
          msg: 'Katılımcı sayısı en az 1 olmalıdır.',
        },
      },
    },

    // --- Konum Bilgileri ---
    meetingFormat: {
      type: DataTypes.ENUM('Fiziksel', 'Çevrimiçi'),
      allowNull: false,
      validate: {
        notNull: { msg: 'Toplantı şekli gereklidir.' },
        isIn: {
          args: [['Fiziksel', 'Çevrimiçi']],
          msg: 'Toplantı şekli Fiziksel veya Çevrimiçi olmalıdır.',
        },
      },
    },
    // Fiziksel toplantılar için konum
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Çevrimiçi toplantılar için platform
    platform: {
      type: DataTypes.ENUM('Google Meet', 'Zoom', 'Microsoft Teams', 'Diğer'),
      allowNull: true,
    },
    // Çevrimiçi toplantılar için link
    meetingLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Geçerli bir URL giriniz.' },
      },
    },

    // --- Gündem ---
    agenda: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Toplantı gündemi gereklidir.' },
        notEmpty: { msg: 'Toplantı gündemi boş bırakılamaz.' },
      },
    },

    // --- Durum ---
    status: {
      type: DataTypes.ENUM('Planlandı', 'Tamamlandı', 'İptal Edildi'),
      allowNull: false,
      defaultValue: 'Planlandı',
    },
  }, {
    tableName: 'meetings',
    timestamps: true,
    validate: {
      // Fiziksel toplantı için konum zorunlu
      locationRequired() {
        if (this.meetingFormat === 'Fiziksel' && !this.location) {
          throw new Error('Fiziksel toplantılar için konum gereklidir.');
        }
      },
      // Çevrimiçi toplantı için platform ve link zorunlu
      onlineFieldsRequired() {
        if (this.meetingFormat === 'Çevrimiçi') {
          if (!this.platform) {
            throw new Error('Çevrimiçi toplantılar için platform seçimi gereklidir.');
          }
          if (!this.meetingLink) {
            throw new Error('Çevrimiçi toplantılar için toplantı linki gereklidir.');
          }
        }
      },
      // Bitiş saati başlangıç saatinden sonra olmalı
      endTimeAfterStartTime() {
        if (this.startTime && this.endTime && this.endTime <= this.startTime) {
          throw new Error('Bitiş saati başlangıç saatinden sonra olmalıdır.');
        }
      },
    },
  });

  Meeting.associate = (models) => {
    // İleride katılımcı ilişkileri eklenebilir
    // Meeting.belongsToMany(models.Member, { through: 'MeetingParticipants' });
  };

  return Meeting;
};
