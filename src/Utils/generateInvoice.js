import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (order, payment) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const invoiceDir = path.resolve("invoices");
      
      // Ensure folder exists
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const invoiceName = `invoice-${order._id}.pdf`;
      const invoicePath = path.join(invoiceDir, invoiceName);
      const writeStream = fs.createWriteStream(invoicePath);

      doc.pipe(writeStream);

      // --- PDF CONTENT ---
      doc.fillColor("#f472b6").fontSize(26).text("🍰 My Bakery Invoice", { align: "center" });
      doc.moveDown();

      doc.fillColor("black").fontSize(12);
      doc.text(`Invoice #: ${order._id}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      
      // Handle Customer Name/Email safely
      const customerName = order.user?.username || order.customerName || "Customer";
      const customerEmail = order.user?.email || order.customerEmail || "N/A";
      
      doc.text(`Customer: ${customerName}`);
      doc.text(`Email: ${customerEmail}`);
      doc.moveDown();

      // Table Header
      doc.font("Helvetica-Bold");
      doc.text("Item", 50, doc.y, { continued: true });
      doc.text("Qty", 250, doc.y, { continued: true });
      doc.text("Price", 350, doc.y, { continued: true });
      doc.text("Total", 450, doc.y);
      doc.moveDown();
      doc.font("Helvetica");

      // Items
      if (order.items) {
        order.items.forEach((item) => {
          const name = item.name || item.product?.name || "Item";
          const price = item.price || 0;
          const qty = item.quantity || 1;
          
          doc.text(name, 50, doc.y, { continued: true });
          doc.text(qty.toString(), 250, doc.y, { continued: true });
          doc.text(`Rs. ${price}`, 350, doc.y, { continued: true });
          doc.text(`Rs. ${price * qty}`, 450, doc.y);
          doc.moveDown();
        });
      }

      doc.moveDown();
      doc.font("Helvetica-Bold").text(`Total Paid: Rs. ${payment.amount}`, { align: "right" });
      doc.font("Helvetica").text(`Status: ${payment.status.toUpperCase()}`, { align: "right" });

      doc.end();

      // --- WAIT FOR FINISH ---
      writeStream.on("finish", () => {
        resolve(invoicePath);
      });

      writeStream.on("error", (err) => {
        reject(err);
      });

    } catch (err) {
      reject(err);
    }
  });
};