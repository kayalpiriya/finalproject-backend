// import Chat from "../Models/Chat.js";

// // Get all chat messages
// export const getChats = async (req, res) => {
//   try {
//     const chats = await Chat.find().sort({ createdAt: 1 });
//     res.status(200).json(chats);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching chats", error });
//   }
// };

// // Save new chat message
// export const createChat = async (req, res) => {
//   try {
//     const { sender, message } = req.body;
//     const chat = new Chat({ sender, message });
//     await chat.save();
//     res.status(201).json(chat);
//   } catch (error) {
//     res.status(500).json({ message: "Error sending message", error });
//   }
// };

// import fetch from "node-fetch";

// export const generateReply = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt) return res.status(400).json({ error: "Prompt is required" });

//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//     const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

//     console.log("PROMPT →", prompt);
//     console.log("CALLING GEMINI →", GEMINI_ENDPOINT);

//     const response = await fetch(GEMINI_ENDPOINT, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }]
//       })
//     });

//     const data = await response.json();
//     console.log("GEMINI FULL RESPONSE:", data);

//     if (data.error) {
//       return res.status(500).json({ error: data.error.message });
//     }

//     const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from AI";
//     res.json({ reply });

//   } catch (error) {
//     console.error("ChatController ERROR:", error);
//     res.status(500).json({ error: "Server Error", details: error.message });
//   }
// };


import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const generateReply = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ reply: "No prompt provided" });

    const API_KEY = process.env.GEMINI_API_KEY;

    // Correct working endpoint
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    console.log("CALLING GEMINI →", GEMINI_URL);

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    console.log("GEMINI RESPONSE →", data);

    const aiReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ AI did not send a message";

    return res.json({ reply: aiReply });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.json({ reply: "Server error: " + error.message });
  }
};
