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
import { Calendar, Search, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { debounce } from "lodash";

interface News {
  _id: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  createdAt: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all") params.append("category", selectedCategory);

      const res = await axios.get(`/api/news?${params}`);
      if (res.data.success) {
        setNews(res.data.data || []);
        setTotalPages(res.data.pagination?.pages || 1);
      } else {
        setError("Failed to fetch news");
      }
    } catch (err) {
      setError("Failed to fetch news");
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
    fetchNews();
  }, [searchQuery, selectedCategory, currentPage]);

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
      <div className="h-48 bg-[#344C64]/50 rounded-t-lg" />
      <CardHeader>
        <div className="h-4 bg-[#344C64]/50 rounded w-1/4 mb-2" />
        <div className="h-6 bg-[#344C64]/50 rounded w-3/4 mb-2" />
        <div className="h-4 bg-[#344C64]/50 rounded w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="h-10 bg-[#344C64]/50 rounded w-full" />
      </CardContent>
    </Card>
  );

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
            Latest News
          </h1>
          <p className="text-lg sm:text-xl text-[#577B8D] max-w-2xl mx-auto">
            Stay informed with the latest updates from around the world.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#344C64]/80 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-12 border border-[#577B8D]"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#577B8D] h-5 w-5" />
              <Input
                type="text"
                placeholder="Search news by title..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border-[#577B8D] focus:border-[#57A6A1] focus:ring-2 focus:ring-[#57A6A1] text-sm bg-[#240750]/50 text-[#577B8D] placeholder:text-[#577B8D]/50"
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Select value={selectedCategory} onValueChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-full md:w-48 rounded-lg border-[#577B8D] focus:border-[#57A6A1] focus:ring-2 focus:ring-[#57A6A1] bg-[#240750]/50 text-[#577B8D]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#344C64] border-[#577B8D] rounded-lg shadow-lg">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
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

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : news.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#577B8D] text-lg"
          >
            No news articles found.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {news.map((article) => (
                <motion.div key={article._id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col bg-[#344C64]/80 backdrop-blur-sm border-[#577B8D]">
                    <div className="relative h-48">
                      <Image
                        src={article.image || "/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            className={`${
                              article.category === "national"
                                ? "bg-[#57A6A1]"
                                : article.category === "international"
                                ? "bg-[#577B8D]"
                                : "bg-[#344C64]"
                            } text-white`}
                          >
                            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
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

        {/* Pagination */}
        {!loading && news.length > 0 && (
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

export default NewsPage;
