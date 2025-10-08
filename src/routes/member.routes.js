
import express from 'express';
import { addNewMember } from '../controllers/member.controller.js';

const router = express.Router();


router.post("/add-new-member", addNewMember);

export default router;