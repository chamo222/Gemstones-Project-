import React from "react";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <motion.div
        className="max-w-3xl w-full bg-bodyColor p-8 rounded-xl shadow-lg border border-gray-800"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-designColor mb-6 drop-shadow-[0_0_6px_#00ffc3] animate-pulse hover:animate-none transition-all duration-300 ease-in-out">
          Terms &amp; Conditions
        </h1>

        <p className="text-sm text-gray-300 mb-4">
          These Terms &amp; Conditions govern the use of chamodheranda.com, the
          personal portfolio and project payment site of Chamodh Eranda.
          Payments on this site are securely processed through PayHere on behalf
          of Chamodh’s business, LogicForge.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          1. Payment Acceptance
        </h2>
        <p className="text-gray-400 text-sm">
          We accept payments through PayHere via Visa, MasterCard, American
          Express, and Sri Lankan bank cards. Payments are typically made in LKR
          and must be completed in full before project work begins or continues.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          2. Refund Policy
        </h2>
        <p className="text-gray-400 text-sm">
          All payments are final. Refunds will be considered only in specific
          cases such as duplicate transactions, technical issues, or if
          previously discussed and agreed upon in writing with Chamodh Eranda.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          3. Project Responsibility
        </h2>
        <p className="text-gray-400 text-sm">
          Once payment is received, a mutually agreed scope of work will be
          initiated. Delays or revisions beyond the agreed scope may incur
          additional costs. The client is responsible for providing accurate
          requirements and content.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          4. Limitation of Liability
        </h2>
        <p className="text-gray-400 text-sm">
          Chamodh Eranda and LogicForge are not responsible for any damages
          resulting from misuse of the website or any third-party services
          integrated into your project. Liability is limited to the total amount
          paid for the specific service.
        </p>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          5. Contact Information
        </h2>
        <p className="text-gray-400 text-sm">
          For any questions about these terms, please contact Chamodh Eranda at{" "}
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

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          6. Agreement
        </h2>
        <p className="text-gray-400 text-sm">
          By proceeding with a payment through this site, you acknowledge that
          you have read, understood, and agreed to these terms. You also agree
          to PayHere’s{" "}
          <a
            href="https://www.payhere.lk/terms-and-conditions"
            className="text-designColor underline"
            target="_blank"
            rel="noreferrer"
          >
            Terms &amp; Conditions
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
};

export default Terms;