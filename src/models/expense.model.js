// src/models/expense.model.js
import { DataTypes } from 'sequelize';

// Ödeme yöntemleri
export const PAYMENT_METHODS = {
    NAKIT: 'Nakit',
    BANKA_TRANSFERI: 'Banka transferi',
    KREDI_KARTI: 'Kredi kartı',
    CEK: 'Çek',
    SENET: 'Senet',
    HAVALE_EFT: 'Havale/EFT'
};

// Para birimleri
export const CURRENCIES = {
    TRY: 'TRY',
    USD: 'USD',
    EUR: 'EUR'
};

export default (sequelize) => {
    const Expense = sequelize.define('Expense', {
        mainCategory: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Ana kategori'
        },
        subCategory: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Alt kategori'
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Tutar'
        },
        currency: {
            type: DataTypes.ENUM(...Object.values(CURRENCIES)),
            allowNull: false,
            defaultValue: CURRENCIES.TRY,
            comment: 'Para birimi'
        },
        expenseDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Gider tarihi'
        },
        paymentMethod: {
            type: DataTypes.ENUM(...Object.values(PAYMENT_METHODS)),
            allowNull: false,
            comment: 'Ödeme yöntemi'
        },
        invoiceNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Fatura/Fiş numarası'
        },
        supplierName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Tedarikçi/Alıcı adı'
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Departman'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Açıklama'
        },
        isRecurring: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Düzenli tekrarlama (aylık)'
        },
        // Belge alanları
        file: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
            comment: 'Belge içeriği (PDF, JPG, PNG)'
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Orijinal dosya adı'
        },
        fileMimeType: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Dosya tipi (application/pdf, image/jpeg vb.)'
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Dosya boyutu (bytes)'
        }
    }, {
        tableName: 'Expenses',
        timestamps: true,
        indexes: [
            {
                fields: ['expenseDate']
            },
            {
                fields: ['mainCategory']
            },
            {
                fields: ['paymentMethod']
            }
        ]
    });

    return Expense;
};
