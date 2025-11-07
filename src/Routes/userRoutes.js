// src/Routes/userRoutes.js
import express from 'express';
import User from '../Models/User.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// ✅ Admin only - get all users
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // password hide
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
