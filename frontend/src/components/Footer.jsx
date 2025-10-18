import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa6';
import { motion } from 'framer-motion';

// Add URL for each link
const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { name: 'Rings', url: '/shop/rings' },
      { name: 'Necklaces', url: '/shop/necklaces' },
      { name: 'Bracelets', url: '/shop/bracelets' },
      { name: 'Earrings', url: '/shop/earrings' },
      { name: 'Collections', url: '/shop/collections' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', url: '/about' },
      { name: 'Our Story', url: '/story' },
      { name: 'Careers', url: '/careers' },
      { name: 'Privacy Policy', url: '/privacy' },
      { name: 'Terms', url: '/terms' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', url: '/contact' },
      { name: 'FAQ', url: '/faq' },
      { name: 'Shipping & Returns', url: '/shipping-returns' },
      { name: 'Warranty', url: '/warranty' },
    ],
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
  { icon: <FaFacebook />, link: 'https://www.facebook.com/yourpage' },
  { icon: <FaInstagram />, link: 'https://www.instagram.com/logicforge.lk/' },
  { icon: <FaTwitter />, link: 'https://twitter.com/yourpage' },
  { icon: <FaYoutube />, link: 'https://youtube.com/yourchannel' },
  { icon: <FaLinkedin />, link: 'https://linkedin.com/company/yourcompany' },
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
                    to={link.url}
                    className="text-sm hover:text-[#4169E1] transition-colors"
                  >
                    {link.name}
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

      {/* Social icons */}
      <div className="flex justify-center md:absolute md:bottom-4 md:left-6 gap-4 md:gap-3 mt-4 md:mt-0">
        {SOCIALS.map((s, i) => (
          <a
            key={i}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
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