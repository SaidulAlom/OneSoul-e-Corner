'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  Newspaper, 
  Video, 
  BookOpen, 
  Briefcase,
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';

interface ContentItem {
  _id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  author?: string;
  views?: number;
  featured?: boolean;
}

interface NewsItem extends ContentItem {
  excerpt: string;
  published: boolean;
}

interface VlogItem extends ContentItem {
  duration: number;
  published: boolean;
  views: number;
}

interface EbookItem extends ContentItem {
  author: string;
  price: number;
  downloads: number;
  available: boolean;
}

interface JobItem extends ContentItem {
  company: string;
  location: string;
  type: string;
  active: boolean;
  applications: number;
}

export default function ContentManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('news');
  const [content, setContent] = useState<{
    news: NewsItem[];
    vlogs: VlogItem[];
    ebooks: EbookItem[];
    jobs: JobItem[];
  }>({
    news: [],
    vlogs: [],
    ebooks: [],
    jobs: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getAuthHeaders = (contentType?: string) => {
    const headers: Record<string, string> = {};
    if (contentType) headers['Content-Type'] = contentType;
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Handle URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    const action = searchParams.get('action');
    
    if (type && ['news', 'vlogs', 'ebooks', 'jobs'].includes(type)) {
      setActiveTab(type);
    }
    
    if (action === 'add') {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/content/${activeTab}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setContent(prev => ({
          ...prev,
          [activeTab]: data.data
        }));
      } else {
        toast({ title: 'Failed to load', description: data.error || 'Authorization required', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({ title: 'Error', description: 'Failed to load content.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`/api/admin/content/${activeTab}/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Deleted', description: `${activeTab.slice(0, -1)} deleted successfully.` });
        fetchContent();
      } else {
        toast({ title: 'Failed', description: data.error || 'Failed to delete item.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({ title: 'Error', description: 'Failed to delete item.', variant: 'destructive' });
    }
  };

  const handleUpdateItem = async (formData: FormData) => {
    if (!selectedItem) return;
    
    try {
      const response = await fetch(`/api/admin/content/${activeTab}/${selectedItem._id}`, {
        method: 'PUT',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Updated', description: `${activeTab.slice(0, -1)} updated successfully.` });
        setIsEditDialogOpen(false);
        setSelectedItem(null);
        fetchContent();
      } else {
        toast({ title: 'Failed', description: data.error || 'Failed to update item.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast({ title: 'Error', description: 'Failed to update item.', variant: 'destructive' });
    }
  };

  const onEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleUpdateItem(formData);
  };

  const handleAddItem = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/admin/content/${activeTab}`, {
        method: 'POST',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Created', description: `${activeTab.slice(0, -1)} added successfully.` });
        setIsAddDialogOpen(false);
        fetchContent();
        router.push('/admin/content');
      } else {
        toast({ title: 'Failed', description: data.error || 'Failed to add item.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({ title: 'Error', description: 'Failed to add item.', variant: 'destructive' });
    }
  };

  const onAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleAddItem(formData);
  };

  const getCurrentContent = () => {
    return content[activeTab as keyof typeof content] || [];
  };

  const filteredContent = getCurrentContent().filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.company && item.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const getStatusBadge = (item: any) => {
    switch (activeTab) {
      case 'news':
        return (
          <Badge variant={item.published ? 'default' : 'secondary'}>
            {item.published ? 'Published' : 'Draft'}
          </Badge>
        );
      case 'vlogs':
        return (
          <Badge variant={item.published ? 'default' : 'secondary'}>
            {item.published ? 'Published' : 'Draft'}
          </Badge>
        );
      case 'ebooks':
        return (
          <Badge variant={item.available ? 'default' : 'destructive'}>
            {item.available ? 'Available' : 'Unavailable'}
          </Badge>
        );
      case 'jobs':
        return (
          <Badge variant={item.active ? 'default' : 'secondary'}>
            {item.active ? 'Active' : 'Inactive'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTableHeaders = () => {
    switch (activeTab) {
      case 'news':
        return ['Title', 'Category', 'Status', 'Author', 'Created', 'Actions'];
      case 'vlogs':
        return ['Title', 'Category', 'Duration', 'Views', 'Status', 'Created', 'Actions'];
      case 'ebooks':
        return ['Title', 'Author', 'Category', 'Price', 'Downloads', 'Status', 'Actions'];
      case 'jobs':
        return ['Title', 'Company', 'Location', 'Type', 'Applications', 'Status', 'Actions'];
      default:
        return [];
    }
  };

  const renderTableRow = (item: any) => {
    switch (activeTab) {
      case 'news':
        return (
          <TableRow key={item._id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{getStatusBadge(item)}</TableCell>
            <TableCell>{item.author}</TableCell>
            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      case 'vlogs':
        return (
          <TableRow key={item._id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</TableCell>
            <TableCell>{item.views}</TableCell>
            <TableCell>{getStatusBadge(item)}</TableCell>
            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      case 'ebooks':
        return (
          <TableRow key={item._id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.author}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>${item.price}</TableCell>
            <TableCell>{item.downloads}</TableCell>
            <TableCell>{getStatusBadge(item)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      case 'jobs':
        return (
          <TableRow key={item._id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.company}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.applications}</TableCell>
            <TableCell>{getStatusBadge(item)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage all website content from one place</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add {activeTab.slice(0, -1)}
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            News
          </TabsTrigger>
          <TabsTrigger value="vlogs" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vlogs
          </TabsTrigger>
          <TabsTrigger value="ebooks" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            E-Books
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Content</Label>
                  <Input
                    id="search"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <Label htmlFor="status-filter">Filter by Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Table */}
          <Card>
            <CardHeader>
              <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({filteredContent.length})</CardTitle>
              <CardDescription>Manage your {activeTab} content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {getTableHeaders().map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((item) => renderTableRow(item))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {activeTab.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={onEditSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={selectedItem.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={selectedItem.category}
                    required
                  />
                </div>
              </div>
              
              {activeTab === 'news' && (
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    defaultValue={selectedItem.excerpt}
                    rows={3}
                  />
                </div>
              )}

              {activeTab === 'ebooks' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      defaultValue={selectedItem.author}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      defaultValue={selectedItem.price}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      defaultValue={selectedItem.company}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={selectedItem.location}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={selectedItem.published ? 'published' : 'draft'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="featured">Featured</Label>
                  <Select name="featured" defaultValue={selectedItem.featured ? 'true' : 'false'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Update {activeTab.slice(0, -1)}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New {activeTab.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onAddSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="add-title">Title</Label>
                <Input
                  id="add-title"
                  name="title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-category">Category</Label>
                <Input
                  id="add-category"
                  name="category"
                  required
                />
              </div>
            </div>
            
            {activeTab === 'news' && (
              <div>
                <Label htmlFor="add-excerpt">Excerpt</Label>
                <Textarea
                  id="add-excerpt"
                  name="excerpt"
                  rows={3}
                />
              </div>
            )}

            {activeTab === 'vlogs' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="add-videoUrl">Video URL</Label>
                  <Input id="add-videoUrl" name="videoUrl" placeholder="https://..." required />
                </div>
                <div>
                  <Label htmlFor="add-thumbnailUrl">Thumbnail URL</Label>
                  <Input id="add-thumbnailUrl" name="thumbnailUrl" placeholder="https://..." />
                </div>
                <div>
                  <Label htmlFor="add-duration">Duration (seconds)</Label>
                  <Input id="add-duration" name="duration" type="number" min={0} defaultValue={0} />
                </div>
                <div>
                  <Label htmlFor="add-description">Description</Label>
                  <Input id="add-description" name="description" />
                </div>
              </div>
            )}

            {activeTab === 'ebooks' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="add-author">Author</Label>
                  <Input
                    id="add-author"
                    name="author"
                  />
                </div>
                <div>
                  <Label htmlFor="add-price">Price</Label>
                  <Input
                    id="add-price"
                    name="price"
                    type="number"
                  />
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="add-company">Company</Label>
                  <Input
                    id="add-company"
                    name="company"
                  />
                </div>
                <div>
                  <Label htmlFor="add-location">Location</Label>
                  <Input
                    id="add-location"
                    name="location"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="add-status">Status</Label>
                <Select name="status" defaultValue="draft">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="add-featured">Featured</Label>
                <Select name="featured" defaultValue="false">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Add {activeTab.slice(0, -1)}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
