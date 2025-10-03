import express from "express";
import { addProduct, updateProduct, removeProduct, singleProduct, listProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth, upload.single("image"), addProduct);
productRouter.post("/update", adminAuth, upload.single("image"), updateProduct); // ✅ Update route
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProduct);

export default productRouter;