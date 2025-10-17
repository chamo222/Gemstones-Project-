import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaStar, FaStarHalfStroke, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { TbShoppingBagPlus } from "react-icons/tb";
import { motion } from "framer-motion";
import { GiCutDiamond } from "react-icons/gi";
import Footer from "../components/Footer";
import Item from "../components/Item";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";

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
  const { foods, currency, addToCart } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [popularProducts, setPopularProducts] = useState([]);

  const popularRef = useRef(null);

  // Load product and popular products
  useEffect(() => {
    setLoading(true);
    const found = foods.find((item) => item._id === id);
    const timer = setTimeout(() => {
      setProduct(found || null);

      if (found?.sizes?.length > 0) {
        setSelectedWeight(found.sizes[0]);
      }

      const popular = foods.filter((p) => p._id !== id && p.popular).slice(0, 20);
      setPopularProducts(popular);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id, foods]);

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

  const whatsappNumber = "261336261649"; // Replace with your number
  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in the gemstone: ${product?.name} (${selectedWeight || ""})`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Carousel scroll
  const scrollLeft = () => {
    if (popularRef.current) {
      popularRef.current.scrollBy({ left: -popularRef.current.offsetWidth, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (popularRef.current) {
      popularRef.current.scrollBy({ left: popularRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  if (loading) return <LoadingDiamond />;

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Product not found.
      </div>
    );
  }

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

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-x-1 text-yellow-500 mb-3">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalfStroke />
              <span className="text-gray-500 text-sm ml-2">4.5 / 5 Rating</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description ||
                "This gemstone is crafted with exceptional precision and brilliance, offering timeless elegance and premium quality."}
            </p>

            {/* Weight Selection */}
            {product.sizes && product.sizes.length > 0 && (
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

            {/* Add to Cart Button */}
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

          {/* Extra Info */}
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

      {/* Popular Products Section (Item card style) */}
      {popularProducts.length > 0 && (
        <div className="mt-16 relative">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Popular Products
          </h2>

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 z-10 hover:bg-gray-100 transition"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>

          {/* Right Arrow */}
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

      {/* WhatsApp Floating Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[#25D366] text-white font-medium px-4 py-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(37, 211, 102, 0.6)" }}
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