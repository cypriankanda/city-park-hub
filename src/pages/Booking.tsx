import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookingModal } from '@/components/BookingModal';
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
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: parkingSpots, isLoading: loadingSpots } = useQuery({
    queryKey: ['parkingSpots'],
    queryFn: parkingApi.getAll,
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    toast.success('Booking created successfully');
    navigate('/bookings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Booking
            </h1>
            <p className="text-gray-600">Select your preferred parking spot and time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingSpots ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-navy mx-auto"></div>
            ) : parkingSpots?.map((spot: ParkingSpot) => (
              <Card key={spot.id}>
                <CardHeader>
                  <CardTitle>{spot.name}</CardTitle>
                  <CardDescription>
                    {spot.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{spot.availableSpots} spots available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{spot.pricePerHour} KES/hour</span>
                    </div>
                    <Button
                      onClick={() => handleSpotSelect(spot)}
                      className="w-full bg-primary text-white hover:bg-primary/90"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <BookingModal
            spot={selectedSpot || parkingSpots?.[0] || { 
              id: 0, 
              name: '', 
              address: '', 
              availableSpots: 0, 
              totalSpots: 0, 
              pricePerHour: 0 
            }}
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            localKw="NAIROBI"
            onSuccess={handleBookingSuccess}
          />
        </div>
      </div>
    </div>
  );
}
