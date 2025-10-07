
import express from 'express';
import { getUserById } from '../controllers/member.controller.js';
import { addNewMember } from '../controllers/member.controller.js';
const router = express.Router();

router.get('/:id', getUserById);
router.post("/add-new-member", addNewMember);

export default router;