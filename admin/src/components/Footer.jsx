import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 py-6 border-t text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} Admin Panel — All rights reserved
    </footer>
  );
};

export default Footer;