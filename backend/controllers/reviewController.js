import Product from "../models/productModel.js";
import mongoose from "mongoose";

// Add a review
export const addReview = async (req, res) => {
  try {
    const { productId, name, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const review = {
      _id: new mongoose.Types.ObjectId(),
      name: name || "Anonymous",
      rating,
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    await product.save();

    res.json({ success: true, review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews (for admin or homepage slider)
export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({ "reviews.0": { $exists: true } });
    let allReviews = [];
    products.forEach((product) => {
      allReviews = allReviews.concat(
        product.reviews.map((r) => ({
          productId: product._id,   // <-- important
          productName: product.name,
          ...r.toObject()
        }))
      );
    });
    res.json({ success: true, reviews: allReviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a specific product
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, reviews: product.reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review (admin)
export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const reviewIndex = product.reviews.findIndex((r) => r._id.toString() === reviewId);
    if (reviewIndex === -1)
      return res.status(404).json({ success: false, message: "Review not found" });

    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};