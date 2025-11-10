import express from 'express';
import { createPayment, getPayments ,confirmPayment
 } from '../Controllers/paymentController.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Create payment (any logged-in user)
router.post('/', verifyToken, createPayment);

// Get all payments (admin only)
router.get('/', verifyToken, verifyAdmin, getPayments);

// Confirm payment
router.post('/confirm', verifyToken, confirmPayment);

export default router;

