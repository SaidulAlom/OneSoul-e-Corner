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
} from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().nonempty("Please select a time slot"),
  notes: z.string().optional(),
});

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

  const services = [
    {
      id: "voter-id",
      name: "Voter ID Apply/Correction",
      description: "Apply for new Voter ID or correct existing details",
      price: 50,
      icon: UserCheck,
      duration: "30 minutes",
    },
    {
      id: "aadhaar",
      name: "Aadhaar Card Correction",
      description: "Update or correct Aadhaar card information",
      price: 30,
      icon: FileText,
      duration: "20 minutes",
    },
    {
      id: "pan-card",
      name: "PAN Card Apply",
      description: "Apply for new PAN card or reprint existing",
      price: 100,
      icon: CreditCard,
      duration: "25 minutes",
    },
    {
      id: "typing-jobs",
      name: "Typing Jobs",
      description: "Professional typing services for documents",
      price: 5,
      icon: Keyboard,
      duration: "Per page",
    },
    {
      id: "it-return",
      name: "IT Return Filing",
      description: "Income tax return filing and consultation",
      price: 200,
      icon: Calculator,
      duration: "45 minutes",
    },
    {
      id: "exam-form",
      name: "Exam Form Filling",
      description: "Fill exam forms for various competitive exams",
      price: 25,
      icon: FileText,
      duration: "15 minutes",
    },
  ];

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

      const service = services.find((s) => s.id === selectedService);
      if (!service) return;

      const response = await axios.post("/api/services", {
        ...validatedData,
        service: service.name,
        amount: service.price,
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
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-[#577B8D] max-w-2xl mx-auto">
            Explore our professional digital services tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {services.map((service) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <Card
                    className={`cursor-pointer bg-[#344C64]/80 backdrop-blur-sm border border-[#577B8D] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      selectedService === service.id ? "ring-2 ring-[#57A6A1] shadow-xl" : ""
                    } group`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <service.icon className="h-8 w-8 text-[#57A6A1]" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-[#577B8D] group-hover:text-[#57A6A1] transition-colors duration-300">
                            {service.name}
                          </CardTitle>
                          <p className="text-sm text-[#577B8D]">{service.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#57A6A1]">
                          ₹{service.price}
                        </span>
                        <span className="text-sm text-[#577B8D]">{service.duration}</span>
                      </div>
                      {selectedService === service.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 flex items-center text-[#57A6A1]"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="text-sm font-medium">Selected</span>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-[#344C64]/80 backdrop-blur-sm border border-[#577B8D] rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#57A6A1]">
                  Book a Service
                </CardTitle>
                <p className="text-sm text-[#577B8D]">
                  Fill in your details to schedule an appointment
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={formFieldVariants}>
                    <Label htmlFor="name" className="text-[#577B8D]">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-1 bg-[#240750]/50 border-[#577B8D] text-[#577B8D] placeholder:text-[#577B8D]/50 focus:border-[#57A6A1] focus:ring-[#57A6A1]"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </motion.div>

                  <motion.div variants={formFieldVariants}>
                    <Label htmlFor="email" className="text-[#577B8D]">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1 bg-[#240750]/50 border-[#577B8D] text-[#577B8D] placeholder:text-[#577B8D]/50 focus:border-[#57A6A1] focus:ring-[#57A6A1]"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </motion.div>

                  <motion.div variants={formFieldVariants}>
                    <Label htmlFor="phone" className="text-[#577B8D]">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-1 bg-[#240750]/50 border-[#577B8D] text-[#577B8D] placeholder:text-[#577B8D]/50 focus:border-[#57A6A1] focus:ring-[#57A6A1]"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </motion.div>

                  <motion.div variants={formFieldVariants}>
                    <Label className="text-[#577B8D]">Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal mt-1 bg-[#240750]/50 border-[#577B8D] text-[#577B8D] hover:bg-[#57A6A1] hover:text-white ${
                            !formData.date && "text-[#577B8D]/50"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? (
                            format(formData.date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#344C64] border-[#577B8D]">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) =>
                            setFormData({ ...formData, date })
                          }
                          initialFocus
                          className="bg-[#344C64] text-[#577B8D]"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                    )}
                  </motion.div>

                  <motion.div variants={formFieldVariants}>
                    <Label htmlFor="time" className="text-[#577B8D]">
                      Preferred Time
                    </Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) =>
                        setFormData({ ...formData, time: value })
                      }
                    >
                      <SelectTrigger className="mt-1 bg-[#240750]/50 border-[#577B8D] text-[#577B8D] focus:border-[#57A6A1] focus:ring-[#57A6A1]">
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#344C64] border-[#577B8D]">
                        {timeSlots.map((slot) => (
                          <SelectItem
                            key={slot}
                            value={slot}
                            className="text-[#577B8D] hover:bg-[#57A6A1] hover:text-white"
                          >
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-500">{errors.time}</p>
                    )}
                  </motion.div>

                  <motion.div variants={formFieldVariants}>
                    <Label htmlFor="notes" className="text-[#577B8D]">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="mt-1 bg-[#240750]/50 border-[#577B8D] text-[#577B8D] placeholder:text-[#577B8D]/50 focus:border-[#57A6A1] focus:ring-[#57A6A1]"
                      placeholder="Any specific requirements or questions?"
                      rows={3}
                    />
                  </motion.div>

                  <motion.div variants={formFieldVariants}>
                    <Button
                      type="submit"
                      className="w-full bg-[#57A6A1] hover:bg-[#577B8D] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Book Now"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
