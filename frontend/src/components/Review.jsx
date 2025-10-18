import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";

const Review = ({ productId, token }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${backend_url}/api/product/${productId}/reviews`);
      if (res.data.success) setReviews(res.data.reviews);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const submitReview = async () => {
    if (!rating) return toast.error("Please select a rating");
    try {
      const res = await axios.post(
        `${backend_url}/api/product/review`,
        { productId, rating, comment },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Review submitted");
        setRating(0); setComment("");
        fetchReviews();
      }
    } catch (err) { console.log(err); toast.error(err.message); }
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Customer Reviews</h3>

      {/* Review Form */}
      <div className="flex flex-col gap-2 mb-6 p-4 bg-white rounded shadow-sm">
        <div className="flex items-center">
          {[1,2,3,4,5].map((star) => (
            <FaStar
              key={star}
              size={24}
              className={`cursor-pointer ${star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border rounded resize-none"
        />
        <button
          onClick={submitReview}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Submit Review
        </button>
      </div>

      {/* Display Reviews */}
      <div className="flex flex-col gap-3">
        {reviews.map((rev, i) => (
          <div key={i} className="bg-white p-3 rounded shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, idx) => (
                <FaStar
                  key={idx}
                  size={16}
                  className={idx < rev.rating ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
              <span className="text-sm font-medium">{rev.name}</span>
            </div>
            <p className="text-gray-700 text-sm">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;