import express from "express";
import {
  allOrders,
  placeOrder,
  placeOrderStripe,
  UpdateStatus,
  userOrders,
  verifyStripe
} from "../controllers/orderController.js";
import { getRevenueStats } from "../controllers/revenueController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, UpdateStatus); // admin updates status

// Payment routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);

// User frontend routes
orderRouter.post('/userorders', authUser, userOrders);

// Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);

// Optional: public order route
orderRouter.post("/placePublic", placeOrder);

// Public Revenue route (no authentication)
orderRouter.get("/revenue", getRevenueStats);

export default orderRouter;