import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaInfoCircle, FaWhatsapp } from "react-icons/fa";
import Title from "../components/Title";
import FooterLogicForge from "../components/FooterLogicForge";

// Loading animation with About icon
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-b from-[#faf7f2] to-white">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <FaInfoCircle className="text-[#4169E1] text-6xl" />
    </motion.div>
    <motion.p
      className="mt-5 text-gray-600 text-lg font-medium animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Loading About...
    </motion.p>
  </div>
);

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  const whatsappNumber = "94771929902";
  const whatsappMessage = encodeURIComponent(
    "Hello LogicForge, I would like to get in touch."
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-[#faf7f2] to-white flex flex-col">
      <motion.div
        className="max-w-6xl mx-auto px-6 sm:px-10 py-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title title1="About" title2="LogicForge" title1Styles="h3" />
        <p className="text-gray-700 mt-6 text-lg leading-relaxed max-w-3xl text-center">
          Welcome to <span className="font-semibold text-[#4169E1]">LogicForge</span> — where innovation meets precision. We specialize in modern software solutions that empower businesses to achieve more through design, development, and data-driven excellence.
        </p>

        <div className="grid sm:grid-cols-3 gap-8 mt-16 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all">
            <h3 className="font-semibold text-xl mb-2 text-[#4169E1]">💡 Vision</h3>
            <p className="text-gray-600">To be Sri Lanka’s most trusted innovation hub delivering global tech excellence.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all">
            <h3 className="font-semibold text-xl mb-2 text-[#4169E1]">🚀 Mission</h3>
            <p className="text-gray-600">Empowering businesses through reliable, scalable, and creative digital products.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all">
            <h3 className="font-semibold text-xl mb-2 text-[#4169E1]">🤝 Promise</h3>
            <p className="text-gray-600">We believe in collaboration, transparency, and lasting partnerships.</p>
          </div>
        </div>
      </motion.div>

      {/* WhatsApp Floating Button */}
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

export default About;