'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  FileText, 
  Briefcase, 
  Video, 
  BookOpen, 
  Settings,
  Bell,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/');
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name || 'User'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {user?.role || 'User'}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Access the main features of OneSoul e Corner
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={() => router.push('/news')}
                    >
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">News</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={() => router.push('/jobs')}
                    >
                      <Briefcase className="h-6 w-6" />
                      <span className="text-sm">Jobs</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={() => router.push('/vlogs')}
                    >
                      <Video className="h-6 w-6" />
                      <span className="text-sm">Vlogs</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={() => router.push('/ebooks')}
                    >
                      <BookOpen className="h-6 w-6" />
                      <span className="text-sm">E-Books</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">New article published</p>
                        <p className="text-xs text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Briefcase className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">New job opportunity available</p>
                        <p className="text-xs text-gray-600">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Video className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">New vlog episode released</p>
                        <p className="text-xs text-gray-600">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Profile & Settings */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-lg">{user?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-lg">{user?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Role</p>
                      <Badge variant="secondary">{user?.role || 'User'}</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
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
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">No upcoming events scheduled.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;