import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

export const sendInvoiceEmail = async (userEmail, order, invoicePath) => {
  try {
    const mailOptions = {
      from: `"My Bakery Team 🍰" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation & Invoice - Order #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #d63384;">Thank you for your order! 🧁</h1>
          <p>Hi there,</p>
          <p>We have received your payment for <b>Order #${order._id}</b>.</p>
          <p>Your invoice is attached to this email.</p>
          <br/>
          <p>If you have any questions, reply to this email.</p>
          <p>Regards,<br/><b>My Bakery Team</b></p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice-${order._id}.pdf`,
          path: invoicePath, // Auto-attaches the file we generated
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${userEmail}: ${info.response}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};