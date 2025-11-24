// import mongoose from "mongoose";

// const chatSchema = new mongoose.Schema({
//   sender: {
//     type: String, // "user" or "admin"
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Chat = mongoose.model("Chat", chatSchema);

// export default Chat;




// // models/Chat.js
// import mongoose from "mongoose";

// const chatSchema = new mongoose.Schema({
//   sender: {
//     type: String, // "user" or "ai" or "admin"
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   metadata: {
//     // optional: store extra info (like model used, tokens, etc)
//     type: Object,
//     default: {}
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Chat = mongoose.model("Chat", chatSchema);

// export default Chat;


// import mongoose from "mongoose";

// const chatSchema = new mongoose.Schema({
//   sender: { type: String, required: true }, // "user" or "ai"
//   message: { type: String, required: true },
//   metadata: { type: Object, default: {} },
//   createdAt: { type: Date, default: Date.now }
// });

// const Chat = mongoose.model("Chat", chatSchema);
// export default Chat;

// import mongoose from "mongoose";

// const chatSchema = new mongoose.Schema(
//   {
//     user: { type: String, required: true }, // You can store user id or email
//     message: { type: String, required: true },
//     role: { type: String, enum: ["user", "ai"], required: true },
//   },
//   { timestamps: true }
// );

// const Chat = mongoose.model("Chat", chatSchema);
// export default Chat;


import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // user id, email, or name
    message: { type: String, required: true },
    role: { type: String, enum: ["user", "ai"], required: true },
    metadata: { type: Object, default: {} } // optional raw AI data
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
