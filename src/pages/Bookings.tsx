
import { useState } from 'react';
import { Calendar, MapPin, Clock, CreditCard, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('all');

  const bookings = [
    {
      id: 1,
      location: "Westlands Shopping Mall",
      address: "Westlands Road, Nairobi",
      date: "2024-01-15",
      time: "14:30 - 17:30",
      duration: "3 hours",
      price: "KSh 600",
      status: "active",
      paymentMethod: "M-Pesa"
    },
    {
      id: 2,
      location: "KICC Parking",
      address: "City Hall Way, Nairobi",
      date: "2024-01-14",
      time: "09:00 - 12:00",
      duration: "3 hours", 
      price: "KSh 450",
      status: "completed",
      paymentMethod: "Card"
    },
    {
      id: 3,
      location: "Sarit Centre",
      address: "Karuna Road, Westlands",
      date: "2024-01-12",
      time: "15:15 - 18:00",
      duration: "2.75 hours",
      price: "KSh 550",
      status: "completed",
      paymentMethod: "M-Pesa"
    },
    {
      id: 4,
      location: "Junction Mall",
      address: "Ngong Road, Nairobi",
      date: "2024-01-18",
      time: "10:00 - 13:00",
      duration: "3 hours",
      price: "KSh 450",
      status: "upcoming",
      paymentMethod: "M-Pesa"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-parking-navy mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage and track all your parking reservations</p>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by location or booking ID..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'all', label: 'All Bookings' },
                  { id: 'active', label: 'Active' },
                  { id: 'upcoming', label: 'Upcoming' },
                  { id: 'completed', label: 'Completed' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-parking-navy text-parking-navy'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.location}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.address}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="h-4 w-4" />
                          <span>{booking.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-parking-navy">
                          <span>{booking.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {booking.status === 'upcoming' && (
                        <>
                          <Button variant="outline" size="sm">
                            Modify
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'active' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Extend Time
                        </Button>
                      )}
                      {booking.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          Rebook
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-4">You don't have any {activeTab === 'all' ? '' : activeTab} bookings yet.</p>
                <Button className="bg-parking-navy hover:bg-blue-800">
                  Find Parking
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
