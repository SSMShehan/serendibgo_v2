import React from 'react'
import { Car, Users, Fuel, Calendar } from 'lucide-react'

const Vehicles = () => {
  // Mock data - replace with actual API call
  const vehicles = [
    {
      id: 1,
      name: 'Toyota Corolla',
      type: 'Sedan',
      capacity: 4,
      price: 8000,
      fuelType: 'Petrol',
      features: ['AC', 'GPS', 'Driver'],
      image: '/api/placeholder/300/200',
      description: 'Comfortable sedan perfect for city tours and short trips.'
    },
    {
      id: 2,
      name: 'Toyota Hiace',
      type: 'Van',
      capacity: 12,
      price: 12000,
      fuelType: 'Diesel',
      features: ['AC', 'GPS', 'Driver', 'Luggage Space'],
      image: '/api/placeholder/300/200',
      description: 'Spacious van ideal for group tours and family trips.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Rentals</h1>
          <p className="mt-2 text-gray-600">Choose the perfect vehicle for your Sri Lankan journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Car className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{vehicle.type}</p>
                    <p className="mt-2 text-gray-600 text-sm">{vehicle.description}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-primary">LKR {vehicle.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Up to {vehicle.capacity} passengers
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Fuel className="h-4 w-4 mr-2" />
                    {vehicle.fuelType}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature) => (
                      <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {feature}
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

export default Vehicles
