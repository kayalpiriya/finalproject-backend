// import express from "express";
// import { getChats, createChat } from "../Controllers/chatController.js";

// const router = express.Router();

// router.get("/", getChats);
// router.post("/", createChat);

// export default router;
// import express from "express";
// import { generateReply } from "../Controllers/chatController.js";

// const router = express.Router();
// router.post("/generate", generateReply);

// export default router;





// import express from "express";
// import Chat from "../Models/Chat.js";

// const router = express.Router();

// // Save a chat message
// router.post("/", async (req, res) => {
//   try {
//     const { user, message, role } = req.body;
//     const chat = await Chat.create({ user, message, role });
//     res.status(201).json(chat);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get all chats (admin)
// router.get("/all", (req, res) => {
//   const adminPass = req.headers["admin-password"];
//   if (adminPass !== process.env.ADMIN_PASSWORD) {
//     return res.status(403).json({ message: "Not authorized" });
//   }
//   Chat.find()
//     .sort({ createdAt: -1 })
//     .then((chats) => res.json(chats))
//     .catch((err) => res.status(500).json({ error: err.message }));
// });

// // Delete a chat by id (admin)
// router.delete("/:id", (req, res) => {
//   const adminPass = req.headers["admin-password"];
//   if (adminPass !== process.env.ADMIN_PASSWORD) {
//     return res.status(403).json({ message: "Not authorized" });
//   }
//   Chat.findByIdAndDelete(req.params.id)
//     .then(() => res.json({ message: "Chat deleted" }))
//     .catch((err) => res.status(500).json({ error: err.message }));
// });

// export default router;

// import express from "express";
// import Chat from "../Models/Chat.js";

// const router = express.Router();

// // GET all chats (admin)
// router.get("/", async (req, res) => {
//   try {
//     const chats = await Chat.find().sort({ createdAt: -1 });
//     res.status(200).json(chats);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load chats", error: err.message });
//   }
// });

// // POST new chat
// router.post("/", async (req, res) => {
//   try {
//     const { user, role, message, metadata } = req.body;
//     if (!user || !role || !message)
//       return res.status(400).json({ message: "user, role, and message are required" });

//     const chat = new Chat({ user, role, message, metadata: metadata || {} });
//     await chat.save();
//     res.status(201).json(chat);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to save chat", error: err.message });
//   }
// });

// // DELETE chat by ID (admin only)
// router.delete("/:id", async (req, res) => {
//   try {
//     await Chat.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Chat deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete chat", error: err.message });
//   }
// });

// export default router;

import express from "express";
import Chat from "../Models/Chat.js"; // Ensure capitalization matches your file

const router = express.Router();

// 1. GET ALL CHATS (For Admin Dashboard)
router.get("/", async (req, res) => {
  try {
    // Sort by newest first
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to load chats", error: err.message });
  }
});

// 2. SAVE NEW CHAT (Used by Chatbot)
router.post("/", async (req, res) => {
  try {
    const { user, role, message } = req.body;
    
    if (!user || !role || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const chat = new Chat({ user, role, message });
    await chat.save();
    
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Failed to save chat", error: err.message });
  }
});

// 3. DELETE CHAT (For Admin Dashboard)
router.delete("/:id", async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete chat", error: err.message });
  }
});

export default router;