

// Controllers/orderController.js

import Product from '../Models/Product.js';
import Order from '../Models/Order.js';

/**
 * Create a new order (logged-in users)
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products, address } = req.body; // products = [{ productId, quantity }]

    if (!products || products.length === 0)
      return res.status(400).json({ message: "No products provided" });

    if (!address)
      return res.status(400).json({ message: "Address is required" });

    let total = 0;
    const orderProducts = [];

    // 1️⃣ Check stock & prepare order products
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `${product.name} stock insufficient` });

      // Calculate total
      total += product.price * item.quantity;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // 2️⃣ Save order
    const order = new Order({
      products: orderProducts,
      user: userId,
      total,
      address,
      status: "pending",
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get orders
 * - Admin: all orders
 * - User: only their orders
 */
export const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === "admin") {
      // Admin sees all orders
      orders = await Order.find()
        .populate("user", "name email")
        .populate("products.product", "name price");
    } else {
      // Regular user sees only their orders
      orders = await Order.find({ user: req.user.id }).populate(
        "products.product",
        "name price"
      );
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
