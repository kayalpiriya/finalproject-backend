import Order from '../Models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body, user: req.user.id });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products').populate('user', 'name email');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
