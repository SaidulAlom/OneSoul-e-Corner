'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Save, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddContentPage = () => {
  const [contentType, setContentType] = useState('news');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    imageUrl: '',
    featured: false,
    published: false,
    // Job specific fields
    company: '',
    location: '',
    salary: '',
    requirements: '',
    applicationUrl: '',
    deadline: '',
    // Vlog specific fields
    videoUrl: '',
    duration: '',
    // E-book specific fields
    author: '',
    price: '',
    fileUrl: '',
    pages: '',
    language: 'English'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} created successfully!`);
      router.push('/admin');
    } catch (error) {
      toast.error('Failed to create content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    switch (contentType) {
      case 'news':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Brief summary of the article..."
                rows={3}
              />
            </div>
          </>
        );

      case 'jobs':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Company name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Job location"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="walkin">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  placeholder="e.g., ₹50,000 - ₹80,000"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                placeholder="Job requirements and qualifications..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="applicationUrl">Application URL</Label>
              <Input
                id="applicationUrl"
                value={formData.applicationUrl}
                onChange={(e) => setFormData({...formData, applicationUrl: e.target.value})}
                placeholder="https://company.com/apply"
              />
            </div>
          </>
        );

      case 'vlogs':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="15"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="videoUrl">YouTube Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
          </>
        );

      case 'ebooks':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="Author name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competitive">Competitive</SelectItem>
                    <SelectItem value="fiction">Fiction</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="299"
                />
              </div>
              <div>
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({...formData, pages: e.target.value})}
                  placeholder="250"
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="fileUrl">E-book File URL</Label>
              <Input
                id="fileUrl"
                value={formData.fileUrl}
                onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                placeholder="https://storage.com/ebook.pdf"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Content</h1>
                <p className="text-sm text-gray-600">Create new {contentType} content</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>
                Fill in the details for your new content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content Type Selection */}
                <div>
                  <Label>Content Type</Label>
                  <Tabs value={contentType} onValueChange={setContentType} className="mt-2">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="news">News</TabsTrigger>
                      <TabsTrigger value="jobs">Jobs</TabsTrigger>
                      <TabsTrigger value="vlogs">Vlogs</TabsTrigger>
                      <TabsTrigger value="ebooks">E-Books</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Common Fields */}
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter title..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Description/Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Enter detailed description..."
                    rows={6}
                    required
                  />
                </div>

                {/* Dynamic Fields Based on Content Type */}
                {renderFormFields()}

                {/* Settings */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Settings</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="featured">Featured Content</Label>
                      <p className="text-sm text-gray-600">Show this content in featured sections</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="published">Publish Immediately</Label>
                      <p className="text-sm text-gray-600">Make this content visible to users</p>
                    </div>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({...formData, published: checked})}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button type="button" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <div className="flex items-center space-x-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default AddContentPage;