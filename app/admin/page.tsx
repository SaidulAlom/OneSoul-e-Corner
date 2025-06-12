"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Video,
  BookOpen,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      color: "#229799",
    },
    {
      title: "News Articles",
      value: "567",
      icon: FileText,
      color: "#48CFCB",
    },
    {
      title: "Videos",
      value: "89",
      icon: Video,
      color: "#229799",
    },
    {
      title: "E-Books",
      value: "123",
      icon: BookOpen,
      color: "#48CFCB",
    },
  ];

  const recentActivities = [
    {
      type: "New User",
      description: "John Doe registered",
      time: "5 minutes ago",
    },
    {
      type: "New Article",
      description: "Latest tech trends published",
      time: "1 hour ago",
    },
    {
      type: "New Video",
      description: "Interview with CEO uploaded",
      time: "2 hours ago",
    },
    {
      type: "New E-Book",
      description: "Digital Marketing Guide added",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-[#424242]"
          >
            Admin Dashboard
          </motion.h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="text-[#424242] hover:text-[#48CFCB]"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              className="text-[#424242] hover:text-[#48CFCB]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-[#424242]">
                      {stat.title}
                    </CardTitle>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: stat.color }}
                    >
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#424242]">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#424242]">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-[#424242]">
                          {activity.type}
                        </p>
                        <p className="text-sm text-[#424242]/80">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-sm text-[#424242]/60">
                        {activity.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#424242]">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-[#229799] hover:bg-[#48CFCB] text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add News Article
                  </Button>
                  <Button
                    className="w-full bg-[#229799] hover:bg-[#48CFCB] text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button
                    className="w-full bg-[#229799] hover:bg-[#48CFCB] text-white"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add E-Book
                  </Button>
                  <Button
                    className="w-full bg-[#229799] hover:bg-[#48CFCB] text-white"
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 