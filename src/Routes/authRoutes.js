import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPasswordWithOtp, logoutUser} from '../Controllers/authController.js';
import passport from "../Controllers/googleAuth.js"; // import the configured passport
import jwt from "jsonwebtoken";


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordWithOtp);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.post("/logout", logoutUser);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
    // You can generate JWT here if you want
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.redirect(`http://localhost:3000/login?token=${token}`); // send JWT to frontend
  }
);

export default router;
