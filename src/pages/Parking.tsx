
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Clock, Star, Filter, Navigation as NavIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { parkingApi } from '@/lib/api-client';
import { ParkingSpot } from '@/lib/api-client';
import { BookingModal } from '@/components/BookingModal';

const Parking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: parkingSpots, isLoading, error } = useQuery({
    queryKey: ['parkingSpots'],
    queryFn: parkingApi.getAll,
  });

  const filteredSpots = parkingSpots?.filter((spot: ParkingSpot) => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'available' && spot.availableSpots > 0);
    return matchesSearch && matchesFilter;
  }) || [];

  const handleBookSpot = async (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setIsBookingModalOpen(true);
  };

  const getAvailabilityColor = (available: number, total: number): string => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAvailabilityBg = (available: number, total: number): string => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'bg-green-100';
    if (percentage > 20) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-parking-navy mb-2">Find Parking</h1>
            <p className="text-gray-600">Real-time parking availability near you</p>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by location, mall, or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <NavIcon className="h-4 w-4" />
                    Near Me
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Locations' },
              { id: 'available', label: 'Available Now' },
              { id: 'covered', label: 'Covered Parking' },
              { id: 'security', label: 'Secure' },
              { id: 'cheap', label: 'Under KSh 150/hr' }
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={selectedFilter === filter.id ? "bg-parking-navy" : ""}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Location Status Banner */}
          <Card className="mb-6 bg-gradient-to-r from-parking-navy to-blue-700 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Current Location: Westlands, Nairobi</p>
                    <p className="text-blue-100 text-sm">Showing parking within 5km radius</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-parking-navy">
                  Change Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parking Spots Grid */}
          <div className="space-y-4">
            {parkingSpots.map((spot) => (
              <Card key={spot.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {spot.name}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-1 mb-2">
                            <MapPin className="h-4 w-4" />
                            {spot.address} • {spot.distance} away
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{spot.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{spot.walkTime} walk</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`px-3 py-2 rounded-lg ${getAvailabilityBg(spot.availableSpots, spot.totalSpots)}`}>
                          <div className={`text-lg font-bold ${getAvailabilityColor(spot.availableSpots, spot.totalSpots)}`}>
                            {spot.availableSpots}
                          </div>
                          <div className="text-xs text-gray-600">
                            of {spot.totalSpots} spots
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {spot.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-parking-navy">
                          KSh {spot.pricePerHour}
                          <span className="text-sm font-normal text-gray-600">/hour</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:ml-6">
                      <Button 
                        className="bg-parking-red hover:bg-red-700 text-white px-6 py-3"
                        disabled={spot.availableSpots === 0}
                      >
                        {spot.availableSpots > 0 ? 'Book Now' : 'Full'}
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Book Section */}
          <Card className="mt-8 bg-gradient-to-r from-parking-red to-red-700 text-white">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Need parking urgently?</h3>
                <p className="text-red-100 mb-4">Let us find the nearest available spot for you</p>
                <Button className="bg-white text-parking-red hover:bg-gray-100">
                  Quick Find
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Parking;

// Add BookingModal component at the end of the file
const BookingModalComponent = () => {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <BookingModal
      spot={selectedSpot || ({} as ParkingSpot)}
      isOpen={isBookingModalOpen}
      onClose={() => {
        setIsBookingModalOpen(false);
        setSelectedSpot(null);
      }}
    />
  );
};

export { BookingModalComponent };
