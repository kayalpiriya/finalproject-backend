import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPasswordWithOtp,} from '../Controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordWithOtp);

export default router;
