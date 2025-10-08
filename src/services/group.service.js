import  { Group } from '../models/group.model.js';

export const addNewGroup = async (groupData) => {
    console.log("addNewGroup service çalıştı");
    console.log("Gelen groupData:", groupData);
  const { name, description } = groupData;
  console.log("Grup verileri - name:", name, "description:", description);
  try {
    const newGroup = await Group.create({ group_name: name, description, isActive: true });
    console.log("Yeni grup oluşturuldu:", newGroup);
    return {
      id: newGroup.id,
      name: newGroup.group_name,
      description: newGroup.description,
      isActive: newGroup.isActive
    };

  } catch (error) {
    console.error("Grup kaydı sırasında hata:", error);
    throw error; // Hatayı controller'a fırlat
  }
};