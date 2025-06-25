import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

export default function Profile() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['userBookings'],
    queryFn: () => apiClient.get('/api/bookings').then(res => res.data),
    enabled: !!user,
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put('/api/profile', formData);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your profile
          </h1>
          <Button className="bg-parking-navy hover:bg-blue-800">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-2"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="submit" className="bg-parking-navy hover:bg-blue-800">
                      Update Profile
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Your recent parking reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBookings ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-navy mx-auto"></div>
                ) : (
                  <div className="space-y-4">
                    {bookings?.map((booking: any) => (
                      <div key={booking.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{booking.location}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.start_time).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            booking.status === 'active' ? 'bg-green-100 text-green-800' :
                            booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            booking.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-center text-gray-600">No recent bookings</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
