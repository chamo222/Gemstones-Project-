import React, { useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { TbTrash } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import * as XLSX from "xlsx";
import Footer from "../components/Footer";

const Add = ({ token }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prices, setPrices] = useState([]); // Stores size-price pairs dynamically
  const [category, setCategory] = useState("Curry");
  const [popular, setPopular] = useState(false);
  const [excelData, setExcelData] = useState([]); // For Excel import

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

  // Handle Excel file import
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
      toast.success(
        `Excel loaded! ${jsonData.length} products ready to submit.`
      );
    };
    reader.readAsBinaryString(file);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (excelData.length > 0) {
        // Submit all Excel products
        for (let product of excelData) {
          const { name, description, category, popular, ...sizePrices } = product;

          // Transform dynamic size columns into prices array
          const pricesArray = Object.keys(sizePrices).map((size) => ({
            size,
            price: sizePrices[size],
          }));

          const formData = new FormData();
          formData.append("name", name);
          formData.append("description", description || "");
          formData.append("category", category || "Curry");
          formData.append("popular", popular === "true" || popular === true);
          formData.append("prices", JSON.stringify(pricesArray));

          if (image) formData.append("image", image);

          await axios.post(`${backend_url}/api/product/add`, formData, {
            headers: { token },
          });
        }
        toast.success("All products added from Excel!");
        setExcelData([]);
        setImage(null);
        setName("");
        setDescription("");
        setPrices([]);
        setPopular(false);
        return;
      }

      // Submit single product from form
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

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrices([]);
        setImage(null);
        setPopular(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="px-2 sm:px-8">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-y-6 bg-white shadow-sm rounded-xl p-6 lg:w-[777px] mx-auto"
      >
        {/* Excel Import */}
        <div className="flex flex-col gap-y-2">
          <h5 className="font-semibold text-gray-800">Import from Excel</h5>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelImport}
            className="px-3 py-2 border rounded-lg cursor-pointer text-sm text-gray-600"
          />
        </div>

        {/* Product Name */}
        <div className="w-full">
          <h5 className="font-semibold text-gray-800">Product Name</h5>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter product name"
            className="px-4 py-2 ring-1 ring-gray-300 rounded-lg bg-white mt-1 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Product Description */}
        <div className="w-full">
          <h5 className="font-semibold text-gray-800">Product Description</h5>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={5}
            placeholder="Describe your product (ingredients, details, etc.)"
            className="px-4 py-2 ring-1 ring-gray-300 rounded-lg bg-white mt-1 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Category + Image */}
        <div className="flex items-center justify-between gap-x-6">
          <div className="flex-1">
            <h5 className="font-semibold text-gray-800">Category</h5>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="px-4 py-2 ring-1 ring-gray-300 rounded-lg bg-white mt-1 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="Curry">Curry</option>
              <option value="Pizza">Pizza</option>
              <option value="Rice">Rice</option>
              <option value="Deserts">Desserts</option>
              <option value="Drinks">Drinks</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <h5 className="font-semibold text-gray-800">Upload Image</h5>
            <label
              htmlFor="image"
              className="mt-2 cursor-pointer flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition"
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

        {/* Sizes */}
        <div>
          <h5 className="font-semibold text-gray-800">Sizes & Pricing</h5>
          {prices.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mt-2">
              <input
                onChange={(e) => handleSizePriceChange(index, "size", e.target.value)}
                value={item.size}
                type="text"
                placeholder="(S, M, L)"
                className="px-3 py-2 ring-1 ring-gray-300 rounded-lg bg-white w-24 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <input
                onChange={(e) => handleSizePriceChange(index, "price", e.target.value)}
                value={item.price}
                type="number"
                placeholder="Enter price"
                min={0}
                className="px-3 py-2 ring-1 ring-gray-300 rounded-lg bg-white w-32 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <button
                onClick={() => removeSizePrice(index)}
                type="button"
                className="text-red-500 hover:text-red-700 p-2 text-xl"
              >
                <TbTrash />
              </button>
            </div>
          ))}
          <button
            onClick={addSizePrice}
            type="button"
            className="btn-secondary flex items-center gap-x-2 mt-4 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
          >
            <FaPlus /> Add Size
          </button>
        </div>

        {/* Popular */}
        <div className="flex items-center gap-2 my-2">
          <input
            onChange={() => setPopular((prev) => !prev)}
            type="checkbox"
            checked={popular}
            id="popular"
            className="w-4 h-4 accent-indigo-500"
          />
          <label htmlFor="popular" className="cursor-pointer text-gray-700">
            Mark as Popular
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-dark bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 transition mt-3 max-w-44 sm:w-full"
        >
          {excelData.length > 0
            ? `Submit ${excelData.length} Products`
            : "Add Product"}
        </button>
      </form>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Add;