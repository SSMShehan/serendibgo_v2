import React, { useState, useEffect } from 'react'
import { Car, Users, Fuel, Calendar, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        // Try main endpoint first
        try {
          const response = await api.get('/vehicles?status=available')
          setVehicles(response.data.data || [])
        } catch (mainError) {
          console.log('Main vehicles endpoint failed, trying sample data:', mainError.message)
          // Fallback to sample data
          const sampleResponse = await api.get('/sample-vehicles?status=available')
          setVehicles(sampleResponse.data.data?.vehicles || [])
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err)
        setError('Failed to load vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-strong p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Rentals</h1>
          <p className="mt-2 text-gray-600">Choose the perfect vehicle for your Sri Lankan journey</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading vehicles...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load vehicles</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles available</h3>
            <p className="text-gray-600">Check back later for available vehicles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img 
                      src={vehicle.images[0].url || vehicle.images[0]} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{vehicle.vehicleType}</p>
                      <p className="mt-2 text-gray-600 text-sm">{vehicle.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-primary">
                        {vehicle.pricing?.currency || 'LKR'} {vehicle.pricing?.dailyRate?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-500">per day</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Up to {vehicle.capacity?.passengers || vehicle.seatingCapacity || 0} passengers
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Fuel className="h-4 w-4 mr-2" />
                      {vehicle.fuelType}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features && Object.values(vehicle.features).some(feature => feature) ? (
                        Object.entries(vehicle.features)
                          .filter(([_, enabled]) => enabled)
                          .map(([feature, _]) => (
                            <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          ))
                      ) : (
                        <span className="text-gray-500 text-sm">No features listed</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/booking?vehicle=${vehicle._id}`)}
                      className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default Vehicles