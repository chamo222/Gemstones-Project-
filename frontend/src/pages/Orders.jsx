import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaFileDownload,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import Title from "../components/Title";
import Footer from "../components/Footer";
import { io as socketClient } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const stages = [
    "Order Placed",
    "Preparing",
    "Order Ready",
    "Out for Delivery",
    "Delivered",
  ];

  const loadOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = socketClient(backendUrl);

    socket.on("newOrder", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      toast.info(
        `🛒 New order placed! Order ID: ${newOrder._id.slice(-6).toUpperCase()}`
      );
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      if (updatedOrder.status === "Cancelled") {
        toast.error(
          `❌ Order ${updatedOrder._id.slice(-6).toUpperCase()} has been cancelled.`
        );
      }
    });

    return () => socket.disconnect();
  }, [backendUrl]);

  useEffect(() => {
    loadOrders();
  }, [token]);

  const openTrackingModal = (orderId) => setTrackingOrderId(orderId);
  const closeTrackingModal = () => setTrackingOrderId(null);

  // 🧾 Improved Invoice Design
  const generateInvoice = (order) => {
    const invoiceElement = document.createElement("div");
    invoiceElement.style.width = "700px";
    invoiceElement.style.padding = "40px";
    invoiceElement.style.background = "#fff";
    invoiceElement.style.fontFamily = "Arial, sans-serif";
    invoiceElement.style.position = "fixed";
    invoiceElement.style.top = "-9999px";
    invoiceElement.style.left = "-9999px";

    invoiceElement.innerHTML = `
      <div style="text-align:center; margin-bottom: 25px;">
        <h1 style="color:#ff6600; margin:0;">The Dias Restaurant</h1>
        <p style="margin:4px 0; color:#555;">394/3 Kirillawala,Kadawatha 11850, Sri Lanka</p>
        <p style="margin:0; color:#555;">Phone: +94 77 123 4567 | Email: thedias@gmail.com</p>
      </div>
      <hr style="margin: 10px 0; border: none; border-top: 2px solid #ff6600;">
      
      <div style="display:flex; justify-content:space-between; margin-top:20px;">
        <div>
          <h3 style="color:#ff6600; margin-bottom:6px;">Invoice Details</h3>
          <p><strong>Order ID:</strong> ${order._id.slice(-6).toUpperCase()}</p>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>
        <div>
          <h3 style="color:#ff6600; margin-bottom:6px;">Billing Details</h3>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Address:</strong> 45 Main Street, Colombo</p>
          <p><strong>Phone:</strong> +94 76 987 6543</p>
        </div>
      </div>

      <h3 style="margin-top: 25px; color: #ff6600;">Order Summary</h3>
      <table style="width:100%; border-collapse: collapse; margin-top: 10px; font-size:13px; border: 1px solid #ddd;">
        <thead>
          <tr style="background:#ff6600; color:white;">
            <th style="text-align:left; padding:8px;">Item</th>
            <th style="text-align:center; padding:8px;">Size</th>
            <th style="text-align:center; padding:8px;">Qty</th>
            <th style="text-align:center; padding:8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee;">${item.name}</td>
              <td style="text-align:center; border-bottom:1px solid #eee;">${item.size}</td>
              <td style="text-align:center; border-bottom:1px solid #eee;">${item.quantity}</td>
              <td style="text-align:center; border-bottom:1px solid #eee;">${currency}${item.price[item.size]}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <p style="text-align:right; margin-top:15px; font-size:15px;">
        <strong>Total:</strong> ${currency}${order.items
          .reduce(
            (sum, item) => sum + item.price[item.size] * item.quantity,
            0
          )
          .toFixed(2)}
      </p>

      <hr style="margin:15px 0; border:none; border-top:1px dashed #ccc;">

      <div style="margin-top: 20px; text-align:center;">
        <p style="font-size:13px; color:#444;">Thank you for dining with us!</p>
        <p style="font-size:12px; color:#777;">Visit us again at www.thediasrestaurant.lk</p>
      </div>
    `;

    document.body.appendChild(invoiceElement);

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF("p", "pt", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 500;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const x = (pageWidth - imgWidth) / 2;
      pdf.addImage(imgData, "PNG", x, 40, imgWidth, 0);
      pdf.save(`Invoice_${order._id.slice(-6).toUpperCase()}.pdf`);
      document.body.removeChild(invoiceElement);
    });
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order._id]) acc[order._id] = order;
    return acc;
  }, {});

  return (
    <motion.section
      className="max-padd-container mt-24"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="pt-6 pb-28">
        <Title title1="Orders" title2="List" titleStyles="h3" />

        {loading ? (
          <LoadingSpinner />
        ) : Object.values(groupedOrders).length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No orders found.</p>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {Object.values(groupedOrders).map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`p-4 rounded-xl bg-white mt-4 shadow-md border relative ${
                    order.status === "Cancelled" ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Order ID:{" "}
                        <span className="font-medium">
                          {order._id.slice(-6).toUpperCase()}
                        </span>
                      </p>
                      <p className="text-gray-500 text-sm">
                        Date: {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-center sm:items-end">
                      {order.status !== "Cancelled" &&
                        order.status !== "Delivered" && (
                          <button
                            onClick={() => openTrackingModal(order._id)}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                          >
                            Track Order
                          </button>
                        )}

                      {order.status === "Delivered" && (
                        <div className="flex flex-col items-center mt-2 space-y-2">
                          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold shadow-sm">
                            <FaCheckCircle className="w-4 h-4 mr-1" />
                            Delivered
                          </div>
                          <button
                            onClick={() => generateInvoice(order)}
                            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-xs transition shadow-sm"
                          >
                            <FaFileDownload className="w-3 h-3" /> Download Invoice
                          </button>
                        </div>
                      )}

                      {order.status === "Cancelled" && (
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold">
                          <FaTimesCircle className="w-4 h-4 mr-1" />
                          Cancelled
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 border-b py-2 hover:bg-orange-50 rounded-md transition-all"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{item.name}</span>
                          <span>Size: {item.size}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>
                            Price: {currency}
                            {item.price[item.size]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Modal */}
                  {trackingOrderId === order._id && (
                    <motion.div
                      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="bg-white p-6 rounded-xl shadow-xl w-96"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                      >
                        <h3 className="text-lg font-semibold mb-4 text-center text-orange-600">
                          Track Your Order
                        </h3>
                        <div className="space-y-3">
                          {stages.map((stage, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-2 ${
                                stages.indexOf(order.status) >= index
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              <FaCheckCircle className="w-4 h-4" />
                              <span>{stage}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                          <button
                            onClick={() => generateInvoice(order)}
                            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm transition"
                          >
                            <FaFileDownload className="w-4 h-4" /> Download Invoice
                          </button>
                          <button
                            onClick={closeTrackingModal}
                            className="bg-gray-300 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-400 text-sm transition"
                          >
                            Close
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </motion.section>
  );
};

export default Orders;