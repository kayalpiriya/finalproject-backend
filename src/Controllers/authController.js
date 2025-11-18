import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { config } from 'dotenv';

config()
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "email already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Forgot Password (Send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate 6-digit OTP
   
    const otp = String(Math.floor(100000 + Math.random() * 900000)); // always string


    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP Email
    await transporter.sendMail({
      from: `"Bakery App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Your OTP for password reset is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Reset Password with OTP
export const resetPasswordWithOtp = async (req, res) => {
  try {
    let { email, otp, password } = req.body;
    
    otp = otp.toString().trim();

const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: "User not found" });

if (user.otp !== otp) {
  return res.status(400).json({ message: "Invalid OTP" });
}

if (user.otpExpiry < Date.now()) {
  return res.status(400).json({ message: "OTP expired" });
}


    // Hash new password
    user.password = await bcrypt.hash(password, 10);

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Frontend will simply delete token
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
