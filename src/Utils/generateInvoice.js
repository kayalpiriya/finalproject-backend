import PDFDocument from "pdfkit";

export const generateInvoice = (order, payment) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // ---------- PDF CONTENT ----------
      doc.fillColor("#f472b6").fontSize(26).text("🍰 My Bakery Invoice", { align: "center" });
      doc.moveDown();

      doc.fillColor("black").fontSize(12);
      doc.text(`Invoice #: ${order._id}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);

      const customerName = order.user?.username || order.customerName || "Customer";
      const customerEmail = order.user?.email || order.customerEmail || "N/A";

      doc.text(`Customer: ${customerName}`);
      doc.text(`Email: ${customerEmail}`);
      doc.moveDown();

      doc.font("Helvetica-Bold");
      doc.text("Item", 50, doc.y, { continued: true });
      doc.text("Qty", 250, doc.y, { continued: true });
      doc.text("Price", 350, doc.y, { continued: true });
      doc.text("Total", 450, doc.y);
      doc.moveDown();
      doc.font("Helvetica");

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
      doc.text(`Status: PAID`, { align: "right" });

      doc.end();
      // --------------------------------

    } catch (err) {
      reject(err);
    }
  });
};
