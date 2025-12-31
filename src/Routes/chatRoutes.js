// backend/Routes/chatRoutes.js
import express from "express";
import { sendMessage, getChatHistory, getAllChats, deleteChatAdmin } from "../Controllers/chatController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const router = express.Router();

// USER ROUTES
router.post("/send", verifyToken, sendMessage);
router.get("/history", verifyToken, getChatHistory);

// ADMIN ROUTES (no verifyAdmin)
router.get("/all", verifyToken, getAllChats);
router.delete("/delete/:id", verifyToken, deleteChatAdmin);

export default router;
