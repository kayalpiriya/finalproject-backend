// // import Chat from "../Models/Chat.js";

// // // Get all chat messages
// // export const getChats = async (req, res) => {
// //   try {
// //     const chats = await Chat.find().sort({ createdAt: 1 });
// //     res.status(200).json(chats);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching chats", error });
// //   }
// // };

// // // Save new chat message
// // export const createChat = async (req, res) => {
// //   try {
// //     const { sender, message } = req.body;
// //     const chat = new Chat({ sender, message });
// //     await chat.save();
// //     res.status(201).json(chat);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error sending message", error });
// //   }
// // };

// // import fetch from "node-fetch";

// // export const generateReply = async (req, res) => {
// //   try {
// //     const { prompt } = req.body;
// //     if (!prompt) return res.status(400).json({ error: "Prompt is required" });

// //     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// //     const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// //     console.log("PROMPT →", prompt);
// //     console.log("CALLING GEMINI →", GEMINI_ENDPOINT);

// //     const response = await fetch(GEMINI_ENDPOINT, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         contents: [{ parts: [{ text: prompt }] }]
// //       })
// //     });

// //     const data = await response.json();
// //     console.log("GEMINI FULL RESPONSE:", data);

// //     if (data.error) {
// //       return res.status(500).json({ error: data.error.message });
// //     }

// //     const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from AI";
// //     res.json({ reply });

// //   } catch (error) {
// //     console.error("ChatController ERROR:", error);
// //     res.status(500).json({ error: "Server Error", details: error.message });
// //   }
// // };


// // import fetch from "node-fetch";
// // import dotenv from "dotenv";
// // dotenv.config();

// // export const generateReply = async (req, res) => {
// //   try {
// //     const { prompt } = req.body;
// //     if (!prompt) return res.status(400).json({ reply: "No prompt provided" });

// //     const API_KEY = process.env.GEMINI_API_KEY;

// //     // Correct working endpoint
// //     const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// //     console.log("CALLING GEMINI →", GEMINI_URL);

// //     const response = await fetch(GEMINI_URL, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         contents: [{ parts: [{ text: prompt }] }],
// //       }),
// //     });

// //     const data = await response.json();
// //     console.log("GEMINI RESPONSE →", data);

// //     const aiReply =
// //       data?.candidates?.[0]?.content?.parts?.[0]?.text ||
// //       "⚠️ AI did not send a message";

// //     return res.json({ reply: aiReply });

// //   } catch (error) {
// //     console.error("Gemini Error:", error);
// //     return res.json({ reply: "Server error: " + error.message });
// //   }
// // };





// // Controllers/chatController.js
// import Chat from "../Models/Chat.js";
// import fetch from "node-fetch";
// import dotenv from "dotenv";
// dotenv.config();

// const API_KEY = process.env.GEMINI_API_KEY;
// const MODEL = process.env.GEMINI_MODEL || "models/gemini-2.0-flash";

// // Helper to call Gemini (flexible extraction)
// async function callGemini(prompt) {
//   // Try v1beta2 generateMessage endpoint pattern first (flexible)
//   // You can change BASE_URL/METHOD if your account/docs use a different path.
//   const BASE_URL = "https://generativelanguage.googleapis.com/v1beta2";
//   const url = `${BASE_URL}/${MODEL}:generateMessage?key=${API_KEY}`;

//   const payload = {
//     // messages style commonly accepted by the API
//     messages: [
//       { role: "system", content: [{ type: "text", text: "You are a helpful assistant." }] },
//       { role: "user", content: [{ type: "text", text: prompt }] }
//     ],
//     temperature: 0.2,
//     // maxOutputTokens can be added if desired: maxOutputTokens: 512
//   };

//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   });

//   const data = await res.json();

//   // Save raw for debugging
//   // console.log("Gemini raw response:", JSON.stringify(data, null, 2));

//   // Try common paths to extract text — fallback to JSON stringify
//   let text = null;

//   // v1beta2 message style: data?.message?.content
//   if (data?.message?.content) {
//     // content is an array of objects with text fields
//     try {
//       text = data.message.content.map(c => c?.text || (c?.parts ? c.parts.map(p => p.text || "").join("") : "")).join("\n");
//     } catch (e) {}
//   }

//   // older style: outputs / candidates
//   if (!text && data?.candidates?.[0]?.content) {
//     try {
//       const c = data.candidates[0].content;
//       // content might be array of { text } or { parts:[{text}] }
//       text = c.map(item => item?.text || (item?.parts ? item.parts.map(p => p.text).join("") : "")).join("\n");
//     } catch (e) {}
//   }

//   if (!text && data?.outputs?.[0]?.content) {
//     try {
//       const c = data.outputs[0].content;
//       text = c.map(item => item?.text || (item?.parts ? item.parts.map(p => p.text).join("") : "")).join("\n");
//     } catch (e) {}
//   }

//   if (!text) {
//     // final fallback - try to find any text-like property
//     const str = JSON.stringify(data);
//     text = str.length > 0 ? str : "No reply from AI";
//   }

//   return { text, raw: data };
// }

// // Controller: get all chats (optionally limit)
// export const getChats = async (req, res) => {
//   try {
//     const chats = await Chat.find({}).sort({ createdAt: 1 }).limit(100);
//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Controller: create/save single chat message
// export const createChat = async (req, res) => {
//   try {
//     const { sender, message, metadata } = req.body;
//     if (!sender || !message) return res.status(400).json({ error: "sender and message required" });

//     const chat = new Chat({ sender, message, metadata: metadata || {} });
//     await chat.save();
//     res.json(chat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Controller: generate reply from Gemini, save both user & ai messages
// export const generateReply = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt) return res.status(400).json({ error: "prompt required" });

//     // Save user message
//     const userChat = new Chat({ sender: "user", message: prompt });
//     await userChat.save();

//     // Call Gemini
//     const { text, raw } = await callGemini(prompt);

//     // Save AI reply
//     const aiChat = new Chat({ sender: "ai", message: text, metadata: { rawResponse: raw } });
//     await aiChat.save();

//     return res.json({ reply: text, aiChat, userChat });
//   } catch (err) {
//     console.error("generateReply error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



// // src/Controllers/chatController.js
// import Chat from "../Models/Chat.js"; // Make sure your model is ChatModel.js
// import fetch from "node-fetch";
// import dotenv from "dotenv";
// dotenv.config();

// const API_KEY = process.env.GEMINI_API_KEY;
// const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash"; // default Gemini Free AI model

// // --- Helper function to call Gemini AI ---
// async function callGemini(prompt) {
//   const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

//   const payload = {
//     contents: [{ parts: [{ text: prompt }] }],
//     temperature: 0.2
//   };

//   const res = await fetch(GEMINI_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   });

//   const data = await res.json();

//   // Try to extract AI response text
//   const text =
//     data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//     "⚠️ AI did not respond";

//   return { text, raw: data };
// }

// // --- Get all chats ---
// export const getChats = async (req, res) => {
//   try {
//     const chats = await Chat.find({}).sort({ createdAt: 1 }).limit(100);
//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // --- Create/save single chat message ---
// export const createChat = async (req, res) => {
//   try {
//     const { sender, message, metadata } = req.body;
//     if (!sender || !message)
//       return res.status(400).json({ error: "sender and message required" });

//     const chat = new Chat({ sender, message, metadata: metadata || {} });
//     await chat.save();
//     res.json(chat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // --- Generate AI reply and save both user & AI messages ---
// export const generateReply = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt) return res.status(400).json({ error: "prompt required" });

//     // Save user message
//     const userChat = new Chat({ sender: "user", message: prompt });
//     await userChat.save();

//     // Call Gemini AI
//     const { text, raw } = await callGemini(prompt);

//     // Save AI reply
//     const aiChat = new Chat({ sender: "ai", message: text, metadata: { rawResponse: raw } });
//     await aiChat.save();

//     return res.json({ reply: text, aiChat, userChat });
//   } catch (err) {
//     console.error("generateReply error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // src/Controllers/chatController.js
// import Chat from "../Models/Chat.js"; // Your Chat model
// import fetch from "node-fetch";
// import dotenv from "dotenv";
// dotenv.config();

// const API_KEY = process.env.GEMINI_API_KEY;
// const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash"; // Free Gemini model

// // --- Helper function to call Gemini AI ---
// async function callGemini(prompt) {
//   const BASE_URL = "https://generativelanguage.googleapis.com/v1beta2";
//   const url = `${BASE_URL}/models/${MODEL}:generateMessage?key=${API_KEY}`;

//   const payload = {
//     messages: [
//       { role: "system", content: [{ type: "text", text: "You are a helpful assistant." }] },
//       { role: "user", content: [{ type: "text", text: prompt }] }
//     ]
//   };

//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   });

//   const data = await res.json();

//   // Extract AI text safely
//   let text = "⚠️ AI did not respond";

//   try {
//     if (data?.message?.content) {
//       text = data.message.content
//         .map(c => c?.text || (c?.parts?.map(p => p.text).join("") || ""))
//         .join("\n");
//     } else if (data?.candidates?.[0]?.content) {
//       const c = data.candidates[0].content;
//       text = c.map(i => i?.text || (i?.parts?.map(p => p.text).join("") || "")).join("\n");
//     }
//   } catch (e) {
//     console.error("Error parsing Gemini response:", e);
//   }

//   return { text, raw: data };
// }

// // --- Get all chats ---
// export const getChats = async (req, res) => {
//   try {
//     const chats = await Chat.find({}).sort({ createdAt: 1 }).limit(100);
//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // --- Create/save single chat message ---
// export const createChat = async (req, res) => {
//   try {
//     const { sender, message, metadata } = req.body;
//     if (!sender || !message)
//       return res.status(400).json({ error: "sender and message required" });

//     const chat = new Chat({ sender, message, metadata: metadata || {} });
//     await chat.save();
//     res.json(chat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // --- Generate AI reply and save both user & AI messages ---
// export const generateReply = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt) return res.status(400).json({ error: "prompt required" });

//     // Save user message
//     const userChat = new Chat({ sender: "user", message: prompt });
//     await userChat.save();

//     // Call Gemini AI
//     const { text, raw } = await callGemini(prompt);

//     // Save AI reply
//     const aiChat = new Chat({ sender: "ai", message: text, metadata: { rawResponse: raw } });
//     await aiChat.save();

//     // Return combined response
//     return res.json({ reply: text, userChat, aiChat });
//   } catch (err) {
//     console.error("generateReply error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

import Chat from "../models/Chat.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/${MODEL}:generateMessage?key=${API_KEY}`;
  const payload = {
    messages: [
      { role: "system", content: [{ type: "text", text: "You are a helpful assistant." }] },
      { role: "user", content: [{ type: "text", text: prompt }] }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  let text = "⚠️ AI did not respond";

  try {
    if (data?.message?.content) {
      text = data.message.content.map(c => c?.text || "").join("\n");
    }
  } catch (e) {
    console.error(e);
  }

  return text;
}

export const generateReply = async (req, res) => {
  try {
    const { prompt, user } = req.body;
    if (!prompt || !user) return res.status(400).json({ error: "prompt and user required" });

    const userChat = new Chat({ user, message: prompt, role: "user" });
    await userChat.save();

    const aiReply = await callGemini(prompt);
    const aiChat = new Chat({ user, message: aiReply, role: "ai" });
    await aiChat.save();

    res.json({ reply: aiReply, userChat, aiChat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
