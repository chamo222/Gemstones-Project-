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
    { to: '/menu', label: 'Menu', icon: <IoMdListBox /> },
    { to: '/contact', label: 'Contact', icon: <IoMailOpen /> },
    { to: '/about', label: 'About', icon: <FaInfoCircle /> },
    { to: '/orders', label: 'OrderTracking', icon: <GiFoodTruck /> },
  ];

  // handle closing the menu automatically when a link is clicked
  const handleNavClick = () => {
    if (menuOpened) toggleMenu();
  };

  return (
    <nav className={containerStyles}>
      {/* Close button & logo for mobile menu */}
      {menuOpened && (
        <>
          <FaRegWindowClose
            onClick={toggleMenu}
            className="text-xl self-end cursor-pointer relative left-8 md:hidden"
          />
          <Link to="/" className="bold-24 mb-6 md:hidden" onClick={handleNavClick}>
            <h4 className="text-secondary">The Dias Restaurant</h4>
          </Link>
        </>
      )}

      {/* Nav Items */}
      {navItems.map(({ to, label, icon }) => (
        <div key={label} className="inline-flex mb-2">
          <NavLink
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "active-link flex items-center gap-x-2 md:gap-x-0"
                : "flex items-center gap-x-2 md:gap-x-0"
            }
          >
            {/* Mobile: show icon */}
            <span className="text-xl md:hidden">{icon}</span>
            {/* Desktop: hide icon, show only text */}
            <h5 className="medium-16">{label}</h5>
          </NavLink>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;