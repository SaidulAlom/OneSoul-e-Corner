"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Search, BookOpen, User, Tag, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Ebook {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  cover: string;
  fileUrl: string;
  price: number;
  createdAt: string;
}

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Business",
    "Technology",
    "Self-Help",
  ];

  useEffect(() => {
    fetchEbooks();
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchEbooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("/api/ebooks", {
        params: {
          page: currentPage,
          limit: 9,
          search: searchQuery,
          category: selectedCategory,
        },
      });
      setEbooks(response.data.ebooks || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch e-books. Please try again later.");
      setEbooks([]);
      setTotalPages(1);
      toast.error("Failed to fetch e-books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEbooks();
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setCurrentPage(1);
  };

  const renderEbooks = () => {
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

    if (!ebooks || ebooks.length === 0) {
      return (
        <div className="text-center text-[#424242] py-12">
          <p className="text-xl">No e-books found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ebooks.map((ebook) => (
          <motion.div
            key={ebook._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={ebook.cover}
                    alt={ebook.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-[#229799]/10 text-[#229799]"
                  >
                    {ebook.category}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-[#48CFCB]/10 text-[#48CFCB]"
                  >
                    ${ebook.price.toFixed(2)}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-[#424242] line-clamp-2">
                  {ebook.title}
                </CardTitle>
                <div className="flex items-center text-[#424242]/80 mt-2">
                  <User className="h-4 w-4 mr-2" />
                  {ebook.author}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#424242]/80 line-clamp-3 mb-4">
                  {ebook.description}
                </p>
                <Link href={`/ebooks/${ebook._id}`}>
                  <Button
                    variant="outline"
                    className="w-full text-[#229799] hover:text-[#48CFCB] border-[#229799] hover:border-[#48CFCB]"
                  >
                    View Details
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
            E-Book Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-[#424242]/80 max-w-2xl mx-auto"
          >
            Discover our collection of digital books
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search e-books..."
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

        {/* E-Books Grid */}
        {renderEbooks()}

        {/* Pagination */}
        {!isLoading && ebooks && ebooks.length > 0 && (
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