import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/lib/auth';
import { parkingApi, bookingApi } from '@/lib/api-client';
import { ParkingSpot } from '@/lib/api-client';

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    parkingSpotId: 0,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    durationHours: 0
  });

  const { data: parkingSpots, isLoading: isLoadingSpots, error: spotsError } = useQuery({
    queryKey: ['parkingSpots'],
    queryFn: parkingApi.getAll,
  });

  const handleTimeChange = (type: 'startTime' | 'endTime', time: string) => {
    const newTime = new Date(time);
    setFormData(prev => ({
      ...prev,
      [type]: newTime.toISOString(),
      durationHours: type === 'endTime' 
        ? Math.round((newTime.getTime() - new Date(prev.startTime).getTime()) / (1000 * 60 * 60))
        : Math.round((new Date(prev.endTime).getTime() - newTime.getTime()) / (1000 * 60 * 60))
    }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      if (!formData.parkingSpotId || !formData.startTime || !formData.endTime) {
        toast.error('Please select parking spot and times');
        return;
      }

      const bookingData = {
        parking_spot_id: formData.parkingSpotId,
        start_time: new Date(formData.startTime),
        end_time: new Date(formData.endTime),
        duration_hours: formData.durationHours
      };

      try {
        await bookingApi.create(bookingData);

        toast.success('Booking successful!');
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Booking error:', error.response?.data || error);
        if (error.response?.data?.detail) {
          const validationErrors = error.response.data.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
          toast.error(validationErrors);
        } else if (error.message.includes('Network Error')) {
          toast.error('Network error. Please check your internet connection.');
        } else {
          toast.error('Failed to create booking');
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoadingSpots ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-navy"></div>
            </div>
          ) : spotsError ? (
            <div className="text-center text-red-500">
              Failed to load parking spots. Please try again later.
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-parking-navy mb-2">Book Parking Spot</h1>
                <p className="text-gray-600">Select your preferred parking spot and time</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parking Spot Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Parking Spot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {parkingSpots?.map((spot) => (
                        <div key={spot.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg">
                          <input
                            type="radio"
                            name="parkingSpot"
                            value={spot.id}
                            checked={formData.parkingSpotId === spot.id}
                            onChange={() => setFormData(prev => ({ ...prev, parkingSpotId: spot.id }))}
                            className="h-4 w-4 text-parking-navy"
                          />
                          <div>
                            <h3 className="font-semibold">{spot.name}</h3>
                            <p className="text-gray-600">{spot.address}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{spot.availableSpots} spots available</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Time Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={new Date(formData.startTime).toISOString().split('T')[0]}
                            onChange={(e) => handleTimeChange('startTime', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="time"
                            value={new Date(formData.startTime).toISOString().split('T')[1].split('.')[0]}
                            onChange={(e) => handleTimeChange('startTime', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={new Date(formData.endTime).toISOString().split('T')[0]}
                            onChange={(e) => handleTimeChange('endTime', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="time"
                            value={new Date(formData.endTime).toISOString().split('T')[1].split('.')[0]}
                            onChange={(e) => handleTimeChange('endTime', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <Input
                          type="text"
                          value={`${formData.durationHours} hours`}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-parking-red hover:bg-red-700">
                        {isLoading ? 'Booking...' : 'Book Now'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
