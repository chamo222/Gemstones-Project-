import React, { useEffect, useState, useRef } from "react";
import { backend_url, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { TfiPackage } from "react-icons/tfi";

// Place your audio file in public/assets folder
const notificationSound = "../assets/order_notification.mp3";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [openOrderDetails, setOpenOrderDetails] = useState({});
  const lastOrderCount = useRef(0);
  const audioRef = useRef(null);

  // Initialize audio once
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.5;

    // Unlock audio on first user interaction
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

        // Play sound if new order arrived
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
    const intervalId = setInterval(fetchAllOrders, 30000);
    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <div className="px-4 sm:px-8 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🛒 Orders Dashboard
      </h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="hidden xl:flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow">
                  <TfiPackage className="text-3xl text-secondary" />
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
                <span className="text-primary font-bold">
                  {currency}
                  {order.amount}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => toggleOrderDetails(order._id)}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
              >
                {openOrderDetails[order._id] ? "Hide Details" : "Show Details"}
              </button>
            </div>

            {openOrderDetails[order._id] && (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <td className="p-2">
                          {order.payment ? "✅ Done" : "⌛ Pending"}
                        </td>
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
                      <span className="font-semibold text-gray-700">
                        Address:{" "}
                      </span>
                      {order.address.street}, {order.address.city},{" "}
                      {order.address.state}, {order.address.country},{" "}
                      {order.address.zipcode}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Phone: </span>
                      {order.address.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
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
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-md"
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
              </div>
            )}

            <div className="mt-6 flex justify-end">
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
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;