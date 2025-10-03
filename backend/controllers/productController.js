import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, category, prices, popular } = req.body;
    const image = req.file;

    const imageUrl = await cloudinary.uploader
      .upload(image.path, { resource_type: "image" })
      .then((res) => res.secure_url);

    const parsedPrices = JSON.parse(prices);
    const price = parsedPrices.reduce((acc, curr) => {
      acc[curr.size] = Number(curr.price);
      return acc;
    }, {});

    const sizes = parsedPrices.map((item) => item.size);

    const productData = {
      name,
      description,
      category,
      price,
      popular: popular === "true",
      sizes,
      image: imageUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Food Added", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { productId, name, description, prices, category, popular } = req.body;

    const updateData = {
      name,
      description,
      category,
      popular: popular === "true",
      price: JSON.parse(prices).reduce((acc, curr) => {
        acc[curr.size] = Number(curr.price);
        return acc;
      }, {}),
      sizes: JSON.parse(prices).map((item) => item.size),
    };

    if (req.file) {
      const imageUrl = await cloudinary.uploader
        .upload(req.file.path, { resource_type: "image" })
        .then((res) => res.secure_url);
      updateData.image = imageUrl;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(productId, updateData, { new: true });

    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List Products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Single Product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, updateProduct, removeProduct, singleProduct, listProduct };