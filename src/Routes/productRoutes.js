import express from 'express';
import { createProduct, getProducts , updateProduct, deleteProduct, getProductById} from '../Controllers/productController.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// 🔹 Multer setup for file upload (memory storage for Cloudinary)
const storage = multer.memoryStorage();
export const upload = multer({ storage });


// Create product (admin only) with image upload
router.post('/', verifyToken, verifyAdmin, upload.single('img'), createProduct);
router.post('/', verifyToken, verifyAdmin, createProduct); // admin only
router.get('/', getProducts); // everyone
router.get("/:id", getProductById);

// router.put('/:id', verifyToken, verifyAdmin, updateProduct);
router.put('/:id', verifyToken, verifyAdmin, upload.single('img'), updateProduct);

router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
// router.put('/stock/:id', verifyToken, verifyAdmin, updateStock);

export default router;
