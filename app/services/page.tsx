"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import {
  FileText,
  CreditCard,
  UserCheck,
  Calculator,
  Keyboard,
  CalendarIcon,
  Phone,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Book,
  Briefcase,
  Video,
  Newspaper,
} from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { z } from "zod";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().nonempty("Please select a time slot"),
  notes: z.string().optional(),
});

const services = [
  {
    title: "News Portal",
    description: "Stay updated with the latest news and events from around the world. Our comprehensive news coverage includes national, regional, and international stories.",
    icon: Newspaper,
    href: "/news",
    color: "#229799",
  },
  {
    title: "Job Portal",
    description: "Find your dream job with our extensive job listings. We connect job seekers with top employers across various industries and locations.",
    icon: Briefcase,
    href: "/jobs",
    color: "#48CFCB",
  },
  {
    title: "Vlog Platform",
    description: "Watch engaging video content from our talented creators. From educational content to entertainment, we have something for everyone.",
    icon: Video,
    href: "/vlogs",
    color: "#229799",
  },
  {
    title: "E-Book Library",
    description: "Access our vast collection of digital books. Whether you're looking for fiction, non-fiction, or educational content, we've got you covered.",
    icon: Book,
    href: "/ebooks",
    color: "#48CFCB",
  },
];

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }

    try {
      const validatedData = formSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      const service = services.find((s) => s.title === selectedService);
      if (!service) return;

      const response = await axios.post("/api/services", {
        ...validatedData,
        service: service.title,
        amount: 0, // Assuming the price is not available in the services array
      });

      if (response.data.success) {
        toast.success("Service request submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: undefined,
          time: "",
          notes: "",
        });
        setSelectedService("");
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Error submitting service request:", error);
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

  const formFieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
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
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-[#424242]/80 max-w-2xl mx-auto"
          >
            Discover our comprehensive range of services designed to meet your needs
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: service.color }}
                    >
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#424242] text-[#424242] hover:bg-[#229799] hover:text-white hover:border-[#229799]"
                      asChild
                    >
                      <Link href={service.href}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <CardTitle className="text-2xl font-semibold text-[#424242] mb-2">
                    {service.title}
                  </CardTitle>
                  <p className="text-[#424242]/80">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-1 w-full bg-[#424242]/10 rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{ width: "100%", backgroundColor: service.color }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-[#424242] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-[#424242]/80 mb-8 max-w-2xl mx-auto">
            Explore our services and find the perfect solution for your needs. Our team is here to help you every step of the way.
          </p>
          <Button
            className="bg-[#229799] hover:bg-[#48CFCB] text-white"
            asChild
          >
            <Link href="/contact">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;
