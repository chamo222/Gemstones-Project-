import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelopeOpenText, FaReply, FaTrash } from "react-icons/fa6";
import Footer from "../components/Footer";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [showAllDesktop, setShowAllDesktop] = useState(false);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/contact/all");
        // Sort messages by newest first
        const sortedMessages = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTimeout(() => {
          setMessages(sortedMessages);
          setLoading(false);
        }, 1000); // Loader visible for 1 second
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch messages!");
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Handle reply
  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return toast.error("Please type a reply message.");

    try {
      setSending(true);
      const res = await axios.post(
        `http://localhost:4000/api/contact/reply/${selectedMessage._id}`,
        { reply }
      );

      if (res.status === 200) {
        toast.success("Reply sent successfully!");
        setMessages((prev) =>
          prev.map((m) =>
            m._id === selectedMessage._id
              ? { ...m, reply, repliedAt: new Date() }
              : m
          )
        );
        setReply("");
        setSelectedMessage(null);
      } else {
        toast.error("Failed to send reply.");
      }
    } catch (error) {
      console.error("Reply error:", error);
      toast.error("Error sending reply.");
    } finally {
      setSending(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/contact/${id}`);
      setMessages(messages.filter((m) => m._id !== id));
      toast.success("Message deleted successfully!");
      setDeleteMessageId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-[#4169E1] text-7xl mb-4"
          >
            <FaEnvelopeOpenText />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-lg font-semibold text-[#4169E1]"
          >
            Loading Messages...
          </motion.p>
        </div>
      </div>
    );
  }

  const mobileMessages = showAllMobile ? messages : messages.slice(0, 10);
  const desktopMessages = showAllDesktop ? messages : messages.slice(0, 10);

  return (
    <section className="p-6 md:p-10 bg-gradient-to-b from-[#faf7f2] to-white min-h-screen">
      <motion.div className="mt-10 md:mt-16">
        <motion.h2
          className="text-3xl font-bold text-[#4169E1] mb-10 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaEnvelopeOpenText className="text-3xl" /> User Messages
        </motion.h2>
      </motion.div>

      <div className="space-y-10">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-3xl shadow-lg border border-[#4169E1]/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4169E1] text-white">
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Message</th>
                <th className="py-3 px-5">Received At</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {desktopMessages.map((msg) => (
                <React.Fragment key={msg._id}>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                    <td className="py-3 px-5 font-semibold">{msg.name}</td>
                    <td className="py-3 px-5 text-blue-600">{msg.email}</td>
                    <td className="py-3 px-5">{msg.message}</td>
                    <td className="py-3 px-5">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-5 text-center flex gap-3 justify-center">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="text-[#4169E1] hover:text-blue-600"
                        title="Reply"
                      >
                        <FaReply />
                      </button>
                      <button
                        onClick={() => setDeleteMessageId(msg._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  {msg.reply && (
                    <tr>
                      <td colSpan={5}>
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg mx-5 my-3 border border-green-200">
                          <strong>Replied:</strong> {msg.reply}{" "}
                          <span className="text-xs text-gray-400">
                            ({new Date(msg.repliedAt).toLocaleString()})
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {messages.length > 10 && (
            <div className="text-center py-6">
              <button
                onClick={() => setShowAllDesktop(!showAllDesktop)}
                className="px-4 py-2 bg-[#4169E1] text-white rounded-lg hover:bg-blue-600"
              >
                {showAllDesktop ? "Show Less" : "Load More"}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {mobileMessages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white rounded-2xl shadow-md p-4 border border-[#4169E1]/20"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg text-[#4169E1]">{msg.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMessage(msg)}
                    className="text-[#4169E1] hover:text-blue-600"
                    title="Reply"
                  >
                    <FaReply />
                  </button>
                  <button
                    onClick={() => setDeleteMessageId(msg._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">
                <strong>Email:</strong> {msg.email}
              </p>
              <p className="text-gray-700 mb-2">{msg.message}</p>
              {msg.reply && (
                <p className="text-green-700 text-sm mb-2 bg-green-50 p-2 rounded-lg">
                  <strong>Replied:</strong> {msg.reply}{" "}
                  <span className="text-xs text-gray-400">
                    ({new Date(msg.repliedAt).toLocaleString()})
                  </span>
                </p>
              )}
              <p className="text-gray-400 text-xs">
                Received at: {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          {messages.length > 10 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="px-4 py-2 bg-[#4169E1] text-white rounded-lg hover:bg-blue-600"
              >
                {showAllMobile ? "Show Less" : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 sm:p-8 w-[90%] sm:w-[500px] shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-2xl font-semibold text-[#4169E1] mb-3">
                Reply to {selectedMessage.name}
              </h3>
              <p className="text-gray-600 mb-4">
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <textarea
                rows="5"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply message..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
              ></textarea>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={sending}
                  className="px-4 py-2 bg-[#4169E1] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteMessageId && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-[#4169E1] mb-4">
                Confirm Delete
              </h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteMessageId(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteMessageId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16">
        <Footer />
      </div>
    </section>
  );
};

export default Messages;