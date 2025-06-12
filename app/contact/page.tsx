"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = formSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      // TODO: Implement your contact form submission logic here
      // const response = await axios.post("/api/contact", validatedData);

      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const contactInfo = [
    {
      title: "Email",
      value: "contact@onesoulcorner.com",
      icon: Mail,
    },
    {
      title: "Phone",
      value: "+91 1234567890",
      icon: Phone,
    },
    {
      title: "Address",
      value: "123 Digital Street, Tech City, India",
      icon: MapPin,
    },
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
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-[#577B8D] max-w-2xl mx-auto">
            Get in touch with us. We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            {contactInfo.map((info) => (
              <motion.div key={info.title} variants={itemVariants} className="mb-6">
                <Card className="bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <info.icon className="h-8 w-8 text-[#57A6A1]" />
                      <CardTitle className="text-xl font-semibold text-[#57A6A1]">{info.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#577B8D]">{info.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <Card className="bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D] rounded-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#57A6A1]">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#57A6A1]">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`bg-[#240750]/50 border-[#577B8D] text-[#577B8D] placeholder:text-[#577B8D]/50 ${errors.name ? "border-red-500" : ""}`}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#57A6A1]">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`bg-[#240750]/50 border-[#577B8D] text-[#577B8D] placeholder:text-[#577B8D]/50 ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#57A6A1]">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`bg-[#240750]/50 border-[#577B8D] text-[#577B8D] placeholder:text-[#577B8D]/50 ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#57A6A1]">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`bg-[#240750]/50 border-[#577B8D] text-[#577B8D] placeholder:text-[#577B8D]/50 ${errors.message ? "border-red-500" : ""}`}
                      rows={5}
                    />
                    {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#57A6A1] hover:bg-[#577B8D] text-white"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;