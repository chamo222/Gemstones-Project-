import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  FaBoxOpen,
  FaTruck,
  FaTimesCircle,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClipboardList,
  FaShippingFast,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Title from "../components/Title";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LabelList,
} from "recharts";
import Footer from "../components/Footer";

const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [salesType, setSalesType] = useState("daily");
  const [salesData, setSalesData] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Load revenue stats
  const loadStats = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/revenue`);
      if (res.data.success) setStats(res.data.stats);
      else setError("Failed to load revenue stats.");
    } catch (err) {
      console.error(err);
      setError("Failed to load revenue stats.");
    }
  };

  // Load sales data based on type
  const loadSalesData = async (type) => {
    try {
      const res = await axios.get(`${backendUrl}/api/sales?type=${type}`);
      if (res.data.success) setSalesData(res.data.sales);
      else setSalesData([]);
    } catch (err) {
      console.error(err);
      setSalesData([]);
    }
  };

  useEffect(() => {
    loadStats();
    loadSalesData(salesType);

    // Initialize Socket.IO connection
    const socket = io(backendUrl);

    // Listen for new orders
    socket.on("newOrder", () => {
      loadStats();          // Update stats
      loadSalesData(salesType); // Update sales chart
    });

    // Listen for order status updates
    socket.on("orderUpdated", () => {
      loadStats();          // Update stats
      loadSalesData(salesType); // Update sales chart
    });

    return () => socket.disconnect();
  }, [salesType]);

  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!stats) return <p className="text-center mt-20">Loading...</p>;

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders, icon: <FaClipboardList />, bg: "bg-blue-100", color: "text-blue-500" },
    { title: "Order Placed", value: stats.orderPlaced, icon: <FaBoxOpen />, bg: "bg-yellow-100", color: "text-yellow-500" },
    { title: "Packing", value: stats.packingOrders, icon: <FaBoxOpen />, bg: "bg-orange-100", color: "text-orange-500" },
    { title: "Shipped", value: stats.shippedOrders, icon: <FaTruck />, bg: "bg-purple-100", color: "text-purple-500" },
    { title: "Out for Delivery", value: stats.outForDeliveryOrders, icon: <FaShippingFast />, bg: "bg-teal-100", color: "text-teal-500" },
    { title: "Delivered", value: stats.deliveredOrders, icon: <FaCheckCircle />, bg: "bg-green-100", color: "text-green-500" },
    { title: "Cancelled", value: stats.cancelledOrders, icon: <FaTimesCircle />, bg: "bg-red-100", color: "text-red-500" },
    { title: "Total Sales", value: `LKR ${stats.totalSales.toLocaleString()}`, icon: <FaMoneyBillWave />, bg: "bg-teal-50", color: "text-teal-500", fullWidth: true },
  ];

  const flowData = [
    { stage: "Placed", orders: stats.orderPlaced },
    { stage: "Packing", orders: stats.packingOrders },
    { stage: "Shipped", orders: stats.shippedOrders },
    { stage: "Out 4 Delivery", orders: stats.outForDeliveryOrders },
    { stage: "Delivered", orders: stats.deliveredOrders },
    { stage: "Cancelled", orders: stats.cancelledOrders },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <section className="px-2 sm:px-4 md:px-8 mt-24 flex-1">
        <Title title1="Revenue" title2="Dashboard" titleStyles="h3" />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl shadow hover:shadow-lg transition-all duration-300 ${stat.bg} ${stat.fullWidth ? "col-span-full" : ""}`}
            >
              <motion.div
                className={`p-2 sm:p-3 rounded-full bg-white shadow`}
                whileHover={{ scale: 1.15, rotate: 8 }}
                whileTap={{ scale: 0.95 }}
              >
                {React.cloneElement(stat.icon, { className: `text-2xl sm:text-3xl ${stat.color}` })}
              </motion.div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</h4>
                <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Flow Chart */}
        <div className="mt-10 p-4 sm:p-6 bg-white rounded-xl shadow">
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Orders Flow</h4>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={flowData} margin={{ top: 10, bottom: 10 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#4ADE80" strokeWidth={3} />
              <LabelList dataKey="orders" position="top" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Flow Chart */}
        <div className="mt-10 p-4 sm:p-6 bg-white rounded-xl shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
            <h4 className="text-base sm:text-lg font-semibold text-gray-700">Sales Flow</h4>
            <select
              className="border rounded px-2 py-1 sm:px-3 sm:py-1 text-sm sm:text-base"
              value={salesType}
              onChange={(e) => setSalesType(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={salesData} margin={{ top: 10, bottom: 10 }}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} />
              <LabelList dataKey="amount" position="top" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Revenue;