// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   description: String,
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model('Product', productSchema);


import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 0  // 🔹 default means initially no stock
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Product", productSchema);
