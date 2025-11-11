import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    avatar: { type: String, default: "" }, // profile image URL
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("UserProfile", userSchema);
