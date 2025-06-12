"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  ExternalLink,
  Play,
  DollarSign,
  ArrowRight,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface News {
  _id: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  createdAt: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  salary: string;
  lastDate: string;
  applyLink: string;
}

interface Vlog {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  youtubeUrl: string;
  createdAt: string;
}

interface EBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  coverImage: string;
  price: number;
  downloads: number;
}

const FeaturedSection = () => {
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [featuredVlogs, setFeaturedVlogs] = useState<Vlog[]>([]);
  const [featuredEBooks, setFeaturedEBooks] = useState<EBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setLoading(true);
      try {
        const [newsRes, jobsRes, vlogsRes, ebooksRes] = await Promise.all([
          axios.get("/api/news?featured=true&limit=2"),
          axios.get("/api/jobs?featured=true&limit=2"),
          axios.get("/api/vlogs?featured=true&limit=2"),
          axios.get("/api/ebooks?featured=true&limit=2"),
        ]);

        setFeaturedNews(newsRes.data.news || []);
        setFeaturedJobs(jobsRes.data.jobs || []);
        setFeaturedVlogs(vlogsRes.data.vlogs || []);
        setFeaturedEBooks(ebooksRes.data.ebooks || []);
      } catch (err) {
        setError("Failed to load featured content");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, ease: "easeOut" },
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

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <div className="h-48 bg-[#344C64]/50 rounded-t-lg" />
      <CardHeader>
        <div className="h-4 bg-[#344C64]/50 rounded w-1/4 mb-2" />
        <div className="h-6 bg-[#344C64]/50 rounded w-3/4" />
        <div className="h-4 bg-[#344C64]/50 rounded w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-10 bg-[#344C64]/50 rounded w-full" />
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#424242] mb-4">
            Featured Content
          </h2>
          <p className="text-[#424242]/80">
            Discover our handpicked selection of the best content
          </p>
        </div>

        {error && (
          <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Featured News */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#424242]">Latest News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredNews.map((article) => (
                    <Link
                      key={article._id}
                      href={`/news/${article._id}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                          <Image
                            src={article.image || "/placeholder.jpg"}
                            alt={article.title}
                            fill
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <Badge
                            className="mb-2"
                            style={{
                              backgroundColor:
                                article.category === "National"
                                  ? "#229799"
                                  : article.category === "International"
                                  ? "#48CFCB"
                                  : "#424242",
                            }}
                          >
                            {article.category}
                          </Badge>
                          <h3 className="text-sm font-medium text-[#424242] group-hover:text-[#48CFCB] transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs text-[#424242]/60 mt-1">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-4 text-[#229799] hover:text-[#48CFCB] p-0"
                  asChild
                >
                  <Link href="/news">
                    View all news <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#424242]">Featured Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredJobs.map((job) => (
                    <Link
                      key={job._id}
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[#424242] group-hover:text-[#48CFCB] transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#424242]/60">
                          <span>{job.company}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor:
                                job.category === "Full-time"
                                  ? "#229799"
                                  : job.category === "Part-time"
                                  ? "#48CFCB"
                                  : "#424242",
                            }}
                          >
                            {job.category}
                          </Badge>
                          <span className="text-xs text-[#424242]/60">
                            {new Date(job.lastDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-4 text-[#229799] hover:text-[#48CFCB] p-0"
                  asChild
                >
                  <Link href="/jobs">
                    View all jobs <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Vlogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#424242]">Popular Vlogs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredVlogs.map((vlog) => (
                    <Link
                      key={vlog._id}
                      href={vlog.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={vlog.thumbnail || "/placeholder.jpg"}
                            alt={vlog.title}
                            fill
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Youtube className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <h3 className="text-sm font-medium text-[#424242] group-hover:text-[#48CFCB] transition-colors">
                          {vlog.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor:
                                vlog.category === "Education"
                                  ? "#229799"
                                  : vlog.category === "Technology"
                                  ? "#48CFCB"
                                  : "#424242",
                            }}
                          >
                            {vlog.category}
                          </Badge>
                          <span className="text-xs text-[#424242]/60">
                            {new Date(vlog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-4 text-[#229799] hover:text-[#48CFCB] p-0"
                  asChild
                >
                  <Link href="/vlogs">
                    View all vlogs <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured E-Books */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#424242]">Top E-Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredEBooks.map((ebook) => (
                    <Link
                      key={ebook._id}
                      href={`/ebooks/${ebook._id}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-28 rounded-lg overflow-hidden">
                          <Image
                            src={ebook.coverImage || "/placeholder.jpg"}
                            alt={ebook.title}
                            fill
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <Badge
                            className="mb-2"
                            style={{
                              backgroundColor:
                                ebook.category === "Education"
                                  ? "#229799"
                                  : ebook.category === "Technology"
                                  ? "#48CFCB"
                                  : "#424242",
                            }}
                          >
                            {ebook.category}
                          </Badge>
                          <h3 className="text-sm font-medium text-[#424242] group-hover:text-[#48CFCB] transition-colors">
                            {ebook.title}
                          </h3>
                          <p className="text-sm font-medium text-[#229799] mt-1">
                            ${ebook.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-4 text-[#229799] hover:text-[#48CFCB] p-0"
                  asChild
                >
                  <Link href="/ebooks">
                    View all e-books <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
