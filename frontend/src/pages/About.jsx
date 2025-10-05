import React from "react";
import heroImg from "../assets/restaurant-hero.jpg"; // Replace with your hero image
import ambiance1 from "../assets/ambiance1.jpg";
import ambiance2 from "../assets/ambiance2.jpg";
import { motion } from "framer-motion";

const About = () => {
  const features = [
    {
      title: "Fresh Ingredients",
      description: "We source the finest locally grown and premium ingredients for every dish.",
    },
    {
      title: "Gourmet Cuisine",
      description: "Our menu blends tradition and modern culinary innovation to delight every palate.",
    },
    {
      title: "Luxurious Ambiance",
      description: "Elegant interiors designed to provide a relaxing and premium dining experience.",
    },
    {
      title: "Exceptional Service",
      description: "Our team ensures that every visit is seamless and memorable.",
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden h-[500px] flex items-center justify-center mb-16">
        <img
          src={heroImg}
          alt="Restaurant Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-white text-4xl sm:text-6xl font-bold text-center z-10"
        >
          Welcome to The Dias Restaurant
        </motion.h1>
      </section>

      {/* Our Story */}
      <section className="mt-16 flex flex-col lg:flex-row gap-12 items-center mb-20">
        <motion.img
          src={ambiance1}
          alt="Restaurant interior"
          className="rounded-2xl lg:w-1/2 h-[400px] object-cover shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            The Dias Restaurant was founded with a passion for exceptional food and an unwavering commitment to quality. 
            Over the years, we have become a destination for those seeking a fine dining experience that combines luxury with comfort.
          </p>
          <p className="text-gray-600 mb-4">
            From locally sourced ingredients to masterfully crafted dishes, every meal tells a story of culinary excellence. 
            Our vision is to create an unforgettable dining journey for each guest, where flavors, ambiance, and service come together in harmony.
          </p>
          <p className="text-gray-600">
            We believe dining is not just about food, it’s about creating memories. At The Dias Restaurant, every detail, from the decor to the flavors on your plate, is curated to delight the senses.
          </p>
        </motion.div>
      </section>

      {/* Features / What Makes Us Special */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What Makes Us Special</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-lg rounded-2xl text-center hover:shadow-2xl transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ambiance / Experience */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Ambiance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.img
            src={ambiance1}
            alt="Restaurant interior"
            className="rounded-2xl h-[400px] object-cover shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.img
            src={ambiance2}
            alt="Restaurant dining"
            className="rounded-2xl h-[400px] object-cover shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </section>

      {/* Optional: Testimonials / Awards Section */}
      {/* <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What Our Guests Say</h2>
        // Add a carousel or testimonial cards here
      </section> */}
    </div>
  );
};

export default About;