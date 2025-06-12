"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "News", href: "/news" },
    { name: "Jobs", href: "/jobs" },
    { name: "Vlogs", href: "/vlogs" },
    { name: "E-Books", href: "/ebooks" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-[#424242] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-[#229799]"
            >
              OneSoul e Corner
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-200 hover:text-[#229799] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#229799] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Search and Icons */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news, jobs, e-books..."
                className="w-48 sm:w-64 rounded-lg border border-gray-600 pl-10 pr-4 py-2 text-sm bg-[#424242] text-gray-200 placeholder-gray-400 focus:border-[#229799] focus:outline-none focus:ring-2 focus:ring-[#229799] transition-all duration-200"
              />
            </form>
            <motion.button
              className="p-2 text-gray-200 hover:text-[#229799] rounded-full hover:bg-[#424242]/80 focus:outline-none focus:ring-2 focus:ring-[#229799]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <User className="h-5 w-5" />
            </motion.button>
            <motion.button
              className="p-2 text-gray-200 hover:text-[#229799] rounded-full hover:bg-[#424242]/80 focus:outline-none focus:ring-2 focus:ring-[#229799]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <motion.button
              className="p-2 text-gray-200 hover:text-[#229799] rounded-full hover:bg-[#424242]/80 focus:outline-none focus:ring-2 focus:ring-[#229799]"
              onClick={() => setSearchQuery("")} // Clear search when opening search
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-200 hover:text-[#229799] rounded-full hover:bg-[#424242]/80 focus:outline-none focus:ring-2 focus:ring-[#229799]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation and Search */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-[#424242] border-t border-gray-700"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news, jobs, e-books..."
                    className="w-full rounded-lg border border-gray-600 pl-10 pr-4 py-2 text-sm bg-[#424242] text-gray-200 placeholder-gray-400 focus:border-[#229799] focus:outline-none focus:ring-2 focus:ring-[#229799]"
                  />
                </form>
                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-gray-200 hover:text-[#229799] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                {/* Mobile Icons */}
                <div className="flex gap-4">
                  <Link href="/profile">
                    <motion.button
                      className="p-2 text-gray-200 hover:text-[#229799] rounded-full hover:bg-[#424242]/80 focus:outline-none focus:ring-2 focus:ring-[#229799]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                    </motion.button>
                  </Link>
                  <Link href="/cart">
                    <motion.button
                      className="p-2 text-gray-200 hover:text-[#229799] rounded-full hover:bg-[#424242]/80 focus:outline-none focus:ring-2 focus:ring-[#229799]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
