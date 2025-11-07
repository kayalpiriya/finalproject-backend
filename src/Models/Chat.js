import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: {
    type: String, // "user" or "admin"
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
