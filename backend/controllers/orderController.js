import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { io } from "../server.js"; // ✅ import socket instance

// Global variables 
const currency = "usd"; // use ISO currency for Stripe
const Delivery_Charges = 350;

// COD order
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

    // ✅ Emit event to admin + user
    io.emit("newOrder", newOrder);

    res.json({ success: true, message: "Order Placed", order: newOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe order
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

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

    // ✅ Emit to admin so they instantly see order
    io.emit("newOrder", newOrder);

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price[item.size] * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery_Charges",
        },
        unit_amount: Delivery_Charges * 100,
      },
      quantity: 1,
    });

    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
    //   cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    //   line_items,
    //   mode: "payment",
    // });

    // res.json({ success: true, session_url: session.url });

    res.json({ success: true, message: "Stripe order created", order: newOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      // ✅ Emit payment confirmation
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

// Admin: all orders
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User: orders
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

// Admin: update order status
const UpdateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updated = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    // ✅ Emit event so customer frontend updates instantly
    io.emit("orderUpdated", updated);

    res.json({ success: true, message: "Status Updated", order: updated });
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
};