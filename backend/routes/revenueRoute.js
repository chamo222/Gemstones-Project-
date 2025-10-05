import express from "express";
import { getRevenueStats } from "../controllers/revenueController.js";

const router = express.Router();

// No adminAuth middleware here
router.get("/", getRevenueStats);

export default router;