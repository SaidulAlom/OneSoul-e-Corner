"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/jobs", label: "Jobs" },
  { href: "/vlogs", label: "Vlogs" },
  { href: "/ebooks", label: "E-Books" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#424242] border-b border-[#F5F5F5] shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#229799]">OneSoul</span>
          </Link>
          <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-base text-[#F5F5F5] transition-colors hover:text-[#48CFCB] ${
                  pathname === item.href ? "text-[#48CFCB]" : ""
                } after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#48CFCB] after:transition-all after:duration-300 hover:after:w-full`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[140px] lg:w-[200px] bg-[#f7f5f5] border-[#F5F5F5] text-[#000000] placeholder-[#F5F5F5]/60 focus:border-[#48CFCB] focus:ring-2 focus:ring-[#48CFCB] rounded-md text-base"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-[#1a0606] border-[#F5F5F5] hover:bg-[#48CFCB] hover:text-[#424242] hover:border-[#48CFCB] focus:ring-2 focus:ring-[#48CFCB] rounded-md"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-[#070707] border-[#F5F5F5] hover:bg-[#48CFCB] hover:text-[#424242] hover:border-[#48CFCB] focus:ring-2 focus:ring-[#48CFCB] rounded-md md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#424242] border-t border-[#F5F5F5]"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="flex-1 bg-[#f7f5f5] border-[#F5F5F5] text-[#000000] placeholder-[#F5F5F5]/60 focus:border-[#48CFCB] focus:ring-2 focus:ring-[#48CFCB] rounded-md text-base"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#1a0606] border-[#F5F5F5] hover:bg-[#48CFCB] hover:text-[#424242] hover:border-[#48CFCB] focus:ring-2 focus:ring-[#48CFCB] rounded-md"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex flex-col gap-2 items-center">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-base text-[#F5F5F5] hover:text-[#48CFCB] ${
                      pathname === item.href ? "text-[#48CFCB]" : ""
                    } after:content-[''] after:absolute after:left-4 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#48CFCB] after:transition-all after:duration-300 hover:after:w-[calc(100%-32px)]`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
