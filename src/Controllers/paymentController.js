

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