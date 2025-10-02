import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  X
} from 'lucide-react'
import { guideService } from '../../services/guideService'

const GuideDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingData, setBookingData] = useState({
    date: '',
    duration: '',
    groupSize: 1,
    specialRequests: ''
  })

  // Fetch guide data from API
  useEffect(() => {
    if (id) {
      fetchGuide()
    }
    
    // Listen for guide profile updates
    const handleGuideUpdate = (event) => {
      console.log('Guide profile updated, refreshing guide detail:', event.detail)
      if (event.detail.guideId === id) {
        fetchGuide()
      }
    }
    
    window.addEventListener('guideProfileUpdated', handleGuideUpdate)
    
    return () => {
      window.removeEventListener('guideProfileUpdated', handleGuideUpdate)
    }
  }, [id])

  const fetchGuide = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await guideService.getGuideById(id)
      setGuide(response.data)
    } catch (err) {
      console.error('Error fetching guide:', err)
      setError('Failed to load guide details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Guide Details...</h2>
          <p className="text-slate-600">Please wait while we fetch the guide information.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Error Loading Guide</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchGuide}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/guides')}
              className="w-full px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors duration-200 font-semibold"
            >
              Back to Guides
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Guide Not Found</h1>
          <p className="text-slate-600 mb-6">The guide you are looking for does not exist.</p>
          <button
            onClick={() => navigate('/guides')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-semibold"
          >
            Go Back to Guides
          </button>
        </div>
      </div>
    )
  }

  const handleBookGuide = () => {
    setShowBookingModal(true)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    console.log('Booking submitted:', { guide: guide, ...bookingData })
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-cyan-500/10"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-200 hover:text-blue-100 transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Guides
          </button>
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-5xl font-bold">
                  {guide.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold mb-3">{guide.name}</h1>
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
                <span className="ml-2 text-xl font-bold">{guide.rating}</span>
                <span className="ml-2 text-white/80">({guide.reviewCount} reviews)</span>
              </div>
              <p className="text-xl text-white/90 max-w-2xl lg:max-w-none mx-auto lg:mx-0">{guide.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-100 shadow-lg">
            <div className="flex items-center mb-5">
              <BookOpen className="h-7 w-7 text-blue-600 mr-4" />
              <h2 className="text-3xl font-bold text-slate-900">About {guide.name}</h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-lg font-medium">{guide.bio}</p>
          </div>

          {/* Highlights Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-100 shadow-lg">
            <div className="flex items-center mb-5">
              <Award className="h-7 w-7 text-yellow-600 mr-4" />
              <h2 className="text-3xl font-bold text-slate-900">Key Highlights</h2>
            </div>
            <div className="space-y-4">
              {guide.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center p-4 bg-white/60 rounded-2xl border border-yellow-200 shadow-sm">
                  <Zap className="h-6 w-6 text-yellow-500 mr-4" />
                  <span className="text-slate-700 font-semibold text-lg">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialties Section */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100 shadow-lg">
            <div className="flex items-center mb-5">
              <Award className="h-7 w-7 text-blue-600 mr-4" />
              <h2 className="text-3xl font-bold text-slate-900">Specialties</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {guide.specialties.map((specialty) => (
                <span key={specialty} className="px-5 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-2xl font-bold border border-blue-300 shadow-sm">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Languages Section */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-100 shadow-lg">
            <div className="flex items-center mb-5">
              <Globe className="h-7 w-7 text-blue-600 mr-4" />
              <h2 className="text-3xl font-bold text-slate-900">Languages</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {guide.languages.map((lang) => (
                <span key={lang} className="px-5 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-2xl font-bold border border-blue-300 shadow-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg">
            <div className="flex items-center mb-5">
              <MessageCircle className="h-7 w-7 text-blue-600 mr-4" />
              <h2 className="text-3xl font-bold text-slate-900">Connect with {guide.name}</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 font-semibold">
                <Phone className="h-5 w-5 mr-2" /> Call
              </button>
              <button className="flex items-center px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold">
                <Mail className="h-5 w-5 mr-2" /> Email
              </button>
              <button className="flex items-center px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors duration-200 font-semibold">
                <Share2 className="h-5 w-5 mr-2" /> Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Booking & Quick Info */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-200 shadow-xl sticky top-24">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-green-600 mb-2">LKR {guide.price.toLocaleString()}</div>
              <div className="text-green-600 font-semibold">per day</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-2xl border border-slate-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-slate-600 font-medium">Experience</span>
                </div>
                <span className="font-bold text-slate-900">{guide.experience} years</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-2xl border border-slate-200">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-slate-600 font-medium">Location</span>
                </div>
                <span className="font-bold text-slate-900">{guide.location}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-2xl border border-slate-200">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-slate-600 font-medium">Tours Completed</span>
                </div>
                <span className="font-bold text-slate-900">{guide.completedTours}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-2xl border border-slate-200">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-slate-600 font-medium">Response Time</span>
                </div>
                <span className="font-bold text-slate-900">{guide.responseTime}</span>
              </div>
            </div>

            <button
              onClick={handleBookGuide}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Book This Guide
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200 p-8 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {guide.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Book {guide.name}</h2>
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
                      LKR {(guide.price * bookingData.groupSize).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">
                      {bookingData.groupSize} person(s) × LKR {guide.price.toLocaleString()}
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

export default GuideDetail
