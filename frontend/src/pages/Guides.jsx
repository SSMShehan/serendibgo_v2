import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Clock, Users, Search, Filter, Calendar, Phone, Mail, Award, Globe, Heart, ChevronDown, X, Shield, CheckCircle, Zap, Crown, Sparkles, Eye, BookOpen } from 'lucide-react'
import { guideService } from '../services/guideService'

const Guides = () => {
  const navigate = useNavigate()
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [bookingData, setBookingData] = useState({
    date: '',
    duration: '',
    groupSize: 1,
    specialRequests: ''
  })

  // Fetch guides from API
  useEffect(() => {
    fetchGuides()
    
    // Listen for guide profile updates
    const handleGuideUpdate = (event) => {
      console.log('Guide profile updated, refreshing guides list:', event.detail)
      fetchGuides()
    }
    
    window.addEventListener('guideProfileUpdated', handleGuideUpdate)
    
    return () => {
      window.removeEventListener('guideProfileUpdated', handleGuideUpdate)
    }
  }, [])

  const fetchGuides = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        search: searchTerm,
        location: selectedLocation,
        specialty: selectedSpecialty,
        limit: 50 // Get more guides
      }
      const response = await guideService.getGuides(params)
      setGuides(response.data || [])
    } catch (err) {
      console.error('Error fetching guides:', err)
      setError('Failed to load guides. Please try again.')
      // Fallback to empty array
      setGuides([])
    } finally {
      setLoading(false)
    }
  }

  // Refetch guides when filters change
  useEffect(() => {
    if (!loading) {
      fetchGuides()
    }
  }, [searchTerm, selectedLocation, selectedSpecialty])

  const locations = ['All Locations', 'Colombo', 'Kandy', 'Galle', 'Anuradhapura', 'Trincomalee']
  const specialties = ['All Specialties', 'Cultural Tours', 'Historical Sites', 'Nature Tours', 'Wildlife', 'Food Tours', 'Religious Tours', 'Luxury Tours', 'Family Tours']

  const handleBookGuide = (guide) => {
    setSelectedGuide(guide)
    setShowBookingModal(true)
  }

  const handleViewDetails = (guide) => {
    navigate(`/guides/${guide.id}`)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    console.log('Booking submitted:', { guide: selectedGuide, ...bookingData })
    alert('Booking request submitted successfully! We will contact you soon.')
    setShowBookingModal(false)
    setBookingData({
      date: '',
      duration: '',
      groupSize: 1,
      specialRequests: ''
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-cyan-500/10"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Crown className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-white/90 font-medium">Premium Certified Guides</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Professional
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Tour Guides
                  </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover Sri Lanka with our <span className="font-semibold text-blue-300">certified</span>, 
              <span className="font-semibold text-cyan-300"> experienced</span>, and 
              <span className="font-semibold text-blue-200"> passionate</span> local guides. 
              Each guide brings unique expertise and local knowledge to make your journey unforgettable.
            </p>
            
            {/* Search and Filter Section */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Search */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search guides or specialties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-slate-700 placeholder-slate-400 font-medium transition-all duration-200 hover:bg-white hover:shadow-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Location Filter */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white/80 backdrop-blur-sm text-slate-700 font-medium transition-all duration-200 hover:bg-white hover:shadow-lg"
                      >
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Specialty Filter */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white/80 backdrop-blur-sm text-slate-700 font-medium transition-all duration-200 hover:bg-white hover:shadow-lg"
                      >
                        {specialties.map(specialty => (
                          <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-slate-700 font-semibold">
              Showing {guides.length} certified guides
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-xl p-8 animate-pulse">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl mr-4"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="h-12 bg-slate-200 rounded-2xl"></div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-3xl p-8 max-w-md mx-auto">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Guides</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                  onClick={fetchGuides}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : guides.length === 0 ? (
            // No guides found
            <div className="col-span-full text-center py-16">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 max-w-md mx-auto">
                <div className="text-slate-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Guides Found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your search criteria or check back later.</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedLocation('')
                    setSelectedSpecialty('')
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            guides.map((guide) => (
              <div key={guide.id} className="group relative">
              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              
              {/* Main Card */}
              <div 
                onClick={() => handleViewDetails(guide)}
                className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 group-hover:border-blue-200 cursor-pointer"
              >
                {/* Premium Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold shadow-lg">
                    <Crown className="h-3 w-3 mr-1" />
                    PREMIUM
                  </div>
        </div>

                {/* Guide Header */}
                <div className="p-8">
                  <div className="flex items-start space-x-5">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-white text-3xl font-bold">
                    {guide.name.split(' ').map(n => n[0]).join('')}
                  </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                </div>
                <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{guide.name}</h3>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="ml-2 text-lg font-bold text-slate-700">{guide.rating}</span>
                          <span className="ml-2 text-sm text-slate-500 font-medium">({guide.reviewCount} reviews)</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">{guide.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="font-medium">{guide.experience} experience</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <div className="text-3xl font-bold text-green-600">LKR {guide.price.toLocaleString()}</div>
                      <div className="ml-2 text-sm text-green-600 font-medium">per day</div>
                  </div>
                </div>
              </div>
              
                {/* Description */}
                <div className="px-8 pb-6">
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{guide.description}</p>
                  </div>
                </div>
                
                {/* Languages */}
                <div className="px-8 pb-4">
                  <div className="flex items-center mb-3">
                    <Globe className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-semibold text-slate-700">Languages</span>
                  </div>
                <div className="flex flex-wrap gap-2">
                    {guide.languages.slice(0, 3).map((lang) => (
                      <span key={lang} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm rounded-xl font-semibold border border-blue-300">
                      {lang}
                    </span>
                  ))}
                    {guide.languages.length > 3 && (
                      <span className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 text-sm rounded-xl font-semibold border border-slate-300">
                        +{guide.languages.length - 3} more
                      </span>
                    )}
                </div>
              </div>
              
                {/* Specialties */}
                <div className="px-8 pb-8">
                  <div className="flex items-center mb-3">
                    <Award className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-sm font-semibold text-slate-700">Specialties</span>
                  </div>
                <div className="flex flex-wrap gap-2">
                    {guide.specialties.slice(0, 2).map((specialty) => (
                      <span key={specialty} className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-sm rounded-xl font-semibold border border-purple-300">
                        {specialty}
                      </span>
                    ))}
                    {guide.specialties.length > 2 && (
                      <span className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 text-sm rounded-xl font-semibold border border-slate-300">
                        +{guide.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              
                {/* Action Buttons */}
                <div className="px-8 pb-8 flex space-x-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetails(guide)
                    }}
                    className="flex-1 px-6 py-4 border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 font-semibold flex items-center justify-center group"
                  >
                    <Eye className="h-5 w-5 mr-2 group-hover:text-blue-500 transition-colors" />
                    View Details
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBookGuide(guide)
                    }}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center group"
                  >
                    <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Book Now
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
        
        {guides.length === 0 && !loading && !error && (
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-slate-100">
                <div className="text-slate-400 mb-6">
                  <Users className="h-20 w-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No guides found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your search criteria or filters to find the perfect guide for your adventure.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedLocation('')
                    setSelectedSpecialty('')
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200 p-8 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {selectedGuide.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Book {selectedGuide.name}</h2>
                    <p className="text-slate-600 font-medium">Complete your booking details below</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Bio */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-6 border border-slate-100">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-2xl font-bold text-slate-900">About</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-lg font-medium">{selectedGuide.bio}</p>
                  </div>
                  
                  {/* Highlights */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-6 border border-yellow-100">
                    <div className="flex items-center mb-4">
                      <Award className="h-6 w-6 text-yellow-600 mr-3" />
                      <h3 className="text-2xl font-bold text-slate-900">Key Highlights</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedGuide.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center p-3 bg-white/60 rounded-2xl border border-yellow-200">
                          <Zap className="h-5 w-5 text-yellow-500 mr-3" />
                          <span className="text-slate-700 font-semibold">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Specialties */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
                    <div className="flex items-center mb-4">
                      <Award className="h-6 w-6 text-purple-600 mr-3" />
                      <h3 className="text-2xl font-bold text-slate-900">Specialties</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedGuide.specialties.map((specialty) => (
                        <span key={specialty} className="px-4 py-3 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-2xl font-bold border border-purple-300 shadow-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
                  {/* Languages */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <Globe className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-2xl font-bold text-slate-900">Languages</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedGuide.languages.map((lang) => (
                        <span key={lang} className="px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-2xl font-bold border border-blue-300 shadow-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-200 shadow-xl">
                    <div className="text-center mb-8">
                      <div className="relative mx-auto mb-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                          <span className="text-white text-4xl font-bold">
                            {selectedGuide.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedGuide.name}</h3>
                      <div className="flex items-center justify-center mb-4">
                        <Star className="h-6 w-6 text-yellow-400 fill-current" />
                        <span className="ml-2 text-xl font-bold text-slate-700">{selectedGuide.rating}</span>
                        <span className="ml-2 text-slate-500">({selectedGuide.reviewCount} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center p-3 bg-white/60 rounded-2xl border border-slate-200">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-purple-500 mr-2" />
                          <span className="text-slate-600 font-medium">Experience</span>
                        </div>
                        <span className="font-bold text-slate-900">{selectedGuide.experience}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/60 rounded-2xl border border-slate-200">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-slate-600 font-medium">Location</span>
                        </div>
                        <span className="font-bold text-slate-900">{selectedGuide.location}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/60 rounded-2xl border border-slate-200">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-slate-600 font-medium">Tours Completed</span>
                        </div>
                        <span className="font-bold text-slate-900">{selectedGuide.completedTours}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/60 rounded-2xl border border-slate-200">
                        <div className="flex items-center">
                          <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="text-slate-600 font-medium">Response Time</span>
                        </div>
                        <span className="font-bold text-slate-900">{selectedGuide.responseTime}</span>
                      </div>
                    </div>
                    
                    <div className="text-center mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl border border-green-200">
                      <div className="text-4xl font-bold text-green-600 mb-2">LKR {selectedGuide.price.toLocaleString()}</div>
                      <div className="text-green-600 font-semibold">per day</div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowDetailsModal(false)
                        handleBookGuide(selectedGuide)
                      }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Book This Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200 p-8 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {selectedGuide.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Book {selectedGuide.name}</h2>
                    <p className="text-slate-600 font-medium">Complete your booking details below</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              
              <form onSubmit={handleBookingSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      Tour Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 hover:bg-white transition-all duration-200 font-medium"
                      required
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Duration
                    </label>
                    <select
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 hover:bg-white transition-all duration-200 font-medium appearance-none"
                      required
                    >
                      <option value="">Select duration</option>
                      <option value="half-day">Half Day (4 hours)</option>
                      <option value="full-day">Full Day (8 hours)</option>
                      <option value="multi-day">Multi Day</option>
                    </select>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    Group Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={bookingData.groupSize}
                    onChange={(e) => setBookingData({...bookingData, groupSize: parseInt(e.target.value)})}
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-slate-50 hover:bg-white transition-all duration-200 font-medium"
                    required
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    Special Requests
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    rows="4"
                    placeholder="Any special requirements or requests..."
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50 hover:bg-white transition-all duration-200 font-medium resize-none"
                  />
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-slate-900">Total Price</span>
                    <span className="text-4xl font-bold text-green-600">
                      LKR {(selectedGuide.price * bookingData.groupSize).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">
                      {bookingData.groupSize} person(s) × LKR {selectedGuide.price.toLocaleString()}
                    </span>
                    <div className="flex items-center text-green-600 font-semibold">
                      <Shield className="h-4 w-4 mr-1" />
                      Secure Payment
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-6">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Submit Booking Request
                  </button>
                </div>
              </form>
        </div>
      </div>
        </div>
      )}
    </div>
  )
}

export default Guides
