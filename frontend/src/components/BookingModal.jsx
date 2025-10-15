import React, { useState } from 'react'
import { X, Calendar, Users, DollarSign, Clock, User, MapPin, AlertCircle } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const BookingModal = ({ tour, isOpen, onClose, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    groupSize: 1,
    specialRequests: '',
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Calculate total amount
  const calculateTotal = () => {
    if (!tour?.price || !formData.startDate || !formData.endDate || !formData.groupSize) {
      console.log('Missing required data:', { 
        price: tour?.price, 
        startDate: formData.startDate, 
        endDate: formData.endDate, 
        groupSize: formData.groupSize 
      })
      return 0
    }
    
    const start = new Date(formData.startDate + 'T00:00:00')
    const end = new Date(formData.endDate + 'T00:00:00')
    
    // Ensure end date is after start date
    if (end <= start) {
      console.log('End date is not after start date:', { start, end })
      return 0
    }
    
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    const total = tour.price * formData.groupSize * days
    
    console.log('Calculation:', { 
      price: tour.price, 
      groupSize: formData.groupSize, 
      days, 
      total 
    })
    
    return total
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    if (!formData.groupSize || formData.groupSize < 1) newErrors.groupSize = 'Group size must be at least 1'
    if (formData.groupSize > tour?.maxParticipants) newErrors.groupSize = `Maximum ${tour?.maxParticipants} participants allowed`
    if (!formData.contactInfo.firstName) newErrors.firstName = 'First name is required'
    if (!formData.contactInfo.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.contactInfo.email) newErrors.email = 'Email is required'
    if (!formData.contactInfo.phone) newErrors.phone = 'Phone number is required'
    
    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past'
      }
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('You must be logged in to book a tour')
      return
    }
    
    // Check if user has a valid token
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Authentication token not found. Please log in again.')
      return
    }
    
    // Check if total amount is valid
    if (totalAmount <= 0) {
      toast.error('Please select valid dates and group size to calculate the total amount')
      return
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setLoading(true)
    
    try {
      const bookingData = {
        tourId: tour._id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        groupSize: formData.groupSize,
        specialRequests: formData.specialRequests,
        contactInfo: formData.contactInfo
      }
      
      console.log('Sending booking data:', bookingData)
      console.log('User token:', localStorage.getItem('token'))
      console.log('User authenticated:', isAuthenticated)
      console.log('User data:', user)
      
      const response = await api.post('/bookings', bookingData)
      
      if (response.data.success) {
        toast.success('Booking created successfully!')
        onBookingSuccess?.(response.data.data)
        onClose()
        
        // Reset form
        setFormData({
          startDate: '',
          endDate: '',
          groupSize: 1,
          specialRequests: '',
          contactInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
          }
        })
      } else {
        toast.error(response.data.message || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleContactInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  if (!isOpen) return null

  // Show authentication required message if user is not logged in
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">You need to be logged in to book a tour.</p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClose()
                  window.location.href = '/login'
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalAmount = calculateTotal()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Book This Tour</h3>
              <p className="text-gray-600 mt-1">{tour?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tour Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-4">
              {tour?.images && tour.images.length > 0 ? (
                <img
                  src={tour.images[0].url || tour.images[0]}
                  alt={tour.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{tour?.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{tour?.shortDescription}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour?.duration} day{tour?.duration > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Up to {tour?.maxParticipants} people
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    LKR {tour?.price?.toLocaleString()} per person
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Travel Dates */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Travel Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.endDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of People *
              </label>
              <input
                type="number"
                min="1"
                max={tour?.maxParticipants || 50}
                value={formData.groupSize}
                onChange={(e) => handleInputChange('groupSize', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.groupSize ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.groupSize && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.groupSize}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Maximum {tour?.maxParticipants} people allowed
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.firstName}
                    onChange={(e) => handleContactInfoChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.lastName}
                    onChange={(e) => handleContactInfoChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requests or dietary requirements..."
              />
            </div>

            {/* Price Summary */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Price Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Price per person:</span>
                  <span>LKR {tour?.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of people:</span>
                  <span>{formData.groupSize}</span>
                </div>
                {formData.startDate && formData.endDate && (
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>
                      {formData.startDate && formData.endDate ? 
                        Math.ceil((new Date(formData.endDate + 'T00:00:00') - new Date(formData.startDate + 'T00:00:00')) / (1000 * 60 * 60 * 24)) : 0} day(s)
                    </span>
                  </div>
                )}
                <div className="border-t border-blue-200 pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>LKR {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now - LKR {totalAmount.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingModal
