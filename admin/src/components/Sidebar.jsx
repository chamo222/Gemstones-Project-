import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlus, FaListCheck } from "react-icons/fa6";
import { FaInfoCircle, FaLifeRing } from "react-icons/fa";
import { MdFactCheck, MdMessage } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { motion } from "framer-motion";
import logo from "../assets/logo.jpg";
import { User } from "lucide-react";

// ✅ Updated mainLinks with Users page
const mainLinks = [
  { name: "Revenue", icon: <MdFactCheck />, path: "/" },
  { name: "Add Items", icon: <FaPlus />, path: "/add" },
  { name: "List Items", icon: <FaListCheck />, path: "/list" },
  { name: "Orders", icon: <MdFactCheck />, path: "/orders" },
  { name: "Messages", icon: <MdMessage />, path: "/messages" },
  { name: "Finance", icon: <MdFactCheck />, path: "/finance" },
  { name: "Users", icon: <User />, path: "/users" }, // ✅ New Users link
];

const extraLinks = [
  { name: "About", icon: <FaInfoCircle />, path: "/about" },
  { name: "Support", icon: <FaLifeRing />, path: "/support" },
];

const Sidebar = ({ token, setToken }) => {
  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="hidden sm:flex flex-col bg-white rounded-r-2xl shadow-lg sm:w-64 min-h-screen justify-between relative"
      >
        {/* Upper Section */}
        <div className="flex flex-col items-center px-6 pt-20 pb-6">
          {/* 🟢 User Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center shadow-md overflow-hidden border-2 border-orange-400">
              <img src={logo} alt="User Logo" className="w-full h-full object-cover" />
            </div>
            <span className="mt-3 font-medium text-gray-700 text-sm">Store Admin</span>
          </div>

          {/* 🟠 Dashboard Header */}
          <div className="text-lg font-bold text-gray-800 mb-6 tracking-wide">Dashboard</div>

          {/* 🟣 Main Navigation Links */}
          <div className="flex flex-col gap-3 w-full">
            {mainLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-orange-50 hover:translate-x-1"
                  }`
                }
              >
                <motion.div whileHover={{ scale: 1.2 }} className="text-xl">
                  {link.icon}
                </motion.div>
                <span className="font-medium">{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* 🔵 Extra Links (Desktop Only) */}
          <div className="flex flex-col gap-3 w-full mt-8 border-t border-gray-200 pt-5">
            {extraLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-orange-50 hover:translate-x-1"
                  }`
                }
              >
                <motion.div whileHover={{ scale: 1.2 }} className="text-xl">
                  {link.icon}
                </motion.div>
                <span className="font-medium">{link.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Lower Section — Logout Button */}
        {token && (
          <motion.div
            className="px-6 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setToken("")}
              className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 hover:translate-x-1 transition-all duration-300 w-full"
            >
              <BiLogOut className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* ===== MOBILE NAVBAR ===== */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white shadow-t rounded-t-xl flex justify-around py-3 border-t border-gray-200 z-50">
        {mainLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-all w-16 ${
                isActive ? "text-orange-500" : "text-gray-400 hover:text-orange-400"
              }`
            }
          >
            <motion.div whileTap={{ scale: 0.9 }} className="text-2xl mb-1">
              {link.icon}
            </motion.div>
            <span className="text-xs font-medium text-center">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;