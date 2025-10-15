import React from 'react'
import { MapPin, Star, Wifi, Car, Coffee } from 'lucide-react'

const Hotels = () => {
  // Mock data - replace with actual API call
  const hotels = [
    {
      id: 1,
      name: 'Grand Oriental Hotel',
      rating: 4.5,
      price: 25000,
      location: 'Colombo',
      amenities: ['Free WiFi', 'Parking', 'Restaurant'],
      image: '/api/placeholder/300/200',
      description: 'Luxury hotel in the heart of Colombo with modern amenities and excellent service.'
    },
    {
      id: 2,
      name: 'Kandy Heritage Hotel',
      rating: 4.3,
      price: 18000,
      location: 'Kandy',
      amenities: ['Free WiFi', 'Pool', 'Spa'],
      image: '/api/placeholder/300/200',
      description: 'Traditional Sri Lankan hospitality with contemporary comfort in the cultural capital.'
    }
  ]

  return (
    <div 
      className="min-h-screen py-8"
      style={{
        backgroundImage: 'url(/glassmorphism-bg-5.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Hotels & Accommodations</h1>
          <p className="mt-2 text-white/90">Find the perfect place to stay during your Sri Lankan adventure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Hotel Image</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{hotel.rating}</span>
                      <span className="ml-2 text-sm text-gray-500">•</span>
                      <div className="flex items-center ml-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.location}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">{hotel.description}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-primary">LKR {hotel.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity) => (
                      <span key={amenity} className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {amenity === 'Free WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                        {amenity === 'Parking' && <Car className="h-3 w-3 mr-1" />}
                        {amenity === 'Restaurant' && <Coffee className="h-3 w-3 mr-1" />}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors duration-200">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hotels
