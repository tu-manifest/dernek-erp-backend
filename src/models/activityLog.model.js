import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const ActivityLog = sequelize.define('ActivityLog', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // İşlem türü
        action: {
            type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
            allowNull: false,
        },

        // Etkilenen entity türü (örn: 'Event', 'Member', 'Campaign')
        entityType: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // Etkilenen entity ID'si
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Silme işlemlerinde null olabilir
        },

        // Görüntülenecek entity ismi (örn: 'ETKİNLİK VAR GELİNNN')
        entityName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // İşlemi yapan admin ID
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Sistem işlemleri için null olabilir
        },

        // İşlemi yapan admin adı (denormalized - hızlı sorgular için)
        adminName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Sistem',
        },

        // Değişiklik detayları (eski ve yeni değerler)
        details: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // IP adresi
        ipAddress: {
            type: DataTypes.STRING(45), // IPv6 desteği
            allowNull: true,
        },

        // Frontend'de gösterilecek hazır mesaj
        displayMessage: {
            type: DataTypes.VIRTUAL,
            get() {
                const actionTexts = {
                    'CREATE': 'tarafından yeni',
                    'UPDATE': 'tarafından',
                    'DELETE': 'tarafından',
                };

                const actionVerbs = {
                    'CREATE': 'oluşturuldu',
                    'UPDATE': 'güncellendi',
                    'DELETE': 'silindi',
                };

                const entityTypeTexts = {
                    'Event': 'etkinlik',
                    'Member': 'üye',
                    'Campaign': 'kampanya',
                    'DonationCampaign': 'kampanya',
                    'Donation': 'bağış',
                    'Document': 'döküman',
                    'FixedAsset': 'demirbaş',
                    'Debt': 'borç',
                    'Collection': 'tahsilat',
                    'Donor': 'bağışçı',
                    'ExternalDebtor': 'dış borçlu',
                    'Group': 'grup',
                };

                const entityText = entityTypeTexts[this.entityType] || this.entityType.toLowerCase();
                const actionText = actionTexts[this.action];
                const verbText = actionVerbs[this.action];

                return `${this.adminName} ${actionText} ${entityText} ${verbText}: ${this.entityName}`;
            }
        },
    }, {
        tableName: 'activity_logs',
        timestamps: true,
        updatedAt: false, // Log kayıtları güncellenmiyor
        indexes: [
            { fields: ['entityType', 'entityId'] },
            { fields: ['adminId'] },
            { fields: ['createdAt'] },
            { fields: ['action'] },
        ],
    });

    ActivityLog.associate = (models) => {
        ActivityLog.belongsTo(models.Admin, {
            foreignKey: 'adminId',
            as: 'admin',
        });
    };

    return ActivityLog;
};
