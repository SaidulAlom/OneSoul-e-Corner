"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Book, Download } from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Head from "next/head";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/ebooks`, {
          params: {
            page,
            search: searchQuery,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
          },
        });
        setEbooks(response.data.ebooks);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError("Failed to fetch e-books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEbooks();
  }, [page, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Head>
        <title>E-Books | OneSoul e Corner</title>
        <meta
          name="description"
          content="Discover and purchase quality e-books for competitive exams, fiction, and learning at OneSoul e Corner."
        />
      </Head>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#424242] mb-2">E-Books Library</h1>
          <p className="text-[#424242]/80">Discover our collection of digital books</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            type="search"
            placeholder="Search e-books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white border-[#424242] focus:border-[#48CFCB]"
          />
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full md:w-[200px] bg-white border-[#424242] focus:border-[#48CFCB]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="fiction">Fiction</SelectItem>
              <SelectItem value="non-fiction">Non-Fiction</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="self-help">Self-Help</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-[#424242]/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook) => (
              <motion.div
                key={ebook._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full bg-white hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={ebook.cover}
                      alt={ebook.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        style={{
                          backgroundColor:
                            ebook.category === "fiction"
                              ? "#229799"
                              : ebook.category === "non-fiction"
                              ? "#48CFCB"
                              : "#424242",
                        }}
                      >
                        {ebook.category}
                      </Badge>
                      <span className="text-sm text-[#424242]/60 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(ebook.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-[#424242] line-clamp-2">
                      {ebook.title}
                    </CardTitle>
                    <p className="text-sm text-[#424242]/80 flex items-center">
                      <Book className="h-4 w-4 mr-1" />
                      {ebook.author}
                    </p>
                    <p className="text-sm text-[#424242]/80 line-clamp-2 mt-2">
                      {ebook.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-[#229799]">
                        ${ebook.price.toFixed(2)}
                      </span>
                      <Button
                        variant="outline"
                        className="border-[#424242] text-[#424242] hover:bg-[#229799] hover:text-white hover:border-[#229799]"
                        asChild
                      >
                        <Link href={`/ebooks/${ebook._id}`}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="border-[#424242] text-[#424242] hover:bg-[#229799] hover:text-white hover:border-[#229799]"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="mx-4 flex items-center text-[#424242]">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            className="border-[#424242] text-[#424242] hover:bg-[#229799] hover:text-white hover:border-[#229799]"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
