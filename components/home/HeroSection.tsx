"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Briefcase, Newspaper, Video } from "lucide-react";

const features = [
  {
    icon: <Newspaper className="h-6 w-6" />,
    title: "Latest News",
    description: "Stay updated with the latest news and events from around the world.",
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: "Job Opportunities",
    description: "Find your dream job with our comprehensive job listings.",
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: "Educational Vlogs",
    description: "Learn from our expert-led video content and tutorials.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "E-Books",
    description: "Access a vast collection of digital books and resources.",
  },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F5F5] to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#424242] leading-tight">
              Your Gateway to{" "}
              <span className="text-[#229799]">Knowledge</span> and{" "}
              <span className="text-[#48CFCB]">Opportunities</span>
            </h1>
            <p className="text-lg text-[#424242]/80">
              Discover a world of possibilities with OneSoul. From news and jobs to
              educational content and digital services, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#229799] hover:bg-[#48CFCB] text-white"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#424242] text-[#424242] hover:bg-[#424242] hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-[#229799] mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#424242] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#424242]/80">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#229799]/20 to-[#48CFCB]/20" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
