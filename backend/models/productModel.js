import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Object, required: true },
  date: { type: Number, required: true },
  sizes: { type: Array, required: true },
  popular: { type: Boolean, default: false },
  reviews: { type: [reviewSchema], default: [] }, // ✅ Reviews
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;