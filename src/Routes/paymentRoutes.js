// import express from 'express';
// import { createPayment, getPayments ,confirmPayment, getPaymentBySession , getInvoice
//  } from '../Controllers/paymentController.js';
// import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';
// import path from "path";

// const router = express.Router();

// // Create payment (any logged-in user)
// router.post('/', verifyToken, createPayment);

// // Get all payments (admin only)
// router.get('/', verifyToken, verifyAdmin, getPayments);

// // Confirm payment
// router.post('/confirm', verifyToken, confirmPayment);


// router.get("/invoice/:orderId", verifyToken, (req, res) => {
//     const invoicePath = path.join("invoices", `invoice-${req.params.orderId}.pdf`);
//     res.download(invoicePath);
//   });
//   router.get("/session/:sessionId", verifyToken, getPaymentBySession);
//   router.get("/invoice/:orderId", verifyToken, getInvoice);


// export default router;



import express from 'express';
import { 
    createPayment, 
    getPayments, 
    confirmPayment, 
    getPaymentBySession, 
    getInvoice 
} from '../Controllers/paymentController.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Create payment
router.post('/', verifyToken, createPayment);

// Get all payments (admin only)
router.get('/', verifyToken, verifyAdmin, getPayments);

// Confirm payment (Manual trigger from frontend if webhook fails/delayed)
router.post('/confirm', verifyToken, confirmPayment);

// Get Payment Details by Session ID
router.get("/session/:sessionId", verifyToken, getPaymentBySession);

// Download Invoice - (Single, correct route)
router.get("/invoice/:orderId", verifyToken, getInvoice);

export default router;