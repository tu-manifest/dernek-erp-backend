import { Member } from './member.model.js';
import { Group } from './group.model.js';
import { Debt } from './debt.model.js';
import { ExternalDebtor } from './externalDebtor.model.js';
import { Collection } from './collection.model.js';

// ✅ Debt ve Member ilişkisi
Member.hasMany(Debt, { foreignKey: 'memberId', as: 'memberDebts' });
Debt.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// ✅ Debt ve ExternalDebtor ilişkisi
ExternalDebtor.hasMany(Debt, { foreignKey: 'externalDebtorId', as: 'externalDebts' });
Debt.belongsTo(ExternalDebtor, { foreignKey: 'externalDebtorId', as: 'externalDebtor' });

// ✅ Debt ve Collection ilişkisi
Debt.hasMany(Collection, { foreignKey: 'debtId', as: 'collections' });
Collection.belongsTo(Debt, { foreignKey: 'debtId', as: 'debt' });

// ✅ Group ve Member ilişkisi
Group.hasMany(Member, { 
  foreignKey: 'group_id',
  as: 'members'
});

Member.belongsTo(Group, { 
  foreignKey: 'group_id',
  as: 'group'
});

// ✅ Modelleri export et 
export { Member, Group, Debt, ExternalDebtor, Collection };