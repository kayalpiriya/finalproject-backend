import User from "../Models/Profile.js"; // உங்க schema file
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

// ✅ Multer setup (memory storage) for image upload
import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ✅ Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================
// Get user profile
// =====================
// export const getProfile = async (req, res) => {
//   try {
//     console.log("REQ USER:", req.user); // debug
//     const user = await User.findById(req.user.id).select("-password");
//     console.log("FIND USER:", user); // debug

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // only exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    // optional: set default avatar if empty
    if (!user.avatar) user.avatar = "https://via.placeholder.com/150";

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// Update profile (name, email, optional avatar)
// =====================
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    // Upload avatar if file provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "user_profiles" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      user.avatar = result.secure_url;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// =====================
// Change password
// =====================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
