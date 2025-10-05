import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Process from '../components/Process';
import PopularFoods from '../components/PopularFoods';
import coverBanner1 from "../assets/cover-banner-1.jpg";
import coverBanner2 from "../assets/cover-banner-2.jpg";
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

// Simple loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Home = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading (you can remove setTimeout if data loads dynamically)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner />;

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

      {/* Popular Foods Section */}
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
            alt="Restaurant interior"
            className="rounded-2xl md:rounded-e-2xl shadow-md hover:shadow-lg transition-all duration-300"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <img
            src={coverBanner2}
            alt="Restaurant dish"
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
    </motion.div>
  );
};

export default Home;