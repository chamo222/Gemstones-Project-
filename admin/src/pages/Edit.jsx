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

        // Convert price object back to array for form
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
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/list");
        }, 1000);
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
        className="flex flex-col gap-y-3 medium-14 lg:w-[777px]"
      >
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

        <div className="flex items-end gap-x-6">
          <div>
            <h5 className="h5">Category</h5>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 sm:w-full text-gray-30"
            >
              <option value="Garnet">Garnet</option>
              <option value="Sobalt Spinel">Sobalt Spinel</option>
              <option value="Chrysoberyl">Chrysoberyl</option>
              <option value="Aquamarine">Aquamarine</option>
              <option value="Andalusite">Andalusite</option>
              <option value="Amethyst">Amethyst</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <label htmlFor="image">
              <img
                src={image ? URL.createObjectURL(image) : existingImage || upload_icon}
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

        {/* Sizes and Prices */}
        <div>
          <h5 className="h5">Size and Pricing</h5>
          {prices.map((item, index) => (
            <div key={index} className="flex items-end gap-4 mt-2">
              <input
                onChange={(e) =>
                  handleSizePriceChange(index, "size", e.target.value)
                }
                value={item.size}
                type="text"
                placeholder="(S, M, L)"
                className="px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white w-20"
              />
              <input
                onChange={(e) =>
                  handleSizePriceChange(index, "price", e.target.value)
                }
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

        <button
          type="submit"
          className="btn-dark !rounded mt-3 max-w-44 sm:w-full"
        >
          Update Product
        </button>
      </form>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Edit;