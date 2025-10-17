import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";  // Feather check circle icon

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

const Success = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-8 relative overflow-hidden text-white">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#00221f] via-[#004d3d] to-[#00221f]"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15, delayChildren: 0.3 }}
        className="flex flex-col items-center bg-bodyColor p-10 rounded-xl shadow-lg border border-gray-800 max-w-md w-full relative"
      >
        {/* Pulsing glow behind icon */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-designColor opacity-20 blur-[60px] -z-10"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Icon with rotate and pulse */}
        <motion.div
          initial={{ rotate: 0, scale: 0.9, opacity: 0 }}
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [0.9, 1.1, 0.9],
            opacity: 1,
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="text-designColor text-7xl mb-6"
          aria-label="Success checkmark"
        >
          <FiCheckCircle />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-3 text-designColor drop-shadow-[0_0_10px_#00ffc3] text-center whitespace-nowrap"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Payment Successful!
        </motion.h2>

        <motion.p
          className="text-gray-300 mb-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Thank you for your payment. Your transaction has been completed successfully.
        </motion.p>

        <motion.p
          className="text-gray-400 text-sm mb-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          You will receive a confirmation email shortly. If you have any questions, please contact us at{" "}
          <a
            href="mailto:Chamodheranda51@gmail.com"
            className="text-designColor underline"
          >
            Chamodheranda51@gmail.com
          </a>.
        </motion.p>

        <motion.button
          onClick={() => (window.location.href = "/")}
          className="bg-designColor transition-all duration-300 text-black font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-[0_0_15px_#00ffc3] hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Go to Homepage
        </motion.button>

        {/* Sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={sparkleVariants}
            className="absolute bg-designColor rounded-full opacity-0"
            style={{
              width: 6,
              height: 6,
              top: `${10 + i * 15}%`,
              left: `${20 + (i % 2) * 50}%`,
              filter: "drop-shadow(0 0 6px #00ffc3)",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Success;