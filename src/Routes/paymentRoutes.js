import express from 'express';
import { 
    createPayment, 
    getPayments, 
    confirmPayment, 
    getPaymentBySession, 
    getInvoice,
    handleStripeWebhook 
} from '../Controllers/paymentController.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// 1. Create Payment (Requires Login)
router.post('/', verifyToken, createPayment);

// 2. Webhook (No Login Required - Called by Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// 3. Confirm Payment (Manual)
router.post('/confirm', verifyToken, confirmPayment);

// 4. Get Payment by Session
router.get("/session/:sessionId", verifyToken, getPaymentBySession);

// 5. Download Invoice
router.get("/invoice/:orderId", verifyToken, getInvoice);

// 6. Admin Get All
router.get('/', verifyToken, verifyAdmin, getPayments);

export default router;