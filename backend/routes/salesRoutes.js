import express from "express";
import { getSalesData } from "../controllers/salesController.js";

const router = express.Router();

// Public endpoint for sales
router.get("/", getSalesData);

export default router;