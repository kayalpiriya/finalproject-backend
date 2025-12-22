// import Stripe from 'stripe';
// import dotenv from 'dotenv';
// import Payment from '../Models/Payment.js';
// import Order from '../Models/Order.js';
// import { generateInvoice } from "../Utils/generateInvoice.js";

// dotenv.config();

// // ✅ Initialize Stripe with your secret key
// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // -------- FIX: Stripe Safe Init ----------
// if (!process.env.STRIPE_SECRET_KEY) {
//   console.error("❌ STRIPE_SECRET_KEY missing in cloud environment!");
// }
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");


// // export const createPayment = async (req, res) => {
// //   try {
// //     const { orderId, amount, method } = req.body;

// //     // Check if order exists
// //     const order = await Order.findById(orderId);
// //     if (!order) return res.status(404).json({ message: 'Order not found' });

// //     // ✅ Create Stripe Payment Intent
// //     const paymentIntent = await stripe.paymentIntents.create({
// //       // amount: amount * 100, // convert to cents
// //       // currency: 'usd',
// //       // payment_method_types: ['card'],
// //       amount: Math.round(amount * 100), // ✅ cents
// //       currency: "inr",
// //       automatic_payment_methods: { enabled: true },
// //     });

// //     // Save payment in DB
// //     const payment = new Payment({
// //       order: orderId,
// //       amount,
// //       method,
// //       status: 'pending',
// //       stripePaymentId: paymentIntent.id,
// //     });

// //     await payment.save();

// //     res.status(201).json({
// //       clientSecret: paymentIntent.client_secret,
// //       paymentId: payment._id, // 👈 this

// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// // export const createPayment = async (req, res) => {
// //   try {
// //     const { orderId, amount } = req.body;

// //     const order = await Order.findById(orderId);
// //     if (!order) return res.status(404).json({ message: "Order not found" });

// //     // ✅ Create Checkout Session
// //     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: ["card"],
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: "inr",
// //             product_data: { name: "Order " + orderId },
// //             unit_amount: Math.round(amount * 100), // in paise
// //           },
// //           quantity: 1,
// //         },
// //       ],
// //       mode: "payment",
// //       success_url: "http://localhost:5173/payment-success",
// //       cancel_url: "http://localhost:5173/payment-cancel",
// //     });

// //     // Save Payment in DB
// //     const payment = new Payment({
// //       order: orderId,
// //       amount,
// //       method: "card",
// //       status: "pending",
// //       stripePaymentId: session.id,
// //     });
// //     await payment.save();

// //     res.status(201).json({ url: session.url }); // ✅ return Stripe URL
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: err.message });
// //   }
// // };
// export const createPayment = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // ✅ Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: { name: "Order " + orderId },
//             unit_amount: Math.round(amount * 100), // in paise
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: "https://finalproject-frontend-ues3.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",
//       cancel_url: "https://finalproject-frontend-ues3.vercel.app/payment-cancel",
//     });

//     // ✅ Save Payment in DB with user reference
//     const payment = new Payment({
//       order: orderId,
//       user: req.user.id,      // <-- link logged-in user here
//       amount,
//       method: "card",
//       status: "pending",
//       stripePaymentId: session.id,
//     });
//     await payment.save();

//     res.status(201).json({ url: session.url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };


// export const getPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find().populate('order');
//     res.status(200).json(payments);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // export const confirmPayment = async (req, res) => {
// //   try {
// //     const { paymentId } = req.body;
// //     const payment = await Payment.findById(paymentId);
// //     if (!payment) return res.status(404).json({ message: "Payment not found" });

// //     payment.status = "completed";
// //     await payment.save();

// //     res.status(200).json({ message: "Payment confirmed", payment });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// export const confirmPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.body;
//     const payment = await Payment.findById(paymentId).populate("order");
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     payment.status = "completed";
//     await payment.save();

//     // ✅ Generate PDF Invoice
//     const invoicePath = await generateInvoice(payment.order, payment);

//     res.status(200).json({
//       message: "Payment confirmed and invoice generated",
//       payment,
//       invoicePath, // path to download
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// export const getPaymentBySession = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const payment = await Payment.findOne({ stripePaymentId: sessionId }).populate("order");
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     res.status(200).json(payment.order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // GET /payments/invoice/:orderId
// export const getInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const payment = await Payment.findOne({ order: orderId }).populate("order");

//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     // ✅ Check if logged-in user is the owner
//     if (payment.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // Generate invoice PDF
//     const invoicePath = await generateInvoice(payment.order, payment);

//     res.download(invoicePath); // send PDF file
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };



// import Stripe from 'stripe';
// import dotenv from 'dotenv';
// import Payment from '../Models/Payment.js';
// import Order from '../Models/Order.js';
// import { generateInvoice } from "../Utils/generateInvoice.js";

// dotenv.config();

// // -------- Stripe Safe Init ----------
// if (!process.env.STRIPE_SECRET_KEY) {
//   console.error("❌ STRIPE_SECRET_KEY missing in cloud environment!");
// }
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");


// // ✔ PAYMENT CREATION — CHECKOUT SESSION (LKR)
// export const createPayment = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // 🟢 Create Stripe Checkout Session in LKR
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",               // 👈 CHANGED ONLY THIS
//             product_data: { name: "Order " + orderId },
//             unit_amount: Math.round(amount * 100), // keep same
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: "https://finalproject-frontend-ues3.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",
//       cancel_url: "https://finalproject-frontend-ues3.vercel.app/payment-cancel",
//     });

//     // Save Payment to DB
//     const payment = new Payment({
//       order: orderId,
//       user: req.user.id,
//       amount,
//       method: "card",
//       status: "pending",
//       stripePaymentId: session.id,
//     });

//     await payment.save();

//     res.status(201).json({ url: session.url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };


// // ✔ ADMIN — GET ALL PAYMENTS
// export const getPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find().populate('order');
//     res.status(200).json(payments);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ✔ CONFIRM PAYMENT + GENERATE INVOICE (PDF)
// export const confirmPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.body;
//     const payment = await Payment.findById(paymentId).populate("order");

//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     payment.status = "completed";
//     await payment.save();

//     // Generate PDF Invoice
//     const invoicePath = await generateInvoice(payment.order, payment);

//     res.status(200).json({
//       message: "Payment confirmed and invoice generated",
//       payment,
//       invoicePath,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ✔ PAYMENT LOOKUP BY SESSION ID
// export const getPaymentBySession = async (req, res) => {
//   try {
//     const { sessionId } = req.params;

//     const payment = await Payment.findOne({
//       stripePaymentId: sessionId,
//     }).populate("order");

//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     res.status(200).json(payment.order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ✔ USER-ONLY INVOICE DOWNLOAD
// export const getInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const payment = await Payment.findOne({ order: orderId }).populate("order");
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     // Check user ownership
//     if (payment.user.toString() !== req.user.id)
//       return res.status(403).json({ message: "Access denied" });

//     const invoicePath = await generateInvoice(payment.order, payment);

//     res.download(invoicePath);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };



// import Stripe from 'stripe';
// import dotenv from 'dotenv';
// import Payment from '../Models/Payment.js';
// import Order from '../Models/Order.js';
// import { generateInvoice } from "../Utils/generateInvoice.js";
// import fs from 'fs'; // Needed to check if file exists
// import path from 'path';

// dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // 1. CREATE PAYMENT
// export const createPayment = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr", // Changed to INR as requested
//             product_data: { name: "Order " + orderId },
//             unit_amount: Math.round(amount * 100), 
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       // Add metadata so we know which User/Order this is in the Webhook
//       metadata: {
//         orderId: orderId.toString(),
//         userId: req.user.id.toString()
//       },
//       success_url: "https://finalproject-frontend-ues3.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",
//       cancel_url: "https://finalproject-frontend-ues3.vercel.app/payment-cancel",
//     });

//     // Save initial Pending Payment
//     const payment = new Payment({
//       order: orderId,
//       user: req.user.id,
//       amount,
//       method: "card",
//       status: "pending",
//       stripePaymentId: session.id,
//     });

//     await payment.save();
//     res.status(201).json({ url: session.url });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 2. STRIPE WEBHOOK HANDLER (New)
// export const handleStripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   let event;

//   try {
//     // Construct event using the RAW body (req.body)
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error(`Webhook Signature Error: ${err.message}`);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
    
//     try {
//       // Find the payment in DB
//       const payment = await Payment.findOne({ stripePaymentId: session.id }).populate('order');
      
//       if (payment) {
//         // Update Payment Status
//         payment.status = "completed";
//         await payment.save();

//         // Update Order Status (Optional but recommended)
//         if(payment.order) {
//             await Order.findByIdAndUpdate(payment.order._id, { status: 'Processing' });
//         }

//         console.log(`💰 Payment ${session.id} confirmed via Webhook.`);

//         // AUTOMATICALLY GENERATE INVOICE
//         try {
//             await generateInvoice(payment.order, payment);
//             console.log("📄 Invoice generated automatically.");
//         } catch (invErr) {
//             console.error("Failed to generate invoice in webhook:", invErr);
//         }
//       }
//     } catch (err) {
//       console.error("Error updating DB in webhook:", err);
//     }
//   }

//   // Return 200 to acknowledge receipt to Stripe
//   res.send();
// };

// // 3. GET INVOICE (Fixed)
// export const getInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const payment = await Payment.findOne({ order: orderId }).populate("order");
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     // Security Check
//     if (req.user.role !== 'admin' && payment.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // Try to find the file
//     // Assuming generateInvoice saves to a folder named "invoices"
//     const invoiceName = `invoice-${payment.order._id}.pdf`; // Ensure this matches your generateInvoice logic
//     const invoicePath = path.resolve("invoices", invoiceName); 

//     // If file doesn't exist, try to generate it now
//     if (!fs.existsSync(invoicePath)) {
//         console.log("Invoice file missing, regenerating...");
//         await generateInvoice(payment.order, payment);
//     }

//     // Check again
//     if (fs.existsSync(invoicePath)) {
//         res.download(invoicePath);
//     } else {
//         res.status(500).json({ message: "Could not generate invoice file." });
//     }

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ... keep getPayments and getPaymentBySession as they were ...
// export const getPayments = async (req, res) => {
//     try {
//       const payments = await Payment.find().populate('order');
//       res.status(200).json(payments);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
// };

// export const getPaymentBySession = async (req, res) => {
//     try {
//       const { sessionId } = req.params;
//       const payment = await Payment.findOne({ stripePaymentId: sessionId }).populate("order");
//       if (!payment) return res.status(404).json({ message: "Payment not found" });
//       res.status(200).json(payment.order);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
// };

// // Confirm Payment (Manual/Fallback - Webhook is preferred)
// export const confirmPayment = async (req, res) => {
//     // Logic remains similar but webhooks are better
//     try {
//         const { paymentId } = req.body;
//         const payment = await Payment.findById(paymentId).populate("order");
//         if (!payment) return res.status(404).json({ message: "Payment not found" });
    
//         payment.status = "completed";
//         await payment.save();
        
//         // Generate Invoice
//         const invoicePath = await generateInvoice(payment.order, payment);
        
//         res.status(200).json({ message: "Confirmed", invoicePath });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


// import Stripe from 'stripe';
// import dotenv from 'dotenv';
// import Payment from '../Models/Payment.js';
// import Order from '../Models/Order.js';
// import { generateInvoice } from "../Utils/generateInvoice.js";
// import { sendInvoiceEmail } from "../Utils/sendEmail.js"; // Import Email function
// import fs from 'fs';
// import path from 'path';

// dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // 1. CREATE PAYMENT SESSION
// export const createPayment = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [{
//         price_data: {
//           currency: "inr",
//           product_data: { name: "Order #" + orderId },
//           unit_amount: Math.round(amount * 100),
//         },
//         quantity: 1,
//       }],
//       mode: "payment",
//       success_url: "https://finalproject-frontend-ues3.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",
//       cancel_url: "https://finalproject-frontend-ues3.vercel.app/payment-cancel",
//     });

//     const payment = new Payment({
//       order: orderId,
//       user: req.user.id,
//       amount,
//       method: "card",
//       status: "pending",
//       stripePaymentId: session.id,
//     });

//     await payment.save();
//     res.status(201).json({ url: session.url });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 2. WEBHOOK HANDLER (Auto Confirm + Invoice + Email)
// export const handleStripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error(`Webhook Error: ${err.message}`);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     try {
//       // Find Payment & Populate User Details for Email
//       const payment = await Payment.findOne({ stripePaymentId: session.id })
//         .populate({
//             path: 'order',
//             populate: { path: 'user' } // Get User email
//         });

//       if (payment) {
//         payment.status = "completed";
//         await payment.save();
//         await Order.findByIdAndUpdate(payment.order._id, { status: 'Processing' });

//         console.log(`💰 Payment confirmed: ${session.id}`);

//         // A. Generate Invoice
//         const invoicePath = await generateInvoice(payment.order, payment);
//         console.log("📄 Invoice generated.");

//         // B. Send Email
//         const customerEmail = payment.order.user?.email || payment.order.customerEmail;
//         if (customerEmail) {
//             await sendInvoiceEmail(customerEmail, payment.order, invoicePath);
//         } else {
//             console.log("⚠️ No email found, skipping email send.");
//         }
//       }
//     } catch (err) {
//       console.error("Webhook Logic Error:", err);
//     }
//   }
//   res.send();
// };

// // 3. MANUAL CONFIRM (Fallback)
// export const confirmPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.body;
//     const payment = await Payment.findById(paymentId)
//       .populate({ path: 'order', populate: { path: 'user' } });

//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     payment.status = "completed";
//     await payment.save();

//     // Generate & Email
//     const invoicePath = await generateInvoice(payment.order, payment);
//     const customerEmail = payment.order.user?.email;
    
//     if (customerEmail) {
//         await sendInvoiceEmail(customerEmail, payment.order, invoicePath);
//     }

//     res.status(200).json({ message: "Confirmed & Emailed", invoicePath });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 4. DOWNLOAD INVOICE (Frontend)
// export const getInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const payment = await Payment.findOne({ order: orderId }).populate("order");
    
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     const invoiceName = `invoice-${payment.order._id}.pdf`;
//     const invoicePath = path.resolve("invoices", invoiceName);

//     // If file missing, regenerate it
//     if (!fs.existsSync(invoicePath)) {
//         await generateInvoice(payment.order, payment);
//     }

//     res.download(invoicePath);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 5. GET PAYMENTS (Admin)
// export const getPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find().populate('order');
//     res.status(200).json(payments);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 6. GET SESSION
// export const getPaymentBySession = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const payment = await Payment.findOne({ stripePaymentId: sessionId }).populate("order");
//     if (!payment) return res.status(404).json({ message: "Payment not found" });
//     res.status(200).json(payment.order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../Models/Payment.js';
import Order from '../Models/Order.js';
import { generateInvoice } from "../Utils/generateInvoice.js";
import { sendInvoiceEmail } from "../Utils/sendEmail.js";
import fs from 'fs';
import path from 'path';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. CREATE PAYMENT SESSION
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    console.log(`⚡ Payment Request - Order: ${orderId}, Raw Amount: ${amount}`);

    // --- CHECK 1: User Authentication ---
    if (!req.user || !req.user.id) {
      console.error("❌ Auth Failed: No user found in request.");
      return res.status(401).json({ message: "User authentication failed. Please login again." });
    }

    // --- CHECK 2: Order Existence ---
    const order = await Order.findById(orderId);
    if (!order) {
        console.error("❌ Order Not Found");
        return res.status(404).json({ message: "Order not found." });
    }

    // --- CHECK 3: Validate Amount & Currency ---
    // Parse amount to ensure it is a number
    const finalAmount = parseFloat(amount);
    
    // Stripe Minimum Requirement: ~0.50 USD.
    // 0.50 USD is roughly 150 LKR. We use 200 LKR as a safe buffer.
    if (isNaN(finalAmount) || finalAmount < 200) {
        console.error(`❌ Amount Rejected: ${finalAmount} LKR is too low.`);
        return res.status(400).json({ 
            message: `Total amount must be at least LKR 200 to process online. Your total is LKR ${finalAmount}. Please add more items.` 
        });
    }

    // --- 4. Create Stripe Session ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "lkr",
          product_data: { name: "Order #" + orderId },
          unit_amount: Math.round(finalAmount * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: "payment",
      // Ensure these match your actual deployed frontend URL
      success_url: "https://finalproject-frontend-ues3.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://finalproject-frontend-ues3.vercel.app/payment-cancel",
    });

    // --- 5. Save Pending Payment ---
    const payment = new Payment({
      order: orderId,
      user: req.user.id,
      amount: finalAmount,
      method: "card",
      status: "pending",
      stripePaymentId: session.id,
    });

    await payment.save();
    console.log(`✅ Session generated: ${session.id}`);

    res.status(201).json({ url: session.url });

  } catch (err) {
    console.error("❌ SERVER ERROR in createPayment:", err);
    res.status(500).json({ message: err.message });
  }
};

// 2. WEBHOOK HANDLER
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      const payment = await Payment.findOne({ stripePaymentId: session.id })
        .populate({ path: 'order', populate: { path: 'user' } });

      if (payment) {
        payment.status = "completed";
        await payment.save();
        await Order.findByIdAndUpdate(payment.order._id, { status: 'Processing' });

        console.log(`💰 Webhook: Payment confirmed for ${session.id}`);

        // Generate & Email Invoice
        const invoicePath = await generateInvoice(payment.order, payment);
        const customerEmail = payment.order.user?.email || payment.order.customerEmail;
        
        if (customerEmail) {
            await sendInvoiceEmail(customerEmail, payment.order, invoicePath);
        }
      }
    } catch (err) {
      console.error("Webhook Logic Error:", err);
    }
  }
  res.send();
};

// 3. MANUAL CONFIRM
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId)
      .populate({ path: 'order', populate: { path: 'user' } });

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "completed";
    await payment.save();

    const invoicePath = await generateInvoice(payment.order, payment);
    const customerEmail = payment.order.user?.email;
    if (customerEmail) await sendInvoiceEmail(customerEmail, payment.order, invoicePath);

    res.status(200).json({ message: "Confirmed & Emailed", invoicePath });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. GET INVOICE
export const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ order: orderId }).populate("order");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const invoiceName = `invoice-${payment.order._id}.pdf`;
    const invoicePath = path.resolve("invoices", invoiceName);

    if (!fs.existsSync(invoicePath)) await generateInvoice(payment.order, payment);

    res.download(invoicePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. GET PAYMENTS
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('order');
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. GET SESSION
export const getPaymentBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const payment = await Payment.findOne({ stripePaymentId: sessionId }).populate("order");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment.order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};