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
      // 1. Setup Document
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      
      // Use absolute path to ensure folder is found
      const invoiceDir = path.resolve("invoices");
      const invoiceName = `invoice-${order._id}.pdf`;
      const invoicePath = path.join(invoiceDir, invoiceName);

      // Create folder if it doesn't exist
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      // 2. Setup Write Stream (The File Saver)
      const writeStream = fs.createWriteStream(invoicePath);
      doc.pipe(writeStream);

      // ---------------- Header ----------------
      doc
        .fillColor("#f472b6") // pink/muffin theme
        .fontSize(26)
        .text("🍰 My Bakery Invoice", { align: "center" });
      doc.moveDown();

      doc.fillColor("black").fontSize(12);
      doc.text(`Invoice #: ${order._id}`, { align: "left" });
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Customer Info - Safety checks added
      const customerName = order.user?.username || order.customerName || "Customer";
      const customerEmail = order.user?.email || order.customerEmail || "N/A";

      doc.text(`Customer Name: ${customerName}`);
      doc.text(`Email: ${customerEmail}`);
      doc.moveDown();

      // ---------------- Items Table ----------------
      doc.font("Helvetica-Bold");
      // Header Row
      doc.text("Item", 50, doc.y, { continued: true });
      doc.text("Qty", 250, doc.y, { continued: true });
      doc.text("Price", 350, doc.y, { continued: true });
      doc.text("Total", 450, doc.y);
      doc.moveDown();
      doc.font("Helvetica");

      // Items Loop
      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          // Handle cases where item might be populated or raw object
          const itemName = item.name || item.product?.name || "Product"; 
          const itemPrice = item.price || 0;
          const itemQty = item.quantity || 1;
          const itemTotal = itemPrice * itemQty;

          doc.text(itemName, 50, doc.y, { continued: true });
          doc.text(itemQty.toString(), 250, doc.y, { continued: true });
          doc.text(`Rs. ${itemPrice}`, 350, doc.y, { continued: true }); // Changed ₹ to Rs.
          doc.text(`Rs. ${itemTotal}`, 450, doc.y);
          doc.moveDown();
        });
      }

      // Total
      doc.moveDown();
      doc
        .font("Helvetica-Bold")
        .fillColor("#f472b6")
        .text(`Total: Rs. ${order.totalAmount || order.total}`, { align: "right" }); // Changed ₹ to Rs.

      doc.moveDown();
      doc.fillColor("black").font("Helvetica");
      doc.text(`Payment Method: ${payment.method}`);
      doc.text(`Payment Status: ${payment.status.toUpperCase()}`);
      doc.moveDown(2);

      // Footer
      doc
        .fontSize(10)
        .fillColor("gray")
        .text("Thank you for choosing My Bakery! 🍰", { align: "center" });

      // 3. Finalize PDF
      doc.end();

      // ---------------- CRITICAL FIX ----------------
      // We must wait for the 'finish' event before resolving.
      // This ensures the file is fully saved on disk.
      writeStream.on("finish", () => {
        resolve(invoicePath);
      });

      writeStream.on("error", (err) => {
        console.error("Error writing PDF stream:", err);
        reject(err);
      });

    } catch (err) {
      console.error("Error generating invoice:", err);
      reject(err);
    }
  });
};