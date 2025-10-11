import { Member } from './member.model.js';
import { Group } from './group.model.js';

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