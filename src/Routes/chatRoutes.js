// import express from "express";
// import { getChats, createChat } from "../Controllers/chatController.js";

// const router = express.Router();

// router.get("/", getChats);
// router.post("/", createChat);

// export default router;
import express from "express";
import { generateReply } from "../Controllers/chatController.js";

const router = express.Router();
router.post("/generate", generateReply);

export default router;
