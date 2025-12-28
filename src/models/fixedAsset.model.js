// src/models/fixedAsset.model.js
import { DataTypes } from 'sequelize';

// Varlık sınıfları (hesap kodları ile)
export const ASSET_CLASSES = {
    BINALAR: 'Binalar (252)',
    TESIS_MAKINE: 'Tesis Makine ve Cihazlar (253)',
    TASITLAR: 'Taşıtlar (254)',
    DEMIRBASLAR: 'Demirbaşlar (255)',
    OZEL_MALIYETLER: 'Özel Maliyetler (264)',
    MADDI_OLMAYAN: 'Maddi Olmayan Duran Varlıklar (260)'
};

// Alt sınıflar (ana sınıfa göre)
export const ASSET_SUB_CLASSES = {
    [ASSET_CLASSES.BINALAR]: [
        'Beton, Çelik Konstrüksiyon Binalar',
        'Yarı Kagir ve Ahşap Binalar',
        'Diğer Binalar (Prefabrik vb.)'
    ],
    [ASSET_CLASSES.TESIS_MAKINE]: [
        'Jeneratör, Kompresör ve Pompalar',
        'Güvenlik, Alarm ve Yangın Sistemleri',
        'Klima ve Havalandırma Sistemleri'
    ],
    [ASSET_CLASSES.TASITLAR]: [
        'Binek Otomobiller',
        'Minibüsler, Otobüsler'
    ],
    [ASSET_CLASSES.DEMIRBASLAR]: [
        'Mobilya ve Dekorasyon Malzemeleri',
        'Bilgisayar, Yazıcı, Sunucu',
        'Ses ve Kamera Donanımları',
        'Kitaplıklar, Arşivleme Malzemeleri',
        'Eğitim Materyalleri, Simülatörler'
    ],
    [ASSET_CLASSES.OZEL_MALIYETLER]: [
        'Kiralanan Yerdeki Tadilat Giderleri'
    ],
    [ASSET_CLASSES.MADDI_OLMAYAN]: [
        'Lisans, Telif Hakkı',
        'Web Sitesi Kurulum Giderleri'
    ]
};

// Durum seçenekleri
export const ASSET_STATUS = {
    KULANIMDA: 'Kullanımda',
    ARIZALI: 'Arızalı',
    HURDAYA_AYRILMIS: 'Hurdaya Çekilmiş'
};

export default (sequelize) => {
    const FixedAsset = sequelize.define('FixedAsset', {
        registrationNo: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Varlık sicil no'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Varlık adı'
        },
        assetClass: {
            type: DataTypes.ENUM(...Object.values(ASSET_CLASSES)),
            allowNull: false,
            comment: 'Varlık sınıfı'
        },
        assetSubClass: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Alt sınıf'
        },
        brandModel: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Marka model'
        },
        costValue: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Maliyet bedeli (KDV hariç)'
        },
        acquisitionDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Edinme tarihi'
        },
        invoiceNo: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Fatura numarası'
        },
        supplierName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Satıcı/tedarikçi firma adı'
        },
        usefulLife: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Faydalı ömür (yıl)'
        },
        depreciationRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Amortisman oranı (%)'
        },
        salvageValue: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
            defaultValue: 0,
            comment: 'Hurda değeri'
        },
        depreciationStartDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Amortisman başlangıç tarihi'
        },
        responsiblePerson: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Sorumlu kişi'
        },
        warrantyEndDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Garanti bitiş tarihi'
        },
        revaluationApplied: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Yeniden değerleme / enflasyon düzeltmesi uygulandı mı?'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Açıklama'
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ASSET_STATUS)),
            allowNull: false,
            defaultValue: ASSET_STATUS.KULANIMDA,
            comment: 'Durum'
        },
        image: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
            comment: 'Varlık resmi (bytea)'
        },
        imageMimeType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Resim dosya tipi (image/jpeg, image/png vb.)'
        }
    }, {
        tableName: 'FixedAssets',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['registrationNo']
            }
        ]
    });

    return FixedAsset;
};
