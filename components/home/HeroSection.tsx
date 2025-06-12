"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Newspaper,
  Briefcase,
  Video,
  BookOpen,
  Settings,
} from "lucide-react";

const HeroSection = () => {
  const features = [
    {
      icon: Newspaper,
      title: "Latest News",
      description: "Stay updated with current affairs",
      href: "/news",
    },
    {
      icon: Briefcase,
      title: "Job Opportunities",
      description: "Find your dream job",
      href: "/jobs",
    },
    {
      icon: Video,
      title: "Educational Vlogs",
      description: "Learn from experts",
      href: "/vlogs",
    },
    {
      icon: BookOpen,
      title: "E-Books",
      description: "Digital learning resources",
      href: "/ebooks",
    },
    {
      icon: Settings,
      title: "Digital Services",
      description: "Government & private services",
      href: "/services",
    },
  ];

  // Background animation variants
  const bgVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  // CTA button animation loop
  const ctaVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 2,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-[#240750] via-[#344C64] to-[#577B8D] text-white py-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <motion.div
        className="absolute inset-0 bg-[url('/bg-pattern.png')] bg-cover opacity-10"
        variants={bgVariants}
        initial="initial"
        animate="animate"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#240750]/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
          >
            Discover{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#57A6A1] to-[#577B8D]">
              OneSoul e Corner
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl lg:text-2xl mb-10 text-[#57A6A1] leading-relaxed"
          >
            Your ultimate hub for news, jobs, vlogs, e-books, and digital services
            tailored for you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/news">
              <motion.button
                variants={ctaVariants}
                animate="animate"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#57A6A1] text-white font-semibold text-sm sm:text-base hover:bg-[#577B8D] focus:outline-none focus:ring-2 focus:ring-[#57A6A1] transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore News <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
            <Link href="/jobs">
              <motion.button
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-[#57A6A1] text-[#57A6A1] font-semibold text-sm sm:text-base hover:bg-[#57A6A1] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#57A6A1] transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find Jobs <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          {features.map((feature, index) => (
            <Link href={feature.href} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + index * 0.1,
                  ease: "easeOut",
                }}
                className="relative bg-[#344C64]/80 backdrop-blur-md rounded-xl p-6 border border-[#577B8D] hover:bg-[#344C64] hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <feature.icon className="h-10 w-10 mx-auto mb-4 text-[#57A6A1] group-hover:text-[#577B8D] transition-colors duration-300" />
                <h3 className="text-base sm:text-lg font-semibold text-[#57A6A1] text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#577B8D] text-center">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#57A6A1] group-hover:w-full transition-all duration-300" />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
