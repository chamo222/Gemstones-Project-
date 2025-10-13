import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Collections'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Our Story', 'Careers', 'Privacy Policy', 'Terms'],
  },
  {
    title: 'Support',
    links: ['Contact Us', 'FAQ', 'Shipping & Returns', 'Warranty'],
  },
];

const FOOTER_CONTACT_INFO = {
  title: 'Contact',
  links: [
    { label: 'Address', value: '123 Gemstone Avenue, Crystal City' },
    { label: 'Phone', value: '+94 74 194 1535' },
    { label: 'Email', value: 'info@bsirisenaholdings.lk' },
  ],
};

const SOCIALS = [
  { icon: <FaFacebook />, link: 'https://www.instagram.com/logicforge.lk/' },
  { icon: <FaInstagram />, link: 'https://www.instagram.com/logicforge.lk/' },
  { icon: <FaTwitter />, link: 'https://www.instagram.com/logicforge.lk/' },
  { icon: <FaYoutube />, link: 'https://www.instagram.com/logicforge.lk/' },
  { icon: <FaLinkedin />, link: 'https://www.instagram.com/logicforge.lk/' },
];

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white shadow-md relative rounded-t-2xl text-gray-600"
    >
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row justify-between gap-8">
        {/* Logo */}
        <div className="flex flex-col gap-2 md:w-1/4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-10 w-10 object-cover rounded-full" />
            <span className="font-semibold text-[#4169E1] text-lg">B Sirisena Holdings</span>
          </Link>
          <p className="text-sm">
            Exquisite gemstones and jewelry, handcrafted with precision and care.
          </p>
        </div>

        {/* Footer Columns */}
        <div className="flex-1 flex flex-wrap justify-between gap-6">
          {FOOTER_LINKS.map((col) => (
            <FooterColumn key={col.title} title={col.title}>
              <ul className="flex flex-col gap-2">
                {col.links.map((link, i) => (
                  <Link
                    key={i}
                    to="#"
                    className="text-sm hover:text-[#4169E1] transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </ul>
            </FooterColumn>
          ))}

          <FooterColumn title={FOOTER_CONTACT_INFO.title}>
            <ul className="flex flex-col gap-2 text-sm">
              {FOOTER_CONTACT_INFO.links.map((link, i) => (
                <li key={i}>
                  <span className="font-medium">{link.label}:</span> {link.value}
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>
      </div>

      {/* Social icons - Adjust for mobile */}
      <div className="flex justify-center md:absolute md:bottom-4 md:left-6 gap-4 md:gap-3 mt-4 md:mt-0">
        {SOCIALS.map((s, i) => (
          <a
            key={i}
            href={s.link}
            className="text-[#4169E1] text-xl md:text-lg hover:text-[#5a7dfa] transition-transform duration-300 hover:scale-110"
          >
            {s.icon}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 text-center py-3 md:py-4 text-sm text-gray-500 mt-6 md:mt-8">
        &copy; {new Date().getFullYear()} B Sirisena Holdings Pvt Ltd. All rights reserved.
      </div>
    </motion.footer>
  );
};

const FooterColumn = ({ title, children }) => (
  <div className="flex flex-col gap-2 min-w-[120px]">
    <h4 className="text-md font-semibold text-[#4169E1]">{title}</h4>
    {children}
  </div>
);

export default Footer;