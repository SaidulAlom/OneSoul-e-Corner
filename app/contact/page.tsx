"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-[#424242]/80 max-w-2xl mx-auto"
          >
            Get in touch with us for any questions or inquiries
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#424242]">
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#424242] focus:border-[#48CFCB]"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#424242] focus:border-[#48CFCB]"
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#424242] focus:border-[#48CFCB]"
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#424242] focus:border-[#48CFCB] min-h-[150px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#229799] hover:bg-[#48CFCB] text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#424242]">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "#22979920" }}
                  >
                    <Mail className="h-6 w-6 text-[#229799]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#424242]">Email</h3>
                    <p className="text-[#424242]/80">contact@onesoul.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "#48CFCB20" }}
                  >
                    <Phone className="h-6 w-6 text-[#48CFCB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#424242]">Phone</h3>
                    <p className="text-[#424242]/80">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "#22979920" }}
                  >
                    <MapPin className="h-6 w-6 text-[#229799]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#424242]">Address</h3>
                    <p className="text-[#424242]/80">
                      123 Digital Street, Tech City, TC 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "#48CFCB20" }}
                  >
                    <Clock className="h-6 w-6 text-[#48CFCB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#424242]">
                      Business Hours
                    </h3>
                    <p className="text-[#424242]/80">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-[#424242]/80">
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}