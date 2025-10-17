// src/pages/Orders.jsx
import React, { useEffect, useState, useRef } from "react";
import { backend_url, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { TfiPackage } from "react-icons/tfi";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

const notificationSound = "../assets/order_notification.mp3";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [openOrderDetails, setOpenOrderDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false); // State to toggle showing all orders
  const lastOrderCount = useRef(0);
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
        const newOrders = response.data.orders;

        if (newOrders.length > lastOrderCount.current) {
          playNotificationSound();
          toast.info("🔔 New order received!", {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
          });
        }

        setOrders(newOrders);
        lastOrderCount.current = newOrders.length;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
      ...prev,
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

  // Determine orders to display based on showAll toggle
  const displayedOrders = showAll ? filteredOrders : filteredOrders.slice(0, 7);

  return (
    <div className="px-6 sm:px-12 py-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🛒 Orders Dashboard
      </h1>

      {/* Search Bar */}
      <div className="mb-6 relative w-full sm:w-1/2">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-12 p-3 border-2 border-orange-400 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-lg"
        />
        <FiSearch className="absolute right-4 top-3 text-gray-400 text-xl" />
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
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition p-6 ${
                  order.status === "Cancelled" ? "opacity-60" : ""
                }`}
              >
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
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
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
                      {/* ... Your existing order details rendering ... */}
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
                                      item.imageUrl
                                        ? item.imageUrl.startsWith("http")
                                          ? item.imageUrl
                                          : `${backend_url.replace(/\/$/, "")}/${item.imageUrl.replace(/^\//, "")}`
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
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
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