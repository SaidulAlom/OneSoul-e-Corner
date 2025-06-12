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
  Search,
  Star,
  Download,
  DollarSign,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { debounce } from "lodash";
import Head from "next/head";
import { toast } from "sonner";

interface EBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  coverImage: string;
  price: number;
  rating: number;
  downloads: number;
}

const EBooksPage = () => {
  const [ebooks, setEbooks] = useState<EBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const fetchEBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all") params.append("category", selectedCategory);

      const res = await axios.get(`/api/ebooks?${params}`);
      if (res.data.success) {
        setEbooks(res.data.data || []);
        setTotalPages(res.data.pagination?.pages || 1);
      } else {
        setError("Failed to fetch e-books");
        toast.error("Failed to fetch e-books");
      }
    } catch (err) {
      setError("Failed to fetch e-books");
      toast.error("An error occurred while fetching e-books");
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
    fetchEBooks();
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
      <div className="h-64 bg-gray-200 rounded-t-lg" />
      <CardHeader className="pb-2">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-4 bg-gray-200 rounded mb-4" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#240750] to-[#344C64] py-12">
      <Head>
        <title>E-Books | OneSoul e Corner</title>
        <meta
          name="description"
          content="Discover and purchase quality e-books for competitive exams, fiction, and learning at OneSoul e Corner."
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
            E-Book Store
          </h1>
          <p className="text-lg sm:text-xl text-[#577B8D] max-w-2xl mx-auto">
            Explore our curated collection of e-books for learning and inspiration.
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
                placeholder="Search by title or author..."
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
                <SelectTrigger className="w-full md:w-48 rounded-lg border-[#577B8D] focus:border-[#57A6A1] focus:ring-2 focus:ring-[#57A6A1] bg-[#240750]/50 text-[#577B8D]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#344C64] border-[#577B8D] rounded-lg shadow-lg">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="competitive">Competitive Exams</SelectItem>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
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

        {/* E-Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : ebooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#577B8D] text-lg"
          >
            No e-books found. Try adjusting your filters.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            <AnimatePresence>
              {ebooks.map((ebook) => (
                <motion.div key={ebook._id} variants={itemVariants}>
                  <Card className="h-full bg-[#344C64]/80 backdrop-blur-sm border border-[#577B8D] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                    <div className="relative h-64">
                      <Image
                        src={ebook.coverImage || "/placeholder.jpg"}
                        alt={ebook.title}
                        fill
                        className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                      />
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-2 right-2"
                      >
                        <Badge className="bg-[#57A6A1] text-white">
                          {ebook.category.charAt(0).toUpperCase() + ebook.category.slice(1)}
                        </Badge>
                      </motion.div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-[#57A6A1] transition-colors duration-300">
                        {ebook.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-[#577B8D] mt-2">
                        <User className="h-4 w-4 mr-1" />
                        {ebook.author}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-[#577B8D]">
                          <Star className="h-4 w-4 mr-1 text-[#57A6A1]" />
                          <span>{ebook.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center text-[#577B8D]">
                          <Download className="h-4 w-4 mr-1" />
                          <span>{ebook.downloads}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-[#57A6A1] font-semibold">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {ebook.price.toFixed(2)}
                        </div>
                        <Button className="bg-[#57A6A1] hover:bg-[#577B8D] text-white">
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && ebooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-[#577B8D] text-[#577B8D] hover:bg-[#57A6A1] hover:text-white"
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
              className="border-[#577B8D] text-[#577B8D] hover:bg-[#57A6A1] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EBooksPage;
