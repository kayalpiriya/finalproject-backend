import express from "express";
import { getProfile, updateProfile, changePassword, upload } from "../Controllers/profileController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Get profile
router.get("/profile", verifyToken, getProfile);

// Update profile (with optional image)
router.put("/profile", verifyToken, upload.single("avatar"), updateProfile);

// Change password
router.put("/profile/password", verifyToken, changePassword);

export default router;

