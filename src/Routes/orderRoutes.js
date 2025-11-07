import express from 'express';
import { createOrder } from '../Controllers/orderController.js';
import { verifyToken } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createOrder); // logged-in users
router.get('/', verifyToken); // admin or user can see orders

export default router;
