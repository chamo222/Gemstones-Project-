// src/pages/Edit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import upload_icon from "../assets/upload_icon.png";
import { TbTrash } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const Edit = () => {
  const { id } = useParams(); // productId from route
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prices, setPrices] = useState([]);
  const [category, setCategory] = useState("Garnet");
  const [popular, setPopular] = useState(false);
  const [existingImage, setExistingImage] = useState("");

  // Fetch product data by ID
  const fetchProduct = async () => {
    try {
      const response = await axios.post(`${backend_url}/api/product/single`, {
        productId: id,
      });
      if (response.data.success) {
        const product = response.data.product;
        setName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setPopular(product.popular);
        setExistingImage(product.image);

        const priceArr = Object.entries(product.price).map(([size, price]) => ({
          size,
          price,
        }));
        setPrices(priceArr);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => setImage(e.target.files[0]);
  const addSizePrice = () => setPrices([...prices, { size: "", price: "" }]);
  const handleSizePriceChange = (index, field, value) => {
    const updatePrices = prices.map((item, i) =>
      i === index
        ? { ...item, [field]: field === "size" ? value.toUpperCase() : value }
        : item
    );
    setPrices(updatePrices);
  };
  const removeSizePrice = (index) =>
    setPrices(prices.filter((_, i) => i !== index));

  // Submit updated product
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productId", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("prices", JSON.stringify(prices));
      formData.append("category", category);
      formData.append("popular", popular);
      if (image) formData.append("image", image);

      const response = await axios.post(
        `${backend_url}/api/product/update`,
        formData
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        setTimeout(() => navigate("/list"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      className="px-4 sm:px-8 pt-16 pb-16 bg-gradient-to-b from-white to-blue-50 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 bg-white shadow-lg rounded-2xl p-8 lg:w-[750px] mx-auto border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-[#4169E1] text-center">
          Edit Gemstone
        </h2>
        <p className="text-gray-500 text-center text-sm">
          Update gemstone details below.
        </p>

        {/* Product Name */}
        <div>
          <label className="font-medium text-gray-800">Product Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter gemstone name"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#4169E1] outline-none"
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="font-medium text-gray-800">Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={4}
            placeholder="Describe gemstone quality, origin, and properties..."
            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#4169E1] outline-none"
          />
        </div>

        {/* Category + Image */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <label className="font-medium text-gray-800">Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#4169E1] outline-none"
            >
              <option value="Garnet">Garnet</option>
              <option value="Sobalt Spinel">Sobalt Spinel</option>
              <option value="Chrysoberyl">Chrysoberyl</option>
              <option value="Aquamarine">Aquamarine</option>
              <option value="Andalusite">Andalusite</option>
              <option value="Amethyst">Amethyst</option>
              <option value="Ruby">Ruby</option>
              <option value="Emerald">Emerald</option>
              <option value="Tourmaline">Tourmaline</option>
              <option value="Sapphire">Sapphire</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <label className="font-medium text-gray-800 mb-1">Upload Image</label>
            <label
              htmlFor="image"
              className="cursor-pointer w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#4169E1] transition"
            >
              <img
                src={image ? URL.createObjectURL(image) : existingImage || upload_icon}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                type="file"
                onChange={handleImageChange}
                name="image"
                id="image"
                hidden
              />
            </label>
          </div>
        </div>

        {/* Sizes & Pricing */}
        <div>
          <label className="font-medium text-gray-800">Weights & Pricing</label>
          {prices.map((item, index) => (
            <div key={index} className="flex items-center gap-3 mt-2">
              <input
                onChange={(e) => handleSizePriceChange(index, "size", e.target.value)}
                value={item.size}
                type="text"
                placeholder="(1.2ct, 2.0ct, etc.)"
                className="px-3 py-2 border border-gray-300 rounded-lg w-28 focus:ring-2 focus:ring-[#4169E1] outline-none"
              />
              <input
                onChange={(e) => handleSizePriceChange(index, "price", e.target.value)}
                value={item.price}
                type="number"
                placeholder="Price (USD)"
                min={0}
                className="px-3 py-2 border border-gray-300 rounded-lg w-36 focus:ring-2 focus:ring-[#4169E1] outline-none"
              />
              <button
                onClick={() => removeSizePrice(index)}
                type="button"
                className="text-red-500 hover:text-red-600 text-xl p-1"
              >
                <TbTrash />
              </button>
            </div>
          ))}
          <button
            onClick={addSizePrice}
            type="button"
            className="flex items-center gap-2 mt-4 px-4 py-2 bg-[#4169E1]/10 text-[#4169E1] rounded-lg hover:bg-[#4169E1]/20 transition text-sm font-medium"
          >
            <FaPlus /> Add Weight
          </button>
        </div>

        {/* Popular */}
        <div className="flex items-center gap-2">
          <input
            onChange={() => setPopular((prev) => !prev)}
            type="checkbox"
            checked={popular}
            id="popular"
            className="w-4 h-4 accent-[#4169E1]"
          />
          <label htmlFor="popular" className="text-gray-700 cursor-pointer">
            Mark as Featured
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-[#4169E1] hover:bg-[#365ed1] text-white font-semibold py-2.5 rounded-lg shadow-md transition"
        >
          Update Product
        </button>
      </motion.form>

      <div className="mt-12">
        <Footer />
      </div>
    </motion.div>
  );
};

export default Edit;