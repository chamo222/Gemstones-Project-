import React from 'react';
import delivery from "../assets/shipping-fast.svg";        // Replace with a gemstone delivery icon
import certificate from "../assets/certificate.svg";  // Replace with an authenticity or badge icon
import payment from "../assets/secure-payment.svg";   // Replace with a shield or payment icon
import gemologist from "../assets/gem-expert.svg";    // Replace with a gem expert or magnifying glass icon
import { motion } from 'framer-motion';

const Features = () => {
  const featuresData = [
    {
      icon: delivery,
      title: "Worldwide Delivery",
      desc: "We carefully ship gemstones across the globe with full insurance and tracking.",
    },
    {
      icon: certificate,
      title: "Certified Authenticity",
      desc: "Every gemstone comes with a laboratory certificate ensuring purity and origin.",
    },
    {
      icon: payment,
      title: "Secure Payments",
      desc: "Enjoy peace of mind with encrypted transactions through trusted payment gateways.",
    },
    {
      icon: gemologist,
      title: "Expert Gemologists",
      desc: "Our specialists handpick and verify each gemstone for brilliance and value.",
    },
  ];

  return (
    <section className='max-padd-container py-16 xl:py-28 !pb-12'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-12'>
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className='flex flex-col items-center gap-4 p-6 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden'
          >
            {/* Soft luxury gradient behind icon */}
            <div className='absolute w-24 h-24 bg-gradient-to-tr from-purple-500 to-amber-400 rounded-full -top-8 -left-8 opacity-20'></div>
            
            <img src={feature.icon} alt={feature.title} className='z-10 w-12 h-12' />
            
            <div className='flex flex-col items-center z-10'>
              <h5 className='h5 text-lg font-semibold text-gray-800'>{feature.title}</h5>
              <hr className='w-10 bg-purple-500 h-1 rounded-full border-none my-1' />
            </div>
            
            <p className='text-center text-gray-600 z-10'>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;