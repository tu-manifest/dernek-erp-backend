// src/models/document.model.js
import { DataTypes } from 'sequelize';

// Döküman kategorileri
export const DOCUMENT_CATEGORIES = {
    YONETIM_KURULU: 'Yönetim Kurulu Kararları',
    MALI_RAPORLAR: 'Mali Raporlar',
    UYELIK_BELGELERI: 'Üyelik Belgeleri',
    SOZLESMELER: 'Sözleşmeler',
    TOPLANTI_TUTANAKLARI: 'Toplantı Tutanakları',
    DIGER: 'Diğer'
};

export default (sequelize) => {
    const Document = sequelize.define('Document', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Döküman adı'
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Kategori'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Açıklama'
        },
        file: {
            type: DataTypes.BLOB('long'),
            allowNull: false,
            comment: 'Dosya içeriği (bytea)'
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Orijinal dosya adı'
        },
        fileMimeType: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Dosya tipi (application/pdf, image/jpeg vb.)'
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Dosya boyutu (bytes)'
        }
    }, {
        tableName: 'Documents',
        timestamps: true
    });

    return Document;
};
