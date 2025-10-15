import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotel } from '../../context/hotels/HotelContext';
import { hotelUtils } from '../../services/hotels/hotelService';

const HotelSearch = () => {
  const navigate = useNavigate();
  const { hotels, hotelsLoading, hotelsError, filterActions, hotelActions } = useHotel();
  
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    infants: 0
  });
  
  const [filters, setFilters] = useState({
    category: '',
    starRating: '',
    minPrice: '',
    maxPrice: '',
    amenities: [],
    area: ''
  });
  
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Load hotels on component mount
    loadHotels();
  }, []);
  
  const loadHotels = async () => {
    try {
      await hotelActions.getHotels({
        ...filters,
        sort: sortBy,
        order: sortOrder
      });
    } catch (error) {
      console.error('Failed to load hotels:', error);
    }
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    await loadHotels();
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleAmenityChange = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      category: '',
      starRating: '',
      minPrice: '',
      maxPrice: '',
      amenities: [],
      area: ''
    });
  };
  
  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const calculateNights = () => {
    if (searchParams.checkIn && searchParams.checkOut) {
      return hotelUtils.calculateNights(searchParams.checkIn, searchParams.checkOut);
    }
    return 0;
  };
  
  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <select
                  value={searchParams.city}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cities</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Negombo">Negombo</option>
                  <option value="Bentota">Bentota</option>
                  <option value="Hikkaduwa">Hikkaduwa</option>
                  <option value="Unawatuna">Unawatuna</option>
                  <option value="Mirissa">Mirissa</option>
                  <option value="Weligama">Weligama</option>
                  <option value="Tangalle">Tangalle</option>
                  <option value="Arugam Bay">Arugam Bay</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Ella">Ella</option>
                  <option value="Bandarawela">Bandarawela</option>
                  <option value="Haputale">Haputale</option>
                  <option value="Sigiriya">Sigiriya</option>
                  <option value="Dambulla">Dambulla</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Polonnaruwa">Polonnaruwa</option>
                  <option value="Trincomalee">Trincomalee</option>
                  <option value="Batticaloa">Batticaloa</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Kalpitiya">Kalpitiya</option>
                  <option value="Chilaw">Chilaw</option>
                  <option value="Puttalam">Puttalam</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out
                </label>
                <input
                  type="date"
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <select
                  value={`${searchParams.adults} adults, ${searchParams.children} children`}
                  onChange={(e) => {
                    const [adults, children] = e.target.value.split(', ');
                    setSearchParams(prev => ({
                      ...prev,
                      adults: parseInt(adults),
                      children: parseInt(children)
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1 adults, 0 children">1 adult</option>
                  <option value="2 adults, 0 children">2 adults</option>
                  <option value="1 adults, 1 children">1 adult, 1 child</option>
                  <option value="2 adults, 1 children">2 adults, 1 child</option>
                  <option value="2 adults, 2 children">2 adults, 2 children</option>
                  <option value="3 adults, 0 children">3 adults</option>
                  <option value="4 adults, 0 children">4 adults</option>
                </select>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Search Hotels
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card-strong p-8">
          <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Beach Resort">Beach Resort</option>
                    <option value="Hill Station Hotel">Hill Station Hotel</option>
                    <option value="Heritage Hotel">Heritage Hotel</option>
                    <option value="Wildlife Lodge">Wildlife Lodge</option>
                    <option value="Ayurveda Retreat">Ayurveda Retreat</option>
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Budget Hostel">Budget Hostel</option>
                    <option value="Luxury Hotel">Luxury Hotel</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Villa">Villa</option>
                    <option value="Eco Lodge">Eco Lodge</option>
                    <option value="Plantation Bungalow">Plantation Bungalow</option>
                  </select>
                </div>
                
                {/* Star Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Star Rating
                  </label>
                  <select
                    value={filters.starRating}
                    onChange={(e) => handleFilterChange('starRating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars & Up</option>
                    <option value="3">3 Stars & Up</option>
                    <option value="2">2 Stars & Up</option>
                    <option value="1">1 Star & Up</option>
                  </select>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (LKR)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Area Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Type
                  </label>
                  <select
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Areas</option>
                    <option value="Beach">Beach</option>
                    <option value="Hill Country">Hill Country</option>
                    <option value="Cultural Triangle">Cultural Triangle</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="City Center">City Center</option>
                    <option value="Suburbs">Suburbs</option>
                    <option value="Heritage Site">Heritage Site</option>
                    <option value="National Park">National Park</option>
                    <option value="Plantation">Plantation</option>
                    <option value="Coastal">Coastal</option>
                  </select>
                </div>
                
                {/* Amenities Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    {[
                      'wifi', 'airConditioning', 'pool', 'spa', 'restaurant', 'bar',
                      'parking', 'gym', 'airportPickup', 'tourBooking', 'ayurveda'
                    ].map(amenity => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {amenity.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {hotels.length} Hotels Found
                </h2>
                {searchParams.city && (
                  <p className="text-gray-600">
                    in {searchParams.city}
                    {searchParams.checkIn && searchParams.checkOut && (
                      <span> • {formatDate(searchParams.checkIn)} - {formatDate(searchParams.checkOut)}</span>
                    )}
                    {calculateNights() > 0 && (
                      <span> • {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                    )}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="ratings.overall-desc">Highest Rated</option>
                  <option value="ratings.overall-asc">Lowest Rated</option>
                  <option value="starRating-desc">Highest Star Rating</option>
                  <option value="starRating-asc">Lowest Star Rating</option>
                </select>
              </div>
            </div>
            
            {/* Loading State */}
            {hotelsLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading hotels...</p>
              </div>
            )}
            
            {/* Error State */}
            {hotelsError && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Hotels</h3>
                <p className="text-gray-600">{hotelsError}</p>
              </div>
            )}
            
            {/* Hotels Grid */}
            {!hotelsLoading && !hotelsError && (
              <div className="grid grid-cols-1 gap-6">
                {hotels.map((hotel) => (
                  <div
                    key={hotel._id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleHotelClick(hotel._id)}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Hotel Image */}
                        <div className="md:w-1/3">
                          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                            {(hotel.primaryImage || (hotel.images && hotel.images.length > 0)) ? (
                              <img
                                src={hotel.primaryImage || hotel.images[0].url}
                                alt={hotel.name}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Hotel Details */}
                        <div className="md:w-2/3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                              <p className="text-gray-600 mb-2">{hotel.location.city}, {hotel.location.district}</p>
                              <p className="text-sm text-gray-500 mb-3">{hotel.category}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center mb-2">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < hotel.starRating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="text-sm text-gray-600">
                                {hotelUtils.getRatingDisplay(hotel.ratings.overall)} ({hotel.reviewCount} reviews)
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {hotel.shortDescription || hotel.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {hotelUtils.getAmenitiesList(hotel.amenities).slice(0, 4).map(amenity => (
                                <span
                                  key={amenity}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {amenity.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              ))}
                              {hotelUtils.getAmenitiesList(hotel.amenities).length > 4 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{hotelUtils.getAmenitiesList(hotel.amenities).length - 4} more
                                </span>
                              )}
                            </div>
                            
                            {hotelUtils.formatPrice(hotel.averageRoomPrice) && (
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                  {hotelUtils.formatPrice(hotel.averageRoomPrice)}
                                </p>
                                <p className="text-sm text-gray-600">per night</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results */}
            {!hotelsLoading && !hotelsError && hotels.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hotels found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;
