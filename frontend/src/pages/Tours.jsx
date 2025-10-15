import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Users, 
  Star, 
  Clock,
  Award,
  Loader2,
  Search,
  Filter,
  Eye,
  BookOpen
} from 'lucide-react'
import api from '../services/api'
import BookingModal from '../components/BookingModal'

const Tours = () => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'nature', label: 'Nature' },
    { value: 'beach', label: 'Beach' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'religious', label: 'Religious' },
    { value: 'historical', label: 'Historical' },
    { value: 'culinary', label: 'Culinary' }
  ]

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Duration' },
    { value: 'newest', label: 'Newest' }
  ]

  // Fetch tours from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.get('/tours')
        if (response.data.success) {
          setTours(response.data.data || [])
        } else {
          setError('Failed to fetch tours')
        }
      } catch (err) {
        console.error('Error fetching tours:', err)
        setError('Failed to load tours. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  // Filter and sort tours
  const filteredTours = tours.filter(tour => {
    const matchesSearch = !searchQuery || 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tour.location?.name && tour.location.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || tour.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return (b.rating?.average || 0) - (a.rating?.average || 0)
      case 'duration':
        return a.duration - b.duration
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'featured':
      default:
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return (b.rating?.average || 0) - (a.rating?.average || 0)
    }
  })

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is handled by filteredTours
  }

  // Handle booking
  const handleBookNow = (tour) => {
    setSelectedTour(tour)
    setShowBookingModal(true)
  }

  const handleBookingSuccess = (booking) => {
    console.log('Booking created successfully:', booking)
    // You can add additional logic here, like showing a success message
    // or redirecting to a confirmation page
  }

  const handleCloseBookingModal = () => {
    setShowBookingModal(false)
    setSelectedTour(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Tours</h3>
          <p className="text-gray-600">Discovering amazing experiences for you...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Tours</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Sri Lanka
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Embark on unforgettable adventures with our curated collection of tours and experiences
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search tours, destinations, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTours.length} of {tours.length} tours
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
          </p>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tours Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory 
                ? 'Try adjusting your search criteria or filters' 
                : 'No tours are currently available. Check back soon!'}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center relative">
                  {tour.images && tour.images.length > 0 ? (
                    <img
                      src={tour.images[0].url || tour.images[0]}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MapPin className="w-16 h-16 text-blue-500/30" />
                  )}
                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold border border-slate-200">
                      {categories.find(c => c.value === tour.category)?.label || tour.category}
                    </div>
                  </div>
                  {/* Featured Badge */}
                  {tour.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <div className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Featured
                      </div>
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-bold">
                      LKR {tour.price?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">
                        {tour.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                        {tour.shortDescription || tour.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{tour.location?.name || tour.location || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{tour.duration} day{tour.duration > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Up to {tour.maxParticipants}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-2 text-lg font-bold text-slate-700">{tour.rating?.average || 0}</span>
                      <span className="ml-2 text-sm text-slate-500 font-medium">({tour.rating?.count || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/tours/${tour._id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleBookNow(tour)}
                      className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 font-medium flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        tour={selectedTour}
        isOpen={showBookingModal}
        onClose={handleCloseBookingModal}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  )
}

export default Tours