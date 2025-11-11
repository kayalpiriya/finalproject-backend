import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../Models/Payment.js';
import Order from '../Models/Order.js';

dotenv.config();

// ✅ Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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


export const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Create Checkout Session
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
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
    });

    // Save Payment in DB
    const payment = new Payment({
      order: orderId,
      amount,
      method: "card",
      status: "pending",
      stripePaymentId: session.id,
    });
    await payment.save();

    res.status(201).json({ url: session.url }); // ✅ return Stripe URL
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


export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "completed";
    await payment.save();

    res.status(200).json({ message: "Payment confirmed", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
