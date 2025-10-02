import express from "express";
import { allOrders, placeOrder, placeOrderStripe, UpdateStatus, userOrders, verifyStripe } from "../controllers/orderController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, UpdateStatus);
orderRouter.post("/status", verifyAdmin, UpdateStatus); // <-- changed router -> orderRouter

// Payment routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);

// User frontend routes
orderRouter.post('/userorders', authUser, userOrders);

// Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);

// Optional: public order route
orderRouter.post("/placePublic", placeOrder);  // avoid duplicate '/place'

// Export router
export default orderRouter;