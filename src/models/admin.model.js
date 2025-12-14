import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Admin = sequelize.define('Admin', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // --- Kişisel Bilgiler ---
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Ad ve soyad gereklidir.' },
                notEmpty: { msg: 'Ad ve soyad boş bırakılamaz.' },
                len: [3, 255],
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: { msg: 'E-posta adresi gereklidir.' },
                isEmail: { msg: 'Geçerli bir e-posta adresi giriniz.' },
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notNull: { msg: 'Telefon numarası gereklidir.' },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Şifre gereklidir.' },
                len: {
                    args: [6, 255],
                    msg: 'Şifre en az 6 karakter olmalıdır.',
                },
            }
        },

        // --- Notlar ---
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // --- Modül Yetkileri ---
        canManageMembers: { // Üye yönetimi
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        canManageDonations: { // Bağış yönetimi
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        canManageAdmins: { // Yönetici yönetimi
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        canManageEvents: { // Etkinlik yönetimi
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        canManageMeetings: { // Toplantı yönetimi
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        canManageSocialMedia: { // Sosyal medya yönetimi
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        canManageFinance: { // Finansal işlemler yönetimi
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        canManageDocuments: { // Döküman yönetimi
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        // --- Hesap Durumu ---
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'admins',
        timestamps: true,
    });

    return Admin;
};
