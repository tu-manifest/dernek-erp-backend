import express from 'express';
import memberRoutes from './member.routes.js';
const router = express.Router();



router.use("/member", memberRoutes);
router.get("/", (req, res) => {
    res.send("API is running..");
});

export default router;
