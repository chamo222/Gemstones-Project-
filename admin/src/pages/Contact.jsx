import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaHeadphones, FaWhatsapp } from "react-icons/fa6";
import Title from "../components/Title";
import FooterLogicForge from "../components/FooterLogicForge";
import axios from "axios";
import { toast } from "react-toastify";

// Loading animation with Contact icon
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-b from-[#faf7f2] to-white">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <FaEnvelope className="text-[#4169E1] text-6xl" />
    </motion.div>
    <motion.p
      className="mt-5 text-gray-600 text-lg font-medium animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Loading Contact...
    </motion.p>
  </div>
);

const Contact = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

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
      const response = await axios.post("http://localhost:4000/api/contact", formData);
      if (response.status === 200) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const whatsappLink =
    "https://wa.me/94771929902?text=Hello%20LogicForge%2C%20I’d%20like%20to%20learn%20more%20about%20your%20services.";

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-[#faf7f2] to-white flex flex-col">
      <motion.div className="max-w-7xl mx-auto px-6 sm:px-10 py-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Title title1="Get" title2="in Touch" title1Styles="h3" />

        <div className="flex flex-col xl:flex-row gap-10 mt-10">
          {/* Form */}
          <motion.div className="flex-1 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-blue-100" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <p className="mb-6 text-gray-600 text-lg">
              We’d love to hear from you. Fill out the form below and our team will get back to you soon.
            </p>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-5">
                <input type="text" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                <input type="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
              </div>
              <textarea id="message" rows="5" placeholder="Write your message..." value={formData.message} onChange={handleChange} className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none" />
              <motion.button type="submit" disabled={sending} className="w-full py-3 rounded-lg bg-[#4169E1] text-white font-medium hover:bg-blue-500 transition-all" whileHover={{ scale: sending ? 1 : 1.03 }} whileTap={{ scale: sending ? 1 : 0.97 }}>
                {sending ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Details */}
          <motion.div className="flex-1 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-blue-100" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <Title title1="Contact" title2="Details" title1Styles="h4" />
            <div className="flex flex-col gap-6 text-gray-700 mt-4">
              <p className="flex items-center gap-3"><FaPhone className="text-blue-500 text-lg" /> +94 77 192 9902</p>
              <p className="flex items-center gap-3"><FaEnvelope className="text-blue-500 text-lg" /> l.f.logicforge@gmail.com</p>
              <p className="flex items-center gap-3"><FaHeadphones className="text-blue-500 text-lg" /> 24/7 Support Available</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg" title="Chat on WhatsApp">
        <FaWhatsapp className="text-2xl" />
      </a>

      <FooterLogicForge />
    </section>
  );
};

export default Contact;