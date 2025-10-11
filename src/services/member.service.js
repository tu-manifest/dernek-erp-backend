import { Member, Group } from '../models/index.js';

// CREATE - Group ID ile üye ekleme
export const addNewMember = async (memberData) => {
  console.log("addNewMember service çalıştı");
  
  const {
    fullName,
    tcNumber,
    birthDate,
    phoneNumber,
    email,
    address,
    group_id, // YENİ: Grup ID'si
    duesAmount,
    duesFrequency,
    paymentStatus,
    charterApproval, 
    kvkkApproval     
  } = memberData;

  const isCharterApproved = charterApproval === 'true' || charterApproval === true;
  const isKvkkApproved = kvkkApproval === 'true' || kvkkApproval === true;
  
  try {
    // Önce grup var mı kontrol et
    const group = await Group.findByPk(group_id);
    if (!group) {
      const error = new Error('Seçilen grup bulunamadı');
      error.statusCode = 400;
      throw error;
    }

    // Grup aktif mi kontrol et
    if (!group.isActive) {
      const error = new Error('Seçilen grup aktif değil');
      error.statusCode = 400;
      throw error;
    }

    const newMember = await Member.create({
      fullName,
      tcNumber,
      birthDate,
      phoneNumber,
      email,
      address,
      group_id: parseInt(group_id), // Grup ID'sini ekle
      duesAmount: parseFloat(duesAmount),
      duesFrequency,
      paymentStatus,
      charterApproval: isCharterApproved,
      kvkkApproval: isKvkkApproved,
    });

    console.log("Yeni üye oluşturuldu:", newMember);
    return {
      id: newMember.id,
      fullName: newMember.fullName,
      email: newMember.email,
      tcNumber: newMember.tcNumber,
      group_id: newMember.group_id,
      group_name: group.group_name, // Grup adını da döndür
      createdAt: newMember.createdAt,
      updatedAt: newMember.updatedAt
    };

  } catch (error) {
    console.error("Üye kaydı sırasında hata:", error);
    throw error;
  }
};

// READ - Tüm üyeleri grup bilgileriyle getir
export const getAllMembers = async () => {
    console.log("getAllMembers service çalıştı");
    
    try {
        const members = await Member.findAll({
            include: [{
                model: Group,
                as: 'group',
                attributes: ['id', 'group_name', 'isActive']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        return members.map(member => ({
            id: member.id,
            fullName: member.fullName,
            tcNumber: member.tcNumber,
            birthDate: member.birthDate,
            phoneNumber: member.phoneNumber,
            email: member.email,
            address: member.address,
            applicationDate: member.applicationDate,
            duesAmount: member.duesAmount,
            duesFrequency: member.duesFrequency,
            paymentStatus: member.paymentStatus,
            charterApproval: member.charterApproval,
            kvkkApproval: member.kvkkApproval,
            group_id: member.group_id,
            group: {
                id: member.group.id,
                group_name: member.group.group_name,
                isActive: member.group.isActive
            },
            createdAt: member.createdAt,
            updatedAt: member.updatedAt
        }));
    } catch (error) {
        console.error("Üyeleri getirme sırasında hata:", error);
        throw error;
    }
};

// READ - ID'ye göre üye getir (grup bilgisiyle)
export const getMemberById = async (id) => {
    console.log("getMemberById service çalıştı, ID:", id);
    
    try {
        const member = await Member.findByPk(id, {
            include: [{
                model: Group,
                as: 'group',
                attributes: ['id', 'group_name', 'description', 'isActive']
            }]
        });
        
        if (!member) {
            const error = new Error('Üye bulunamadı');
            error.statusCode = 404;
            throw error;
        }
        
        return {
            id: member.id,
            fullName: member.fullName,
            tcNumber: member.tcNumber,
            birthDate: member.birthDate,
            phoneNumber: member.phoneNumber,
            email: member.email,
            address: member.address,
            applicationDate: member.applicationDate,
            duesAmount: member.duesAmount,
            duesFrequency: member.duesFrequency,
            paymentStatus: member.paymentStatus,
            charterApproval: member.charterApproval,
            kvkkApproval: member.kvkkApproval,
            group_id: member.group_id,
            group: {
                id: member.group.id,
                group_name: member.group.group_name,
                description: member.group.description,
                isActive: member.group.isActive
            },
            createdAt: member.createdAt,
            updatedAt: member.updatedAt
        };
    } catch (error) {
        console.error("Üye getirme sırasında hata:", error);
        throw error;
    }
};

// UPDATE - Üye güncelle (grup değişikliği dahil)
export const updateMember = async (id, updateData) => {
    console.log("updateMember service çalıştı, ID:", id);
    console.log("Güncellenecek veriler:", updateData);
    
    try {
        const member = await Member.findByPk(id);
        
        if (!member) {
            const error = new Error('Güncellenecek üye bulunamadı');
            error.statusCode = 404;
            throw error;
        }
        
        const {
            fullName,
            tcNumber,
            birthDate,
            phoneNumber,
            email,
            address,
            group_id, // YENİ: Grup ID'si güncelleme
            duesAmount,
            duesFrequency,
            paymentStatus,
            charterApproval,
            kvkkApproval
        } = updateData;
        
        // Eğer grup değiştiriliyorsa, yeni grup var mı kontrol et
        if (group_id && group_id !== member.group_id) {
            const group = await Group.findByPk(group_id);
            if (!group) {
                const error = new Error('Seçilen yeni grup bulunamadı');
                error.statusCode = 400;
                throw error;
            }
            if (!group.isActive) {
                const error = new Error('Seçilen yeni grup aktif değil');
                error.statusCode = 400;
                throw error;
            }
        }
        
        // Boolean değerleri doğru şekilde parse et
        const isCharterApproved = charterApproval !== undefined ? 
            (charterApproval === 'true' || charterApproval === true) : member.charterApproval;
        const isKvkkApproved = kvkkApproval !== undefined ? 
            (kvkkApproval === 'true' || kvkkApproval === true) : member.kvkkApproval;
        
        const updatedMember = await member.update({
            fullName: fullName || member.fullName,
            tcNumber: tcNumber || member.tcNumber,
            birthDate: birthDate || member.birthDate,
            phoneNumber: phoneNumber || member.phoneNumber,
            email: email || member.email,
            address: address || member.address,
            group_id: group_id ? parseInt(group_id) : member.group_id, // YENİ
            duesAmount: duesAmount ? parseFloat(duesAmount) : member.duesAmount,
            duesFrequency: duesFrequency || member.duesFrequency,
            paymentStatus: paymentStatus || member.paymentStatus,
            charterApproval: isCharterApproved,
            kvkkApproval: isKvkkApproved
        });

        // Güncellenmiş üyeyi grup bilgisiyle getir
        const memberWithGroup = await Member.findByPk(updatedMember.id, {
            include: [{
                model: Group,
                as: 'group',
                attributes: ['id', 'group_name']
            }]
        });
        
        console.log("Üye güncellendi:", updatedMember);
        return {
            id: memberWithGroup.id,
            fullName: memberWithGroup.fullName,
            email: memberWithGroup.email,
            tcNumber: memberWithGroup.tcNumber,
            paymentStatus: memberWithGroup.paymentStatus,
            group_id: memberWithGroup.group_id,
            group_name: memberWithGroup.group.group_name,
            createdAt: memberWithGroup.createdAt,
            updatedAt: memberWithGroup.updatedAt
        };
    } catch (error) {
        console.error("Üye güncelleme sırasında hata:", error);
        throw error;
    }
};

// DELETE - Üye kalıcı olarak sil (aynı)
export const deleteMember = async (id) => {
    console.log("deleteMember service çalıştı, ID:", id);
    
    try {
        const member = await Member.findByPk(id, {
            include: [{
                model: Group,
                as: 'group',
                attributes: ['group_name']
            }]
        });
        
        if (!member) {
            const error = new Error('Silinecek üye bulunamadı');
            error.statusCode = 404;
            throw error;
        }
        
        // Üyeyi kalıcı olarak sil
        await member.destroy();
        
        console.log("Üye kalıcı olarak silindi, ID:", id);
        return {
            id: parseInt(id),
            fullName: member.fullName,
            email: member.email,
            group_name: member.group.group_name,
            message: 'Üye kalıcı olarak silindi'
        };
    } catch (error) {
        console.error("Üye silme sırasında hata:", error);
        throw error;
    }
};

// SEARCH - Üyeleri arama (grup bilgisiyle)
export const searchMembers = async (searchTerm) => {
    console.log("searchMembers service çalıştı, searchTerm:", searchTerm);
    
    try {
        const { Op } = await import('sequelize');
        
        const members = await Member.findAll({
            where: {
                [Op.or]: [
                    { fullName: { [Op.iLike]: `%${searchTerm}%` } },
                    { tcNumber: { [Op.like]: `%${searchTerm}%` } }
                ]
            },
            include: [{
                model: Group,
                as: 'group',
                attributes: ['id', 'group_name']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        return members.map(member => ({
            id: member.id,
            fullName: member.fullName,
            email: member.email,
            tcNumber: member.tcNumber,
            paymentStatus: member.paymentStatus,
            group_id: member.group_id,
            group_name: member.group.group_name,
            createdAt: member.createdAt
        }));
    } catch (error) {
        console.error("Üye arama sırasında hata:", error);
        throw error;
    }
};