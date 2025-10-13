import React from 'react';
import { TbHomeFilled } from 'react-icons/tb';
import { FaInfoCircle, FaRegWindowClose } from "react-icons/fa";
import { Link, NavLink } from 'react-router-dom';
import { IoMdListBox } from "react-icons/io";
import { IoMailOpen } from 'react-icons/io5';
import { GiFoodTruck } from "react-icons/gi";

const Navbar = ({ containerStyles, toggleMenu, menuOpened }) => {
  const navItems = [
    { to: '/', label: 'Home', icon: <TbHomeFilled /> },
    { to: '/Product', label: 'Product', icon: <IoMdListBox /> },
    { to: '/contact', label: 'Contact', icon: <IoMailOpen /> },
    { to: '/about', label: 'About', icon: <FaInfoCircle /> },
    { to: '/orders', label: 'Orders', icon: <GiFoodTruck /> },
  ];

  const handleNavClick = () => {
    if (menuOpened) toggleMenu();
  };

  return (
    <>
      {/* Desktop + Mobile container */}
      <nav className={`relative ${containerStyles}`}>
        {/* Desktop: horizontal */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map(({ to, label }) => (
            <li key={label}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-all duration-300 ${
                    isActive
                      ? "bg-[#4169E1] text-white shadow-md"
                      : "text-gray-700 hover:bg-[#4169E1]/20 hover:text-[#4169E1]"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-between px-4 py-2">
          <Link to="/" className="text-xl font-bold text-[#4169E1]">
            B Sirisena Holdings
          </Link>
          <button onClick={toggleMenu} className="text-2xl">
            {menuOpened ? <FaRegWindowClose /> : "☰"}
          </button>
        </div>

        {/* Mobile slide-in menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
            menuOpened ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <h2 className="text-lg font-bold text-[#4169E1]">B Sirisena Holdings Pvt Ltd</h2>
            <FaRegWindowClose
              onClick={toggleMenu}
              className="text-xl cursor-pointer"
            />
          </div>
          <ul className="flex flex-col gap-4 mt-4 px-4">
            {navItems.map(({ to, label, icon }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ${
                      isActive
                        ? "bg-[#4169E1] text-white shadow-md"
                        : "text-gray-700 hover:bg-[#4169E1]/20 hover:text-[#4169E1]"
                    }`
                  }
                >
                  <span className="text-xl">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile overlay */}
        {menuOpened && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleMenu}
          ></div>
        )}
      </nav>
    </>
  );
};

export default Navbar;