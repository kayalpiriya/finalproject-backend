import OpenAI from "openai";
import dotenv from "dotenv";
import Chat from "../Models/Chat.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Endpoint to handle AI chat
export const getAIResponse = async (req, res) => {
  try {
    const { message } = req.body;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for a bakery website." },
        { role: "user", content: message }
      ]
    });

    const aiMessage = response.choices[0].message.content;
    console.log("AI message:", aiMessage); // ✅ இதை check பண்ணுங்க


    // Save AI message in database
    const chat = new Chat({ sender: "AI", message: aiMessage });
    await chat.save();

    res.status(200).json(chat);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI Error", error });
  }
};
