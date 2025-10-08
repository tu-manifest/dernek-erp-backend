import express from 'express';
import * as Groupservice from '../services/group.service.js';

export const addNewGroup = async (req, res, next) => {
    try {
        const newGroup = await Groupservice.addNewGroup(req.body);
        res.status(201).json({ success: true, data: newGroup });
    } catch (error) {
        next(error);
    }
}
