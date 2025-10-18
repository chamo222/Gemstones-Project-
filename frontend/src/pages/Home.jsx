import React, { useEffect, useState, useContext } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Process from '../components/Process';
import PopularFoods from '../components/PopularGemstones';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { GiCutDiamond } from 'react-icons/gi';
import { FaWhatsapp, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

// 💎 Loading diamond
const LoadingDiamond = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
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
  const { backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/review/all`);
        if (res.data.success) setReviews(res.data.reviews);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReviews();
  }, [backendUrl]);

  if (loading) return <LoadingDiamond />;

  // WhatsApp
  const whatsappNumber = '261336261649';
  const whatsappMessage = encodeURIComponent(
    'Hello, I would like to inquire about your gemstones.'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // ✅ Smooth continuous scroll settings
  const scrollSpeed = 30; // smaller = faster
  const duplicatedReviews = [...reviews, ...reviews, ...reviews]; // triple for seamless loop

  return (
    <div className="overflow-hidden">
      <Hero />
      <Features />
      <Process />

      {/* 💬 Customer Reviews - Continuous Infinite Slider */}
      {reviews.length > 0 && (
        <div className="relative py-12 bg-white overflow-hidden">
          <h2 className="text-2xl font-bold text-center text-[#4169E1] mb-8">
            Customer Reviews
          </h2>

          <div className="relative w-full overflow-hidden">
            <motion.div
              className="flex gap-6"
              style={{
                width: 'max-content',
                whiteSpace: 'nowrap',
              }}
              animate={{
                x: ['0%', '-33.33%'], // move by 1/3 of total width since tripled
              }}
              transition={{
                repeat: Infinity,
                duration: scrollSpeed,
                ease: 'linear',
              }}
            >
              {duplicatedReviews.map((r, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-white border border-gray-100 rounded-xl shadow-sm p-5 w-80 min-w-[320px] flex flex-col justify-between"
                >
                  <p className="text-gray-700 mb-3 break-words text-sm italic">
                    “{r.comment}”
                  </p>
                  <div className="flex items-center mb-2">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 mr-1" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {r.name || 'Anonymous'}
                  </p>
                  {r.productName && (
                    <p className="text-xs text-gray-500 truncate">
                      {r.productName}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : ''}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      <PopularFoods />
      <Footer />

      {/* 💬 WhatsApp Floating Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[#25D366] text-white font-medium px-4 py-3 rounded-full shadow-lg"
        whileHover={{
          scale: 1.1,
          boxShadow: '0 0 20px rgba(37, 211, 102, 0.6)',
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <FaWhatsapp className="text-2xl" />
        <span className="hidden sm:inline">Contact Us</span>
      </motion.a>
    </div>
  );
};

export default Home;