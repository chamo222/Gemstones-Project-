import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import {
  FaStar,
  FaRegStar,
  FaRegCopy,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { TbShoppingBagPlus } from "react-icons/tb";
import { motion } from "framer-motion";
import { GiCutDiamond } from "react-icons/gi";
import Footer from "../components/Footer";
import Item from "../components/Item";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";

// 💎 Loading animation
const LoadingDiamond = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <GiCutDiamond className="text-[#4169E1] text-7xl drop-shadow-md" />
    </motion.div>
    <motion.p
      className="mt-5 text-gray-600 text-lg font-medium tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Preparing your gemstone details...
    </motion.p>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foods, currency, addToCart, backendUrl } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [popularProducts, setPopularProducts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [allReviews, setAllReviews] = useState([]);

  const popularRef = useRef(null);
  const backend_url = `${backendUrl}/api/product`;

  // Load product and popular products
  useEffect(() => {
    setLoading(true);
    const found = foods.find((item) => item._id === id);
    const timer = setTimeout(() => {
      setProduct(found || null);
      if (found?.sizes?.length > 0) setSelectedWeight(found.sizes[0]);
      const popular = foods.filter((p) => p._id !== id && p.popular).slice(0, 20);
      setPopularProducts(popular);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id, foods]);

  // Fetch reviews for this product
  useEffect(() => {
    if (!id) return;
    axios.get(`${backend_url}/${id}/reviews`).then((res) => {
      if (res.data.success) setReviews(res.data.reviews);
    });
  }, [id]);

  // Fetch all reviews for global slider
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/review/all`);
        if (res.data.success) setAllReviews(res.data.reviews);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllReviews();
  }, [backendUrl]);

  // Add to cart
  const handleAddToCart = () => {
    if (!selectedWeight) {
      toast.warning("⚠️ Please select a weight first!");
      return;
    }
    addToCart(product._id, selectedWeight);
    setAdded(true);
    toast.success("Added to cart successfully!");
    setTimeout(() => setAdded(false), 1500);
  };

  // Copy Product ID
  const handleCopyId = () => {
    if (product?._id) {
      const shortId = product._id.slice(-6).toUpperCase();
      navigator.clipboard.writeText(shortId);
      setCopied(true);
      toast.info(`Product ID (${shortId}) copied!`);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Submit review
  const handleReviewSubmit = async () => {
    if (!userRating || !userComment) {
      toast.warning("Please select a rating and write a comment!");
      return;
    }
    if (!product?._id) {
      toast.error("Product not loaded yet!");
      return;
    }

    try {
      const res = await axios.post(`${backend_url}/add-review`, {
        productId: product._id,
        name: "Customer",
        rating: userRating,
        comment: userComment,
      });

      if (res.data.success) {
        const newReview = {
          ...res.data.review,
          createdAt: res.data.review.createdAt || new Date(),
        };
        setReviews((prev) => [...prev, newReview]);
        setUserComment("");
        setUserRating(0);
        toast.success("Review submitted!");
      } else {
        toast.error(res.data.message || "Failed to submit review!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review!");
    }
  };

  // WhatsApp link
  const whatsappNumber = "261336261649";
  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in the gemstone: ${product?.name} (${selectedWeight || ""})`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Scroll popular products
  const scrollLeft = () => {
    if (popularRef.current)
      popularRef.current.scrollBy({
        left: -popularRef.current.offsetWidth,
        behavior: "smooth",
      });
  };
  const scrollRight = () => {
    if (popularRef.current)
      popularRef.current.scrollBy({
        left: popularRef.current.offsetWidth,
        behavior: "smooth",
      });
  };

  if (loading) return <LoadingDiamond />;

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Product not found.
      </div>
    );

  const displayProductId = product._id ? product._id.slice(-6).toUpperCase() : "UNKNOWN";

  // ✅ Smooth review slider (fixes glitch)
  const duplicatedReviews = [...allReviews, ...allReviews, ...allReviews];
  const scrollSpeed = 30; // lower = faster

  return (
    <motion.section
      className="max-w-7xl mx-auto px-5 py-16 mt-20 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-1 text-[#4169E1] hover:text-[#365ecf] font-medium transition"
      >
        ← Back
      </button>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <motion.div
          className="bg-white shadow-lg rounded-2xl overflow-hidden p-6 flex justify-center items-center hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg w-full max-w-md object-contain"
          />
        </motion.div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2">{product.name}</h1>

            {/* Product ID */}
            <div className="flex items-center gap-2 mb-4">
              <p className="text-gray-500 text-sm">
                Product ID: <span className="font-medium tracking-wider">{displayProductId}</span>
              </p>
              <motion.button
                onClick={handleCopyId}
                whileTap={{ scale: 0.9 }}
                className="text-[#4169E1] hover:text-[#365ecf] transition"
              >
                {copied ? <FaCheck size={15} /> : <FaRegCopy size={15} />}
              </motion.button>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Weight Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-2">Weight:</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedWeight(size)}
                      className={`px-5 py-2 border rounded-md text-sm font-medium transition-all duration-300 ${
                        selectedWeight === size
                          ? "bg-[#4169E1] text-white border-[#4169E1]"
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 mb-6">
              <p className="text-3xl font-bold text-[#4169E1]">
                {currency}
                {(Object.values(product.price)[0] ?? product.price).toLocaleString()}
              </p>
              <span className="text-gray-500 text-sm">/ each</span>
            </div>

            {/* Add to Cart */}
            <motion.button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 text-white font-medium px-7 py-3 rounded-md shadow-md transition-all duration-300 w-full sm:w-auto ${
                added ? "bg-green-500" : "bg-[#4169E1] hover:bg-[#365ecf]"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <TbShoppingBagPlus size={18} />
              {added ? "Added to Cart!" : "Add to Cart"}
            </motion.button>
          </div>

          {/* Info */}
          <div className="mt-8 text-sm text-gray-500 border-t border-gray-200 pt-4">
            <p>
              ✅ 100% Authentic & Certified Gemstones
              <br />
              🚚 Fast & Secure Shipping across Sri Lanka
              <br />
              💎 Lifetime warranty on authenticity
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>
        <div className="flex flex-col gap-4 mb-6">
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="p-4 border rounded-md flex flex-col gap-1 break-words">
              <div className="flex items-center gap-1 text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) =>
                  i <= r.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                )}
              </div>
              <p className="text-gray-700">{r.comment}</p>
              <p className="text-gray-400 text-xs">
                by {r.name} on {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Submit Review */}
        <div className="p-4 border rounded-md">
          <h3 className="text-gray-700 font-medium mb-2">Leave a Review</h3>
          <div className="flex items-center mb-2 gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => setUserRating(i)} className="text-yellow-500 text-xl">
                {i <= userRating ? <FaStar /> : <FaRegStar />}
              </button>
            ))}
          </div>
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            rows={3}
            placeholder="Write your review..."
            className="w-full p-2 border rounded-md mb-2 text-gray-700"
          />
          <button
            onClick={handleReviewSubmit}
            className="px-4 py-2 bg-[#4169E1] text-white rounded-md hover:bg-[#365ecf] transition"
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <div className="mt-16 relative">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Popular Products</h2>
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 z-10 hover:bg-gray-100 transition"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 z-10 hover:bg-gray-100 transition"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
          <div
            ref={popularRef}
            className="flex overflow-x-auto gap-6 scroll-smooth pb-4 scrollbar-hide"
          >
            {popularProducts.map((item) => (
              <div
                key={item._id}
                className="flex-shrink-0 w-[220px] cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <Item food={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Seamless Continuous Customer Review Slider */}
      {allReviews.length > 0 && (
        <div className="relative py-12 mt-20 bg-white overflow-hidden">
          <h2 className="text-2xl font-bold text-center text-[#4169E1] mb-6">
            What Our Customers Say
          </h2>
          <div className="relative w-full overflow-hidden">
            <motion.div
              className="flex gap-6"
              style={{ width: "max-content", whiteSpace: "nowrap" }}
              animate={{ x: ["0%", "-33.33%"] }}
              transition={{
                repeat: Infinity,
                duration: scrollSpeed,
                ease: "linear",
              }}
            >
              {duplicatedReviews.map((r, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-white border border-gray-100 rounded-xl shadow-sm p-5 w-80 min-w-[320px] flex flex-col justify-between"
                >
                  <p className="text-gray-700 mb-3 break-words text-sm italic">
                    “{r.comment}”
                  </p>
                  <div className="flex items-center mb-2">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 mr-1" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {r.name || "Anonymous"}
                  </p>
                  {r.productName && (
                    <p className="text-xs text-gray-500 truncate">{r.productName}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[#25D366] text-white font-medium px-4 py-3 rounded-full shadow-lg"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 20px rgba(37, 211, 102, 0.6)",
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <FaWhatsapp className="text-2xl" />
        <span className="hidden sm:inline">Contact Seller</span>
      </motion.a>

      {/* Footer */}
      <div className="mt-24">
        <Footer />
      </div>
    </motion.section>
  );
};

export default ProductDetails;