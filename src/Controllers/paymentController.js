import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../Models/Payment.js';
import Order from '../Models/Order.js';
import { generateInvoice } from "../Utils/generateInvoice.js";
import { sendInvoiceEmail } from "../Utils/sendEmail.js"; // Import Email function
import fs from 'fs';
import path from 'path';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. CREATE PAYMENT SESSION
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: { name: "Order #" + orderId },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "https://finalproject-frontend-ues3.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://finalproject-frontend-ues3.vercel.app/payment-cancel",
    });

    const payment = new Payment({
      order: orderId,
      user: req.user.id,
      amount,
      method: "card",
      status: "pending",
      stripePaymentId: session.id,
    });

    await payment.save();
    res.status(201).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// WEBHOOK HANDLER
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const payment = await Payment.findOne({ stripePaymentId: session.id })
        .populate({
          path: "order",
          populate: { path: "user" }
        });

      if (!payment) {
        console.log("⚠️ Payment not found for session:", session.id);
        return res.send();
      }

      payment.status = "completed";
      await payment.save();
      await Order.findByIdAndUpdate(payment.order._id, { status: "Processing" });

      // Generate Invoice
      const invoicePath = await generateInvoice(payment.order, payment);

      // Get email safely
      const customerEmail =
        payment.order.user?.email || payment.order.customerEmail;

      console.log("📧 Sending invoice to:", customerEmail);

      if (customerEmail) {
        await sendInvoiceEmail(customerEmail, payment.order, invoicePath);
      }

    } catch (err) {
      console.error("❌ Webhook processing error:", err);
    }
  }

  // ⚠️ MUST always return 200 to Stripe
  res.json({ received: true });
};


// 3. MANUAL CONFIRM (Fallback)
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId)
      .populate({ path: 'order', populate: { path: 'user' } });

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "completed";
    await payment.save();

    // Generate & Email
    const invoicePath = await generateInvoice(payment.order, payment);
    const customerEmail = payment.order.user?.email;
    
    if (customerEmail) {
        await sendInvoiceEmail(customerEmail, payment.order, invoicePath);
    }

    res.status(200).json({ message: "Confirmed & Emailed", invoicePath });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. DOWNLOAD INVOICE (Frontend)
export const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ order: orderId }).populate("order");
    
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const invoiceName = `invoice-${payment.order._id}.pdf`;
    const invoicePath = path.resolve("invoices", invoiceName);

    // If file missing, regenerate it
    if (!fs.existsSync(invoicePath)) {
        await generateInvoice(payment.order, payment);
    }

    res.download(invoicePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. GET PAYMENTS (Admin)
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