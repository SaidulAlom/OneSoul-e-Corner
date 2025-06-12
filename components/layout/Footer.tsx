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
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-[#48CFCB]">
              OneSoul
            </Link>
            <p className="text-gray-300">
              Empowering communities through knowledge, opportunities, and connections.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#48CFCB] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/news" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/vlogs" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                  Vlogs
                </Link>
              </li>
              <li>
                <Link href="/ebooks" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                  E-Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-[#48CFCB] mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/education" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/services/career" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                  Career Guidance
                </Link>
              </li>
              <li>
                <Link href="/services/consulting" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="/services/training" className="text-gray-300 hover:text-[#48CFCB] transition-colors">
                  Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-[#48CFCB] mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">
                <span className="font-medium text-[#48CFCB]">Email:</span> info@onesoul.com
              </li>
              <li className="text-gray-300">
                <span className="font-medium text-[#48CFCB]">Phone:</span> +1 234 567 890
              </li>
              <li className="text-gray-300">
                <span className="font-medium text-[#48CFCB]">Address:</span> 123 Main Street, City, Country
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} OneSoul. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;