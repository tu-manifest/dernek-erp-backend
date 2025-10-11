import { Group, Member } from '../models/index.js';

// CREATE - Mevcut (aynı)
export const addNewGroup = async (groupData) => {
    console.log("addNewGroup service çalıştı");
    console.log("Gelen groupData:", groupData);
    
    const { group_name, description } = groupData;
    console.log("Grup verileri - group_name:", group_name, "description:", description);
    
    try {
        const newGroup = await Group.create({ 
            group_name, 
            description, 
            isActive: true 
        });
        
        console.log("Yeni grup oluşturuldu:", newGroup);
        return {
            id: newGroup.id,
            group_name: newGroup.group_name,
            description: newGroup.description,
            isActive: newGroup.isActive,
            createdAt: newGroup.createdAt,
            updatedAt: newGroup.updatedAt
        };
    } catch (error) {
        console.error("Grup kaydı sırasında hata:", error);
        throw error;
    }
};

// READ - Tüm grupları üye sayısıyla getir
export const getAllGroups = async () => {
    console.log("getAllGroups service çalıştı");
    
    try {
        const groups = await Group.findAll({
            include: [{
                model: Member,
                as: 'members',
                attributes: ['id', 'fullName'], // Sadece gerekli alanları getir
            }],
            order: [['createdAt', 'DESC']]
        });
        
        return groups.map(group => ({
            id: group.id,
            group_name: group.group_name,
            description: group.description,
            isActive: group.isActive,
            memberCount: group.members.length,
            members: group.members.map(member => ({
                id: member.id,
                fullName: member.fullName
            })),
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        }));
    } catch (error) {
        console.error("Grupları getirme sırasında hata:", error);
        throw error;
    }
};

// READ - ID'ye göre grup getir (üyelerle birlikte)
export const getGroupById = async (id) => {
    console.log("getGroupById service çalıştı, ID:", id);
    
    try {
        const group = await Group.findByPk(id, {
            include: [{
                model: Member,
                as: 'members',
                attributes: ['id', 'fullName', 'email', 'membershipType', 'paymentStatus']
            }]
        });
        
        if (!group) {
            const error = new Error('Grup bulunamadı');
            error.statusCode = 404;
            throw error;
        }
        
        return {
            id: group.id,
            group_name: group.group_name,
            description: group.description,
            isActive: group.isActive,
            memberCount: group.members.length,
            members: group.members.map(member => ({
                id: member.id,
                fullName: member.fullName,
                email: member.email,
                membershipType: member.membershipType,
                paymentStatus: member.paymentStatus
            })),
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        };
    } catch (error) {
        console.error("Grup getirme sırasında hata:", error);
        throw error;
    }
};

// Diğer fonksiyonlar aynı kalacak...
export const updateGroup = async (id, updateData) => {
    console.log("updateGroup service çalıştı, ID:", id);
    console.log("Güncellenecek veriler:", updateData);
    
    try {
        const group = await Group.findByPk(id);
        
        if (!group) {
            const error = new Error('Güncellenecek grup bulunamadı');
            error.statusCode = 404;
            throw error;
        }
        
        const { group_name, description, isActive } = updateData;
        
        const updatedGroup = await group.update({
            group_name: group_name || group.group_name,
            description: description !== undefined ? description : group.description,
            isActive: isActive !== undefined ? isActive : group.isActive
        });
        
        console.log("Grup güncellendi:", updatedGroup);
        return {
            id: updatedGroup.id,
            group_name: updatedGroup.group_name,
            description: updatedGroup.description,
            isActive: updatedGroup.isActive,
            createdAt: updatedGroup.createdAt,
            updatedAt: updatedGroup.updatedAt
        };
    } catch (error) {
        console.error("Grup güncelleme sırasında hata:", error);
        throw error;
    }
};

export const deleteGroup = async (id) => {
    console.log("deleteGroup service çalıştı, ID:", id);
     
    try {
        const group = await Group.findByPk(id, {
            include: [{
                model: Member,
                as: 'members'
            }]
        });
        
        if (!group) {
            const error = new Error('Silinecek grup bulunamadı');
            error.statusCode = 404;
            throw error;
        }

        // Grup silinmeden önce üye kontrolü
        if (group.members.length > 0) {
            const error = new Error(`Bu grup silinemez. ${group.members.length} üye bu gruba kayıtlı.`);
            error.statusCode = 400;
            throw error;
        }
        
        // Grubu kalıcı olarak sil
        await group.destroy();
        
        console.log("Grup kalıcı olarak silindi, ID:", id);
        return {
            id: parseInt(id),
            group_name: group.group_name,
            message: 'Grup kalıcı olarak silindi'
        };
    } catch (error) {
        console.error("Grup silme sırasında hata:", error);
        throw error;
    }
};