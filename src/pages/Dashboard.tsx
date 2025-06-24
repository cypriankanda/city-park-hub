
import { Car, MapPin, Clock, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) {
    return <div>Loading...</div>;
  }
  const recentBookings = [
    { id: 1, location: "Westlands Shopping Mall", date: "Today, 2:30 PM", status: "Active", price: "KSh 200" },
    { id: 2, location: "KICC Parking", date: "Yesterday, 9:00 AM", status: "Completed", price: "KSh 150" },
    { id: 3, location: "Sarit Centre", date: "Dec 22, 3:15 PM", status: "Completed", price: "KSh 180" }
  ];

  const quickStats = [
    { title: "Total Bookings", value: "47", icon: <Calendar className="h-5 w-5" />, color: "text-blue-600" },
    { title: "Money Saved", value: "KSh 15,800", icon: <TrendingUp className="h-5 w-5" />, color: "text-green-600" },
    { title: "Hours Saved", value: "23.5", icon: <Clock className="h-5 w-5" />, color: "text-purple-600" },
    { title: "Favorite Spots", value: "8", icon: <MapPin className="h-5 w-5" />, color: "text-red-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-parking-navy">Welcome back, {user.full_name}!</h1>
            <p className="text-gray-600 mt-2">Manage your parking bookings and account settings</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-parking-navy to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Find Parking</h3>
                    <p className="text-blue-100 mb-4">Search for available spots near you</p>
                    <Button className="bg-white text-parking-navy hover:bg-gray-100">
                      Search Now
                    </Button>
                  </div>
                  <Car className="h-16 w-16 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-parking-red to-red-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Quick Book</h3>
                    <p className="text-red-100 mb-4">Reserve your usual parking spots</p>
                    <Button className="bg-white text-parking-red hover:bg-gray-100">
                      Book Now
                    </Button>
                  </div>
                  <MapPin className="h-16 w-16 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Bookings</span>
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-parking-navy rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.location}</h4>
                        <p className="text-sm text-gray-600">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">{booking.price}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
