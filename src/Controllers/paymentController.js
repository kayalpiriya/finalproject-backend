// import Payment from '../Models/Payment.js';
// import Order from '../Models/Order.js';

// export const createPayment = async (req, res) => {
//   try {
//     const { orderId, amount, method } = req.body;

//     // Check if order exists
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     // Create payment
//     const payment = new Payment({
//       order: orderId,
//       amount,
//       method,
//       status: 'completed'  // For simplicity, assume success
//     });

//     await payment.save();
//     res.status(201).json(payment);
//   } catch (err) {
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


import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../Models/Payment.js';
import Order from '../Models/Order.js';

dotenv.config();

// ✅ Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ✅ Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      // amount: amount * 100, // convert to cents
      // currency: 'usd',
      // payment_method_types: ['card'],
      amount: Math.round(amount * 100), // ✅ cents
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    // Save payment in DB
    const payment = new Payment({
      order: orderId,
      amount,
      method,
      status: 'pending',
      stripePaymentId: paymentIntent.id,
    });

    await payment.save();

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      payment,
    });
  } catch (err) {
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
