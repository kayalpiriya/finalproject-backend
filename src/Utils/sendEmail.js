import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create transporter (FIXED)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Verify transporter at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

export const sendInvoiceEmail = async (userEmail, order, invoicePath) => {
  try {
    if (!userEmail) {
      console.log("⚠️ No email provided, skipping email send.");
      return false;
    }

    const mailOptions = {
      from: `"My Bakery 🍰" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Invoice for Order #${order._id}`,
      html: `
        <h2>Thank you for your order! 🧁</h2>
        <p>Your payment was successful.</p>
        <p><b>Order ID:</b> ${order._id}</p>
        <p>Your invoice is attached.</p>
        <br/>
        <p>— My Bakery Team</p>
      `,
      attachments: [
        {
          filename: `Invoice-${order._id}.pdf`,
          path: invoicePath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("❌ Email send failed:", error);
    return false;
  }
};
