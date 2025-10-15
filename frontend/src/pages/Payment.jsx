import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { StripeProvider } from '../context/StripeContext'
import PaymentForm from '../components/PaymentForm'
import { toast } from 'react-hot-toast'
import { 
  CreditCard, 
  CheckCircle, 
  Calendar, 
  Users, 
  MapPin,
  Bed,
  DollarSign,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Car
} from 'lucide-react'

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // Get booking data from navigation state
    if (location.state) {
      setPaymentData(location.state)
      console.log('Payment page received booking data:', location.state)
    } else {
      toast.error('No booking data found')
      navigate('/guides')
    }
  }, [location.state, navigate])

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent)
    toast.success('Payment completed successfully!')
    navigate('/my-bookings', { 
      state: { 
        message: 'Payment completed successfully!',
        bookingId: paymentData.bookingId 
      }
    })
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    toast.error('Payment failed. Please try again.')
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading payment details...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Room Details
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Review your booking details and complete the payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Booking Summary
            </h2>
            
            <div className="space-y-4">
              {/* Booking Type Specific Information */}
              {paymentData.bookingType === 'hotel' && (
                <>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{paymentData.hotelName}</p>
                      <p className="text-sm text-gray-600">{paymentData.roomName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Check-in: {paymentData.checkIn}</p>
                      <p className="text-sm text-gray-600">Check-out: {paymentData.checkOut}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Guests: {paymentData.guests || 1}</p>
                    </div>
                  </div>
                </>
              )}

              {paymentData.bookingType === 'guide' && (
                <>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Guide: {paymentData.guideName}</p>
                      <p className="text-sm text-gray-600">{paymentData.guideEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Start: {paymentData.startDate}</p>
                      <p className="text-sm text-gray-600">End: {paymentData.endDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Group Size: {paymentData.groupSize}</p>
                      <p className="text-sm text-gray-600">Duration: {paymentData.duration}</p>
                    </div>
                  </div>
                </>
              )}

              {paymentData.bookingType === 'tour' && (
                <>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{paymentData.tourName}</p>
                      <p className="text-sm text-gray-600">{paymentData.tourDescription}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Start: {paymentData.startDate}</p>
                      <p className="text-sm text-gray-600">End: {paymentData.endDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Group Size: {paymentData.groupSize}</p>
                    </div>
                  </div>
                </>
              )}

              {paymentData.bookingType === 'vehicle' && (
                <>
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{paymentData.vehicleName}</p>
                      <p className="text-sm text-gray-600">{paymentData.vehicleType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Pickup: {paymentData.pickupLocation}</p>
                      <p className="text-sm text-gray-600">Dropoff: {paymentData.dropoffLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Pickup: {new Date(paymentData.pickupDateTime).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Dropoff: {new Date(paymentData.dropoffDateTime).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Passengers: {paymentData.passengers}</p>
                    </div>
                  </div>
                </>
              )}

              {paymentData.bookingType === 'custom-trip' && (
                <>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{paymentData.tripName}</p>
                      <p className="text-sm text-gray-600">{paymentData.tripDescription}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Start: {paymentData.startDate}</p>
                      <p className="text-sm text-gray-600">End: {paymentData.endDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Group Size: {paymentData.groupSize}</p>
                      <p className="text-sm text-gray-600">Guide: {paymentData.guideName}</p>
                    </div>
                  </div>
                  
                  {paymentData.interests && (
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">Interests: {paymentData.interests}</p>
                        <p className="text-sm text-gray-600">Accommodation: {paymentData.accommodation}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Customer Information */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pricing Breakdown */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {paymentData.bookingType === 'hotel' ? 'Room Price:' : 
                       paymentData.bookingType === 'tour' ? 'Tour Price:' : 
                       paymentData.bookingType === 'vehicle' ? 'Vehicle Rental:' :
                       paymentData.bookingType === 'custom-trip' ? 'Custom Trip Price:' :
                       'Service Price:'}
                    </span>
                    <span>{paymentData.currency} {paymentData.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees:</span>
                    <span>{paymentData.currency} {Math.round(paymentData.amount * 0.15)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {paymentData.currency} {Math.round(paymentData.amount * 1.15)}
                    </span>
                  </div>
                </div>
                {paymentData.bookingReference && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <span className="font-medium">Booking Reference:</span> {paymentData.bookingReference}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <StripeProvider>
            <PaymentForm
              bookingData={{
                bookingId: paymentData.bookingId,
                amount: Math.round(paymentData.amount * 1.15), // Include taxes
                currency: paymentData.currency,
                customerName: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Customer',
                customerEmail: user?.email || ''
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </StripeProvider>
        </div>
      </div>
    </div>
  )
}

export default Payment
