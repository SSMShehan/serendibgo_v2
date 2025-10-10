import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { 
  CreditCard, 
  CheckCircle, 
  Calendar, 
  Users, 
  MapPin,
  Bed,
  DollarSign,
  ArrowLeft
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
      navigate('/hotels')
    }
  }, [location.state, navigate])

  const handlePayment = async () => {
    if (!paymentData) return
    
    setLoading(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Payment completed successfully!')
      navigate('/my-bookings')
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
              
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Room Price:</span>
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
              Payment Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Processing Payment...' : `Pay ${paymentData.currency} ${Math.round(paymentData.amount * 1.15)}`}
                  </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
