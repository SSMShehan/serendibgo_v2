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
  Plus,
  DollarSign,
  Plane,
  Home,
  Utensils,
  Wifi,
  Car,
  Mountain,
  Camera as CameraIcon,
  Map
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Large Image with Overlay */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          {tour.images && tour.images.length > 0 ? (
            <img
              src={tour.images[0].url || tour.images[0]}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <Mountain className="w-32 h-32 text-blue-500/30" />
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <button
            onClick={() => navigate('/tours')}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tours
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleWishlist}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
              {/* Left Content */}
              <div className="lg:col-span-2">
                {/* Badges */}
                <div className="flex items-center gap-3 mb-6">
                  {tour.isFeatured && (
                    <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold shadow-lg">
                      <Award className="h-4 w-4 mr-1" />
                      FEATURED
                    </div>
                  )}
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold border border-white/30">
                    {tour.category.charAt(0).toUpperCase() + tour.category.slice(1)} Tour
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold border border-white/30">
                    {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">{tour.title}</h1>
                
                {/* Location and Duration */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    <span className="text-xl font-medium">{tour.location?.name || tour.location || 'Location TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    <span className="text-xl font-medium">{tour.duration} day{tour.duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="text-xl font-medium">{tour.minParticipants}-{tour.maxParticipants} people</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-6 w-6 ${i < Math.floor(tour.rating?.average || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold">{tour.rating?.average || 0}</span>
                  <span className="text-lg">({tour.rating?.count || 0} reviews)</span>
                </div>
              </div>

              {/* Right Content - Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                  {/* Price */}
                  <div className="text-center mb-6">
                    {tour.originalPrice && (
                      <div className="text-lg text-gray-500 line-through mb-2">LKR {tour.originalPrice.toLocaleString()}</div>
                    )}
                    <div className="text-4xl font-bold text-gray-900 mb-2">LKR {tour.price?.toLocaleString() || '0'}</div>
                    <div className="text-gray-600">per person</div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 mb-6"
                  >
                    <BookOpen className="w-5 h-5" />
                    Book Now
                  </button>

                  {/* Quick Info */}
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{tour.duration} day{tour.duration > 1 ? 's' : ''} tour</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-green-500" />
                      <span>{tour.minParticipants}-{tour.maxParticipants} people</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>{tour.location?.name || tour.location || 'Location TBD'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Overview Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{tour.description}</p>
              
              {/* Highlights */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What to Expect</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights?.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  )) || (
                    <div className="col-span-2 text-gray-500 italic">No highlights available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Itinerary Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Itinerary</h2>
              <div className="space-y-6">
                {tour.itinerary?.map((day, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Day {day.day}: {day.title}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          Activities
                        </h4>
                        <ul className="space-y-2">
                          {day.activities?.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-600">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-purple-500" />
                          Highlights
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {day.highlights?.map((highlight, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-semibold text-gray-600">Meals: </span>
                          <span className="text-gray-700">{day.meals?.join(', ') || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-600">Accommodation: </span>
                          <span className="text-gray-700">{day.accommodation || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No itinerary available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price Includes/Excludes */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Price Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    Price Includes
                  </h3>
                  <div className="space-y-3">
                    {tour.included?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    )) || (
                      <div className="text-gray-500 italic">No inclusions specified</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-red-500" />
                    Price Excludes
                  </h3>
                  <div className="space-y-3">
                    {tour.excluded?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    )) || (
                      <div className="text-gray-500 italic">No exclusions specified</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tour.images?.map((image, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200">
                    <img
                      src={image.url || image}
                      alt={`${tour.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )) || (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <CameraIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No photos available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Reviews</h2>
              <div className="space-y-6">
                {tour.reviews?.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {review.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{review.name || 'Anonymous'}</h4>
                            {review.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-gray-600 text-sm">{review.date || 'Recently'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment || 'No comment provided'}</p>
                  </div>
                )) || (
                  <div className="text-center py-12 text-gray-500">
                    <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No reviews available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
                {/* Price */}
                <div className="text-center mb-6">
                  {tour.originalPrice && (
                    <div className="text-lg text-gray-500 line-through mb-2">LKR {tour.originalPrice.toLocaleString()}</div>
                  )}
                  <div className="text-4xl font-bold text-gray-900 mb-2">LKR {tour.price?.toLocaleString() || '0'}</div>
                  <div className="text-gray-600">per person</div>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 mb-6"
                >
                  <BookOpen className="w-5 h-5" />
                  Book Now
                </button>

                {/* Quick Info */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{tour.duration} day{tour.duration > 1 ? 's' : ''} tour</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>{tour.minParticipants}-{tour.maxParticipants} people</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span>{tour.location?.name || tour.location || 'Location TBD'}</span>
                  </div>
                </div>
              </div>

              {/* Guide Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Your Guide</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {tour.guide ? (tour.guide.firstName + ' ' + tour.guide.lastName).split(' ').map(n => n[0]).join('') : 'G'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {tour.guide ? `${tour.guide.firstName} ${tour.guide.lastName}` : 'Professional Guide'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tour.guide?.profile?.experience || 'Experienced'} guide
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Info</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>+94 11 234 5678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-green-500" />
                    <span>info@serendibgo.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-purple-500" />
                    <span>www.serendibgo.com</span>
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
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-200 my-4">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Book {tour.title}</h2>
                  <p className="text-gray-600 font-medium">Complete your booking details below</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Price Display */}
              <div className="text-center mb-6">
                {tour.originalPrice && (
                  <div className="text-lg text-gray-500 line-through mb-2">LKR {tour.originalPrice.toLocaleString()}</div>
                )}
                <div className="text-3xl font-bold text-gray-900 mb-2">LKR {tour.price?.toLocaleString() || '0'}</div>
                <div className="text-gray-600">per person</div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Date</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Group Size</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingData({...bookingData, groupSize: Math.max(1, bookingData.groupSize - 1)})}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={bookingData.groupSize}
                      onChange={(e) => setBookingData({...bookingData, groupSize: parseInt(e.target.value) || 1})}
                      min="1"
                      max={tour.maxParticipants}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setBookingData({...bookingData, groupSize: Math.min(tour.maxParticipants, bookingData.groupSize + 1)})}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {tour.minParticipants}-{tour.maxParticipants} people
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    rows="3"
                    placeholder="Any special requirements..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Total Price */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Price</span>
                    <span className="text-2xl font-bold text-green-600">
                      LKR {((tour.price || 0) * bookingData.groupSize).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {bookingData.groupSize} person(s) × LKR {tour.price?.toLocaleString() || '0'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Book Now
                  </button>
                </div>
              </form>

              {/* Cancellation Policy */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cancellation Policy</h4>
                    <p className="text-sm text-gray-600">{tour.cancellationDetails || 'Free cancellation up to 24 hours before tour start'}</p>
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
