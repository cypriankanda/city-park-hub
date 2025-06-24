import { useState } from 'react';
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
import axios from 'axios';

const Booking = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    parkingSpotId: 0,
    startTime: "",
    durationHours: 0
  });

  const navigate = useNavigate();

  const parkingSpots = [
    {
      id: 1,
      name: "Westlands Shopping Mall",
      address: "Westlands, Nairobi",
      availableSpots: 50,
      totalSpots: 100
    },
    {
      id: 2,
      name: "KICC Parking",
      address: "KICC, Nairobi",
      availableSpots: 30,
      totalSpots: 50
    },
    {
      id: 3,
      name: "Sarit Centre",
      address: "Sarit, Nairobi",
      availableSpots: 40,
      totalSpots: 80
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.parkingSpotId || !formData.startTime || !formData.endTime) {
        toast.error('Please select parking spot and times');
        return;
      }

      const bookingData = {
        parking_spot_id: formData.parkingSpotId,
        start_time: formData.startTime,
        duration_hours: formData.durationHours
      };

      try {
        const response = await axios.post(api.bookings.create, bookingData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });

        if (response.status === 200) {
          toast.success('Booking successful!');
          navigate('/dashboard');
        } else {
          throw new Error('Booking failed');
        }
      } catch (error: any) {
        console.error('Booking error:', error.response?.data || error);
        if (error.response?.data?.detail) {
          const validationErrors = error.response.data.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
          toast.error(validationErrors);
        } else {
          toast.error('Failed to create booking');
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-parking-navy">
                Book Parking Spot
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Parking Location
                    </label>
                    <select
                      value={formData.parkingSpotId}
                      onChange={(e) => {
                        const spotId = parseInt(e.target.value);
                        const selectedSpot = parkingSpots.find(spot => spot.id === spotId);
                        setFormData({ 
                          ...formData, 
                          parkingSpotId: spotId,
                          parkingLocation: selectedSpot?.name || '',
                          parkingAddress: selectedSpot?.address || ''
                        });
                      }}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-parking-navy focus:border-transparent"
                    >
                      <option value="">Select parking spot</option>
                      {parkingSpots.map(spot => (
                        <option key={spot.id} value={spot.id}>
                          {spot.name} - {spot.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-parking-navy focus:border-transparent"
                    >
                      <option value="">Select vehicle type</option>
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="truck">Truck</option>
                    </select>
                    <div className="mt-2 text-sm text-gray-600">
                      This will help us assign the appropriate parking spot
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => {
                        const startTime = e.target.value;
                        const endTime = new Date(startTime);
                        endTime.setHours(endTime.getHours() + 1);
                        const durationHours = 1; // Simplified to 1 hour for now
                        setFormData({ 
                          ...formData, 
                          startTime: startTime,
                          endTime: endTime.toISOString().slice(0, 16),
                          durationHours: durationHours
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    {/* End time is automatically calculated based on duration */}
                    <div className="text-sm text-gray-600">
                      End time will be automatically calculated based on duration
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={4}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-parking-navy focus:border-transparent"
                    placeholder="Any special requests or requirements..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-parking-navy hover:bg-blue-800 text-white px-8 py-3 rounded-lg"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;
