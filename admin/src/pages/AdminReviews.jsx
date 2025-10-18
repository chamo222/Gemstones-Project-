import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaStar, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import FooterLogicForge from "../components/FooterLogicForge";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true); // Ensure loader shows on each fetch
    try {
      const res = await axios.get(`${backend_url}/api/review/all`);
      if (res.data.success) {
        // Simulate loading time for animation
        setTimeout(() => {
          setReviews(res.data.reviews);
          setLoading(false);
        }, 1800);
      } else {
        toast.error(res.data.message || "Failed to fetch reviews");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Open delete modal
  const openDeleteModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedReview) return;

    try {
      const res = await axios.delete(
        `${backend_url}/api/review/${selectedReview.productId}/delete/${selectedReview._id}`
      );
      if (res.data.success) {
        toast.success("Review deleted successfully!");
        setReviews((prev) => prev.filter((r) => r._id !== selectedReview._id));
      } else {
        toast.error(res.data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsModalOpen(false);
      setSelectedReview(null);
    }
  };

  // -------------------- LOADER --------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="flex flex-col items-center">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [0.5, 1.2, 0.5] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: i * 0.2,
                }}
                className="text-yellow-400 text-5xl"
              >
                <FaStar />
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-lg font-semibold text-[#4169E1] mt-4"
          >
            Loading Reviews...
          </motion.p>
        </div>
      </div>
    );
  }
  // ------------------------------------------------

  return (
    <div className="p-6 max-w-6xl mx-auto mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#4169E1]">
        All Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <p className="text-gray-700 mb-3">&quot;{review.comment}&quot;</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  by <span className="font-medium">{review.name}</span> on{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Product: <span className="font-medium">{review.productName}</span>
                </p>
              </div>
              <button
                onClick={() => openDeleteModal(review)}
                className="self-end mt-4 text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <FaTrash /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tailwind Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterLogicForge />
    </div>
  );
};

export default AdminReviews;