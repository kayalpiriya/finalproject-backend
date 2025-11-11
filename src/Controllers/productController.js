import Product from '../Models/Product.js';
import cloudinary from 'cloudinary';
import multer from 'multer';

// Multer setup for file uploads (memory storage)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create Product with optional image upload
export const createProduct = async (req, res) => {
  try {
    if (req.file) {
      // Upload image to Cloudinary
      cloudinary.v2.uploader.upload_stream({ folder: 'bakery_products' }, async (error, result) => {
        if (error) return res.status(500).json({ message: 'Image upload failed', error });

        const product = new Product({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          stock: req.body.stock,
          img: result.secure_url, // Cloudinary image URL
        });

        await product.save();
        res.status(201).json(product);
      }).end(req.file.buffer);
    } else {
      // If no image uploaded
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        stock: req.body.stock,
        img: req.body.img || '', // can accept direct URL string
      });

      await product.save();
      res.status(201).json(product);
    }
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

// ✅ Update Product (including stock and image)
export const updateProduct = async (req, res) => {
  try {
    let updateData = req.body;

    if (req.file) {
      // Upload new image to Cloudinary if file provided
      const result = await cloudinary.v2.uploader.upload_stream({ folder: 'bakery_products' }, (error, result) => {
        if (error) console.log("Cloudinary upload error:", error);
        updateData.img = result.secure_url;
      }).end(req.file.buffer);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
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
