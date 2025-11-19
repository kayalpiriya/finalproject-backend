import express from "express";
import { getDashboardData } from "../Controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../Middleware/authMiddleware.js";

const router = express.Router();
router.get("/dashboard", verifyToken, verifyAdmin, getDashboardData);

export default router;
