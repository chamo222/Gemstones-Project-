import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../App"; // your backend URL

function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Overview
  const [walletBalance, setWalletBalance] = useState(0);
  const [todaysEarnings, setTodaysEarnings] = useState(0);
  const [settlements, setSettlements] = useState([]);

  // Transcripts
  const [transcripts, setTranscripts] = useState([]);
  const [filters, setFilters] = useState({
    orderId: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  // Fetch Overview
  const fetchOverview = async () => {
    try {
      const res = await axios.get(`${backend_url}/api/finance/overview`);
      setWalletBalance(res.data.walletBalance);
      setTodaysEarnings(res.data.todaysEarnings);
      setSettlements(res.data.settlements);
    } catch (err) {
      console.error(err);
      alert("Error fetching finance overview");
    }
  };

  // Fetch Transcripts
  const fetchTranscripts = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${backend_url}/api/finance/transcripts?${query}`);
      // Map backend data to include category from items
      const mapped = res.data.transcripts.map(t => ({
        ...t,
        category: t.items?.[0]?.category || "N/A",
        date: new Date(t.date).toLocaleDateString(),
      }));
      setTranscripts(mapped);
    } catch (err) {
      console.error(err);
      alert("Error fetching transcripts");
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

  const applyFilters = () => {
    fetchTranscripts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded ${activeTab === "overview" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("transcripts")}
          className={`px-4 py-2 rounded ${activeTab === "transcripts" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
        >
          Transcripts
        </button>
      </div>

      {activeTab === "overview" && (
        <div>
          <div className="flex gap-6 mb-4">
            <div className="p-4 bg-gray-100 rounded shadow">
              <h3 className="font-semibold">Wallet Balance</h3>
              <p>${walletBalance}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded shadow">
              <h3 className="font-semibold">Today's Earnings</h3>
              <p>${todaysEarnings}</p>
            </div>
          </div>

          <h3 className="font-semibold mb-2">Recent Settlements</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((s, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">${s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "transcripts" && (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              name="orderId"
              placeholder="Order ID"
              value={filters.orderId}
              onChange={handleFilterChange}
              className="px-2 py-1 border rounded"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-2 py-1 border rounded"
            />
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="px-2 py-1 border rounded"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="px-2 py-1 border rounded"
            />
            <button
              onClick={applyFilters}
              className="bg-orange-500 text-white px-4 py-1 rounded"
            >
              Filter
            </button>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Order ID</th>
                <th className="border px-2 py-1">Category</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {transcripts.map((t, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{t.date}</td>
                  <td className="border px-2 py-1">{t.orderId}</td>
                  <td className="border px-2 py-1">{t.category}</td>
                  <td className="border px-2 py-1">${t.amount}</td>
                  <td className="border px-2 py-1">{t.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FinancePage;