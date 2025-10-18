import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import LogoLogicForge from "../assets/LogoLogicForge.jpg";
import { BiLogOut } from "react-icons/bi";
import { FaLifeRing, FaInfoCircle, FaComment, FaThumbsUp } from "react-icons/fa";
import axios from "axios";

const Header = ({ setToken }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleAvatarClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setToken(""); // clear token on logout
    setDropdownOpen(false);
  };

  // Fetch unread messages count
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/contact/unread-count");
      setUnreadCount(res.data.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread messages count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount(); // initial fetch
    const interval = setInterval(fetchUnreadCount, 5000); // poll every 5 seconds
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <header className="w-full bg-[#1E1E2F] text-white shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-2 h-16">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-white rounded-lg p-1.5">
            <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
          </div>
          <span className="text-lg sm:text-xl font-semibold tracking-wide">
            B Sirisena Admin Panel
          </span>
        </Link>

        {/* Right Side - Admin Info */}
        <div className="flex items-center gap-6 relative">
          {/* Notification Icon */}
          <Link to="/messages" className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover:text-gray-300 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405M19 13V8a7 7 0 10-14 0v5l-1.405 1.595A1 1 0 005 18h14a1 1 0 00.405-1.595L19 13z"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Admin Avatar */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
              onClick={handleAvatarClick}
            >
              {/* Logo inside circle */}
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-gray-100">
                <img src={LogoLogicForge} alt="Admin Logo" className="h-full w-full object-contain" />
              </div>
              <span className="hidden sm:inline-block text-sm font-medium">
                Admin
              </span>
            </div>

            {/* Dropdown for Mobile */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg border border-gray-200 z-50 sm:hidden">
                <div className="flex justify-center py-2 border-b border-gray-200">
                  <img src={LogoLogicForge} alt="logo" className="h-10 w-10 object-contain rounded-full" />
                </div>
                <ul className="flex flex-col">
                  <li>
                    <Link
                      to="/admin/reviews"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaThumbsUp />
                      Reviews
                    </Link>
                    <Link
                      to="/about"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaInfoCircle />
                      About
                    </Link>
                    <Link
                      to="/support"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaLifeRing />
                      Support
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition text-red-500"
                    >
                      <BiLogOut />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;