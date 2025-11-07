import express from "express";
import { addReview, getReviewsByProduct } from "../Controllers/reviewController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addReview);
router.get("/:productId", getReviewsByProduct);

export default router;
