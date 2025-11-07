// import mongoose from "mongoose";

// const shipmentSchema = new mongoose.Schema({
//   orderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Order",
//     required: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
//     default: "Processing"
//   },
//   trackingNumber: {
//     type: String,
//     default: null
//   },
//   shippedDate: {
//     type: Date
//   },
//   deliveryDate: {
//     type: Date
//   }
// }, { timestamps: true });

// export default mongoose.model("Shipment", shipmentSchema);


import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing"
  },
  trackingNumber: {
    type: String,
    default: null
  },
  shippedDate: {
    type: Date
  },
  deliveryDate: {
    type: Date
  }
}, { timestamps: true });

// 🔹 Optional: auto-generate tracking number if missing
shipmentSchema.pre("save", function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = "TNX" + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

export default mongoose.model("Shipment", shipmentSchema);
