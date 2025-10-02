import express from "express"
import { allOrders, placeOrder, placeOrderStripe, UpdateStatus, userOrders, verifyStripe } from "../controllers/orderController.js"
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"


const orderRouter = express.Router()

// For Admin
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, UpdateStatus)
router.post("/status", verifyAdmin, UpdateStatus);
// For Payment
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
// For user Frontend
orderRouter.post('/userorders', authUser, userOrders)

// verify Payment temporary method
orderRouter.post('/verifyStripe', authUser, verifyStripe)

// Optional: public order route
router.post("/place", placeOrder);

export default orderRouter