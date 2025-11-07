import Chat from "../Models/Chat.js";

// Get all chat messages
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

// Save new chat message
export const createChat = async (req, res) => {
  try {
    const { sender, message } = req.body;
    const chat = new Chat({ sender, message });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

