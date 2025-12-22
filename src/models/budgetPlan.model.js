import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const BudgetPlanItem = sequelize.define('BudgetPlanItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bütçe yılı'
        },
        type: {
            type: DataTypes.ENUM('INCOME', 'EXPENSE'),
            allowNull: false,
            comment: 'Gelir veya Gider'
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Kategori adı (örn: Bağışlar, Personel Giderleri)'
        },
        itemName: {
            type: DataTypes.STRING(200),
            allowNull: false,
            comment: 'Kalem adı (örn: Bireysel Bağışlar, Maaşlar)'
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Planlanan tutar'
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'TRY',
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Ek açıklama'
        }
    }, {
        tableName: 'BudgetPlanItems',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['year', 'type', 'category', 'itemName'],
                name: 'unique_budget_item'
            }
        ]
    });

    return BudgetPlanItem;
};
