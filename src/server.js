import cartRoutes from './Routes/cartRoutes.js';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import session from "express-session";
import passport from "passport";
import "./Controllers/googleAuth.js"; // import the strategy
import aiRoutes from "./Routes/aiRoutes.js";


import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import paymentRoutes from './Routes/paymentRoutes.js';
import userRoutes from "./Routes/userRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";
import shipmentRoutes from './Routes/shipmentRoutes.js';
import chatbotRoutes from "./Routes/chatRoutes.js";
import profileRoutes from './Routes/profileRoutes.js';
dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());


app.use(session({ secret: "secretkey", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://kayalpiriya_09:kayal2004@kayalpiriya.d4mp54n.mongodb.net/?appName=kayalpiriya`)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use(`/users`,userRoutes)
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes); 
app.use("/reviews", reviewRoutes);
app.use('/shipments', shipmentRoutes);
app.use("/chats" ,chatbotRoutes);
app.use('/cart', cartRoutes);
app.use("/ai", aiRoutes);
app.use("/profile",profileRoutes),



app.get('/', (req, res) => res.send("Bakery backend running 🍰"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

