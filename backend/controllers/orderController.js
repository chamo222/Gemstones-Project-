import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { io } from "../server.js"; // Socket.IO instance
import nodemailer from "nodemailer";

const currency = "usd";
const Delivery_Charges = 350;

// --------------------- Nodemailer transporter ---------------------
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Helper to get last 6 chars of order ID in uppercase
const formatOrderId = (id) => id.toString().slice(-6).toUpperCase();

// --------------------- Send Order Confirmation Email ---------------------
const sendOrderConfirmationEmail = async (order, userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px; width:80px;">
            <img src="${item.image || ''}" alt="${item.name}" width="60" height="60" style="border-radius:6px; object-fit:cover;" />
          </td>
          <td style="padding:10px; font-size:14px; color:#333;">
            <strong>${item.name}</strong><br/>
            Size: ${item.size}<br/>
            Quantity: ${item.quantity}<br/>
            Price: ${item.price[item.size]} ${currency}
          </td>
        </tr>
      `
      )
      .join("");

    // --------------------- User Email ---------------------
    const userHtmlContent = `
      <div style="width:100%; background:#f4f4f8; padding:40px 0;">
        <div style="max-width:650px; margin:0 auto; background:#fff; padding:30px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="text-align:center; color:#4a90e2;">💎 Order Confirmation</h2>
          <p style="font-size:16px;">Hi <strong>${userName}</strong>,</p>
          <p style="font-size:16px;">Thank you for your purchase! Here are your order details:</p>

          <div style="margin:20px 0; padding:15px; background:#f9f9fc; border-radius:8px; font-size:14px;">
            <p><strong>Order ID:</strong> ${formatOrderId(order._id)}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Total:</strong> ${order.amount} ${currency}</p>
            <p><strong>Delivery Charges:</strong> ${Delivery_Charges} ${currency}</p>
          </div>

          <h3 style="margin-bottom:10px;">Items:</h3>
          <table width="100%" style="border-collapse:collapse;">
            ${itemsHtml}
          </table>

          <p style="margin-top:20px; font-size:16px;">We will notify you once your order is shipped.</p>
          <p style="margin-top:30px; font-size:14px; color:#888;">B Sirisena Holdings Pvt Ltd</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `💎 Your Order Confirmation - ${formatOrderId(order._id)}`,
      html: userHtmlContent,
    });

    // --------------------- Admin Email with "View Order" Button ---------------------
    const adminHtmlContent = `
      <div style="width:100%; background:#f4f4f8; padding:40px 0;">
        <div style="max-width:650px; margin:0 auto; background:#fff; padding:30px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="text-align:center; color:#4a90e2;">📦 New Order Placed</h2>
          <p style="font-size:16px;">A new order has been placed by <strong>${userName}</strong> (ID: ${order.userId})</p>

          <div style="margin:20px 0; padding:15px; background:#f9f9fc; border-radius:8px; font-size:14px;">
            <p><strong>Order ID:</strong> ${formatOrderId(order._id)}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Total:</strong> ${order.amount} ${currency}</p>
          </div>

          <h3 style="margin-bottom:10px;">Items:</h3>
          <table width="100%" style="border-collapse:collapse;">
            ${itemsHtml}
          </table>

          <div style="margin-top:30px; text-align:center;">
            <a href="https://gemstonesprojectadmin.netlify.app/admin/orders/${order._id}" 
               style="background:#4a90e2; color:#fff; text-decoration:none; padding:12px 30px; border-radius:6px; font-weight:bold;">
              View Order
            </a>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📦 New Order Placed - ${formatOrderId(order._id)}`,
      html: adminHtmlContent,
    });

  } catch (err) {
    console.error("Error sending order email:", err);
  }
};

// --------------------- Send Order Status Update Email ---------------------
const sendOrderStatusEmail = async (order, userEmail, userName) => {
  try {
    const transporter = createTransporter();
    let htmlContent = "";
    let subject = `🔔 Your Order Status Updated - ${formatOrderId(order._id)}`;

    if (order.status === "Delivered") {
      htmlContent = `
        <div style="width:100%; background:#f4f4f8; padding:40px 0;">
          <div style="max-width:650px; margin:0 auto; background:#fff; padding:40px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); font-family:sans-serif; animation:fadeIn 1s ease-in;">
            <div style="text-align:center; margin-bottom:20px;">
              <div style="display:inline-block; border:3px solid #28a745; border-radius:50%; width:90px; height:90px; position:relative; animation:pop 0.8s ease;">
                <div style="color:#28a745; font-size:48px; line-height:90px;">✔</div>
              </div>
            </div>
            <h2 style="text-align:center; color:#28a745;">Order Delivered!</h2>
            <p style="font-size:16px; text-align:center;">Hi <strong>${userName}</strong>, your order <strong>${formatOrderId(order._id)}</strong> has been successfully delivered. 🎉</p>
            <p style="font-size:15px; text-align:center; color:#555;">We hope you love your purchase. Thank you for trusting B Sirisena Holdings!</p>
            <div style="margin-top:30px; text-align:center;">
              <a href="https://gemstonesproject.netlify.app" style="background:#28a745; color:#fff; text-decoration:none; padding:10px 25px; border-radius:6px; font-weight:bold;">Shop Again</a>
            </div>
            <p style="margin-top:30px; text-align:center; font-size:13px; color:#888;">B Sirisena Holdings Pvt Ltd</p>
          </div>
        </div>

        <style>
          @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
          @keyframes pop { 0% {transform:scale(0.8);} 100% {transform:scale(1);} }
        </style>
      `;
      subject = `✅ Your Order Delivered - ${formatOrderId(order._id)}`;
    } else if (order.status === "Cancelled") {
      htmlContent = `
        <div style="width:100%; background:#f4f4f8; padding:40px 0;">
          <div style="max-width:650px; margin:0 auto; background:#fff; padding:40px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); font-family:sans-serif; animation:fadeIn 1s ease-in;">
            <div style="text-align:center; margin-bottom:20px;">
              <div style="display:inline-block; border:3px solid #dc3545; border-radius:50%; width:90px; height:90px; position:relative; animation:shake 0.8s ease;">
                <div style="color:#dc3545; font-size:48px; line-height:90px;">✖</div>
              </div>
            </div>
            <h2 style="text-align:center; color:#dc3545;">Order Cancelled</h2>
            <p style="font-size:16px; text-align:center;">Hi <strong>${userName}</strong>, your order <strong>${formatOrderId(order._id)}</strong> has been cancelled.</p>
            <p style="font-size:15px; text-align:center; color:#555;">If this was a mistake or you’d like to reorder, feel free to contact our support team.</p>
            <div style="margin-top:30px; text-align:center;">
              <a href="https://gemstonesproject.netlify.app/contact" style="background:#dc3545; color:#fff; text-decoration:none; padding:10px 25px; border-radius:6px; font-weight:bold;">Contact Support</a>
            </div>
            <p style="margin-top:30px; text-align:center; font-size:13px; color:#888;">B Sirisena Holdings Pvt Ltd</p>
          </div>
        </div>

        <style>
          @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
          @keyframes shake {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            50% { transform: rotate(-5deg); }
            75% { transform: rotate(3deg); }
            100% { transform: rotate(0deg); }
          }
        </style>
      `;
      subject = `❌ Your Order Cancelled - ${formatOrderId(order._id)}`;
    } else {
      htmlContent = `
        <div style="width:100%; background:#f4f4f8; padding:40px 0;">
          <div style="max-width:650px; margin:0 auto; background:#fff; padding:30px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
            <h2 style="text-align:center; color:#4a90e2;">🔔 Order Status Update</h2>
            <p style="font-size:16px;">Hi <strong>${userName}</strong>,</p>
            <p style="font-size:16px;">The status of your order <strong>${formatOrderId(order._id)}</strong> has been updated:</p>

            <div style="margin:20px 0; padding:15px; background:#f9f9fc; border-radius:8px; font-size:14px;">
              <p><strong>New Status:</strong> ${order.status}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <p style="margin-top:20px; font-size:16px;">Thank you for shopping with us!</p>
            <p style="margin-top:30px; font-size:14px; color:#888;">B Sirisena Holdings Pvt Ltd</p>
          </div>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html: htmlContent,
    });
  } catch (err) {
    console.error("Error sending order status email:", err);
  }
};

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

    const user = await userModel.findById(userId);
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    io.emit("newOrder", newOrder);

    await sendOrderConfirmationEmail(newOrder, user.email, user.name);

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

    const user = await userModel.findById(userId);

    io.emit("newOrder", newOrder);

    await sendOrderConfirmationEmail(newOrder, user.email, user.name);

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

    io.emit("orderUpdated", updatedOrder);

    const user = await userModel.findById(updatedOrder.userId);
    if (user && user.email) {
      await sendOrderStatusEmail(updatedOrder, user.email, user.name);
    }

    res.json({ success: true, message: "Status Updated", order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --------------------- Revenue Stats ---------------------
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
  getRevenueStats,
};