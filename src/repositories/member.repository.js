import { member } from '../models/member.model.js';

export const findById = async (id) => {
  return await Member.findByPk(id);
};