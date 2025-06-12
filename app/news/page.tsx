"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Search, Calendar, Clock, Tag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "Technology",
    "Business",
    "Science",
    "Health",
    "Entertainment",
  ];

  useEffect(() => {
    fetchNews();
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("/api/news", {
        params: {
          page: currentPage,
          limit: 9,
          search: searchQuery,
          category: selectedCategory,
        },
      });
      setNews(response.data.news || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch news. Please try again later.");
      setNews([]);
      setTotalPages(1);
      toast.error("Failed to fetch news");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews();
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setCurrentPage(1);
  };

  const renderNews = () => {
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

    if (!news || news.length === 0) {
      return (
        <div className="text-center text-[#424242] py-12">
          <p className="text-xl">No news articles found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <motion.div
            key={article._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-[#229799]/10 text-[#229799]"
                  >
                    {article.category}
                  </Badge>
                  <span className="text-sm text-[#424242]/60">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-xl font-semibold text-[#424242] line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#424242]/80 line-clamp-3 mb-4">
                  {article.summary}
                </p>
                <Link href={`/news/${article._id}`}>
                  <Button
                    variant="outline"
                    className="w-full text-[#229799] hover:text-[#48CFCB] border-[#229799] hover:border-[#48CFCB]"
                  >
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
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
            Latest News
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-[#424242]/80 max-w-2xl mx-auto"
          >
            Stay updated with the latest news and articles
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search news..."
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
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#229799] text-white"
                    : "text-[#424242] hover:bg-[#48CFCB] hover:text-white"
                }`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {renderNews()}

        {/* Pagination */}
        {!isLoading && news && news.length > 0 && (
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
