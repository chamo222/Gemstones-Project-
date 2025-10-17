import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  Bell,
  PackageCheck,
  XCircle,
  Truck,
  CheckCircle,
  Edit,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

// ✅ Socket connection
const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000");

// ✅ Icon Map
const iconMap = {
  orderPlaced: PackageCheck,
  orderCancelled: XCircle,
  outForDelivery: Truck,
  delivered: CheckCircle,
  productAdded: Bell,
  productEdited: Edit,
  salesReport: TrendingUp,
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications`
      );
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.notifications || [];
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/read`,
        { notificationId }
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Real-time updates from socket
  useEffect(() => {
    fetchNotifications();
    socket.on("notification", (newNote) => {
      setNotifications((prev) => [newNote, ...prev]);
    });
    return () => socket.off("notification");
  }, []);

  return (
    <div className="w-full min-h-screen p-8 bg-white text-[#0A0A0A]">
      {/* Title */}
      <motion.h2
        className="text-3xl font-semibold mb-2 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Bell className="text-blue-500" /> Notifications
      </motion.h2>

      {/* Subheading */}
      <p className="text-gray-400 mb-8">Stay up-to-date with system activities.</p>

      {/* No Notifications */}
      {!loading && notifications.length === 0 && (
        <p className="text-center pt-24 text-gray-400 text-sm">
          No Notifications available yet!
        </p>
      )}

      {/* Notification List */}
      {!loading && notifications.length > 0 && (
        <div className="md:w-[80%] my-6 rounded-lg divide-y divide-gray-800 bg-white/5 backdrop-blur-md shadow-lg border border-gray-800">
          {notifications.map((note, index) => {
            const Icon = iconMap[note.type] || Bell;
            return (
              <motion.div
                key={note._id || index}
                className={`block px-5 py-4 cursor-pointer transition-all ${
                  note.status === "Unread"
                    ? "bg-gray-800/60 hover:bg-gray-800/80"
                    : "hover:bg-gray-800/40"
                }`}
                onClick={() => markAsRead(note._id)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-full flex items-center justify-center">
                    <Icon className="text-blue-400" size={22} />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {note.title || "Notification"}
                    </span>
                    <span className="text-gray-300 text-sm mt-1">
                      {note.message || "A new event occurred in your admin panel."}
                    </span>
                    <span className="text-gray-500 text-xs mt-1">
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleString("en-UK", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Just now"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notification;