import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <motion.div
        className="max-w-3xl w-full bg-bodyColor p-8 rounded-xl shadow-lg border border-gray-800"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-designColor mb-6 drop-shadow-[0_0_6px_#00ffc3] animate-pulse hover:animate-none transition-all duration-300 ease-in-out">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-300 mb-4">
          At chamodheranda.com, your privacy is our priority. This website serves as the personal portfolio of Chamodh Eranda, where clients and visitors may choose to send payments for project work, freelance services, or other creative offerings. Payments are securely processed via PayHere on behalf of Chamodh Eranda's business, LogicForge. This page outlines how we handle your personal information when you engage in such payments.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          1. Data Collection
        </h2>
        <p className="text-gray-400 text-sm">
          We only collect the necessary personal data required to process your
          payment through our partner payment gateway, PayHere. This may include
          your name, email, phone number, and payment details.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          2. Data Usage
        </h2>
        <p className="text-gray-400 text-sm">
          Your information is used exclusively for payment verification,
          communication regarding your transaction, and providing customer
          support if needed. We do not sell or rent your personal data.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          3. Data Security
        </h2>
        <p className="text-gray-400 text-sm">
          All transactions are processed securely via PayHere’s encrypted
          payment infrastructure. We do not store any card information on our
          servers.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          4. Third Parties
        </h2>
        <p className="text-gray-400 text-sm">
          We only share your payment information with PayHere for the purpose of
          processing your transaction. For more, please refer to{" "}
          <a
            href="https://www.payhere.lk/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-designColor underline"
          >
            PayHere’s Privacy Policy
          </a>
          .
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          5. Contact
        </h2>
        <p className="text-gray-400 text-sm">
          If you have any questions about how your data is handled, please email{" "}
          <a
            href="mailto:Chamodheranda51@gmail.com"
            className="text-designColor underline"
          >
            Chamodheranda51@gmail.com
          </a>{" "}
          or call{" "}
          <a href="tel:+94770182402" className="text-designColor underline">
            +94 770 182 402
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;