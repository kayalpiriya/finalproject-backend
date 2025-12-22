// import express from 'express';
// import { 
//     createPayment, 
//     getPayments, 
//     confirmPayment, 
//     getPaymentBySession, 
//     getInvoice 
// } from '../Controllers/paymentController.js';
// import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';

// const router = express.Router();

// // Create payment
// router.post('/', verifyToken, createPayment);

// // Get all payments (admin only)
// router.get('/', verifyToken, verifyAdmin, getPayments);

// // Confirm payment (Manual trigger from frontend if webhook fails/delayed)
// router.post('/confirm', verifyToken, confirmPayment);

// // Get Payment Details by Session ID
// router.get("/session/:sessionId", verifyToken, getPaymentBySession);

// // Download Invoice - (Single, correct route)
// router.get("/invoice/:orderId", verifyToken, getInvoice);

// export default router;



import express from 'express';
import { 
    createPayment, 
    getPayments, 
    confirmPayment, 
    getPaymentBySession, 
    getInvoice,
    handleStripeWebhook // <--- Import this
} from '../Controllers/paymentController.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// 1. Create payment
router.post('/', verifyToken, createPayment);

// 2. Webhook (Must be before other routes & NO verifyToken)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// 3. Confirm payment (Manual fallback)
router.post('/confirm', verifyToken, confirmPayment);

// 4. Get Payment Details
router.get("/session/:sessionId", verifyToken, getPaymentBySession);

// 5. Download Invoice
router.get("/invoice/:orderId", verifyToken, getInvoice);

// 6. Get all payments (Admin)
router.get('/', verifyToken, verifyAdmin, getPayments);

export default router;