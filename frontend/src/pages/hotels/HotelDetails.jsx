import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHotel } from '../../context/hotels/HotelContext';
import { hotelAPI, roomAPI, hotelUtils } from '../../services/hotels/hotelService';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Wifi, 
  Car, 
  Coffee, 
  Tv, 
  Wind, 
  Waves, 
  Utensils, 
  Dumbbell, 
  Sparkles,
  Users,
  Bed,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  Navigation,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotelActions } = useHotel();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    infants: 0,
    specialRequests: ''
  });

  const amenityIcons = {
    wifi: Wifi,
    airConditioning: Wind,
    tv: Tv,
    minibar: Coffee,
    balcony: Waves,
    oceanView: Waves,
    mountainView: MapPin,
    roomService: Utensils,
    safe: Sparkles,
    parking: Car,
    gym: Dumbbell,
    spa: Sparkles,
    restaurant: Utensils,
    bar: Coffee,
    pool: Waves,
    airportPickup: Navigation,
    tourBooking: Globe,
    currencyExchange: Sparkles,
    laundryService: Sparkles,
    englishSpeakingStaff: Users,
    localTransportation: Car,
    safetyDepositBox: Sparkles,
    internationalAdapters: Sparkles,
    ayurveda: Sparkles,
    culturalShows: Sparkles,
    localCuisine: Utensils,
    heritageExperience: Sparkles,
    wildlifeSafari: Sparkles,
    plantationTour: Sparkles
  };

  useEffect(() => {
    fetchHotelDetails();
    fetchRooms();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const response = await hotelAPI.getHotel(id);
      setHotel(response.data.hotel);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      toast.error('Failed to load hotel details');
      navigate('/hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      const response = await roomAPI.getRooms(id);
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setRoomsLoading(false);
    }
  };

  const handleImageNavigation = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => 
        prev === hotel.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === 0 ? hotel.images.length - 1 : prev - 1
      );
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = () => {
    if (!selectedRoom) {
      toast.error('Please select a room first');
      return;
    }

    // Validate booking data
    const validation = hotelUtils.validateDateRange(bookingData.checkIn, bookingData.checkOut);
    if (validation) {
      toast.error(validation);
      return;
    }

    // Navigate to booking page with data
    const bookingParams = new URLSearchParams({
      hotelId: id,
      roomId: selectedRoom._id,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      adults: bookingData.adults,
      children: bookingData.children,
      infants: bookingData.infants,
      specialRequests: bookingData.specialRequests
    });

    navigate(`/hotels/${id}/booking?${bookingParams.toString()}`);
  };

  const getAmenityIcon = (amenity) => {
    const IconComponent = amenityIcons[amenity] || Sparkles;
    return <IconComponent className="w-4 h-4" />;
  };

  const getAmenityLabel = (amenity) => {
    const labels = {
      wifi: 'Free WiFi',
      airConditioning: 'Air Conditioning',
      tv: 'TV',
      minibar: 'Mini Bar',
      balcony: 'Balcony',
      oceanView: 'Ocean View',
      mountainView: 'Mountain View',
      roomService: 'Room Service',
      safe: 'Safe',
      parking: 'Parking',
      gym: 'Gym Access',
      spa: 'Spa Access',
      restaurant: 'Restaurant',
      bar: 'Bar',
      pool: 'Swimming Pool',
      airportPickup: 'Airport Pickup',
      tourBooking: 'Tour Booking',
      currencyExchange: 'Currency Exchange',
      laundryService: 'Laundry Service',
      englishSpeakingStaff: 'English Speaking Staff',
      localTransportation: 'Local Transportation',
      safetyDepositBox: 'Safety Deposit Box',
      internationalAdapters: 'International Adapters',
      ayurveda: 'Ayurveda',
      culturalShows: 'Cultural Shows',
      localCuisine: 'Local Cuisine',
      heritageExperience: 'Heritage Experience',
      wildlifeSafari: 'Wildlife Safari',
      plantationTour: 'Plantation Tour'
    };
    return labels[amenity] || amenity;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h2>
          <Link to="/hotels" className="text-blue-600 hover:text-blue-800">
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/hotels')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Hotels
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hotel Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < hotel.starRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{hotel.location.address}, {hotel.location.city}, {hotel.location.district}</span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{hotelUtils.getRatingDisplay(hotel.ratings.overall)} ({hotel.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{hotel.category}</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </div>

            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {hotelUtils.formatPrice(rooms.length > 0 ? Math.min(...rooms.map(r => r.basePrice)) : 0)}
                  </div>
                  <div className="text-sm text-gray-600">per night</div>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Check Availability
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {hotel.images && hotel.images.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={hotel.images[selectedImageIndex]}
                  alt={`${hotel.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {hotel.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {hotel.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {hotel.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {hotel.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === selectedImageIndex ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Amenities */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(hotel.amenities).map(([amenity, available]) => (
              available && (
                <div key={amenity} className="flex items-center space-x-2">
                  {getAmenityIcon(amenity)}
                  <span className="text-sm text-gray-700">{getAmenityLabel(amenity)}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{hotel.contact.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{hotel.contact.email}</span>
            </div>
            {hotel.contact.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <a
                  href={hotel.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Rooms */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
          
          {roomsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bed className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No rooms available at the moment</p>
            </div>
          ) : (
            <div className="space-y-6">
              {rooms.map((room) => (
                <div key={room._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            {hotelUtils.formatPrice(room.basePrice)}
                          </div>
                          <div className="text-sm text-gray-600">per night</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{room.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{room.maxOccupancy.adults} adults, {room.maxOccupancy.children} children</span>
                        </div>
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{room.bedConfiguration.join(', ')}</span>
                        </div>
                        {room.size && (
                          <div className="flex items-center">
                            <span>{room.size} sq ft</span>
                          </div>
                        )}
                      </div>

                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.amenities.map((amenity) => (
                            <div key={amenity} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                              {getAmenityIcon(amenity)}
                              <span>{getAmenityLabel(amenity)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => handleRoomSelect(room)}
                        className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Select Room
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Check Availability</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookingData.adults}
                    onChange={(e) => setBookingData({...bookingData, adults: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bookingData.children}
                    onChange={(e) => setBookingData({...bookingData, children: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Infants
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bookingData.infants}
                    onChange={(e) => setBookingData({...bookingData, infants: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special requests or requirements..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBookingForm(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
