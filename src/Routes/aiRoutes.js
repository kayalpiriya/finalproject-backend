// import express from "express";
// import { getAIResponse } from "../Controllers/aiController.js";

// const router = express.Router();

// router.post("/", getAIResponse);

// export default router;


// import express from "express";
// import { generateReply } from "../Controllers/chatController.js";
// const router = express.Router();

// router.post("/generate", generateReply);

// export default router;

// import express from "express";
// import fetch from "node-fetch"; // npm i node-fetch
// const router = express.Router();

// const API_KEY = process.env.GEMINI_KEY; // store in .env

// router.post("/generate", async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }]
//         }),
//       }
//     );

//     const data = await response.json();
//     const reply =
//       data?.candidates?.[0]?.content?.[0]?.text ||
//       data?.output?.[0]?.content?.find(c => c.type === "output_text")?.text ||
//       "⚠️ AI did not send a message";

//     res.json({ reply });
//   } catch (err) {
//     res.status(500).json({ reply: "⚠️ Error: " + err.message });
//   }
// });

// export default router;
