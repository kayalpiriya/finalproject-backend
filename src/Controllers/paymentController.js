import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../Models/Payment.js';
import Order from '../Models/Order.js';
import { generateInvoice } from "../Utils/generateInvoice.js";

dotenv.config();

// ✅ Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -------- FIX: Stripe Safe Init ----------
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY missing in cloud environment!");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");


// export const createPayment = async (req, res) => {
//   try {
//     const { orderId, amount, method } = req.body;

//     // Check if order exists
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     // ✅ Create Stripe Payment Intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       // amount: amount * 100, // convert to cents
//       // currency: 'usd',
//       // payment_method_types: ['card'],
//       amount: Math.round(amount * 100), // ✅ cents
//       currency: "inr",
//       automatic_payment_methods: { enabled: true },
//     });

//     // Save payment in DB
//     const payment = new Payment({
//       order: orderId,
//       amount,
//       method,
//       status: 'pending',
//       stripePaymentId: paymentIntent.id,
//     });

//     await payment.save();

//     res.status(201).json({
//       clientSecret: paymentIntent.client_secret,
//       paymentId: payment._id, // 👈 this

//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// export const createPayment = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // ✅ Create Checkout Session
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
//       success_url: "http://localhost:5173/payment-success",
//       cancel_url: "http://localhost:5173/payment-cancel",
//     });

//     // Save Payment in DB
//     const payment = new Payment({
//       order: orderId,
//       amount,
//       method: "card",
//       status: "pending",
//       stripePaymentId: session.id,
//     });
//     await payment.save();

//     res.status(201).json({ url: session.url }); // ✅ return Stripe URL
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Order " + orderId },
            unit_amount: Math.round(amount * 100), // in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/payment-cancel",
    });

    // ✅ Save Payment in DB with user reference
    const payment = new Payment({
      order: orderId,
      user: req.user.id,      // <-- link logged-in user here
      amount,
      method: "card",
      status: "pending",
      stripePaymentId: session.id,
    });
    await payment.save();

    res.status(201).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('order');
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// export const confirmPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.body;
//     const payment = await Payment.findById(paymentId);
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     payment.status = "completed";
//     await payment.save();

//     res.status(200).json({ message: "Payment confirmed", payment });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId).populate("order");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "completed";
    await payment.save();

    // ✅ Generate PDF Invoice
    const invoicePath = await generateInvoice(payment.order, payment);

    res.status(200).json({
      message: "Payment confirmed and invoice generated",
      payment,
      invoicePath, // path to download
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


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


// GET /payments/invoice/:orderId
export const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ order: orderId }).populate("order");

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // ✅ Check if logged-in user is the owner
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Generate invoice PDF
    const invoicePath = await generateInvoice(payment.order, payment);

    res.download(invoicePath); // send PDF file
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

