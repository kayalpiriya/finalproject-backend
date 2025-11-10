import express from 'express';
import { createProduct, getProducts , updateProduct, deleteProduct,updateStock, getProductById} from '../Controllers/productController.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, createProduct); // admin only
router.get('/', getProducts); // everyone
router.get("/:id", getProductById);

router.put('/:id', verifyToken, verifyAdmin, updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
// router.put('/stock/:id', verifyToken, verifyAdmin, updateStock);

export default router;
