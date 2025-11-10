// import Product from '../Models/Product.js';

// export const createProduct = async (req, res) => {
//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ✏️ Update product
// export const updateProduct = async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true } // return updated product
//     );
//     if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🗑️ Delete product
// export const deleteProduct = async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


import Product from '../Models/Product.js';

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body); // stock can be part of req.body
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Product (including stock)
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body, // can include { stock: newStockValue }
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Optional: Update only stock
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body; // expect { stock: number }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔹 Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
