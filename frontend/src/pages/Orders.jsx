import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle, FaFileDownload, FaTimes, FaWhatsapp } from "react-icons/fa";
import Title from "../components/Title";
import Footer from "../components/Footer";
import { io as socketClient } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { GiCutDiamond } from "react-icons/gi";

// 💎 Modern diamond loading component
const LoadingDiamond = () => (
  <div className="flex flex-col items-center justify-center h-80 text-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <GiCutDiamond className="text-[#4169E1] text-6xl drop-shadow-md" />
    </motion.div>
    <motion.p
      className="mt-5 text-gray-600 text-lg font-medium tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Fetching your recent orders...
    </motion.p>
  </div>
);

const stages = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered"];

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const reversed = response.data.orders.reverse();
        setOrders(reversed);
        setDisplayedOrders(reversed.slice(0, visibleCount));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    const socket = socketClient(backendUrl);

    socket.on("newOrder", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      setDisplayedOrders((prev) => [newOrder, ...prev]);
      toast.info(`💎 New order placed! ID: ${newOrder._id.slice(-6).toUpperCase()}`);
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
      setDisplayedOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );

      const orderIdShort = updatedOrder._id.slice(-6).toUpperCase();
      const statusMessages = {
        "Order Placed": `Your order #${orderIdShort} has been placed successfully!`,
        Packing: `🧰 Seller is packing your order #${orderIdShort}.`,
        Shipped: `🚚 Your order #${orderIdShort} has been shipped.`,
        "Out for Delivery": `📦 Your order #${orderIdShort} is out for delivery.`,
        Delivered: `🎉 Your order #${orderIdShort} has been delivered!`,
        Cancelled: `❌ Your order #${orderIdShort} was cancelled.`,
      };

      const message = statusMessages[updatedOrder.status];
      if (message) {
        updatedOrder.status === "Cancelled" ? toast.error(message) : toast.success(message);
      }
    });

    return () => socket.disconnect();
  }, [backendUrl]);

  useEffect(() => {
    loadOrders();
  }, [token]);

  const handleLoadMore = () => {
    const nextCount = visibleCount + 5;
    setDisplayedOrders(orders.slice(0, nextCount));
    setVisibleCount(nextCount);
  };

  const openTrackingModal = (orderId) => setTrackingOrderId(orderId);
  const closeTrackingModal = () => setTrackingOrderId(null);

  const generateInvoice = (order) => {
    const invoiceElement = document.createElement("div");
    invoiceElement.style.width = "700px";
    invoiceElement.style.padding = "40px";
    invoiceElement.style.background = "#fff";
    invoiceElement.style.fontFamily = "Arial, sans-serif";
    invoiceElement.style.position = "fixed";
    invoiceElement.style.top = "-9999px";
    invoiceElement.style.left = "-9999px";
    invoiceElement.style.lineHeight = "1.6";

    const { firstName, lastName, street, phone } = order.address || {
      firstName: "N/A",
      street: "N/A",
      phone: "N/A",
    };

    const totalAmount = order.items
      .reduce((sum, item) => sum + item.price[item.size] * item.quantity, 0)
      .toFixed(2);

    invoiceElement.innerHTML = `
      <div style="text-align:center; margin-bottom: 25px;">
        <h1 style="color:#4169E1; margin:0;">B Sirisena Holdings Pvt Ltd</h1>
        <p style="margin:4px 0; color:#555;">123 Gemstone Avenue, Crystal City, Sri Lanka</p>
        <p style="margin:0; color:#555;">Phone: +94 74 194 1535 | Email: sirisenasaman@outlook.com</p>
      </div>
      <hr style="margin: 10px 0; border: none; border-top: 2px solid #4169E1;">
      
      <div style="display:flex; justify-content:space-between; margin-top:20px;">
        <div style="width:48%;">
          <h3 style="color:#4169E1; margin-bottom:6px;">Invoice Details</h3>
          <p><strong>Order ID:</strong> ${order._id.slice(-6).toUpperCase()}</p>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>
        <div>
          <h3 style="color:#4169E1; margin-bottom:6px;">Billing Details</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Address:</strong> ${street}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>
      </div>

      <h3 style="margin-top: 25px; color: #4169E1;">Order Summary</h3>
      <table style="width:100%; border-collapse: collapse; margin-top: 10px; font-size:13px; border: 1px solid #ddd;">
        <thead>
          <tr style="background:#4169E1; color:white;">
            <th style="text-align:left; padding:10px;">Item</th>
            <th style="text-align:center; padding:10px;">Size</th>
            <th style="text-align:center; padding:10px;">Qty</th>
            <th style="text-align:right; padding:10px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td style="padding:8px 10px; border-bottom:1px solid #eee;">
                ${item.name}
              </td>
              <td style="text-align:center; padding:8px;">${item.size}</td>
              <td style="text-align:center; padding:8px;">${item.quantity}</td>
              <td style="text-align:right; padding:8px 10px;">
                ${currency}${(item.price[item.size] * item.quantity).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <p style="text-align:right; margin-top:15px; font-size:15px;">
        <strong>Total:</strong> ${currency}${Number(totalAmount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>

      <hr style="margin:15px 0; border:none; border-top:1px dashed #ccc;">
      <div style="margin-top: 20px; text-align:center;">
        <p style="font-size:13px; color:#444;">Thank you for shopping with us!</p>
        <p>Gem and Jewelry Authority of Sri Lanka Approved Dealer</p>
        <p style="font-size:12px; color:#777;">Visit us again at www.bsirisenaholdings.lk</p>
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

  const trackedOrder = orders.find((o) => o._id === trackingOrderId);

  // WhatsApp link
  const whatsappNumber = "261336261649"; // Replace with your number
  const lastOrder = orders[0];
  const whatsappMessage = encodeURIComponent(
    lastOrder
      ? `Hello, I want to inquire about my recent order: ${lastOrder._id.slice(-6).toUpperCase()}`
      : "Hello, I want to inquire about my orders."
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <motion.section
      className="max-padd-container mt-24"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="pt-6 pb-28">
        <Title title1="My" title2="Orders" titleStyles="h3" />

        {loading ? (
          <LoadingDiamond />
        ) : displayedOrders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No orders found.</p>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {displayedOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 rounded-xl bg-white mt-4 shadow-md border relative"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
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

                    <div className="flex flex-col items-end justify-center sm:justify-start">
                      {order.status === "Delivered" ? (
                        <div className="flex flex-col items-end space-y-2">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold shadow-sm">
                            <FaCheckCircle className="w-4 h-4 mr-1" />
                            Delivered
                          </div>
                          <button
                            onClick={() => generateInvoice(order)}
                            className="flex items-center gap-2 bg-[#4169E1] text-white px-3 py-1.5 rounded-md hover:bg-blue-500 text-xs transition shadow-sm"
                          >
                            <FaFileDownload className="w-3 h-3" /> Download Invoice
                          </button>
                        </div>
                      ) : order.status === "Cancelled" ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold">
                          <FaTimesCircle className="w-4 h-4 mr-1" />
                          Cancelled
                        </div>
                      ) : (
                        <button
                          onClick={() => openTrackingModal(order._id)}
                          className="bg-[#4169E1] text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors text-sm"
                        >
                          Track Order
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 border-b py-2 hover:bg-amber-50 rounded-md transition-all"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex flex-col text-sm">
                          <span className="font-medium break-words">
                            {item.name}
                          </span>
                          <span>Size: {item.size}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>
                            Price: {currency}
                            {item.price[item.size].toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More Button */}
            {displayedOrders.length < orders.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-[#4169E1] hover:bg-blue-400 text-white rounded-lg font-semibold transition"
                >
                  Load More Orders
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tracking Modal */}
        <AnimatePresence>
          {trackedOrder && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-2xl w-11/12 md:w-2/3 max-w-xl relative"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <button
                  onClick={closeTrackingModal}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  <FaTimes size={18} />
                </button>
                <h3 className="text-xl font-semibold text-center text-[#4169E1] mb-4">
                  Order Tracking — #{trackedOrder._id.slice(-6).toUpperCase()}
                </h3>

                <div className="flex flex-col space-y-4">
                  {stages.map((stage, index) => {
                    const isActive = stages.indexOf(trackedOrder.status) >= index;
                    return (
                      <div key={stage} className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                            isActive
                              ? "bg-[#4169E1] border-blue-400 text-white"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {isActive ? "✓" : index + 1}
                        </div>
                        <span
                          className={`text-sm ${
                            isActive ? "text-gray-800 font-medium" : "text-gray-400"
                          }`}
                        >
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Floating Button */}
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[#25D366] text-white font-medium px-4 py-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(37, 211, 102, 0.6)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <FaWhatsapp className="text-2xl" />
          <span className="hidden sm:inline">Contact Seller</span>
        </motion.a>

        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </motion.section>
  );
};

export default Orders;