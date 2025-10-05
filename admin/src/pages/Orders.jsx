import React, { useEffect, useState, useRef } from "react";
import { backend_url, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { TfiPackage } from "react-icons/tfi";
import { FiSearch } from "react-icons/fi";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const notificationSound = "../assets/order_notification.mp3";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [openOrderDetails, setOpenOrderDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const lastOrderCount = useRef(0);
  const audioRef = useRef(null);

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

  return (
    <div className="px-6 sm:px-12 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🛒 Orders Dashboard
      </h1>

      {/* Search bar */}
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

      <div className="grid gap-8">
        <AnimatePresence>
          {filteredOrders.map((order) => {
            // Determine payment status
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
                className={`bg-white rounded-2xl p-10 shadow-lg border hover:shadow-xl transition-shadow ${
                  order.status === "Cancelled" ? "opacity-60" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="hidden xl:flex items-center justify-center w-20 h-20 rounded-full bg-primary shadow">
                      <TfiPackage className="text-5xl text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-700">
                        {order.items.length} Items
                      </h2>
                      <p className="text-sm text-gray-500">
                        Order ID: {order._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700 mr-3">
                      Price:
                    </span>
                    <span className="text-black font-bold text-lg">
                      {currency}
                      {order.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => toggleOrderDetails(order._id)}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
                  >
                    {openOrderDetails[order._id] ? "Hide Details" : "Show Details"}
                  </button>

                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className="p-2 rounded-lg border border-gray-300 shadow-sm text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {openOrderDetails[order._id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="p-2 font-semibold">Total:</td>
                            <td className="p-2">
                              {currency}
                              {order.amount}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2 font-semibold">Payment Method:</td>
                            <td className="p-2">{order.paymentMethod}</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-semibold">Payment Status:</td>
                            <td className="p-2">{paymentStatus}</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-semibold">Date:</td>
                            <td className="p-2">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p>
                          <span className="font-semibold text-gray-700">Name: </span>
                          {order.address.firstName} {order.address.lastName}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Address: </span>
                          {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Phone: </span>
                          {order.address.phone}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <h3 className="font-semibold text-gray-700 mb-3">Items:</h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left">Image</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Size</th>
                            <th className="p-2 text-left">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={index} className="border-t">
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
              </motion.div>
            );
          })}
        </AnimatePresence>
        <Footer />
      </div>
    </div>
  );
};

export default Orders;