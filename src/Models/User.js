import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    // otp: String,
    // otpExpiry: Date,
    otp: { type: String },
otpExpiry: { type: Date },

  },
  {
    timestamps: true // auto adds createdAt and updatedAt
  }
);

export default mongoose.model('User', userSchema);

