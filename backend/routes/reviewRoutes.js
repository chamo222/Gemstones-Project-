import express from "express";
import { addReview, getAllReviews, getReviewsByProduct, deleteReview } from "../controllers/reviewController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Add review
router.post("/add-review", addReview);

// Get all reviews
router.get("/all", getAllReviews);

// Get reviews for a product
router.get("/:productId/reviews", getReviewsByProduct);

// Delete review (admin only)
router.delete("/:productId/delete/:reviewId", deleteReview);

export default router;