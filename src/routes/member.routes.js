import express from 'express';
import { 
    addNewMember, 
    getAllMembers, 
    getMemberById, 
    updateMember, 
    deleteMember,
    searchMembers 
} from '../controllers/member.controller.js';

const router = express.Router();

// CREATE - Yeni üye oluştur
router.post("/add-new-member", addNewMember);

// READ - Tüm üyeleri getir
router.get("/", getAllMembers);

// SEARCH - Üye arama
router.get("/search", searchMembers);

// READ - ID'ye göre üye getir
router.get("/:id", getMemberById);

// UPDATE - Üye güncelle
router.put("/:id", updateMember);

// DELETE - Üye kalıcı olarak sil
router.delete("/:id", deleteMember);

export default router;