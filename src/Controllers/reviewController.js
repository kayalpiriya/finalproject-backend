import Review from "../Models/Review.js";
import Product from "../Models/Product.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview)
      return res.status(400).json({ message: "You already reviewed this product" });

    const review = new Review({ user: userId, product: productId, rating, comment });
    await review.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate("user", "name");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
