import React, { useState, useEffect } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { TbTrash } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import * as XLSX from "xlsx";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const Add = ({ token }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prices, setPrices] = useState([]);
  const [category, setCategory] = useState("Garnet");
  const [popular, setPopular] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false); // Form submission loading
  const [pageLoading, setPageLoading] = useState(true); // Page load animation

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      setExcelData(jsonData);
      toast.success(`✅ Excel loaded — ${jsonData.length} products ready.`);
    };
    reader.readAsBinaryString(file);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (excelData.length > 0) {
        for (let product of excelData) {
          const { name, description, category, popular, ...sizePrices } = product;
          const pricesArray = Object.keys(sizePrices).map((size) => ({
            size,
            price: sizePrices[size],
          }));

          const formData = new FormData();
          formData.append("name", name);
          formData.append("description", description || "");
          formData.append("category", category || "Garnet");
          formData.append("popular", popular === "true" || popular === true);
          formData.append("prices", JSON.stringify(pricesArray));
          if (image) formData.append("image", image);

          await axios.post(`${backend_url}/api/product/add`, formData, {
            headers: { token },
          });
        }
        toast.success("🎉 All products added successfully from Excel!");
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("popular", popular);
        formData.append("prices", JSON.stringify(prices));
        if (image) formData.append("image", image);

        const response = await axios.post(`${backend_url}/api/product/add`, formData, {
          headers: { token },
        });

        if (response.data.success) toast.success(response.data.message);
        else toast.error(response.data.message);
      }

      setExcelData([]);
      setImage(null);
      setName("");
      setDescription("");
      setPrices([]);
      setPopular(false);
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Product-themed loader
  const LoadingOverlay = ({ text }) => (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="w-20 h-20 bg-[#4169E1]/80 rounded-lg shadow-lg flex items-center justify-center text-white text-4xl"
      >
        📦
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="mt-4 text-white font-semibold text-lg"
      >
        {text}
      </motion.p>
    </motion.div>
  );

  if (pageLoading) return <LoadingOverlay text="Preparing Add Product Page..." />;

  return (
    <motion.div
      className="px-4 sm:px-8 pt-28 pb-16 bg-gradient-to-b from-white to-blue-50/20 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence>
        {loading && <LoadingOverlay text="Uploading Products..." />}
      </AnimatePresence>

      <motion.form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-y-6 bg-white shadow-md rounded-2xl p-8 lg:w-[750px] mx-auto border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-[#4169E1] mb-3 text-center">
          Add New Gemstone
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Upload gemstone details manually or import multiple products via Excel.
        </p>

        {/* Excel Import */}
        <div className="flex flex-col gap-y-2">
          <label className="font-medium text-gray-800">Import from Excel</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelImport}
            className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-sm text-gray-700 hover:border-[#4169E1] transition"
          />
        </div>

        {/* Product Name */}
        <div>
          <label className="font-medium text-gray-800">Product Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter gemstone name"
            className="px-4 py-2 border border-gray-300 rounded-lg w-full mt-1 focus:ring-2 focus:ring-[#4169E1] outline-none"
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
            className="px-4 py-2 border border-gray-300 rounded-lg w-full mt-1 focus:ring-2 focus:ring-[#4169E1] outline-none"
          />
        </div>

        {/* Category + Image */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <label className="font-medium text-gray-800">Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full mt-1 focus:ring-2 focus:ring-[#4169E1] outline-none"
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

          <div className="flex flex-col items-center">
            <label className="font-medium text-gray-800 mb-1">Upload Image</label>
            <label
              htmlFor="image"
              className="cursor-pointer w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#4169E1] transition"
            >
              <img
                src={image ? URL.createObjectURL(image) : upload_icon}
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
          {excelData.length > 0
            ? `Submit ${excelData.length} Products`
            : "Add Product"}
        </button>
      </motion.form>

      <div className="mt-12">
        <Footer />
      </div>
    </motion.div>
  );
};

export default Add;