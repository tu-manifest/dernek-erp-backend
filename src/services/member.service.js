import {Member} from '../models/member.model.js';

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

    return {
      id: newMember.id,
      fullName: newMember.fullName,
      email: newMember.email,
    };

  } catch (error) {
    console.error("Üye kaydı sırasında hata:", error);
    throw error; // Hatayı controller'a fırlat
  }
};