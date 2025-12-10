// import cartRoutes from './Routes/cartRoutes.js';
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import session from "express-session";
// import passport from "passport";
// import "./Controllers/googleAuth.js"; // import the strategy
// // import aiRoutes from "./Routes/aiRoutes.js";
// import adminRoutes from "./Routes/adminRoutes.js";
// // import chatRouter from "./Routes/chatRoutes.js";


// import authRoutes from './Routes/authRoutes.js';
// import productRoutes from './Routes/productRoutes.js';
// import orderRoutes from './Routes/orderRoutes.js';
// import paymentRoutes from './Routes/paymentRoutes.js';
// import userRoutes from "./Routes/userRoutes.js";
// import reviewRoutes from "./Routes/reviewRoutes.js";
// import shipmentRoutes from './Routes/shipmentRoutes.js';
// // import chatRoutes from "./Routes/chatRoutes.js";
// import profileRoutes from './Routes/profileRoutes.js';
// dotenv.config();
// const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

// app.use(express.json());


// app.use(session({ secret: "secretkey", resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Connect to MongoDB
// mongoose.connect(`mongodb+srv://kayalpiriya_09:kayal2004@kayalpiriya.d4mp54n.mongodb.net/?appName=kayalpiriya`)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // Routes
// app.use(`/users`,userRoutes)
// app.use('/auth', authRoutes);
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);
// app.use('/payments', paymentRoutes); 
// app.use("/reviews", reviewRoutes);
// app.use('/shipments', shipmentRoutes);
// // app.use("/chats" ,chatRoutes);
// app.use('/cart', cartRoutes);
// app.use("/ai", aiRoutes);
// app.use("/profile",profileRoutes),
// app.use("/admin", adminRoutes);
// // app.use("/chat", chatRoutes);




// app.get('/', (req, res) => res.send("Bakery backend running 🍰"));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





// server.js (full)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";

// your other route imports (keep existing)
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


// other controllers/strategies
import "./Controllers/googleAuth.js"; // if you have this

dotenv.config();
const app = express();

// app.use(cors({
//   origin: 'https://finalproject-frontend-om9jm7iv9-kayalpiriyas-projects.vercel.app',     "https://finalproject-frontend-ues3.vercel.app"
//   // change if frontend origin differs
//   credentials: true
// }));

app.use(cors({
  origin: [
    "https://finalproject-frontend-om9jm7iv9-kayalpiriyas-projects.vercel.app",
    "https://finalproject-frontend-ues3.vercel.app",
    "https://finalproject-frontend-ues3-git-main-kayalpiriyas-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

// session + passport (keep existing)
app.use(session({ secret: process.env.SESSION_SECRET || "secretkey", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB (use your connection string)
const MONGO = process.env.MONGO_URI || `mongodb+srv://kayalpiriya_09:kayal2004@kayalpiriya.d4mp54n.mongodb.net/?appName=kayalpiriya`;
mongoose.connect(MONGO, {
  // useNewUrlParser: true, useUnifiedTopology: true // optional with newer mongoose
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Existing routes (keep as you had)
app.use(`/users`, userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use("/reviews", reviewRoutes);
app.use('/shipments', shipmentRoutes);
app.use('/cart', cartRoutes);
app.use("/profile", profileRoutes);
app.use("/admin", adminRoutes);
app.use("/chats", chatRoutes);
app.use("/api/blogs", blogRoutes);



// Root
app.get('/', (req, res) => res.send("Bakery backend running 🍰"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
