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