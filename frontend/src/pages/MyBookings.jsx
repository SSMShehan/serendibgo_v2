import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingAPI } from '../services/hotels/hotelService'
import vehicleService from '../services/vehicles/vehicleService'
import { Calendar, MapPin, Clock, Users, CreditCard, Bed, AlertCircle, Car } from 'lucide-react'
import { toast } from 'react-hot-toast'

const MyBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      
      // Fetch both hotel and vehicle bookings
      const [hotelBookingsResponse, vehicleBookingsResponse] = await Promise.allSettled([
        bookingAPI.getMyBookings(),
        vehicleService.vehicleBookingAPI.getUserBookings()
      ])
      
      const allBookings = []
      
      // Add hotel bookings
      if (hotelBookingsResponse.status === 'fulfilled' && hotelBookingsResponse.value.status === 'success') {
        const hotelBookings = hotelBookingsResponse.value.data.bookings.map(booking => ({
          ...booking,
          type: 'hotel',
          icon: Bed
        }))
        allBookings.push(...hotelBookings)
      }
      
      // Add vehicle bookings
      if (vehicleBookingsResponse.status === 'fulfilled' && vehicleBookingsResponse.value.status === 'success') {
        const vehicleBookings = vehicleBookingsResponse.value.data.bookings.map(booking => ({
          ...booking,
          type: 'vehicle',
          icon: Car
        }))
        allBookings.push(...vehicleBookings)
      }
      
      // Sort by booking date (most recent first)
      allBookings.sort((a, b) => new Date(b.bookedAt || b.createdAt) - new Date(a.bookedAt || a.createdAt))
      
      setBookings(allBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading bookings</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={fetchBookings}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Manage your hotel and vehicle bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start by exploring our amazing hotels and vehicles.</p>
            <div className="mt-6 space-x-4">
              <Link
                to="/hotels"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Hotels
              </Link>
              <Link
                to="/vehicles"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Browse Vehicles
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const IconComponent = booking.icon || Bed;
              const isHotel = booking.type === 'hotel';
              const isVehicle = booking.type === 'vehicle';
              
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <IconComponent className={`h-5 w-5 ${isHotel ? 'text-blue-600' : 'text-green-600'}`} />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isHotel && (booking.hotel?.name || 'Hotel Booking')}
                          {isVehicle && (booking.vehicle?.name || 'Vehicle Booking')}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {isHotel && `${booking.room?.name || 'Room'} - ${booking.room?.roomType || 'Standard'}`}
                        {isVehicle && `${booking.vehicle?.vehicleType || 'Vehicle'} - ${booking.vehicle?.make || ''} ${booking.vehicle?.model || ''}`}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {isHotel && formatDate(booking.checkInDate)}
                          {isVehicle && formatDate(booking.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {isHotel && formatDate(booking.checkOutDate)}
                          {isVehicle && formatDate(booking.endDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {isHotel && (booking.hotel?.location?.city || 'Location')}
                          {isVehicle && (booking.tripDetails?.pickupLocation?.city || 'Location')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {isHotel && (booking.guests?.adults || 1)} {isHotel && (booking.guests?.adults === 1 ? 'guest' : 'guests')}
                          {isVehicle && (booking.passengers?.adults || 1)} {isVehicle && (booking.passengers?.adults === 1 ? 'passenger' : 'passengers')}
                        </div>
                      </div>
                      {booking.bookingReference && (
                        <div className="mt-3 text-xs text-gray-500">
                          Reference: {booking.bookingReference}
                        </div>
                      )}
                    </div>
                    <div className="ml-6 flex flex-col items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus || booking.status)}`}>
                        {(booking.bookingStatus || booking.status).charAt(0).toUpperCase() + (booking.bookingStatus || booking.status).slice(1)}
                      </span>
                      <div className="mt-2 flex items-center text-lg font-semibold text-gray-900">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {booking.pricing?.currency || 'USD'} {booking.pricing?.totalPrice?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      View Details
                    </button>
                    {(booking.bookingStatus || booking.status) === 'pending' && (
                      <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings

