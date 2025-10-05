import React from 'react';
import { FaEnvelope, FaHeadphones, FaLocationDot, FaPhone } from 'react-icons/fa6';
import Title from "../components/Title";
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section className="max-padd-container mt-24">
      {/* Contact Form + Details */}
      <motion.div
        className="flex flex-col xl:flex-row gap-10 xl:gap-16 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Contact Form */}
        <motion.div
          className="flex-1 bg-white p-8 sm:p-10 rounded-2xl shadow-lg"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Title title1="Get" title2="in Touch" title1Styles="h3" />
          <p className="mb-6 text-gray-600 leading-relaxed">
            Have questions or need help? Send us a message — we’ll get back to you as soon as possible.
          </p>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all placeholder-gray-400"
              />
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all placeholder-gray-400"
              />
            </div>

            <textarea
              id="message"
              rows="5"
              placeholder="Write your message here..."
              className="w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/40 focus:outline-none transition-all placeholder-gray-400 resize-none"
            ></textarea>

            <motion.button
              type="submit"
              className="btn-dark mt-2 w-full py-3 rounded-lg shadow-md hover:shadow-xl hover:bg-secondary transition-all text-white font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Details */}
        <motion.div
          className="flex-1 bg-white p-8 sm:p-10 rounded-2xl shadow-lg"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Title title1="Contact" title2="Details" title1Styles="h3" />
          <p className="text-gray-600 mb-6 leading-relaxed">
            We’re here to help — feel free to reach us anytime using the details below.
          </p>

          <div className="flex flex-col gap-5 text-gray-700">
            <div>
              <h5 className="font-semibold mb-1">Location:</h5>
              <p className="flex items-center gap-3">
                <FaLocationDot className="text-secondary text-lg" />
                NO.394/3 Kirillawala, Kadawatha 11850
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-1">Email:</h5>
              <p className="flex items-center gap-3 break-all">
                <FaEnvelope className="text-secondary text-lg" />
                thediasrestaurant@gmail.com
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-1">Phone:</h5>
              <p className="flex items-center gap-3">
                <FaPhone className="text-secondary text-lg" />
                +94 (070) 338 0624
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-1">Support:</h5>
              <p className="flex items-center gap-3">
                <FaHeadphones className="text-secondary text-lg" />
                24/7 Support Available
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Location Map */}
      <motion.div
        className="mt-20 rounded-2xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title title1="Find" title2="Us Here" title1Styles="h3" />
        <div className="w-full h-[450px] sm:h-[500px] rounded-xl overflow-hidden mt-4">
          <iframe
            className="w-full h-full border-0 rounded-xl"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.85118018397!2d79.9776108743842!3d7.026772992975024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f9dd6246d741%3A0xbcd12a4d52a7c469!2sThe%20Dias%20Restaurant!5e0!3m2!1sen!2slk!4v1742989519584!5m2!1sen!2slk"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </motion.div>

      {/* Spacer before footer */}
      <div className="mb-32"></div>

      <Footer />
    </section>
  );
};

export default Contact;