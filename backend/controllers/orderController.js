import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { io } from "../server.js"; // Socket.IO instance

const currency = "usd"; 
const Delivery_Charges = 350;

// --------------------- COD Order ---------------------
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Emit new order to admin + user (live update)
    io.emit("newOrder", newOrder);

    res.json({ success: true, message: "Order Placed", order: newOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --------------------- Stripe Order ---------------------
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    io.emit("newOrder", newOrder); // live update to admin

    res.json({ success: true, message: "Stripe order created", order: newOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --------------------- Verify Stripe ---------------------
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      // Emit payment update live
      io.emit("orderUpdated", { orderId, status: "Paid" });

      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --------------------- Admin: All Orders ---------------------
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --------------------- User Orders ---------------------
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --------------------- Update Order Status ---------------------
const UpdateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Emit live status update
    io.emit("orderUpdated", updatedOrder);

    res.json({ success: true, message: "Status Updated", order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --------------------- Revenue Stats (No Auth Needed) ---------------------
const getRevenueStats = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    const totalOrders = orders.length;
    const orderPlaced = orders.filter(o => o.status === "Order Placed").length;
    const preparingOrders = orders.filter(o => o.status === "Preparing").length;
    const readyOrders = orders.filter(o => o.status === "Ready").length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
    const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;

    const totalSales = orders
      .filter(o => o.status === "Delivered" && o.payment)
      .reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      success: true,
      stats: {
        totalOrders,
        orderPlaced,
        preparingOrders,
        readyOrders,
        deliveredOrders,
        cancelledOrders,
        totalSales,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  allOrders,
  userOrders,
  UpdateStatus,
  getRevenueStats, // <-- export revenue stats
};