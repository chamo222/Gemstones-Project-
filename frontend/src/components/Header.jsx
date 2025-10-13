import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import Navbar from './Navbar';
import { CgMenuLeft } from "react-icons/cg";
import { TbUserCircle, TbArrowNarrowRight } from 'react-icons/tb';
import { RiUserLine, RiShoppingBag4Line } from "react-icons/ri";
import { ShopContext } from '../context/ShopContext';

const Header = () => {
  const { token, setToken, navigate, getCartCount } = useContext(ShopContext);
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenu = () => setMenuOpened(prev => !prev);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-sm">
      <div className="max-padd-container flexBetween py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-1">
          <img src={logo} alt="Logo" className="h-10 w-10 object-cover rounded-full" />
          <span className="text-[#4169E1] font-semibold text-lg hidden sm:inline">B Sirisena Holdings Pvt Ltd</span>
        </Link>

        {/* Navbar */}
        <div className="flex-1">
          <Navbar
            menuOpened={menuOpened}
            toggleMenu={toggleMenu}
            containerStyles={`${menuOpened ? "flex flex-col gap-y-8 h-screen w-64 fixed left-0 top-0 bg-white z-50 px-6 pt-6 shadow-lg md:hidden" : "hidden xl:flex gap-x-6 md:gap-x-8"}`}
          />
        </div>

        {/* Right side: menu toggle, cart, user */}
        <div className="flex items-center justify-end gap-3 sm:gap-x-6">
          {/* Mobile menu toggle */}
          {!menuOpened && (
            <CgMenuLeft
              onClick={toggleMenu}
              className="text-2xl xl:hidden cursor-pointer hover:text-[#4169E1] transition-colors"
            />
          )}

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center">
            <RiShoppingBag4Line className="text-2xl hover:text-[#4169E1] transition-colors" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 flexCenter rounded-full bg-[#4169E1] text-white text-[10px]">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* User */}
          <div className="group relative">
            <div onClick={() => !token && navigate('/login')} className="cursor-pointer">
              {token ? (
                <TbUserCircle className="text-[28px] hover:text-[#4169E1] transition-colors" />
              ) : (
                <button className="btn-outline flexCenter gap-2 px-3 py-1 text-sm border rounded hover:bg-[#4169E1]/10 transition">
                  Login <RiUserLine className="text-xl" />
                </button>
              )}
            </div>

            {/* User dropdown */}
            {token && (
              <ul className="hidden group-hover:flex flex-col absolute right-0 top-10 bg-white shadow-md w-32 rounded ring-1 ring-slate-900/15 p-2">
                <li
                  onClick={() => navigate('/orders')}
                  className="flexBetween cursor-pointer px-2 py-1 rounded hover:bg-[#4169E1]/10"
                >
                  <p>Orders</p>
                  <TbArrowNarrowRight className="opacity-50 text-[18px]" />
                </li>
                <hr className="my-1 border-gray-200" />
                <li
                  onClick={logout}
                  className="flexBetween cursor-pointer px-2 py-1 rounded hover:bg-[#4169E1]/10"
                >
                  <p>Logout</p>
                  <TbArrowNarrowRight className="opacity-50 text-[18px]" />
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpened && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;