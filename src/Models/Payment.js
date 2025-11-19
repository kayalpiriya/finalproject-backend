import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // <-- add this
  amount: { type: Number, required: true },
  method: { type: String, required: true },  // e.g., "card", "cash", "paypal"
  status: { type: String, default: 'pending' }, // pending, completed, failed
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
