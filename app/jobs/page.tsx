"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Search, Briefcase, MapPin, Clock, Building } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Head from "next/head";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  logo: string;
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchQuery, selectedType]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("/api/jobs", {
        params: {
          page: currentPage,
          limit: 9,
          search: searchQuery,
          type: selectedType,
        },
      });
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again later.");
      setJobs([]);
      setTotalPages(1);
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? null : type);
    setCurrentPage(1);
  };

  const renderJobs = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-white animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 py-12">
          <p className="text-xl">{error}</p>
        </div>
      );
    }

    if (!jobs || jobs.length === 0) {
      return (
        <div className="text-center text-[#424242] py-12">
          <p className="text-xl">No jobs found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-[#424242] mb-2">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center text-[#424242]/80 mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      {job.company}
                    </div>
                  </div>
                  {job.logo && (
                    <div className="relative w-12 h-12">
                      <Image
                        src={job.logo}
                        alt={`${job.company} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="bg-[#229799]/10 text-[#229799]"
                  >
                    {job.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-[#48CFCB]/10 text-[#48CFCB]"
                  >
                    {job.salary}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-[#424242]/80">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <p className="text-[#424242]/80 line-clamp-2">
                    {job.description}
                  </p>
                  <Link href={`/jobs/${job._id}`}>
                    <Button
                      variant="outline"
                      className="w-full text-[#229799] hover:text-[#48CFCB] border-[#229799] hover:border-[#48CFCB]"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Head>
        <title>Jobs | OneSoul e Corner</title>
        <meta
          name="description"
          content="Explore thousands of job opportunities across government, private, walk-in, and exam categories at OneSoul e Corner."
        />
      </Head>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[#424242] mb-4"
          >
            Find Your Dream Job
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-[#424242]/80 max-w-2xl mx-auto"
          >
            Browse through our curated list of job opportunities
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-[#424242] focus:border-[#48CFCB]"
              />
            </div>
            <Button
              type="submit"
              className="bg-[#229799] hover:bg-[#48CFCB] text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedType === type
                    ? "bg-[#229799] text-white"
                    : "text-[#424242] hover:bg-[#48CFCB] hover:text-white"
                }`}
                onClick={() => handleTypeFilter(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        {renderJobs()}

        {/* Pagination */}
        {!isLoading && jobs && jobs.length > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-[#424242] hover:text-[#48CFCB]"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-[#424242]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-[#424242] hover:text-[#48CFCB]"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
