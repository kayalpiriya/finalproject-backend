import express from "express";
import { verifyToken } from "../Middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart, clearCart ,  getAllCarts} from "../Controllers/cartController.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.delete("/remove", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);
// 👑 Admin route to get all carts
router.get("/all", verifyToken, getAllCarts);

export default router;
