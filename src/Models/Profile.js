
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  avatar: { type: String, default: "" },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // needed for login
  role: { type: String, default: "customer" },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
