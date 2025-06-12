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
  Loader2,
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
    <section className="py-20 bg-gradient-to-b from-[#240750] to-[#344C64]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#57A6A1]">
            Featured Content
          </h2>
          <p className="text-lg text-[#577B8D] mt-4 max-w-2xl mx-auto">
            Discover our latest and most popular news, jobs, vlogs, and e-books
            curated for you.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-4 bg-red-100 text-red-700 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        {/* Featured News */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#57A6A1] mb-6">Latest News</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnimatePresence>
                {featuredNews.map((article) => (
                  <motion.div key={article._id} variants={itemVariants}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D]">
                      <div className="relative h-48">
                        <Image
                          src={article.image || "/placeholder.jpg"}
                          alt={article.title}
                          fill
                          className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              className={`${
                                article.category === "National"
                                  ? "bg-[#57A6A1]"
                                  : article.category === "International"
                                  ? "bg-[#577B8D]"
                                  : "bg-[#344C64]"
                              } text-white`}
                            >
                              {article.category}
                            </Badge>
                          </motion.div>
                          <span className="text-sm text-[#577B8D] flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-[#57A6A1] transition-colors duration-300">
                          {article.title}
                        </CardTitle>
                        <p className="text-sm text-[#577B8D] line-clamp-3">
                          {article.summary}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/news/${article._id}`}>
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-[#57A6A1] group-hover:text-white transition-colors duration-300 border-[#577B8D] text-[#577B8D]"
                          >
                            Read More <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Featured Jobs */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#57A6A1] mb-6">Latest Jobs</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnimatePresence>
                {featuredJobs.map((job) => (
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
                                job.category === "Full-time"
                                  ? "bg-[#57A6A1]"
                                  : job.category === "Part-time"
                                  ? "bg-[#577B8D]"
                                  : "bg-[#344C64]"
                              } text-white`}
                            >
                              {job.category}
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
        </div>

        {/* Featured Vlogs */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#57A6A1] mb-6">Latest Vlogs</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnimatePresence>
                {featuredVlogs.map((vlog) => (
                  <motion.div key={vlog._id} variants={itemVariants}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D]">
                      <div className="relative h-48">
                        <Image
                          src={vlog.thumbnail || "/placeholder.jpg"}
                          alt={vlog.title}
                          fill
                          className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              className={`${
                                vlog.category === "Education"
                                  ? "bg-[#57A6A1]"
                                  : vlog.category === "Technology"
                                  ? "bg-[#577B8D]"
                                  : "bg-[#344C64]"
                              } text-white`}
                            >
                              {vlog.category}
                            </Badge>
                          </motion.div>
                          <span className="text-sm text-[#577B8D] flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(vlog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-[#57A6A1] transition-colors duration-300">
                          {vlog.title}
                        </CardTitle>
                        <p className="text-sm text-[#577B8D] line-clamp-3">
                          {vlog.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Link href={vlog.youtubeUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-[#57A6A1] group-hover:text-white transition-colors duration-300 border-[#577B8D] text-[#577B8D]"
                          >
                            Watch Now <Play className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Featured E-Books */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#57A6A1] mb-6">Latest E-Books</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnimatePresence>
                {featuredEBooks.map((ebook) => (
                  <motion.div key={ebook._id} variants={itemVariants}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D]">
                      <div className="relative h-48">
                        <Image
                          src={ebook.coverImage || "/placeholder.jpg"}
                          alt={ebook.title}
                          fill
                          className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              className={`${
                                ebook.category === "Education"
                                  ? "bg-[#57A6A1]"
                                  : ebook.category === "Technology"
                                  ? "bg-[#577B8D]"
                                  : "bg-[#344C64]"
                              } text-white`}
                            >
                              {ebook.category}
                            </Badge>
                          </motion.div>
                          <span className="text-sm text-[#577B8D] flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {ebook.price}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-[#57A6A1] transition-colors duration-300">
                          {ebook.title}
                        </CardTitle>
                        <p className="text-sm text-[#577B8D]">
                          By {ebook.author}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/ebooks/${ebook._id}`}>
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-[#57A6A1] group-hover:text-white transition-colors duration-300 border-[#577B8D] text-[#577B8D]"
                          >
                            Download Now <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
