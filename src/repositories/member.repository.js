import { Member } from '../models/member.model.js';

export const findById = async (id) => {
    return await Member.findByPk(id);
};

export const findAll = async () => {
    return await Member.findAll({
        order: [['createdAt', 'DESC']]
    });
};

export const create = async (memberData) => {
    return await Member.create(memberData);
};

export const updateById = async (id, updateData) => {
    const member = await Member.findByPk(id);
    if (!member) return null;
    return await member.update(updateData);
};

export const deleteById = async (id) => {
    const member = await Member.findByPk(id);
    if (!member) return null;
    return await member.destroy();
};

export const searchByTerm = async (searchTerm) => {
    const { Op } = await import('sequelize');
    return await Member.findAll({
        where: {
            [Op.or]: [
                { fullName: { [Op.iLike]: `%${searchTerm}%` } },
                { email: { [Op.iLike]: `%${searchTerm}%` } },
                { tcNumber: { [Op.like]: `%${searchTerm}%` } }
            ]
        },
        order: [['createdAt', 'DESC']]
    });
};