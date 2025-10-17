import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Process from '../components/Process';
import PopularFoods from '../components/PopularGemstones';
import coverBanner1 from "../assets/gem-display1.jpg";
import coverBanner2 from "../assets/gem-display2.jpg";
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { GiCutDiamond } from 'react-icons/gi'; // Diamond loader
import { FaWhatsapp } from 'react-icons/fa';

// 💎 Diamond-style loader
const LoadingDiamond = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center w-full">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <GiCutDiamond className="text-[#4169E1] text-6xl drop-shadow-md" />
    </motion.div>
    <motion.p
      className="mt-5 text-gray-600 text-lg font-medium tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Preparing your experience...
    </motion.p>
  </div>
);

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingDiamond />;

  // WhatsApp button configuration
  const whatsappNumber = "261336261649"; // Replace with your number
  const whatsappMessage = encodeURIComponent("Hello, I would like to inquire about your gemstones.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <motion.div
      className="overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Hero />
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Features />
      </motion.div>

      {/* Process Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Process />
      </motion.div>

      {/* Popular Gemstones Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <PopularFoods />
      </motion.div>

      {/* Cover Banners */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-7 py-12 px-4"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <img
            src={coverBanner1}
            alt="Gem Display 1"
            className="rounded-2xl md:rounded-e-2xl shadow-md hover:shadow-lg transition-all duration-300"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <img
            src={coverBanner2}
            alt="Gem Display 2"
            className="rounded-2xl md:rounded-s-2xl shadow-md hover:shadow-lg transition-all duration-300"
          />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Footer />
      </motion.div>

      {/* WhatsApp Floating Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[#25D366] text-white font-medium px-4 py-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(37, 211, 102, 0.6)" }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <FaWhatsapp className="text-2xl" />
        <span className="hidden sm:inline">Contact Us</span>
      </motion.a>
    </motion.div>
  );
};

export default Home;