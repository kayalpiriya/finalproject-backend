import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInvoiceEmail = async (userEmail, order, invoiceBuffer) => {
  try {
    if (!userEmail) {
      console.log("⚠️ No email found, skipping send.");
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
          content: invoiceBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Invoice email sent to:", userEmail);
    return true;

  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return false;
  }
};
