import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, CreditCard } from 'lucide-react'

const MyBookings = () => {
  // Mock data - replace with actual API call
  const bookings = [
    {
      id: 1,
      tourName: 'Sigiriya Rock Fortress Tour',
      date: '2024-01-15',
      time: '08:00 AM',
      participants: 2,
      status: 'confirmed',
      amount: 15000,
      location: 'Sigiriya'
    },
    {
      id: 2,
      tourName: 'Kandy Temple Tour',
      date: '2024-01-20',
      time: '09:00 AM',
      participants: 1,
      status: 'pending',
      amount: 8000,
      location: 'Kandy'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Manage your tour bookings and reservations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start by exploring our amazing tours.</p>
            <div className="mt-6">
              <Link
                to="/tours"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Browse Tours
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{booking.tourName}</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {booking.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {booking.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {booking.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <div className="mt-2 flex items-center text-lg font-semibold text-gray-900">
                      <CreditCard className="h-4 w-4 mr-1" />
                      LKR {booking.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    View Details
                  </button>
                  {booking.status === 'pending' && (
                    <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
