import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { createNotification } from "./utils/notifyEvent.js";

// Routers
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import revenueRouter from "./routes/revenueRoute.js";
import salesRoutes from "./routes/salesRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import otpRouter from "./routes/otpRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());
app.use("/api/notifications", notificationRoutes);

// API Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/sales", salesRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api", contactRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/otp", otpRouter);
app.use("/api/product", reviewRoutes);
app.use("/api/review", reviewRoutes); 

app.get("/", (req, res) => res.send("API connected!"));

// Example triggers (you can place these in order/product controllers)
app.post("/api/product/update", async (req, res) => {
  await createNotification("new_product", "A new product was added!", io);
  res.json({ success: true });
});

app.post("/api/test-order", async (req, res) => {
  await createNotification("order_placed", "A new order has been placed!", io);
  res.json({ success: true });
});

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Frontend/Admin connected via WebSocket");
});

// Start server
server.listen(port, "0.0.0.0", () =>
  console.log("Server running on port " + port)
);