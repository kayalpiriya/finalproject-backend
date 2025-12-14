
// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";

// Route Imports
import cartRoutes from './Routes/cartRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import paymentRoutes from './Routes/paymentRoutes.js';
import userRoutes from "./Routes/userRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";
import shipmentRoutes from './Routes/shipmentRoutes.js';
import profileRoutes from './Routes/profileRoutes.js';
import adminRoutes from "./Routes/adminRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";


// ✅ Add this line RIGHT HERE
console.log("Loaded Stripe Key:", process.env.STRIPE_SECRET_KEY ? "OK" : "MISSING");


// Import the Webhook Controller specifically here
import { handleStripeWebhook } from './Controllers/paymentController.js'; 

dotenv.config();
const app = express();

// 1. CORS Setup
app.use(
  cors({
    origin: [
      "https://finalproject-frontend-inky.vercel.app", 
      "https://finalproject-frontend-ues3.vercel.app",
      "http://localhost:5173"
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// -------------------------------------------------------------------------
// 2. STRIPE WEBHOOK ROUTE (MUST BE BEFORE express.json)
// -------------------------------------------------------------------------
// This route needs the raw body to verify the Stripe signature
app.post(
  '/api/webhook', 
  express.raw({ type: 'application/json' }), 
  handleStripeWebhook
);
// -------------------------------------------------------------------------

// 3. Standard Middleware
app.use(express.json()); // Parses JSON for all other routes

// Session & Passport
app.use(session({ secret: process.env.SESSION_SECRET || "secretkey", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Database
const MONGO = process.env.MONGO_URI;
mongoose.connect(MONGO).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes); // Your standard payment routes
app.use('/shipments', shipmentRoutes);
app.use('/cart', cartRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);
app.use('/chats', chatRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));