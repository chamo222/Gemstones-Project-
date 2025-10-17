import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaHeadphones, FaPhone, FaLifeRing } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import Title from "../components/Title";
import FooterLogicForge from "../components/FooterLogicForge";
import axios from "axios";
import { toast } from "react-toastify";

// Loading animation with Support icon
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-b from-[#faf7f2] to-white">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <FaLifeRing className="text-purple-600 text-6xl" />
    </motion.div>
    <motion.p
      className="mt-5 text-gray-600 text-lg font-medium animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Loading Support...
    </motion.p>
  </div>
);

const Support = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  const whatsappNumber = "94771929902";
  const whatsappMessage = encodeURIComponent(
    "Hello LogicForge, I would like support with your services."
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      setSending(true);
      const response = await axios.post(
        "http://localhost:4000/api/contact",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else toast.error("Failed to send message.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-[#faf7f2] to-white flex flex-col">
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-10 py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Title */}
        <Title
          title1="Customer"
          title2="Support"
          title1Styles="h3"
          title2Styles="text-[#4169E1]"
        />
        <p className="text-gray-700 mt-6 text-lg leading-relaxed max-w-3xl text-center mx-auto">
          Our support team is available <span className="font-semibold">24/7</span> to assist
          you with technical issues, account queries, or project guidance.
        </p>

        {/* Support Features */}
        <div className="grid sm:grid-cols-3 gap-8 mt-16 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all">
            <FaHeadphones className="text-4xl text-[#4169E1] mx-auto mb-3" />
            <h3 className="font-semibold text-xl mb-2 text-gray-800">24/7 Assistance</h3>
            <p className="text-gray-600">We’re always ready to help you solve any issues you face.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all">
            <FaPhone className="text-4xl text-[#4169E1] mx-auto mb-3" />
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Call Us</h3>
            <p className="text-gray-600">+94 77 192 9902</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all">
            <FaEnvelope className="text-4xl text-[#4169E1] mx-auto mb-3" />
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Email Support</h3>
            <p className="text-gray-600 break-all">l.f.logicforge@gmail.com</p>
          </div>
        </div>

        {/* Get in Touch Form + Contact Details */}
        <div className="flex flex-col xl:flex-row gap-10 mt-16">
          {/* Form */}
          <motion.div
            className="flex-1 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#4169E1]"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Title
              title1="Get"
              title2="in Touch"
              title1Styles="h3"
              title2Styles="text-[#4169E1]"
            />
            <p className="mb-6 text-gray-600 text-lg leading-relaxed">
              Have any questions or issues? Send us a message and our team will respond promptly.
            </p>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-5">
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400"
                />
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400"
                />
              </div>
              <textarea
                id="message"
                rows="5"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400 resize-none"
              />
              <motion.button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-lg bg-[#4169E1] text-white font-medium shadow-md hover:bg-blue-500 hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: sending ? 1 : 1.03 }}
                whileTap={{ scale: sending ? 1 : 0.97 }}
              >
                {sending ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            className="flex-1 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#4169E1]"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Title
              title1="Contact"
              title2="Details"
              title1Styles="h3"
              title2Styles="text-[#4169E1]"
            />
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Reach out using the information below or contact us directly for immediate assistance.
            </p>
            <div className="flex flex-col gap-6 text-gray-700">
              <p className="flex items-center gap-3">
                <FaPhone className="text-blue-500 text-lg" /> +94 77 192 9902
              </p>
              <p className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500 text-lg" /> l.f.logicforge@gmail.com
              </p>
              <p className="flex items-center gap-3">
                <FaHeadphones className="text-blue-500 text-lg" /> 24/7 Support Available
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* WhatsApp Button with adjusted bottom for mobile */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-20 sm:bottom-6 z-50 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium cursor-pointer"
        whileHover={{ y: -4, scale: 1.05, boxShadow: "0 0 20px rgba(34,197,94,0.8)" }}
        animate={{ boxShadow: ["0 0 10px rgba(34,197,94,0.5)", "0 0 20px rgba(34,197,94,0.9)", "0 0 10px rgba(34,197,94,0.5)"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <FaWhatsapp className="text-2xl animate-pulse" /> Get Support
      </motion.a>

      <FooterLogicForge />
    </section>
  );
};

export default Support;