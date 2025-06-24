
import { useState } from 'react';
import { Users, MapPin, TrendingUp, Settings, Car, CreditCard, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const adminStats = [
    { title: "Total Users", value: "12,847", change: "+15%", icon: <Users className="h-6 w-6" />, color: "text-blue-600" },
    { title: "Active Bookings", value: "1,234", change: "+8%", icon: <Car className="h-6 w-6" />, color: "text-green-600" },
    { title: "Revenue Today", value: "KSh 845,230", change: "+22%", icon: <CreditCard className="h-6 w-6" />, color: "text-purple-600" },
    { title: "Parking Spots", value: "2,850", change: "+5%", icon: <MapPin className="h-6 w-6" />, color: "text-red-600" }
  ];

  const recentActivities = [
    { id: 1, action: "New user registration", user: "John Doe", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Parking spot added", location: "Westlands Mall", time: "15 minutes ago", type: "spot" },
    { id: 3, action: "Payment processed", amount: "KSh 450", time: "23 minutes ago", type: "payment" },
    { id: 4, action: "Booking cancelled", user: "Jane Smith", time: "45 minutes ago", type: "booking" },
    { id: 5, action: "Maintenance alert", location: "KICC Parking", time: "1 hour ago", type: "alert" }
  ];

  const parkingLocations = [
    { id: 1, name: "Westlands Shopping Mall", spots: 120, occupied: 85, revenue: "KSh 45,600", status: "active" },
    { id: 2, name: "KICC Parking", spots: 80, occupied: 72, revenue: "KSh 32,400", status: "active" },
    { id: 3, name: "Sarit Centre", spots: 200, occupied: 156, revenue: "KSh 62,800", status: "active" },
    { id: 4, name: "Junction Mall", spots: 150, occupied: 98, revenue: "KSh 39,200", status: "maintenance" },
    { id: 5, name: "Two Rivers Mall", spots: 300, occupied: 234, revenue: "KSh 93,600", status: "active" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-600" />;
      case 'spot': return <MapPin className="h-4 w-4 text-green-600" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'booking': return <Car className="h-4 w-4 text-orange-600" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-parking-navy mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your parking system operations</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} from yesterday</p>
                    </div>
                    <div className={`${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-600">
                              {activity.user || activity.location || activity.amount} • {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="h-20 flex flex-col items-center justify-center bg-parking-navy hover:bg-blue-800">
                        <MapPin className="h-6 w-6 mb-2" />
                        Add Location
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                        <Users className="h-6 w-6 mb-2" />
                        Manage Users
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                        <BarChart3 className="h-6 w-6 mb-2" />
                        View Reports
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                        <Settings className="h-6 w-6 mb-2" />
                        System Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Parking Locations
                    <Button className="bg-parking-red hover:bg-red-700">
                      Add New Location
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {parkingLocations.map((location) => (
                      <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-parking-navy rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{location.name}</h4>
                            <p className="text-sm text-gray-600">
                              {location.occupied}/{location.spots} spots occupied
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{location.revenue}</p>
                            <p className="text-sm text-gray-600">Today's revenue</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(location.status)}`}>
                            {location.status}
                          </span>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management Coming Soon</h3>
                    <p className="text-gray-600">Advanced user management features will be available here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Panel Coming Soon</h3>
                    <p className="text-gray-600">System configuration options will be available here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
