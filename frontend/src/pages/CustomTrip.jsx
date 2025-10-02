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
    destination: '',
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Custom trip submitted:', formData)
    alert('Your custom trip request has been submitted! We will contact you within 24 hours to discuss your personalized itinerary.')
    navigate('/')
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
                        Destination in Sri Lanka
                      </label>
                      <select
                        value={formData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      >
                        <option value="">Select a destination</option>
                        <option value="colombo">Colombo</option>
                        <option value="kandy">Kandy</option>
                        <option value="galle">Galle</option>
                        <option value="anuradhapura">Anuradhapura</option>
                        <option value="sigiriya">Sigiriya</option>
                        <option value="ella">Ella</option>
                        <option value="nuwara-eliya">Nuwara Eliya</option>
                        <option value="trincomalee">Trincomalee</option>
                        <option value="multiple">Multiple Cities</option>
                      </select>
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
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      />
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
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        required
                      />
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
                        <span className="font-medium text-slate-600">Destination:</span>
                        <span className="ml-2 text-slate-900 capitalize">{formData.destination}</span>
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
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Sparkles className="w-4 h-4" />
                    Submit Request
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
