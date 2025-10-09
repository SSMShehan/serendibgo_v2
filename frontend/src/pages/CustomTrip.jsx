import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  Share2,
  Camera,
  Navigation,
  Utensils,
  Bed,
  Car,
  Plane,
  Mountain,
  Waves,
  TreePine,
  Building,
  Sparkles,
  Zap,
  Award,
  Shield,
  Info,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const CustomTrip = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    destinations: [], // Array of custom destination strings
    startDate: '',
    endDate: '',
    groupSize: 1,
    budget: '',
    
    // Step 2: Preferences
    interests: [],
    accommodation: '',
    transport: [],
    activities: [],
    
    // Step 3: Details
    specialRequests: '',
    dietaryRequirements: '',
    accessibility: '',
    
    // Step 4: Contact
    name: '',
    email: '',
    phone: '',
    emergencyContact: ''
  })

  const [showInterests, setShowInterests] = useState(false)
  const [showActivities, setShowActivities] = useState(false)
  const [loading, setLoading] = useState(false)
  const [destinationInput, setDestinationInput] = useState('')

  const interests = [
    { id: 'culture', label: 'Culture & History', icon: Building },
    { id: 'nature', label: 'Nature & Wildlife', icon: TreePine },
    { id: 'adventure', label: 'Adventure Sports', icon: Mountain },
    { id: 'beach', label: 'Beach & Relaxation', icon: Waves },
    { id: 'food', label: 'Food & Cuisine', icon: Utensils },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'shopping', label: 'Shopping', icon: Building },
    { id: 'nightlife', label: 'Nightlife', icon: Sparkles }
  ]

  const activities = [
    { id: 'hiking', label: 'Hiking & Trekking', price: 50 },
    { id: 'diving', label: 'Scuba Diving', price: 120 },
    { id: 'safari', label: 'Wildlife Safari', price: 80 },
    { id: 'city-tour', label: 'City Tours', price: 30 },
    { id: 'cooking', label: 'Cooking Classes', price: 40 },
    { id: 'yoga', label: 'Yoga & Wellness', price: 35 },
    { id: 'water-sports', label: 'Water Sports', price: 60 },
    { id: 'cultural-show', label: 'Cultural Shows', price: 25 }
  ]

  const accommodationOptions = [
    { id: 'budget', label: 'Budget Hotels', price: 50, description: 'Clean and comfortable basic accommodation' },
    { id: 'mid-range', label: 'Mid-Range Hotels', price: 100, description: 'Good quality hotels with modern amenities' },
    { id: 'luxury', label: 'Luxury Hotels', price: 200, description: 'Premium hotels with exceptional service' },
    { id: 'resort', label: 'Resorts', price: 150, description: 'All-inclusive resort experience' },
    { id: 'homestay', label: 'Homestays', price: 30, description: 'Authentic local experience' }
  ]

  const transportOptions = [
    { id: 'bus', label: 'Public Bus', price: 5, icon: Car },
    { id: 'private-car', label: 'Private Car', price: 80, icon: Car },
    { id: 'train', label: 'Train', price: 15, icon: Car },
    { id: 'flight', label: 'Domestic Flight', price: 120, icon: Plane },
    { id: 'boat', label: 'Boat/Cruise', price: 40, icon: Waves }
  ]

  const handleAddDestination = () => {
    const destination = destinationInput.trim()
    if (destination && !formData.destinations.includes(destination)) {
      setFormData(prev => ({
        ...prev,
        destinations: [...prev.destinations, destination]
      }))
      setDestinationInput('')
    }
  }

  const handleRemoveDestination = (destinationToRemove) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter(dest => dest !== destinationToRemove)
    }))
  }

  const handleDestinationKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddDestination()
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get minimum end date (start date + 1 day)
  const getMinEndDate = () => {
    if (formData.startDate) {
      const startDate = new Date(formData.startDate)
      startDate.setDate(startDate.getDate() + 1)
      return startDate.toISOString().split('T')[0]
    }
    return getTodayDate()
  }

  // Validate date selection
  const validateDates = () => {
    const today = new Date()
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)

    if (formData.startDate && startDate < today) {
      return 'Start date cannot be in the past'
    }
    if (formData.endDate && formData.startDate && endDate <= startDate) {
      return 'End date must be after start date'
    }
    return null
  }

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const handleActivityToggle = (activityId) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter(id => id !== activityId)
        : [...prev.activities, activityId]
    }))
  }

  const handleTransportToggle = (transportId) => {
    setFormData(prev => ({
      ...prev,
      transport: prev.transport.includes(transportId)
        ? prev.transport.filter(id => id !== transportId)
        : [...prev.transport, transportId]
    }))
  }

  const calculateEstimatedCost = () => {
    let total = 0
    
    // Accommodation cost
    const selectedAccommodation = accommodationOptions.find(acc => acc.id === formData.accommodation)
    if (selectedAccommodation) {
      const days = formData.startDate && formData.endDate 
        ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))
        : 1
      total += selectedAccommodation.price * days * formData.groupSize
    }
    
    // Activity costs
    formData.activities.forEach(activityId => {
      const activity = activities.find(act => act.id === activityId)
      if (activity) {
        total += activity.price * formData.groupSize
      }
    })
    
    // Transport costs
    formData.transport.forEach(transportId => {
      const transport = transportOptions.find(trans => trans.id === transportId)
      if (transport) {
        total += transport.price * formData.groupSize
      }
    })
    
    return total
  }

  const nextStep = () => {
    // Validate required fields before moving to next step
    if (currentStep === 1) {
      // Step 1: Basic Info - validate dates and destinations
      if (!formData.startDate || !formData.endDate) {
        alert('Please select both start and end dates')
        return
      }
      
      if (!formData.destinations || formData.destinations.length === 0) {
        alert('Please add at least one destination')
        return
      }
      
      const dateError = validateDates()
      if (dateError) {
        alert(dateError)
        return
      }
    }
    
    if (currentStep === 2) {
      // Step 2: Preferences - validate budget
      if (!formData.budget || formData.budget.trim() === '') {
        alert('Please enter your budget')
        return
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Comprehensive validation before submission
    if (!formData.startDate || !formData.endDate) {
      alert('Please select both start and end dates')
      return
    }
    
    if (!formData.budget || formData.budget.trim() === '') {
      alert('Please enter your budget')
      return
    }
    
    if (!formData.destinations || formData.destinations.length === 0) {
      alert('Please add at least one destination')
      return
    }
    
    // Validate dates before submission
    const dateError = validateDates()
    if (dateError) {
      alert(dateError)
      return
    }
    
    setLoading(true)
    
    try {
      // Map destination names to enum values
      const destinationMap = {
        'colombo': 'Colombo',
        'kandy': 'Kandy',
        'galle': 'Galle',
        'negombo': 'Negombo',
        'bentota': 'Bentota',
        'hikkaduwa': 'Hikkaduwa',
        'unawatuna': 'Unawatuna',
        'mirissa': 'Mirissa',
        'weligama': 'Weligama',
        'tangalle': 'Tangalle',
        'arugam bay': 'Arugam Bay',
        'nuwara eliya': 'Nuwara Eliya',
        'ella': 'Ella',
        'bandarawela': 'Bandarawela',
        'haputale': 'Haputale',
        'sigiriya': 'Sigiriya',
        'dambulla': 'Dambulla',
        'anuradhapura': 'Anuradhapura',
        'polonnaruwa': 'Polonnaruwa',
        'trincomalee': 'Trincomalee',
        'batticaloa': 'Batticaloa',
        'jaffna': 'Jaffna',
        'kalpitiya': 'Kalpitiya',
        'chilaw': 'Chilaw',
        'puttalam': 'Puttalam'
      }

      // Prepare the data for API submission
      const tripData = {
        destination: formData.destinations.length > 1 ? 'Multiple Cities' : 
                   (destinationMap[formData.destinations[0]?.toLowerCase()] || 'Sri Lanka'),
        destinations: formData.destinations, // Send the full array
        startDate: formData.startDate,
        endDate: formData.endDate,
        groupSize: formData.groupSize,
        budget: formData.budget,
        interests: formData.interests || [],
        accommodation: formData.accommodation,
        transport: formData.transport || [],
        activities: (formData.activities || []).map(activityId => {
          const activity = activities.find(act => act.id === activityId)
          return {
            id: activityId,
            label: activity?.label || activityId,
            price: activity?.price || 0
          }
        }),
        specialRequests: formData.specialRequests,
        dietaryRequirements: formData.dietaryRequirements,
        accessibility: formData.accessibility,
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          emergencyContact: formData.emergencyContact
        }
      }

      console.log('Submitting custom trip:', tripData)

      const response = await fetch('/api/custom-trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tripData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Your custom trip request has been submitted successfully! We will contact you within 24 hours to discuss your personalized itinerary.')
        navigate('/my-bookings')
      } else {
        alert(data.message || 'Failed to submit custom trip request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting custom trip:', error)
      alert('An error occurred while submitting your request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Tell us about your trip' },
    { id: 2, title: 'Preferences', description: 'What interests you?' },
    { id: 3, title: 'Details', description: 'Special requirements' },
    { id: 4, title: 'Contact', description: 'How to reach you' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Create Your Custom Trip</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Design your perfect Sri Lankan adventure with our personalized trip planning service. 
            Tell us your preferences and we'll create a unique itinerary just for you.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-600 text-white shadow-lg'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="font-bold">{step.id}</span>
                  )}
                </div>
                <div className="ml-4 hidden sm:block">
                  <div className={`font-semibold ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-slate-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-6 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Basic Trip Information</h2>
                    <p className="text-slate-600">Let's start with the basics of your dream trip</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Destinations
                      </label>
                      <p className="text-sm text-slate-600 mb-4">Add the places you want to visit in Sri Lanka</p>
                      
                      {/* Destination Input */}
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={destinationInput}
                          onChange={(e) => setDestinationInput(e.target.value)}
                          onKeyPress={handleDestinationKeyPress}
                          placeholder="Type destination name (e.g., Colombo, Kandy, Galle...)"
                          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={handleAddDestination}
                          disabled={!destinationInput.trim()}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Selected Destinations */}
                      {formData.destinations.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600 font-medium">Selected destinations:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.destinations.map((destination, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                <MapPin className="w-4 h-4" />
                                {destination}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDestination(destination)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        min={getTodayDate()}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      />
                      {formData.startDate && new Date(formData.startDate) < new Date() && (
                        <p className="text-red-500 text-sm mt-1">Start date cannot be in the past</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        min={getMinEndDate()}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      />
                      {formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate) && (
                        <p className="text-red-500 text-sm mt-1">End date must be after start date</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Group Size
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleInputChange('groupSize', Math.max(1, formData.groupSize - 1))}
                          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={formData.groupSize}
                          onChange={(e) => handleInputChange('groupSize', parseInt(e.target.value) || 1)}
                          min="1"
                          max="20"
                          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleInputChange('groupSize', Math.min(20, formData.groupSize + 1))}
                          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <Star className="w-4 h-4 inline mr-2" />
                        Budget Range (USD)
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      >
                        <option value="">Select budget range</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-2000">$1,000 - $2,000</option>
                        <option value="2000-3000">$2,000 - $3,000</option>
                        <option value="3000-5000">$3,000 - $5,000</option>
                        <option value="5000+">$5,000+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Preferences */}
              {currentStep === 2 && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Preferences</h2>
                    <p className="text-slate-600">Help us understand what you're looking for</p>
                  </div>

                  {/* Interests */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Interests & Activities</h3>
                      <button
                        type="button"
                        onClick={() => setShowInterests(!showInterests)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {showInterests ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showInterests ? 'Hide' : 'Show'} Options
                      </button>
                    </div>
                    
                    {showInterests && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {interests.map((interest) => (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => handleInterestToggle(interest.id)}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                              formData.interests.includes(interest.id)
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <interest.icon className="w-6 h-6 mb-2" />
                            <div className="text-sm font-medium">{interest.label}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Accommodation */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Accommodation Preference</h3>
                    <div className="space-y-3">
                      {accommodationOptions.map((option) => (
                        <label key={option.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-300">
                          <input
                            type="radio"
                            name="accommodation"
                            value={option.id}
                            checked={formData.accommodation === option.id}
                            onChange={(e) => handleInputChange('accommodation', e.target.value)}
                            className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-slate-900">{option.label}</div>
                              <div className="text-blue-600 font-bold">${option.price}/night</div>
                            </div>
                            <div className="text-sm text-slate-600 mt-1">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Transport */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Transportation Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {transportOptions.map((option) => (
                        <label key={option.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-300">
                          <input
                            type="checkbox"
                            checked={formData.transport.includes(option.id)}
                            onChange={() => handleTransportToggle(option.id)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <option.icon className="w-5 h-5 text-slate-600" />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{option.label}</div>
                            <div className="text-sm text-slate-600">${option.price}/person</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Specific Activities</h3>
                      <button
                        type="button"
                        onClick={() => setShowActivities(!showActivities)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {showActivities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showActivities ? 'Hide' : 'Show'} Activities
                      </button>
                    </div>
                    
                    {showActivities && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activities.map((activity) => (
                          <label key={activity.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-300">
                            <input
                              type="checkbox"
                              checked={formData.activities.includes(activity.id)}
                              onChange={() => handleActivityToggle(activity.id)}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">{activity.label}</div>
                              <div className="text-sm text-slate-600">${activity.price}/person</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {currentStep === 3 && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Special Requirements</h2>
                    <p className="text-slate-600">Any special needs or requests for your trip?</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <Info className="w-4 h-4 inline mr-2" />
                        Special Requests
                      </label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        rows="4"
                        placeholder="Any special requests, celebrations, or specific experiences you'd like to include..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-900 placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <Utensils className="w-4 h-4 inline mr-2" />
                        Dietary Requirements
                      </label>
                      <textarea
                        value={formData.dietaryRequirements}
                        onChange={(e) => handleInputChange('dietaryRequirements', e.target.value)}
                        rows="3"
                        placeholder="Any dietary restrictions, allergies, or food preferences..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-900 placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Accessibility Requirements
                      </label>
                      <textarea
                        value={formData.accessibility}
                        onChange={(e) => handleInputChange('accessibility', e.target.value)}
                        rows="3"
                        placeholder="Any mobility or accessibility requirements..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contact */}
              {currentStep === 4 && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact Information</h2>
                    <p className="text-slate-600">How can we reach you to discuss your custom trip?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Emergency Contact</label>
                      <input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="Name and phone number"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Trip Summary */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Trip Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-600">Destinations:</span>
                        <div className="ml-2 text-slate-900">
                          {formData.destinations.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {formData.destinations.map((dest, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                  {dest}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">Not specified</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Duration:</span>
                        <span className="ml-2 text-slate-900">
                          {formData.startDate && formData.endDate 
                            ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + ' days'
                            : 'Not specified'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Group Size:</span>
                        <span className="ml-2 text-slate-900">{formData.groupSize} person(s)</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Budget:</span>
                        <span className="ml-2 text-slate-900">{formData.budget}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900">Estimated Cost:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${calculateEstimatedCost().toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        *Final price may vary based on availability and specific requirements
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    currentStep === 1
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-white hover:shadow-lg border border-slate-300'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                      loading 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Submit Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Custom Trip Service?</h2>
            <p className="text-slate-600 text-lg">We make your dream trip a reality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Expert Planning</h3>
              <p className="text-slate-600">Our local experts create personalized itineraries based on your preferences and interests.</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">24/7 Support</h3>
              <p className="text-slate-600">Round-the-clock assistance during your trip to ensure everything goes smoothly.</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Best Value</h3>
              <p className="text-slate-600">Get the most out of your budget with our local partnerships and insider knowledge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomTrip
