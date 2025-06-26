import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, CreditCard, Phone, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { parkingApi, bookingApi, ParkingSpot, CreateBookingRequest } from '@/lib/api-client';

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with proper datetime-local format
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    parkingSpaceId: 0,
    startTime: formatDateTimeLocal(now),
    endTime: formatDateTimeLocal(twoHoursLater),
    durationHours: 2
  });

  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const { data: parkingSpots, isLoading: loadingSpots, error: spotsError } = useQuery({
    queryKey: ['parkingSpots'],
    queryFn: parkingApi.getAll,
    retry: 3,
    retryDelay: 1000,
  });

  const handleSpotSelection = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setFormData(prev => ({ ...prev, parkingSpaceId: spot.id }));
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    if (field === 'startTime') {
      const start = new Date(value);
      const end = new Date(start.getTime() + formData.durationHours * 60 * 60 * 1000);
      setFormData(prev => ({
        ...prev,
        startTime: value,
        endTime: formatDateTimeLocal(end)
      }));
    } else {
      const end = new Date(value);
      const start = new Date(formData.startTime);
      const duration = Math.max(1, Math.round((end.getTime() - start.getTime()) / (60 * 60 * 1000)));
      setFormData(prev => ({
        ...prev,
        endTime: value,
        durationHours: duration
      }));
    }
  };

  const handleDurationChange = (duration: number) => {
    const start = new Date(formData.startTime);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    setFormData(prev => ({
      ...prev,
      durationHours: Math.max(1, duration),
      endTime: formatDateTimeLocal(end)
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.parkingSpaceId) {
      return 'Please select a parking spot';
    }
    if (!formData.startTime) {
      return 'Please select a start time';
    }
    if (!formData.endTime) {
      return 'Please select an end time';
    }
    if (formData.durationHours <= 0) {
      return 'Duration must be at least 1 hour';
    }
    
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const now = new Date();
    
    if (start < now) {
      return 'Start time cannot be in the past';
    }
    if (end <= start) {
      return 'End time must be after start time';
    }
    
    return null;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData: CreateBookingRequest = {
        parking_space_id: formData.parkingSpaceId,
        start_time: new Date(formData.startTime).toISOString(),
        end_time: new Date(formData.endTime).toISOString(),
        duration_hours: formData.durationHours,
        local_kw: 'NAIROBI'
      };

      console.log('Submitting booking:', bookingData);
      
      const result = await bookingApi.create(bookingData);
      
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (error: any) {
      console.error('Booking submission error:', error);
      
      let errorMessage = 'Failed to create booking';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Booking
            </h1>
            <p className="text-gray-600">Select your preferred parking spot and time</p>
          </div>

          {spotsError && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load parking spots. Please check your connection and try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Parking Spot Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Select Parking Spot
                </CardTitle>
                <CardDescription>
                  Choose your preferred parking location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingSpots ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading parking spots...</span>
                    </div>
                  ) : parkingSpots && parkingSpots.length > 0 ? (
                    <div className="space-y-3">
                      {parkingSpots.map((spot: ParkingSpot) => (
                        <div
                          key={spot.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedSpot?.id === spot.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handleSpotSelection(spot)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{spot.address}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="font-medium">KES {spot.pricePerHour}/hour</span>
                                <span>{spot.availableSpots} spots available</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Available
                              </span>
                              {selectedSpot?.id === spot.id && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No parking spots available at the moment</p>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()} 
                        className="mt-2"
                      >
                        Refresh
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Booking Details
                </CardTitle>
                <CardDescription>
                  Set your booking time and duration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => handleTimeChange('startTime', e.target.value)}
                      min={formatDateTimeLocal(new Date())}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => handleTimeChange('endTime', e.target.value)}
                      min={formData.startTime}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (hours)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      step="0.5"
                      value={formData.durationHours}
                      onChange={(e) => handleDurationChange(Number(e.target.value))}
                      required
                    />
                  </div>

                  {selectedSpot && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Location: {selectedSpot.name}</div>
                        <div>Duration: {formData.durationHours} hours</div>
                        <div className="font-medium text-gray-900">
                          Total: KES {(selectedSpot.pricePerHour * formData.durationHours).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting || !selectedSpot}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Booking...
                      </>
                    ) : (
                      'Create Booking'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}