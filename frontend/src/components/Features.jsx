import React from 'react';
import shipping from "../assets/shipping-fast.svg";
import hot from "../assets/hot-food.svg";
import fresh from "../assets/fresh-food.svg";
import hat from "../assets/hat-chef.svg";
import { motion } from 'framer-motion';

const Features = () => {
  const featuresData = [
    {
      icon: shipping,
      title: "Fast Delivery",
      desc: "Get your order quickly with our reliable and efficient service",
    },
    {
      icon: hot,
      title: "Hot Foods",
      desc: "Savor freshly prepared, steaming hot meals delivered straight to you",
    },
    {
      icon: fresh,
      title: "Fresh Foods",
      desc: "We serve meals made from the freshest and finest ingredients daily",
    },
    {
      icon: hat,
      title: "Expert Chefs",
      desc: "Our skilled chefs craft every dish with passion and precision",
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
            {/* Gradient circle behind icon */}
            <div className='absolute w-24 h-24 bg-gradient-to-tr from-secondary to-primary rounded-full -top-8 -left-8 opacity-20'></div>
            <img src={feature.icon} alt={feature.title} className='z-10 w-12 h-12' />
            <div className='flex flex-col items-center z-10'>
              <h5 className='h5 text-lg font-semibold'>{feature.title}</h5>
              <hr className='w-10 bg-secondary h-1 rounded-full border-none my-1' />
            </div>
            <p className='text-center text-gray-600 z-10'>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;