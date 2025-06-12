'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  FileText, 
  Briefcase, 
  Video, 
  BookOpen, 
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

interface ContentItem {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  featured?: boolean;
  author?: string;
  views?: number;
  downloads?: number;
}

interface AddFormData {
  title: string;
  category: string;
  status: string;
  description?: string;
  author?: string;
  thumbnail?: string;
  youtubeUrl?: string;
  price?: number;
  location?: string;
  company?: string;
  salary?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    news: 0,
    jobs: 0,
    vlogs: 0,
    ebooks: 0,
    services: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<AddFormData>({
    title: '',
    category: '',
    status: 'draft',
    description: '',
    author: '',
    thumbnail: '',
    youtubeUrl: '',
    price: 0,
    location: '',
    company: '',
    salary: ''
  });
  
  // Sample data - replace with actual API calls
  const [newsItems, setNewsItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Breaking: New Government Policy Announced',
      category: 'national',
      status: 'published',
      createdAt: '2024-01-15',
      featured: true,
      author: 'Admin',
      views: 1250
    },
    {
      id: '2',
      title: 'Local Development Projects Update',
      category: 'regional',
      status: 'draft',
      createdAt: '2024-01-14',
      featured: false,
      author: 'Editor',
      views: 890
    }
  ]);

  const [jobItems, setJobItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Software Engineer - Tech Corp',
      category: 'private',
      status: 'active',
      createdAt: '2024-01-15',
      featured: true
    },
    {
      id: '2',
      title: 'Government Clerk Position',
      category: 'government',
      status: 'active',
      createdAt: '2024-01-14',
      featured: false
    }
  ]);

  const [vlogItems, setVlogItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'How to Apply for Voter ID Online',
      category: 'education',
      status: 'published',
      createdAt: '2024-01-15',
      featured: true,
      views: 2340
    }
  ]);

  const [ebookItems, setEbookItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Complete Guide to Competitive Exams',
      category: 'competitive',
      status: 'available',
      createdAt: '2024-01-15',
      featured: true,
      downloads: 156
    }
  ]);

  const [serviceRequests, setServiceRequests] = useState([
    {
      id: '1',
      name: 'John Doe',
      service: 'Voter ID Apply',
      status: 'pending',
      date: '2024-01-15',
      amount: 50
    },
    {
      id: '2',
      name: 'Jane Smith',
      service: 'PAN Card Apply',
      status: 'completed',
      date: '2024-01-14',
      amount: 100
    }
  ]);

  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock stats for now - replace with actual API calls
      setStats({
        users: 150,
        news: newsItems.length,
        jobs: jobItems.length,
        vlogs: vlogItems.length,
        ebooks: ebookItems.length,
        services: serviceRequests.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = (id: string, type: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      switch (type) {
        case 'news':
          setNewsItems(prev => prev.filter(item => item.id !== id));
          break;
        case 'jobs':
          setJobItems(prev => prev.filter(item => item.id !== id));
          break;
        case 'vlogs':
          setVlogItems(prev => prev.filter(item => item.id !== id));
          break;
        case 'ebooks':
          setEbookItems(prev => prev.filter(item => item.id !== id));
          break;
      }
      toast.success('Item deleted successfully');
    }
  };

  const handleToggleFeatured = (id: string, type: string) => {
    switch (type) {
      case 'news':
        setNewsItems(prev => prev.map(item => 
          item.id === id ? { ...item, featured: !item.featured } : item
        ));
        break;
      case 'jobs':
        setJobItems(prev => prev.map(item => 
          item.id === id ? { ...item, featured: !item.featured } : item
        ));
        break;
      case 'vlogs':
        setVlogItems(prev => prev.map(item => 
          item.id === id ? { ...item, featured: !item.featured } : item
        ));
        break;
      case 'ebooks':
        setEbookItems(prev => prev.map(item => 
          item.id === id ? { ...item, featured: !item.featured } : item
        ));
        break;
    }
    toast.success('Featured status updated');
  };

  const handleUpdateServiceStatus = (id: string, newStatus: string) => {
    setServiceRequests(prev => prev.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    ));
    toast.success('Service status updated');
  };

  const handleAddItem = (type: string) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
      featured: false
    };

    switch (type) {
      case 'news':
        setNewsItems(prev => [...prev, { ...newItem, author: formData.author, views: 0 }]);
        break;
      case 'jobs':
        setJobItems(prev => [...prev, { ...newItem, company: formData.company, location: formData.location, salary: formData.salary }]);
        break;
      case 'vlogs':
        setVlogItems(prev => [...prev, { ...newItem, views: 0, thumbnail: formData.thumbnail, youtubeUrl: formData.youtubeUrl }]);
        break;
      case 'ebooks':
        setEbookItems(prev => [...prev, { ...newItem, downloads: 0, price: formData.price }]);
        break;
    }

    setShowAddForm(false);
    setFormData({
      title: '',
      category: '',
      status: 'draft',
      description: '',
      author: '',
      thumbnail: '',
      youtubeUrl: '',
      price: 0,
      location: '',
      company: '',
      salary: ''
    });
    toast.success('Item added successfully');
  };

  const renderContentTable = (items: ContentItem[], type: string) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {type === 'news' && (
                <>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                </>
              )}
              {type === 'jobs' && (
                <>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="walkin">Walk-in</SelectItem>
                </>
              )}
              {type === 'vlogs' && (
                <>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </>
              )}
              {type === 'ebooks' && (
                <>
                  <SelectItem value="competitive">Competitive</SelectItem>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add {type.charAt(0).toUpperCase() + type.slice(1, -1)}
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    {item.author && (
                      <div className="text-sm text-gray-500">by {item.author}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary">{item.category}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={item.status === 'published' || item.status === 'active' || item.status === 'available' ? 'default' : 'secondary'}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      checked={item.featured || false}
                      onCheckedChange={() => handleToggleFeatured(item.id, type)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteItem(item.id, type)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAddForm = () => {
    if (!showAddForm) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader>
            <CardTitle>Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</CardTitle>
            <CardDescription>Fill in the details below to add a new item.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleAddItem(activeTab); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTab === 'news' && (
                      <>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </>
                    )}
                    {activeTab === 'jobs' && (
                      <>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="walkin">Walk-in</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                      </>
                    )}
                    {activeTab === 'vlogs' && (
                      <>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="daily">Daily Vlogs</SelectItem>
                      </>
                    )}
                    {activeTab === 'ebooks' && (
                      <>
                        <SelectItem value="competitive">Competitive</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {activeTab === 'news' && (
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    required
                  />
                </div>
              )}

              {activeTab === 'jobs' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === 'vlogs' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                    <Input
                      id="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === 'ebooks' && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      title: '',
                      category: '',
                      status: 'draft',
                      description: '',
                      author: '',
                      thumbnail: '',
                      youtubeUrl: '',
                      price: 0,
                      location: '',
                      company: '',
                      salary: ''
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">News</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.news}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.jobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Video className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Vlogs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.vlogs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">E-Books</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.ebooks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Settings className="h-8 w-8 text-gray-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Services</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.services}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Management Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="vlogs">Vlogs</TabsTrigger>
                <TabsTrigger value="ebooks">E-Books</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        System Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                          <span className="font-medium">Total Platform Users</span>
                          <Badge variant="secondary">{stats.users} Active</Badge>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                          <span className="font-medium">Content Items</span>
                          <Badge variant="secondary">{stats.news + stats.vlogs + stats.ebooks} Published</Badge>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                          <span className="font-medium">Job Listings</span>
                          <Badge variant="secondary">{stats.jobs} Active</Badge>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                          <span className="font-medium">Service Requests</span>
                          <Badge variant="secondary">{stats.services} Total</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">New article published</p>
                            <p className="text-xs text-gray-600">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Briefcase className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Job posting approved</p>
                            <p className="text-xs text-gray-600">5 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Settings className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium">Service request completed</p>
                            <p className="text-xs text-gray-600">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="news" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      News Management
                    </CardTitle>
                    <CardDescription>
                      Manage news articles, categories, and publication status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderContentTable(newsItems, 'news')}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Job Management
                    </CardTitle>
                    <CardDescription>
                      Manage job postings, applications, and categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderContentTable(jobItems, 'jobs')}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vlogs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Video className="h-5 w-5 mr-2" />
                      Vlog Management
                    </CardTitle>
                    <CardDescription>
                      Manage video content, categories, and publication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderContentTable(vlogItems, 'vlogs')}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ebooks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      E-Book Management
                    </CardTitle>
                    <CardDescription>
                      Manage e-books, pricing, and availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderContentTable(ebookItems, 'ebooks')}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Service Requests
                    </CardTitle>
                    <CardDescription>
                      Manage customer service requests and bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search requests..."
                            className="pl-10 w-64"
                          />
                        </div>
                        <Select>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-white rounded-lg border">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {serviceRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{request.name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{request.service}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge 
                                      variant={request.status === 'completed' ? 'default' : 
                                              request.status === 'pending' ? 'secondary' : 'outline'}
                                      className={
                                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                      }
                                    >
                                      {request.status}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(request.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₹{request.amount}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                      <Select 
                                        value={request.status} 
                                        onValueChange={(value) => handleUpdateServiceStatus(request.id, value)}
                                      >
                                        <SelectTrigger className="w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="in-progress">In Progress</SelectItem>
                                          <SelectItem value="completed">Completed</SelectItem>
                                          <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button size="sm" variant="outline">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>

        {/* Add Form Modal */}
        {renderAddForm()}
      </div>
    </div>
  );
};

export default AdminDashboard;