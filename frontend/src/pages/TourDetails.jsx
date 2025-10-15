import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  MapPin,
  Star,
  Clock,
  Users,
  Calendar,
  Phone,
  Mail,
  Award,
  Globe,
  Shield,
  CheckCircle,
  Zap,
  Crown,
  Sparkles,
  Eye,
  BookOpen,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Camera,
  Navigation,
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Minus,
  Plus
} from 'lucide-react'
import { useTour } from '../context/TourContext'

const TourDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tours, setCurrentTour } = useTour()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [bookingData, setBookingData] = useState({
    date: '',
    duration: '',
    groupSize: 1,
    specialRequests: ''
  })
  const [showBookingCalendar, setShowBookingCalendar] = useState(false)
  const [selectedBookingDate, setSelectedBookingDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch tour data
  useEffect(() => {
    if (id) {
      fetchTour()
    }
  }, [id])

  const fetchTour = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get(`/tours/${id}`)
      if (response.data.success) {
        const tourData = response.data.data
        setTour(tourData)
        setCurrentTour(tourData)
      } else {
        setError('Tour not found')
      }
    } catch (err) {
      console.error('Error fetching tour:', err)
      setError('Failed to load tour details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    console.log('Booking submitted:', { tour: tour, ...bookingData })
    alert('Booking request submitted successfully! We will contact you soon.')
    setShowBookingModal(false)
    setBookingData({
      date: '',
      duration: '',
      groupSize: 1,
      specialRequests: ''
    })
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tour.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Tour Details...</h2>
          <p className="text-slate-600">Please wait while we fetch the tour information</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Tour</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/tours')} 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Back to Tours
          </button>
        </div>
      </div>
    )
  }

  if (!tour) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tour Not Found</h2>
          <p className="text-slate-600 mb-6">The tour you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/tours')} 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Back to Tours
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate('/tours')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tours
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="aspect-[16/10] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl overflow-hidden relative">
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-24 h-24 text-blue-500/30" />
                </div>
                
                {/* Image Navigation */}
                {tour.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-slate-700" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {tour.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {tour.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {tour.isFeatured && (
                    <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold shadow-lg">
                      <Award className="h-3 w-3 mr-1" />
                      FEATURED
                    </div>
                  )}
                  {tour.originalPrice && (
                    <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                      -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={toggleWishlist}
                  className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-slate-600'}`} />
                </button>
              </div>
            </div>

            {/* Tour Title and Basic Info */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 text-blue-800 text-sm font-semibold">
                  {tour.category.charAt(0).toUpperCase() + tour.category.slice(1)} Tour
                </div>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800 text-sm font-semibold">
                  {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-4">{tour.title}</h1>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-700 font-medium">{tour.location.name}, {tour.location.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-slate-700 font-medium">{tour.duration} day{tour.duration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700 font-medium">{tour.minParticipants}-{tour.maxParticipants} people</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 ${i < Math.floor(tour.rating.average) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-slate-700">{tour.rating.average}</span>
                <span className="text-slate-600">({tour.rating.count} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-lg leading-relaxed mb-8">{tour.description}</p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex border-b border-slate-200">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'itinerary', label: 'Itinerary', icon: Calendar },
                  { id: 'included', label: 'What\'s Included', icon: CheckCircle },
                  { id: 'reviews', label: 'Reviews', icon: Star }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="py-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Highlights */}
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Tour Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tour.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-slate-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Requirements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tour.requirements.map((requirement, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Info className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                            <span className="text-slate-700">{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Time to Visit */}
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Best Time to Visit</h3>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Best Months
                            </h4>
                            <p className="text-slate-700">{tour.seasonality.bestMonths.join(', ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                              <XCircle className="w-5 h-5" />
                              Avoid Months
                            </h4>
                            <p className="text-slate-700">{tour.seasonality.avoidMonths.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    {tour.itinerary.map((day, index) => (
                      <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Day {day.day}: {day.title}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-blue-500" />
                              Activities
                            </h4>
                            <ul className="space-y-2">
                              {day.activities.map((activity, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <ChevronRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                  <span className="text-slate-600">{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                              <Award className="w-5 h-5 text-purple-500" />
                              Highlights
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {day.highlights.map((highlight, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-semibold text-slate-600">Meals: </span>
                              <span className="text-slate-700">{day.meals.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-slate-600">Accommodation: </span>
                              <span className="text-slate-700">{day.accommodation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'included' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        What's Included
                      </h3>
                      <div className="space-y-3">
                        {tour.included.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <XCircle className="w-6 h-6 text-red-500" />
                        What's Not Included
                      </h3>
                      <div className="space-y-3">
                        {tour.excluded.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                            <span className="text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-slate-900">Customer Reviews</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900">{tour.rating.average}</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(tour.rating.average) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                            />
                          ))}
                        </div>
                        <div className="text-slate-600">Based on {tour.rating.count} reviews</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {tour.reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {review.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-slate-900">{review.name}</h4>
                                  {review.verified && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                                    />
                                  ))}
                                  <span className="text-slate-600 text-sm">{review.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
                {/* Price */}
                <div className="text-center mb-6">
                  {tour.originalPrice && (
                    <div className="text-lg text-slate-500 line-through mb-2">${tour.originalPrice}</div>
                  )}
                  <div className="text-4xl font-bold text-slate-900 mb-2">${tour.price}</div>
                  <div className="text-slate-600">per person</div>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Book Now
                </button>

                {/* Quick Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{tour.duration} day{tour.duration > 1 ? 's' : ''} tour</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>{tour.minParticipants}-{tour.maxParticipants} people</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{tour.location.name}</span>
                  </div>
                </div>

                       {/* Guide Info */}
                       <div className="mt-6 pt-6 border-t border-slate-200">
                         <h4 className="font-semibold text-slate-900 mb-3">Your Guide</h4>
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                             <span className="text-white font-bold">
                               {tour.guide ? (tour.guide.firstName + ' ' + tour.guide.lastName).split(' ').map(n => n[0]).join('') : 'G'}
                             </span>
                           </div>
                           <div>
                             <div className="font-semibold text-slate-900">
                               {tour.guide ? `${tour.guide.firstName} ${tour.guide.lastName}` : 'Professional Guide'}
                             </div>
                             <div className="text-sm text-slate-600">
                               {tour.guide?.profile?.experience || 'Experienced'} guide
                             </div>
                             <div className="flex items-center gap-1">
                               <Star className="w-4 h-4 text-yellow-400 fill-current" />
                               <span className="text-sm font-medium">4.8</span>
                             </div>
                           </div>
                         </div>
                       </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 my-4">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Book {tour.title}</h2>
                  <p className="text-slate-600 font-medium">Complete your booking details below</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Price Display */}
              <div className="text-center mb-6">
                {tour.originalPrice && (
                  <div className="text-lg text-slate-500 line-through mb-2">${tour.originalPrice}</div>
                )}
                <div className="text-3xl font-bold text-slate-900 mb-2">${tour.price}</div>
                <div className="text-slate-600">per person</div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tour Date</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Group Size</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingData({...bookingData, groupSize: Math.max(1, bookingData.groupSize - 1)})}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={bookingData.groupSize}
                      onChange={(e) => setBookingData({...bookingData, groupSize: parseInt(e.target.value) || 1})}
                      min="1"
                      max={tour.maxParticipants}
                      className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setBookingData({...bookingData, groupSize: Math.min(tour.maxParticipants, bookingData.groupSize + 1)})}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {tour.minParticipants}-{tour.maxParticipants} people
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Special Requests</label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    rows="3"
                    placeholder="Any special requirements..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* Total Price */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total Price</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(tour.price * bookingData.groupSize).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {bookingData.groupSize} person(s) × ${tour.price}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Book Now
                  </button>
                </div>
              </form>

              {/* Cancellation Policy */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Cancellation Policy</h4>
                    <p className="text-sm text-slate-600">{tour.cancellationDetails}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TourDetails
