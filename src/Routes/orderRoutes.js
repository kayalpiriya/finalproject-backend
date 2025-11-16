import express from 'express';
import { createOrder,getOrders, deleteOrder  } from '../Controllers/orderController.js';
import { verifyToken} from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createOrder); // logged-in users
router.get('/', verifyToken,getOrders); // admin or user can see orders
router.delete('/:id', verifyToken, deleteOrder); // delete order by ID

export default router;
