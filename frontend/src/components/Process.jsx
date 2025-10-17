import React from "react";
import { GiCheckMark } from "react-icons/gi";
import process1 from "../assets/process1.jpg";
import process2 from "../assets/process2.jpg";
import { motion } from "framer-motion";

const Process = () => {
  return (
    <section className="max-padd-container py-16 xl:py-24 bg-gradient-to-b from-white to-blue-50/30">
      {/* Container */}
      <div className="flex flex-col gap-20 xl:flex-row items-center">
        {/* Left side - Text content */}
        <motion.div
          className="flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="h3 max-w-[480px] text-gray-800">
            Discover & Own Your Perfect Gemstone in Four Simple Steps
          </h4>
          <p className="text-gray-600 mt-4 max-w-[500px] leading-relaxed">
            At <span className="text-[#4169E1] font-semibold">B. Sirisena Holdings Pvt Ltd</span>,
            we make your gemstone journey effortless — from selection to delivery.
            Every piece is authenticated, ethically sourced, and crafted with precision.
          </p>

          <div className="my-8 flex flex-col gap-4">
            <div className="flexStart gap-x-4">
              <span className="bg-[#4169E1] text-white h-6 w-6 p-1.5 flexCenter rounded-full shadow-sm">
                <GiCheckMark />
              </span>
              <p className="text-gray-700">
                <span className="font-semibold">Explore:</span> Browse our exclusive
                collection of certified gemstones and fine jewelry.
              </p>
            </div>

            <div className="flexStart gap-x-4">
              <span className="bg-[#4169E1] text-white h-6 w-6 p-1.5 flexCenter rounded-full shadow-sm">
                <GiCheckMark />
              </span>
              <p className="text-gray-700">
                <span className="font-semibold">Select:</span> Choose the perfect gem
                based on cut, clarity, and color preferences.
              </p>
            </div>

            <div className="flexStart gap-x-4">
              <span className="bg-[#4169E1] text-white h-6 w-6 p-1.5 flexCenter rounded-full shadow-sm">
                <GiCheckMark />
              </span>
              <p className="text-gray-700">
                <span className="font-semibold">Secure Payment:</span> Complete your
                purchase through our trusted and encrypted payment gateway.
              </p>
            </div>

            <div className="flexStart gap-x-4">
              <span className="bg-[#4169E1] text-white h-6 w-6 p-1.5 flexCenter rounded-full shadow-sm">
                <GiCheckMark />
              </span>
              <p className="text-gray-700">
                <span className="font-semibold">Delivery:</span> Receive your gemstone
                safely packaged with certification and lifetime authenticity guarantee.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right side - Images */}
        <motion.div
          className="flex-1 flex gap-6 xl:gap-12 justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <img
              src={process1}
              alt="Gemstone inspection"
              className="rounded-2xl shadow-md w-[280px] xl:w-[320px] object-cover"
            />
          </div>
          <div className="relative top-8">
            <img
              src={process2}
              alt="Gem cutting and polishing"
              className="rounded-2xl shadow-md w-[280px] xl:w-[320px] object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;