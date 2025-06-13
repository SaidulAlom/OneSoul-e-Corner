"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  Video, 
  BookOpen, 
  BarChart,
  Settings,
  LogOut,
  Briefcase,
  Newspaper,
  Plus,
  Trash2,
  Edit2,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: string;
  createdAt: string;
}

interface Vlog {
  _id: string;
  title: string;
  category: string;
  views: number;
  createdAt: string;
}

interface Ebook {
  _id: string;
  title: string;
  author: string;
  category: string;
  downloads: number;
  createdAt: string;
}

interface News {
  _id: string;
  title: string;
  category: string;
  views: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State for each section
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [news, setNews] = useState<News[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    file: null as File | null,
  });

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

  // Fetch data on component mount and when activeTab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Fetch data based on active tab
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${activeTab}`);
      const data = await response.json();
      if (data.success) {
        switch (activeTab) {
          case 'users':
            setUsers(data.data);
            break;
          case 'jobs':
            setJobs(data.data);
            break;
          case 'vlogs':
            setVlogs(data.data);
            break;
          case 'ebooks':
            setEbooks(data.data);
            break;
          case 'news':
            setNews(data.data);
            break;
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch(`/api/${activeTab}`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Item created successfully',
        });
        fetchData();
        setFormData({
          title: '',
          description: '',
          category: '',
          content: '',
          file: null,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create item',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${activeTab}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/users/${user._id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'jobs':
        return (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mb-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Job
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Job</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Job'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/jobs/${job._id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(job._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );

      // Similar tables for vlogs, ebooks, and news
      // ... (implement similar structure for other sections)

      default:
        return null;
    }
  };

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

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="grid grid-cols-5 gap-4 mb-6">
            <Card
              className={`p-4 cursor-pointer ${
                activeTab === 'users' ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">Users</h3>
            </Card>
            <Card
              className={`p-4 cursor-pointer ${
                activeTab === 'jobs' ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => setActiveTab('jobs')}
            >
              <Briefcase className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">Jobs</h3>
            </Card>
            <Card
              className={`p-4 cursor-pointer ${
                activeTab === 'vlogs' ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => setActiveTab('vlogs')}
            >
              <Video className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">Vlogs</h3>
            </Card>
            <Card
              className={`p-4 cursor-pointer ${
                activeTab === 'ebooks' ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => setActiveTab('ebooks')}
            >
              <BookOpen className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">E-Books</h3>
            </Card>
            <Card
              className={`p-4 cursor-pointer ${
                activeTab === 'news' ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => setActiveTab('news')}
            >
              <Newspaper className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">News</h3>
            </Card>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 