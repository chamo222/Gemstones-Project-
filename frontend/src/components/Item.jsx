import React, { useContext, useState, useRef } from "react";
import { FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { TbShoppingBagPlus } from "react-icons/tb";
import { ShopContext } from "../context/ShopContext";
import { motion, useAnimation } from "framer-motion";

const Item = ({ food }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [size, setSize] = useState(food.sizes?.[0] || "M");
  const controls = useAnimation();
  const imgRef = useRef(null);

  // 🛒 Add to Cart + Fly Animation
  const handleAddToCart = async () => {
    addToCart(food._id, size);

    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const targetX = window.innerWidth - rect.left - 100;
      const targetY = -rect.top + 50;

      await controls.start({
        x: targetX,
        y: targetY,
        scale: 0.1,
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" },
      });

      // Reset position so image reappears
      controls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      className="relative flex flex-col justify-between rounded-2xl bg-white/80 backdrop-blur-md border border-gray-100 shadow-md overflow-hidden transition-all duration-300 h-full"
    >
      {/* Image Section */}
      <div className="flex items-center justify-center bg-gradient-to-b from-white to-gray-100 p-6 flex-shrink-0">
        <motion.img
          ref={imgRef}
          src={food.image}
          alt={food.name}
          className="h-44 w-44 object-contain rounded-xl transition-transform duration-500 hover:scale-105"
          animate={controls}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-grow p-5">
        {/* Product Info */}
        <div className="flex flex-col text-center flex-grow">
          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 h-6">
            {food.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-2 line-clamp-2 h-10">
            {food.description}
          </p>

          {/* Rating */}
          <div className="flex justify-center items-center gap-x-1 text-yellow-500 mb-3">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfStroke />
            <span className="text-gray-500 text-xs ml-1">4.5</span>
          </div>

          {/* Sizes */}
          {food.sizes && food.sizes.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              {[...food.sizes]
                .sort((a, b) => {
                  const order = ["H", "F", "S", "M", "L", "XL"];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSize(item)}
                    className={`${
                      item === size
                        ? "bg-[#4169E1] text-white"
                        : "bg-gray-200 text-gray-700"
                    } px-3 py-1 text-sm font-medium rounded-md transition-all hover:bg-[#4169E1]/90 hover:text-white`}
                  >
                    {item}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Price + Add to Cart Button */}
        <div className="flex flex-col items-center justify-end mt-auto">
          <p className="text-lg font-bold text-[#4169E1] mb-3">
            {currency}
            {(food.price?.[size] ?? food.price)?.toLocaleString()}
          </p>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-x-2 bg-[#4169E1] hover:bg-[#365ecf] text-white text-sm font-medium px-6 py-2 rounded-md shadow-md transition-all"
          >
            <TbShoppingBagPlus size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Item;