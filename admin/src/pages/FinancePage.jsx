import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { motion, AnimatePresence } from "framer-motion";

function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Overview
  const [walletBalance, setWalletBalance] = useState(0);
  const [todaysEarnings, setTodaysEarnings] = useState(0);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transcripts
  const [transcripts, setTranscripts] = useState([]);
  const [filters, setFilters] = useState({
    orderId: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend_url}/api/finance/overview`);
      setWalletBalance(res.data.walletBalance);
      setTodaysEarnings(res.data.todaysEarnings);
      setSettlements(res.data.settlements);
      setTimeout(() => setLoading(false), 700);
    } catch (err) {
      console.error(err);
      alert("Error fetching finance overview");
      setLoading(false);
    }
  };

  const fetchTranscripts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${backend_url}/api/finance/transcripts?${query}`);
      const mapped = res.data.transcripts.map((t) => ({
        ...t,
        shortOrderId: t.orderId.slice(-6).toUpperCase(),
      }));
      setTranscripts(mapped);
      setTimeout(() => setLoading(false), 700);
    } catch (err) {
      console.error(err);
      alert("Error fetching transcripts");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "overview") fetchOverview();
    else fetchTranscripts();
  }, [activeTab]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => fetchTranscripts();

  const Loader = () => (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-pink-500 text-white text-5xl shadow-xl"
      >
        💰
      </motion.div>
    </motion.div>
  );

  return (
    <div className="p-8 md:p-12 min-h-screen flex flex-col bg-white w-full">
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <h1 className="text-4xl font-bold mb-8 text-gray-800">Finance Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            activeTab === "overview"
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-orange-100"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("transcripts")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            activeTab === "transcripts"
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-orange-100"
          }`}
        >
          Transcripts
        </button>
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-lg font-medium text-gray-600 mb-3">Wallet Balance</h3>
              <p className="text-3xl font-bold text-gray-800">${walletBalance}</p>
            </motion.div>
            <motion.div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-lg font-medium text-gray-600 mb-3">Today's Earnings</h3>
              <p className="text-3xl font-bold text-gray-800">${todaysEarnings}</p>
            </motion.div>
          </div>

          {/* Weekly Settlements Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Settlements</h3>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full border-collapse bg-white text-sm">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 border-b">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {settlements.map((s, idx) => (
                    <tr key={idx} className="hover:bg-orange-50 transition">
                      <td className="px-6 py-4 border-b">{s.date}</td>
                      <td className="px-6 py-4 border-b font-semibold">${s.amount}</td>
                    </tr>
                  ))}
                  {settlements.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center py-6 text-gray-400">No settlements available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transcripts */}
      {activeTab === "transcripts" && (
        <div className="space-y-4 w-full">
          <div className="flex justify-end gap-2 flex-wrap mb-4">
            <input type="text" name="orderId" placeholder="Search Order ID" value={filters.orderId} onChange={handleFilterChange} className="px-4 py-2 border rounded-l-lg w-60 focus:ring-2 focus:ring-orange-400 outline-none" />
            <input type="text" name="name" placeholder="Customer Name" value={filters.name} onChange={handleFilterChange} className="px-4 py-2 border w-60 focus:ring-2 focus:ring-orange-400 outline-none" />
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="px-4 py-2 border w-48 focus:ring-2 focus:ring-orange-400 outline-none" />
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="px-4 py-2 border w-48 focus:ring-2 focus:ring-orange-400 outline-none" />
            <button onClick={applyFilters} className="bg-orange-500 text-white px-6 py-2 rounded-r-lg shadow hover:bg-orange-600 transition">Filter</button>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="min-w-full border-collapse bg-white text-sm">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 border-b">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 border-b">Order ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 border-b">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 border-b">Category</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 border-b">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 border-b">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {transcripts.map((t, idx) => (
                  <tr key={idx} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4 border-b">{t.date}</td>
                    <td className="px-6 py-4 border-b font-mono">{t.shortOrderId}</td>
                    <td className="px-6 py-4 border-b">{t.customerName}</td>
                    <td className="px-6 py-4 border-b">{t.category}</td>
                    <td className="px-6 py-4 border-b font-semibold">${t.amount}</td>
                    <td className="px-6 py-4 border-b">{t.paymentMethod}</td>
                  </tr>
                ))}
                {transcripts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">No transcripts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancePage;