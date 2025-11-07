import Cart from "../Models/Cart.js";
import Product from "../Models/Product.js";

// 🛒 Add item to cart
// export const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const userId = req.user.id; // from verifyToken middleware

//     let cart = await Cart.findOne({ user: userId });

//     // If no cart exists, create new
//     if (!cart) {
//       cart = new Cart({ user: userId, items: [], totalPrice: 0 });
//     }

//     // Check if product already exists in cart
//     const existingItem = cart.items.find(
//       (item) => item.product.toString() === productId
//     );

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({ product: productId, quantity });
//     }

//     // ✅ Recalculate total price properly (no async bug)
//     let total = 0;
//     for (const item of cart.items) {
//       const prod = await Product.findById(item.product);
//       if (prod) total += prod.price * item.quantity;
//     }
//     cart.totalPrice = total;

//     cart.updatedAt = Date.now();
//     await cart.save();

//     res.status(200).json(cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // from verifyToken middleware

    const qty = Number(quantity) || 1; // 🧠 fix here

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    // ✅ Calculate total properly
    let total = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      if (prod) total += prod.price * item.quantity;
    }
    cart.totalPrice = total;

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🧾 Get user’s own cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(200).json({ message: "Cart is empty" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove a product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate total
    let total = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      if (prod) total += prod.price * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧹 Clear user’s cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👑 Get all carts (Admin only)
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("user", "name email")
      .populate("items.product", "name price");

    if (carts.length === 0) {
      return res.status(200).json({ message: "No carts found" });
    }

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
