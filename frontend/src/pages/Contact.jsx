import React, { useState, useEffect } from "react";
import { FaEnvelope, FaHeadphones, FaLocationDot, FaPhone } from "react-icons/fa6";
import { GiCutDiamond } from "react-icons/gi";
import Title from "../components/Title";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

// 💎 Modern diamond loading component (same as Orders page)
const LoadingDiamond = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#faf7f2] to-white">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <GiCutDiamond className="text-[#4169E1] text-6xl drop-shadow-md" />
    </motion.div>
    <motion.p
      className="mt-5 text-gray-600 text-lg font-medium tracking-wide animate-pulse"
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingDiamond />;

  return (
    <section className="max-padd-container mt-24 bg-gradient-to-b from-[#faf7f2] to-white">
      {/* Contact Form + Details */}
      <motion.div
        className="flex flex-col xl:flex-row gap-10 xl:gap-16 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Contact Form */}
        <motion.div
          className="flex-1 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#4169E1]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Title title1="Get" title2="in Touch" title1Styles="h3" />
          <p className="mb-6 text-gray-600 leading-relaxed text-lg">
            Have any questions about our gemstones or services? Send us a message and we’ll respond promptly.
          </p>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400"
              />
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400"
              />
            </div>

            <textarea
              id="message"
              rows="5"
              placeholder="Write your message here..."
              className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400 resize-none"
            ></textarea>

            <motion.button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#4169E1] text-white font-medium shadow-md hover:bg-blue-500 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Send Message
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
          <Title title1="Contact" title2="Details" title1Styles="h3" />
          <p className="text-gray-600 mb-6 leading-relaxed text-lg">
            We’re always happy to assist you. Reach out using the information below or visit our gemstone studio.
          </p>

          <div className="flex flex-col gap-6 text-gray-700">
            <div>
              <h5 className="font-semibold mb-1 text-gray-900">Location:</h5>
              <p className="flex items-center gap-3">
                <FaLocationDot className="text-blue-500 text-lg" />
                123 Gemstone Avenue, Crystal City, Earth 10000
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-1 text-gray-900">Email:</h5>
              <p className="flex items-center gap-3 break-all">
                <FaEnvelope className="text-blue-500 text-lg" />
                sirisenasaman@outlook.com
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-1 text-gray-900">Phone:</h5>
              <p className="flex items-center gap-3">
                <FaPhone className="text-blue-500 text-lg" />
                +94 74 194 1535
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-1 text-gray-900">Support:</h5>
              <p className="flex items-center gap-3">
                <FaHeadphones className="text-blue-500 text-lg" />
                24/7 Gem Expert Support
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Location Map */}
      <motion.div
        className="mt-20 rounded-3xl overflow-hidden shadow-2xl border border-yellow-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title title1="Find" title2="Us Here" title1Styles="h3" />
        <div className="w-full h-[450px] sm:h-[500px] rounded-2xl overflow-hidden mt-4">
          <iframe
            className="w-full h-full border-0 rounded-2xl"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8438215697893!2d144.96316!3d-37.816015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ4JzU3LjciUyAxNDTCsDU3JzQ3LjQiRQ!5e0!3m2!1sen!2sxx!4v1700000000000!5m2!1sen!2sxx"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </motion.div>

      <div className="mb-32"></div>

      <Footer />
    </section>
  );
};

export default Contact;