'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Newspaper, 
  Briefcase, 
  Video, 
  BookOpen, 
  Settings, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalNews: number;
  totalJobs: number;
  totalVlogs: number;
  totalEbooks: number;
  totalApplications: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalNews: 0,
    totalJobs: 0,
    totalVlogs: 0,
    totalEbooks: 0,
    totalApplications: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleQuickAdd = (type: string) => {
    router.push(`/admin/content?type=${type}&action=add`);
  };

  const StatCard = ({ title, value, icon: Icon, description, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your entire website from here</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleNavigation('/admin/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => handleNavigation('/admin/content')}>
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered users"
          color="text-blue-600"
        />
        <StatCard
          title="News Articles"
          value={stats.totalNews}
          icon={Newspaper}
          description="Published articles"
          color="text-green-600"
        />
        <StatCard
          title="Job Listings"
          value={stats.totalJobs}
          icon={Briefcase}
          description="Active jobs"
          color="text-purple-600"
        />
        <StatCard
          title="Vlogs"
          value={stats.totalVlogs}
          icon={Video}
          description="Video content"
          color="text-red-600"
        />
        <StatCard
          title="E-Books"
          value={stats.totalEbooks}
          icon={BookOpen}
          description="Digital books"
          color="text-orange-600"
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          icon={Activity}
          description="Job applications"
          color="text-indigo-600"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start" onClick={() => handleQuickAdd('news')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add News Article
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => handleQuickAdd('jobs')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job Listing
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => handleQuickAdd('vlogs')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Vlog
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => handleQuickAdd('ebooks')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add E-Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Newspaper className="h-5 w-5 mr-2" />
                  News Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" size="sm" onClick={() => handleQuickAdd('news')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Article
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => handleNavigation('/admin/content?type=news')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => handleNavigation('/admin/content?type=news')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Articles
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Vlog Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" size="sm" onClick={() => handleQuickAdd('vlogs')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Vlog
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => handleNavigation('/admin/content?type=vlogs')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => handleNavigation('/admin/content?type=vlogs')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Vlogs
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  E-Book Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" size="sm" onClick={() => handleQuickAdd('ebooks')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add E-Book
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => handleNavigation('/admin/content?type=ebooks')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => handleNavigation('/admin/content?type=ebooks')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit E-Books
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Total Users: {stats.totalUsers}</h3>
                    <p className="text-sm text-muted-foreground">Manage all registered users</p>
                  </div>
                  <Button onClick={() => handleNavigation('/admin/users')}>
                    <Users className="h-4 w-4 mr-2" />
                    View All Users
                  </Button>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  <Button variant="outline" size="sm" onClick={() => handleNavigation('/admin/users?action=add')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleNavigation('/admin/users')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Users
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleNavigation('/admin/settings?tab=permissions')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Permissions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Management</CardTitle>
              <CardDescription>Manage job listings and applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Active Jobs: {stats.totalJobs}</h3>
                    <p className="text-sm text-muted-foreground">Applications: {stats.totalApplications}</p>
                  </div>
                  <Button onClick={() => handleQuickAdd('jobs')}>
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </div>
                <div className="grid gap-2 md:grid-cols-4">
                  <Button variant="outline" size="sm" onClick={() => handleNavigation('/admin/content?type=jobs')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Jobs
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleNavigation('/admin/content?type=jobs')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Jobs
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleNavigation('/admin/applications')}>
                    <Activity className="h-4 w-4 mr-2" />
                    Applications
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleNavigation('/admin/analytics?tab=jobs')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Website Analytics</CardTitle>
                <CardDescription>Track website performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Page Views</span>
                    <Badge variant="secondary">+12%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>User Registrations</span>
                    <Badge variant="secondary">+8%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Engagement</span>
                    <Badge variant="secondary">+15%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Top performing content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Most Viewed News</span>
                    <Badge variant="outline">1.2K views</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Popular Vlog</span>
                    <Badge variant="outline">856 views</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top Job</span>
                    <Badge variant="outline">45 applications</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Configure website preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-2">General Settings</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleNavigation('/admin/settings?tab=general')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Site Configuration
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleNavigation('/admin/settings?tab=seo')}>
                        <Settings className="h-4 w-4 mr-2" />
                        SEO Settings
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleNavigation('/admin/settings?tab=email')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Email Configuration
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Security</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleNavigation('/admin/settings?tab=security')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Access Control
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleNavigation('/admin/settings?tab=backup')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Backup Settings
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleNavigation('/admin/settings?tab=logs')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Security Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 