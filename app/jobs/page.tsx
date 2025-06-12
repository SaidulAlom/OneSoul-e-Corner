"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  MapPin,
  ExternalLink,
  Building,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { debounce } from "lodash";
import Head from "next/head";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  salary: string;
  lastDate: string;
  applyLink: string;
  description: string;
  sector: string;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const states = [
    "All States",
    "Andhra Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Telangana",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedState !== "all" && selectedState !== "All States")
        params.append("state", selectedState);

      const res = await axios.get(`/api/jobs?${params}`);
      if (res.data.success) {
        setJobs(res.data.data || []);
        setTotalPages(res.data.pagination?.pages || 1);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, selectedCategory, selectedState, currentPage]);

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

  // Skeleton Loader
  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 bg-[#344C64]/50 rounded w-1/4 mb-2" />
        <div className="h-6 bg-[#344C64]/50 rounded w-3/4 mb-2" />
        <div className="h-4 bg-[#344C64]/50 rounded w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-[#344C64]/50 rounded mb-2" />
        <div className="h-4 bg-[#344C64]/50 rounded mb-4" />
        <div className="h-10 bg-[#344C64]/50 rounded w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#240750] to-[#344C64] py-12">
      <Head>
        <title>Jobs | OneSoul e Corner</title>
        <meta
          name="description"
          content="Explore thousands of job opportunities across government, private, walk-in, and exam categories at OneSoul e Corner."
        />
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#57A6A1] mb-4">
            Job Opportunities
          </h1>
          <p className="text-lg sm:text-xl text-[#577B8D] max-w-2xl mx-auto">
            Discover your dream job with our curated listings across India.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#344C64]/80 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-12 border border-[#577B8D]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#577B8D] h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by job title or company..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border-[#577B8D] focus:border-[#57A6A1] focus:ring-2 focus:ring-[#57A6A1] text-sm bg-[#240750]/50 text-[#577B8D] placeholder:text-[#577B8D]/50"
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="rounded-lg border-[#577B8D] focus:border-[#57A6A1] focus:ring-2 focus:ring-[#57A6A1] bg-[#240750]/50 text-[#577B8D]">
                  <SelectValue placeholder="Job Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#344C64] border-[#577B8D] rounded-lg shadow-lg">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="walkin">Walk-in</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Select
                value={selectedState}
                onValueChange={(value) => {
                  setSelectedState(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="rounded-lg border-[#577B8D] focus:border-[#57A6A1] focus:ring-2 focus:ring-[#57A6A1] bg-[#240750]/50 text-[#577B8D]">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="bg-[#344C64] border-[#577B8D] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {states.map((state) => (
                    <SelectItem
                      key={state}
                      value={state === "All States" ? "all" : state}
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-4 bg-red-100 text-red-700 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#577B8D] text-lg"
          >
            No jobs found matching your criteria.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {jobs.map((job) => (
                <motion.div key={job._id} variants={itemVariants}>
                  <Card className="hover:shadow-xl transition-shadow duration-300 group bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D]">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            className={`${
                              job.category === "government"
                                ? "bg-[#57A6A1]"
                                : job.category === "private"
                                ? "bg-[#577B8D]"
                                : "bg-[#344C64]"
                            } text-white`}
                          >
                            {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
                          </Badge>
                        </motion.div>
                        <span className="text-sm text-[#577B8D] flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(job.lastDate).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-[#57A6A1] transition-colors duration-300">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-[#577B8D] mt-2">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center text-sm text-[#577B8D] mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-[#577B8D] mt-1">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-[#57A6A1] group-hover:text-white transition-colors duration-300 border-[#577B8D] text-[#577B8D]"
                        >
                          Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-[#577B8D] text-[#577B8D] hover:bg-[#57A6A1] hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-[#577B8D]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-[#577B8D] text-[#577B8D] hover:bg-[#57A6A1] hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
