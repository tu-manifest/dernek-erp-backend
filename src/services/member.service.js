import {Member} from '../models/member.model.js';

// CREATE - Mevcut (düzeltilmiş)
export const addNewMember = async (memberData) => {
  console.log("addNewMember service çalıştı");
  
  const {
    fullName,
    tcNumber,
    birthDate,
    phoneNumber,
    email,
    address,
    membershipType,
    duesAmount,
    duesFrequency,
    paymentStatus,
    charterApproval, 
    kvkkApproval     
  } = memberData;

  const isCharterApproved = charterApproval === 'true' || charterApproval === true;
  const isKvkkApproved = kvkkApproval === 'true' || kvkkApproval === true;
  
  try {
    const newMember = await Member.create({
      fullName,
      tcNumber,
      birthDate,
      phoneNumber,
      email,
      address,
      membershipType,
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
      membershipType: newMember.membershipType,
      createdAt: newMember.createdAt,
      updatedAt: newMember.updatedAt
    };

  } catch (error) {
    console.error("Üye kaydı sırasında hata:", error);
    throw error;
  }
};

// READ - Tüm üyeleri getir
export const getAllMembers = async () => {
    console.log("getAllMembers service çalıştı");
    
    try {
        const members = await Member.findAll({
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
            membershipType: member.membershipType,
            applicationDate: member.applicationDate,
            duesAmount: member.duesAmount,
            duesFrequency: member.duesFrequency,
            paymentStatus: member.paymentStatus,
            charterApproval: member.charterApproval,
            kvkkApproval: member.kvkkApproval,
            createdAt: member.createdAt,
            updatedAt: member.updatedAt
        }));
    } catch (error) {
        console.error("Üyeleri getirme sırasında hata:", error);
        throw error;
    }
};

// READ - ID'ye göre üye getir
export const getMemberById = async (id) => {
    console.log("getMemberById service çalıştı, ID:", id);
    
    try {
        const member = await Member.findByPk(id);
        
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
            membershipType: member.membershipType,
            applicationDate: member.applicationDate,
            duesAmount: member.duesAmount,
            duesFrequency: member.duesFrequency,
            paymentStatus: member.paymentStatus,
            charterApproval: member.charterApproval,
            kvkkApproval: member.kvkkApproval,
            createdAt: member.createdAt,
            updatedAt: member.updatedAt
        };
    } catch (error) {
        console.error("Üye getirme sırasında hata:", error);
        throw error;
    }
};

// UPDATE - Üye güncelle
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
            membershipType,
            duesAmount,
            duesFrequency,
            paymentStatus,
            charterApproval,
            kvkkApproval
        } = updateData;
        
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
            membershipType: membershipType || member.membershipType,
            duesAmount: duesAmount ? parseFloat(duesAmount) : member.duesAmount,
            duesFrequency: duesFrequency || member.duesFrequency,
            paymentStatus: paymentStatus || member.paymentStatus,
            charterApproval: isCharterApproved,
            kvkkApproval: isKvkkApproved
        });
        
        console.log("Üye güncellendi:", updatedMember);
        return {
            id: updatedMember.id,
            fullName: updatedMember.fullName,
            email: updatedMember.email,
            tcNumber: updatedMember.tcNumber,
            membershipType: updatedMember.membershipType,
            paymentStatus: updatedMember.paymentStatus,
            createdAt: updatedMember.createdAt,
            updatedAt: updatedMember.updatedAt
        };
    } catch (error) {
        console.error("Üye güncelleme sırasında hata:", error);
        throw error;
    }
};

// DELETE - Üye kalıcı olarak sil
export const deleteMember = async (id) => {
    console.log("deleteMember service çalıştı, ID:", id);
    
    try {
        const member = await Member.findByPk(id);
        
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
            message: 'Üye kalıcı olarak silindi'
        };
    } catch (error) {
        console.error("Üye silme sırasında hata:", error);
        throw error;
    }
};

// SEARCH - Üyeleri arama (opsiyonel)
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
            order: [['createdAt', 'DESC']]
        });
        
        return members.map(member => ({
            id: member.id,
            fullName: member.fullName,
            email: member.email,
            tcNumber: member.tcNumber,
            membershipType: member.membershipType,
            paymentStatus: member.paymentStatus,
            createdAt: member.createdAt
        }));
    } catch (error) {
        console.error("Üye arama sırasında hata:", error);
        throw error;
    }
};