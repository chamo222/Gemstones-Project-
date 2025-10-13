import React, { useState, useEffect } from "react";
import heroImg from "../assets/gem-hero.jpg"; 
import gemDisplay2 from "../assets/gem-display2.jpg";
import gemDisplay3 from "../assets/gem-display3.jpg";
import gemDisplay4 from "../assets/gem-display4.jpg";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { GiCutDiamond } from "react-icons/gi"; // Matching Orders page diamond

// 💎 Orders-style LoadingDiamond component
const LoadingDiamond = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-b from-[#faf7f2] to-white">
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
      Curating the story…
    </motion.p>
  </div>
);

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Ethically Sourced Gems",
      description:
        "Every gemstone is responsibly mined and carefully selected to ensure authenticity, purity, and ethical sourcing.",
    },
    {
      title: "Master Craftsmanship",
      description:
        "Our expert gem cutters shape each stone to perfection, revealing the inner brilliance and unique beauty of nature’s art.",
    },
    {
      title: "Unparalleled Quality",
      description:
        "Each gem is thoroughly inspected and certified for its clarity, color, and natural origin — ensuring exceptional quality and value.",
    },
    {
      title: "Rare Collections",
      description:
        "We curate exclusive collections of rare gemstones, allowing you to own a true piece of the earth’s hidden wonders.",
    },
  ];

  if (loading) {
    return <LoadingDiamond />;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12 bg-gradient-to-b from-[#faf7f2] to-white">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden h-[600px] flex items-center justify-center mb-20 shadow-xl">
        <img
          src={heroImg}
          alt="Gem Store Hero"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 text-center px-4 pt-24"
        >
          <h1 className="text-white text-4xl sm:text-6xl font-bold mb-4 tracking-wide font-serif">
            Discover the Brilliance of Gemstones
          </h1>
          <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto font-light">
            Celebrating the beauty, rarity, and timeless charm of natural gemstones from around the world.
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="flex flex-col lg:flex-row gap-16 items-center mb-28">
        <motion.img
          src={gemDisplay2}
          alt="Gem Collection Display"
          className="rounded-3xl lg:w-1/2 h-[420px] object-cover shadow-2xl"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-serif border-l-4 border-yellow-600 pl-3">
            Our Story
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed text-lg">
            Born from a deep admiration for nature’s rarest wonders, this gemstone collection was created to bring
            the world’s most captivating gems closer to those who appreciate natural beauty and authenticity.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed text-lg">
            From sparkling sapphires to radiant rubies and luminous emeralds, each stone tells a story of time,
            transformation, and the earth’s artistry. Our mission is to preserve that natural essence and share it with the world.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Every gem is more than a stone — it’s a symbol of rarity, passion, and timeless elegance, crafted by nature itself.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mb-28 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-14 font-serif">
          What Makes Us Shine
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white border border-yellow-100 rounded-3xl shadow-md hover:shadow-xl transition-all hover:-translate-y-2"
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.7 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-yellow-700 font-serif">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-14 font-serif">
          The Gemstone Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.img
            src={gemDisplay3}
            alt="Gem Showcase"
            className="rounded-3xl h-[420px] object-cover shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.img
            src={gemDisplay4}
            alt="Gemstone Collection"
            className="rounded-3xl h-[420px] object-cover shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
        <p className="text-center text-gray-700 mt-10 text-lg max-w-3xl mx-auto leading-relaxed">
          Immerse yourself in the world of gemstones — a journey through color, clarity, and natural brilliance.
          Each gem represents the harmony between earth and artistry, inviting you to experience nature’s finest treasures.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default About;