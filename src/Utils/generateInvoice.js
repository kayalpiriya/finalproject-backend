// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

// export const generateInvoice = async (order, payment) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ size: "A4", margin: 50 });
//       const invoiceName = `invoice-${order._id}.pdf`;
//       const invoicePath = path.join("invoices", invoiceName);

//       if (!fs.existsSync("invoices")) fs.mkdirSync("invoices");

//       doc.pipe(fs.createWriteStream(invoicePath));

//       // ---------------- Header ----------------
//       doc
//         .fillColor("#f472b6") // pink/muffin theme
//         .fontSize(26)
//         .text("🍰 My Bakery Invoice", { align: "center" });
//       doc.moveDown();

//       doc.fillColor("black").fontSize(12);
//       doc.text(`Invoice #: ${order._id}`, { align: "left" });
//       doc.text(`Order ID: ${order._id}`);
//       doc.text(`Date: ${new Date().toLocaleDateString()}`);
//       doc.moveDown();

//       // Customer Info
//       doc.text(`Customer Name: ${order.customerName || "Customer"}`);
//       doc.text(`Email: ${order.customerEmail || "N/A"}`);
//       doc.moveDown();

//       // ---------------- Items Table ----------------
//       doc.font("Helvetica-Bold");
//       doc.text("Item", 50, doc.y, { continued: true });
//       doc.text("Qty", 250, doc.y, { continued: true });
//       doc.text("Price", 350, doc.y, { continued: true });
//       doc.text("Total", 450, doc.y);
//       doc.moveDown();
//       doc.font("Helvetica");

//       order.items.forEach((item) => {
//         doc.text(item.name, 50, doc.y, { continued: true });
//         doc.text(item.quantity.toString(), 250, doc.y, { continued: true });
//         doc.text(`₹${item.price}`, 350, doc.y, { continued: true });
//         doc.text(`₹${item.price * item.quantity}`, 450, doc.y);
//         doc.moveDown();
//       });

//       // Total
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fillColor("#f472b6")
//         .text(`Total: ₹${order.total}`, { align: "right" });

//       doc.moveDown();
//       doc.fillColor("black").font("Helvetica");
//       doc.text(`Payment Method: ${payment.method}`);
//       doc.text(`Payment Status: ${payment.status}`);
//       doc.moveDown(2);

//       // Footer
//       doc
//         .fontSize(10)
//         .fillColor("gray")
//         .text("Thank you for choosing My Bakery! 🍰", { align: "center" });

//       doc.end();

//       resolve(invoicePath);
//     } catch (err) {
//       reject(err);
//     }
//   });
// };


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