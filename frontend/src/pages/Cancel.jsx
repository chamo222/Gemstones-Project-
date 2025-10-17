import React from "react";
import { motion } from "framer-motion";
import { MdCancel } from "react-icons/md";

const sparkleVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i) => ({
    opacity: [0, 1, 0],
    scale: [0.5, 1.2, 0.5],
    transition: {
      delay: i * 0.5,
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

const Cancel = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-8 relative overflow-hidden text-white">
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#220000] via-[#400808] to-[#220000]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15, delayChildren: 0.3 }}
        className="flex flex-col items-center bg-bodyColor p-10 rounded-xl shadow-lg border border-gray-800 max-w-md w-full relative"
      >
        <motion.div
          className="absolute inset-0 rounded-xl bg-red-500 opacity-10 blur-[60px] -z-10"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 rounded-full bg-red-600 opacity-30 blur-[50px]" />
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-red-500 text-7xl relative z-10"
            aria-label="Cancel icon"
          >
            <MdCancel />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-3 text-red-500 drop-shadow-[0_0_10px_#ff4d4d] text-center whitespace-nowrap"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Payment Cancelled
        </motion.h2>

        <motion.p
          className="text-gray-300 mb-4 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your payment was not completed or was cancelled by you. This might happen due to a session timeout, browser interruption, or an intentional cancellation.
        </motion.p>

        <motion.p
          className="text-gray-400 text-sm mb-4 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          If you believe this was a mistake or wish to complete your payment again, you can return to the homepage and retry. If you need assistance, feel free to reach out at{" "}
          <a href="mailto:Chamodheranda51@gmail.com" className="text-red-400 underline">
            Chamodheranda51@gmail.com
          </a>
          .
        </motion.p>

        <motion.button
          onClick={() => (window.location.href = "/")}
          className="bg-red-500 transition-all duration-300 text-black font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-[0_0_15px_#ff4d4d] hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Return to Homepage
        </motion.button>

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={sparkleVariants}
            initial="hidden"
            animate="visible"
            className="absolute bg-red-500 rounded-full opacity-0"
            style={{
              width: 6,
              height: 6,
              top: `${10 + i * 15}%`,
              left: `${20 + (i % 2) * 50}%`,
              filter: "drop-shadow(0 0 6px #ff4d4d)",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Cancel;