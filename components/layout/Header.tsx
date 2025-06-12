"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-[#F5F5F5]">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#229799]">OneSoul</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#48CFCB] ${
                  pathname === item.href ? 'text-[#229799]' : 'text-[#424242]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] bg-[#F5F5F5] border-[#424242] focus:border-[#48CFCB]"
            />
            <Button variant="outline" size="sm" className="text-[#424242] hover:text-[#48CFCB]">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-[#424242] hover:text-[#48CFCB]"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-[#F5F5F5] border-t"
        >
          <div className="container py-4 space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search..."
                className="flex-1 bg-[#F5F5F5] border-[#424242] focus:border-[#48CFCB]"
              />
              <Button variant="outline" size="sm" className="text-[#424242] hover:text-[#48CFCB]">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:text-[#48CFCB] ${
                    pathname === item.href ? 'text-[#229799]' : 'text-[#424242]'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
