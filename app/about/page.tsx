"use client";

import { motion } from "framer-motion";
import { Users, Target, Award, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const values = [
  {
    title: "Our Mission",
    description: "To provide a comprehensive platform that empowers individuals through knowledge sharing, entertainment, and professional growth.",
    icon: Target,
    color: "#229799",
  },
  {
    title: "Our Vision",
    description: "To become the leading multi-purpose platform that connects, educates, and inspires people worldwide.",
    icon: Award,
    color: "#48CFCB",
  },
  {
    title: "Our Team",
    description: "A dedicated group of professionals committed to delivering excellence in every aspect of our services.",
    icon: Users,
    color: "#229799",
  },
  {
    title: "Our Values",
    description: "Integrity, innovation, and inclusivity guide everything we do.",
    icon: Heart,
    color: "#48CFCB",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[#424242] mb-4"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-[#424242]/80 max-w-2xl mx-auto"
          >
            Learn more about our mission, vision, and the team behind OneSoul eCorner
          </motion.p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${value.color}20` }}
                    >
                      <value.icon
                        className="h-6 w-6"
                        style={{ color: value.color }}
                      />
                    </div>
                    <CardTitle className="text-xl font-semibold text-[#424242]">
                      {value.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#424242]/80">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg p-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-[#424242] mb-4">Our Story</h2>
            <p className="text-[#424242]/80 mb-4">
              OneSoul eCorner was founded with a vision to create a comprehensive
              platform that combines news, entertainment, and professional
              development. We believe in the power of knowledge sharing and
              community building.
            </p>
            <p className="text-[#424242]/80">
              Today, we continue to grow and evolve, always staying true to our
              mission of empowering individuals through our diverse range of
              services.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-[#424242] mb-4">
            Join Our Community
          </h2>
          <p className="text-[#424242]/80 mb-6">
            Be part of our growing community and experience the best of news,
            entertainment, and professional development.
          </p>
          <Link href="/contact">
            <Button className="bg-[#229799] hover:bg-[#48CFCB] text-white">
              Get in Touch
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 