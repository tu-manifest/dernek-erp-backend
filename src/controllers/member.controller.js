import express from 'express';
import * as Memberservice from '../services/member.service.js';
const router = express.Router();

export const getUserById =  async (req, res) => {
    try{
        const user = await Memberservice.getUserById(req.params.id);
        res.status(200).json({success: true, data: user}); 

    } catch (error) {
      next(error); 
    }
}
export const addNewMember = async (req, res, next) => {
    try {
        const newMember = await Memberservice.addNewMember(req.body);
        res.status(201).json({ success: true, data: newMember });
    } catch (error) {
        next(error);
    }
}