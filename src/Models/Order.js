// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   total: { type: Number, required: true },
//   status: { type: String, default: 'pending' },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model('Order', orderSchema);


import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true } // price at order time
    }
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  address: { type: String, required: true }, // ✅ Add this line
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
