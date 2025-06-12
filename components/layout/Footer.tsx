'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const quickLinks = [
    { name: 'News', href: '/news' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Vlogs', href: '/vlogs' },
    { name: 'E-Books', href: '/ebooks' },
    { name: 'Services', href: '/services' },
  ];

  const services = [
    'Voter ID Apply/Correction',
    'Aadhaar Card Correction',
    'PAN Card Apply',
    'Typing Jobs',
    'IT Return Filing',
    'Exam Form Filling',
  ];

  return (
    <footer className="bg-[#424242] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-[#229799]"
            >
              OneSoul e Corner
            </motion.h3>
            <p className="text-gray-300">
              Your one-stop destination for news, jobs, education, e-books, and digital services.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-[#229799] transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#229799]">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#229799] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#229799]">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-gray-300 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#229799]">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#229799]" />
                <span className="text-gray-300">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#229799]" />
                <span className="text-gray-300">info@onesoule corner.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#229799]" />
                <span className="text-gray-300">Your City, State - 123456</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 OneSoul e Corner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;