import React, { useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { TbTrash } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import * as XLSX from "xlsx";

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

          // Only attach image if one is selected
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
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-y-3 medium-14 lg:w-[777px]">
        {/* Excel Import */}
        <div className="flex flex-col gap-y-2">
          <h5 className="h5">Import Excel</h5>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelImport}
            className="px-2 py-1 border rounded"
          />
        </div>

        {/* Product Name */}
        <div className="w-full">
          <h5 className="h5">Product Name</h5>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Write here.."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg"
          />
        </div>

        {/* Product Description */}
        <div className="w-full">
          <h5 className="h5">Product Description</h5>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={5}
            placeholder="Write here.."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg"
          />
        </div>

        {/* Category + Image */}
        <div className="flex items-end gap-x-6">
          <div>
            <h5 className="h5">Category</h5>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 sm:w-full text-gray-30"
            >
              <option value="Curry">Curry</option>
              <option value="Pizza">Pizza</option>
              <option value="Rice">Rice</option>
              <option value="Deserts">Deserts</option>
              <option value="Drinks">Drinks</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <label htmlFor="image">
              <img
                src={image ? URL.createObjectURL(image) : upload_icon}
                alt=""
                className="w-14 h-14 aspect-square object-cover ring-1 ring-slate-900/5 bg-white rounded-lg"
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
          <h5 className="h5">Size and Pricing</h5>
          {prices.map((item, index) => (
            <div key={index} className="flex items-end gap-4 mt-2">
              <input
                onChange={(e) => handleSizePriceChange(index, "size", e.target.value)}
                value={item.size}
                type="text"
                placeholder="(S, M, L)"
                className="px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white w-20"
              />
              <input
                onChange={(e) => handleSizePriceChange(index, "price", e.target.value)}
                value={item.price}
                type="number"
                placeholder="Price"
                min={0}
                className="px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white w-20"
              />
              <button
                onClick={() => removeSizePrice(index)}
                type="button"
                className="text-red-500 !p-2 text-xl"
              >
                <TbTrash />
              </button>
            </div>
          ))}
          <button
            onClick={addSizePrice}
            type="button"
            className="btn-secondary !rounded !text-xs flexCenter gap-x-2 mt-4 !px-3 !py-1"
          >
            <FaPlus /> Add Sizing
          </button>
        </div>

        {/* Popular */}
        <div className="flexStart gap-2 my-2">
          <input
            onChange={() => setPopular((prev) => !prev)}
            type="checkbox"
            checked={popular}
            id="popular"
          />
          <label htmlFor="popular" className="cursor-pointer">
            Add to popular
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-dark !rounded mt-3 max-w-44 sm:w-full"
        >
          {excelData.length > 0 ? `Submit ${excelData.length} Products` : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;