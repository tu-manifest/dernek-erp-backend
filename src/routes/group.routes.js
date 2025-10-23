import express from 'express';
import { 
    addNewGroup, 
    getAllGroups, 
    getGroupById, 
    updateGroup, 
    deleteGroup
} from '../controllers/group.controller.js';

const router = express.Router();

// CREATE - Yeni grup oluştur
router.post("/", addNewGroup);

// READ - Tüm grupları getir
router.get("/", getAllGroups);

// READ - ID'ye göre grup getir
router.get("/:id", getGroupById);

// UPDATE - Grup güncelle 
router.put("/:id", updateGroup);

// DELETE - Grup kalıcı olarak sil
router.delete("/:id", deleteGroup);

export default router;