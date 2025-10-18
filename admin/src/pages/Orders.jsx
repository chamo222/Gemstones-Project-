// src/pages/Orders.jsx
import React, { useEffect, useState, useRef } from "react";
import { backend_url, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { TfiPackage } from "react-icons/tfi";
import { FiSearch } from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

const notificationSound = "../assets/order_notification.mp3";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [openOrderDetails, setOpenOrderDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const lastOrderIds = useRef(new Set());
  const isInitialLoad = useRef(true); // Track first fetch
  const audioRef = useRef(null);

  // Initialize notification sound
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.5;

    const unlockAudio = () => {
      audioRef.current
        .play()
        .then(() => audioRef.current.pause())
        .catch(() => {});
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const playNotificationSound = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backend_url + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let newOrders = response.data.orders;
        newOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        const newOrderIds = new Set(newOrders.map((o) => o._id));
        const newlyReceivedOrders = newOrders.filter(
          (o) => !lastOrderIds.current.has(o._id)
        );

        if (isInitialLoad.current) {
          // First fetch: open first order by default
          if (newOrders.length > 0) {
            setOpenOrderDetails({ [newOrders[0]._id]: true });
          }
          isInitialLoad.current = false;
        } else if (newlyReceivedOrders.length > 0) {
          // New order received after initial load
          playNotificationSound();
          toast.info("🔔 New order received!", {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
          });

          // Automatically open details for the first new order, close others
          setOpenOrderDetails({ [newlyReceivedOrders[0]._id]: true });
        }

        setTimeout(() => {
          setOrders(newOrders);
          setLoading(false);
        }, 1200);

        lastOrderIds.current = newOrderIds;
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;
    try {
      const response = await axios.post(
        backend_url + "/api/order/status",
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(
          newStatus === "Cancelled"
            ? "❌ Order cancelled successfully."
            : `✅ Order status updated to "${newStatus}".`
        );
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating the status."
      );
    }
  };

  const toggleOrderDetails = (orderId) => {
    setOpenOrderDetails((prev) => ({
      // Close other orders when manually opening
      [orderId]: !prev[orderId],
    }));
  };

  useEffect(() => {
    fetchAllOrders();
    const intervalId = setInterval(fetchAllOrders, 3000);
    return () => clearInterval(intervalId);
  }, [token]);

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedOrders = showAll ? filteredOrders : filteredOrders.slice(0, 7);

  // -------------------- LOADER --------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  delay: i * 0.2,
                  repeatType: "loop",
                }}
                className="text-orange-500 text-5xl"
              >
                <FaShippingFast />
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-lg font-semibold text-orange-500 mt-4"
          >
            Loading Orders...
          </motion.p>
        </div>
      </div>
    );
  }
  // -----------------------------------------------

  return (
    <div className="px-6 sm:px-12 py-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Orders Dashboard</h1>

      {/* Search Bar */}
      <div className="mb-4 flex justify-end">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by Product ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 p-3 border-2 border-[#4169E1] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
          />
          <FiSearch className="absolute right-3 top-3 text-gray-400 text-lg" />
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {displayedOrders.map((order) => {
            let paymentStatus = "⌛ Pending";
            if (order.status === "Delivered" && order.payment) {
              paymentStatus = "✅ Successfully Paid";
            } else if (order.payment) {
              paymentStatus = "✅ Done";
            }

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition p-6 ${
                  order.status === "Cancelled" ? "opacity-60" : ""
                }`}
              >
                {/* Order Summary */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 text-2xl shadow-md">
                      <TfiPackage />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-700">
                        {order.items.length} Items
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Order ID: {order._id.slice(-6).toUpperCase()}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-lg font-bold">
                      {currency}
                      {order.amount.toLocaleString()}
                    </div>

                    <select
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                      className="p-2 rounded-lg border border-gray-300 shadow-sm text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Seller to Pack</option>
                      <option value="Shipped">Ready</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="bg-[#4169E1] text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      {openOrderDetails[order._id] ? "Hide Details" : "Show Details"}
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                <AnimatePresence>
                  {openOrderDetails[order._id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 rounded-lg p-4 space-y-4 shadow-inner"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <table className="w-full text-sm">
                          <tbody>
                            <tr>
                              <td className="font-semibold p-1">Total:</td>
                              <td className="p-1">
                                {currency}
                                {order.amount.toLocaleString()}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-1">Payment Method:</td>
                              <td className="p-1">{order.paymentMethod}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-1">Payment Status:</td>
                              <td className="p-1">{paymentStatus}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-1">Date:</td>
                              <td className="p-1">
                                {new Date(order.date).toLocaleDateString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p>
                            <span className="font-semibold">Name: </span>
                            {order.address.firstName} {order.address.lastName}
                          </p>
                          <p className="mt-1">
                            <span className="font-semibold">Address: </span>
                            {order.address.street}, {order.address.city},{" "}
                            {order.address.state}, {order.address.country},{" "}
                            {order.address.zipcode}
                          </p>
                          <p className="mt-1">
                            <span className="font-semibold">Phone: </span>
                            {order.address.phone}
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-gray-700 mb-3">Items:</h3>
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="p-2 text-left">Image</th>
                              <th className="p-2 text-left">Name</th>
                              <th className="p-2 text-left">Size</th>
                              <th className="p-2 text-left">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="p-2">
                                  <img
                                    src={
                                      item.image
                                        ? item.image.startsWith("http")
                                          ? item.image
                                          : `${backend_url.replace(/\/$/, "")}/${item.image.replace(
                                              /^\/+/,
                                              ""
                                            )}`
                                        : "/placeholder.png"
                                    }
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                  />
                                </td>
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.size}</td>
                                <td className="p-2">{item.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Load More / Show Less Button */}
      {filteredOrders.length > 7 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-[#4169E1] text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            {showAll ? "Show Less" : "Load More Orders"}
          </button>
        </div>
      )}

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default Orders;