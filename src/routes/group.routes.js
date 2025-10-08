import express from 'express';
import { addNewGroup } from '../controllers/group.controller.js';
const router = express.Router();

router.post("/add-new-group", addNewGroup);

export default router;