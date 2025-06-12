"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Globe, Award, Sparkles } from "lucide-react";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const values = [
    {
      title: "Community First",
      description: "We believe in the power of community and put people at the heart of everything we do.",
      icon: Users
    },
    {
      title: "Innovation",
      description: "We continuously explore new ways to enhance the digital experience for our users.",
      icon: Sparkles
    },
    {
      title: "Accessibility",
      description: "We strive to make our platform accessible to everyone, regardless of their technical background.",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#240750] to-[#344C64] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#57A6A1] mb-4">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-[#577B8D] max-w-2xl mx-auto">
            Welcome to OneSoul e Corner - Your Digital Community Hub
          </p>
        </motion.div>

        {/* Mission and Vision */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Target className="h-8 w-8 text-[#57A6A1]" />
                  <CardTitle className="text-2xl font-bold text-[#57A6A1]">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#577B8D]">
                  We are dedicated to creating a vibrant digital space where communities can connect,
                  share, and grow together. Our platform brings people closer through technology
                  while maintaining the warmth of human connection.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Award className="h-8 w-8 text-[#57A6A1]" />
                  <CardTitle className="text-2xl font-bold text-[#57A6A1]">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#577B8D]">
                  To be the leading platform that bridges the gap between digital innovation
                  and community engagement, making technology accessible and meaningful for everyone.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#57A6A1] text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <motion.div key={value.title} variants={itemVariants}>
                <Card className="bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <value.icon className="h-8 w-8 text-[#57A6A1]" />
                      <CardTitle className="text-xl font-semibold text-[#57A6A1]">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#577B8D]">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-[#57A6A1] mb-8">Join Our Community</h2>
          <p className="text-[#577B8D] mb-8 max-w-2xl mx-auto">
            Be part of something bigger. Connect with like-minded individuals, share your experiences,
            and grow together in our vibrant community.
          </p>
          <Button className="bg-[#57A6A1] hover:bg-[#577B8D] text-white px-8 py-6 text-lg font-semibold rounded-full transition-colors">
            Get Started
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 