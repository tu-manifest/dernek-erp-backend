import { Member } from './member.model.js';
import { Group } from './group.model.js';

const DebtModel = require('./debt.model'); // YENİ IMPORT
const ExternalDebtorModel = require('./externalDebtor.model'); // YENİ IMPORT
const CollectionModel = require('./collection.model');           // YENİ IMPORT

const db = {
  // ... (Mevcut db tanımları)
  Member: MemberModel(sequelize),
  Group: GroupModel(sequelize),
  Debt: DebtModel(sequelize),                      // YENİ MODEL EKLE
  ExternalDebtor: ExternalDebtorModel(sequelize),  // YENİ MODEL EKLE
  Collection: CollectionModel(sequelize)           // YENİ MODEL EKLE
};

// Debt ve Member ilişkisi
db.Member.hasMany(db.Debt, { foreignKey: 'memberId', as: 'memberDebts' });
db.Debt.belongsTo(db.Member, { foreignKey: 'memberId', as: 'member' });

// Debt ve ExternalDebtor ilişkisi
db.ExternalDebtor.hasMany(db.Debt, { foreignKey: 'externalDebtorId', as: 'externalDebts' });
db.Debt.belongsTo(db.ExternalDebtor, { foreignKey: 'externalDebtorId', as: 'externalDebtor' });

// Debt ve Collection ilişkisi (Borç görüntüleme/modal için gerekli)
db.Debt.hasMany(db.Collection, { foreignKey: 'debtId', as: 'collections' });
db.Collection.belongsTo(db.Debt, { foreignKey: 'debtId', as: 'debt' });

// İlişkileri tanımla
Group.hasMany(Member, { 
  foreignKey: 'group_id',
  as: 'members'
});

Member.belongsTo(Group, { 
  foreignKey: 'group_id',
  as: 'group'
});

// Modelleri export et 
export { Member, Group };