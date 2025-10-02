import React, { useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Calendar,
  Camera,
  Save,
  X,
  Upload,
  Globe,
  Award,
  Heart,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react'

const TripManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Sample trip data
  const [trips, setTrips] = useState([
    {
      id: 1,
      title: 'Colombo City Heritage Tour',
      description: 'Explore the rich cultural heritage of Colombo with visits to historic temples, colonial buildings, and local markets.',
      duration: '4 hours',
      price: 5000,
      maxParticipants: 15,
      rating: 4.8,
      status: 'active',
      category: 'Cultural',
      location: 'Colombo',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      highlights: ['Gangaramaya Temple', 'Independence Square', 'Pettah Market', 'Dutch Hospital'],
      included: ['Professional guide', 'Transportation', 'Entrance fees', 'Refreshments'],
      difficulty: 'Easy',
      languages: ['English', 'Sinhala'],
      createdAt: '2024-01-15',
      bookings: 45
    },
    {
      id: 2,
      title: 'Sigiriya Rock Fortress Adventure',
      description: 'Climb the ancient rock fortress and discover the fascinating history and stunning views from the top.',
      duration: '6 hours',
      price: 8000,
      maxParticipants: 12,
      rating: 4.9,
      status: 'active',
      category: 'Adventure',
      location: 'Sigiriya',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      highlights: ['Sigiriya Rock', 'Ancient frescoes', 'Water gardens', 'Lion\'s gate'],
      included: ['Professional guide', 'Transportation', 'Entrance fees', 'Lunch'],
      difficulty: 'Moderate',
      languages: ['English', 'Sinhala'],
      createdAt: '2024-01-10',
      bookings: 32
    },
    {
      id: 3,
      title: 'Kandy Temple & Cultural Experience',
      description: 'Visit the sacred Temple of the Tooth and experience traditional Kandyan culture.',
      duration: '5 hours',
      price: 6000,
      maxParticipants: 20,
      rating: 4.7,
      status: 'draft',
      category: 'Cultural',
      location: 'Kandy',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      highlights: ['Temple of the Tooth', 'Kandy Lake', 'Cultural show', 'Local markets'],
      included: ['Professional guide', 'Transportation', 'Entrance fees', 'Cultural show'],
      difficulty: 'Easy',
      languages: ['English', 'Sinhala'],
      createdAt: '2024-01-20',
      bookings: 0
    }
  ])

  const [newTrip, setNewTrip] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    maxParticipants: '',
    category: '',
    location: '',
    image: '',
    highlights: [],
    included: [],
    difficulty: 'Easy',
    languages: ['English'],
    status: 'draft'
  })

  const [newHighlight, setNewHighlight] = useState('')
  const [newIncluded, setNewIncluded] = useState('')

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleAddTrip = async () => {
    if (!newTrip.title || !newTrip.description || !newTrip.duration || !newTrip.price) {
      showMessage('error', 'Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const trip = {
        ...newTrip,
        id: Date.now(),
        rating: 0,
        bookings: 0,
        createdAt: new Date().toISOString().split('T')[0],
        price: parseInt(newTrip.price),
        maxParticipants: parseInt(newTrip.maxParticipants)
      }
      
      setTrips(prev => [trip, ...prev])
      setShowAddModal(false)
      setNewTrip({
        title: '',
        description: '',
        duration: '',
        price: '',
        maxParticipants: '',
        category: '',
        location: '',
        image: '',
        highlights: [],
        included: [],
        difficulty: 'Easy',
        languages: ['English'],
        status: 'draft'
      })
      showMessage('success', 'Trip added successfully!')
    } catch (error) {
      showMessage('error', 'Failed to add trip')
    } finally {
      setLoading(false)
    }
  }

  const handleEditTrip = async () => {
    if (!selectedTrip.title || !selectedTrip.description || !selectedTrip.duration || !selectedTrip.price) {
      showMessage('error', 'Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      setTrips(prev => prev.map(trip => 
        trip.id === selectedTrip.id ? { ...selectedTrip, price: parseInt(selectedTrip.price), maxParticipants: parseInt(selectedTrip.maxParticipants) } : trip
      ))
      setShowEditModal(false)
      setSelectedTrip(null)
      showMessage('success', 'Trip updated successfully!')
    } catch (error) {
      showMessage('error', 'Failed to update trip')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async () => {
    setLoading(true)
    try {
      setTrips(prev => prev.filter(trip => trip.id !== selectedTrip.id))
      setShowDeleteModal(false)
      setSelectedTrip(null)
      showMessage('success', 'Trip deleted successfully!')
    } catch (error) {
      showMessage('error', 'Failed to delete trip')
    } finally {
      setLoading(false)
    }
  }

  const addHighlight = () => {
    if (newHighlight.trim()) {
      if (showEditModal && selectedTrip) {
        setSelectedTrip(prev => ({
          ...prev,
          highlights: [...prev.highlights, newHighlight.trim()]
        }))
      } else {
        setNewTrip(prev => ({
          ...prev,
          highlights: [...prev.highlights, newHighlight.trim()]
        }))
      }
      setNewHighlight('')
    }
  }

  const removeHighlight = (index) => {
    if (showEditModal && selectedTrip) {
      setSelectedTrip(prev => ({
        ...prev,
        highlights: prev.highlights.filter((_, i) => i !== index)
      }))
    } else {
      setNewTrip(prev => ({
        ...prev,
        highlights: prev.highlights.filter((_, i) => i !== index)
      }))
    }
  }

  const addIncluded = () => {
    if (newIncluded.trim()) {
      if (showEditModal && selectedTrip) {
        setSelectedTrip(prev => ({
          ...prev,
          included: [...prev.included, newIncluded.trim()]
        }))
      } else {
        setNewTrip(prev => ({
          ...prev,
          included: [...prev.included, newIncluded.trim()]
        }))
      }
      setNewIncluded('')
    }
  }

  const removeIncluded = (index) => {
    if (showEditModal && selectedTrip) {
      setSelectedTrip(prev => ({
        ...prev,
        included: prev.included.filter((_, i) => i !== index)
      }))
    } else {
      setNewTrip(prev => ({
        ...prev,
        included: prev.included.filter((_, i) => i !== index)
      }))
    }
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Trip Management</h2>
          <p className="text-slate-600">Manage predesign trips and tour packages</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Trip
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                  {trip.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{trip.title}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-slate-600">{trip.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{trip.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {trip.location}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {trip.duration}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  LKR {trip.price.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Users className="h-4 w-4 mr-2" />
                  Max {trip.maxParticipants} people
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  {trip.bookings} bookings
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTrip(trip)
                      setShowEditModal(true)
                    }}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTrip(trip)
                      setShowDeleteModal(true)
                    }}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <Map className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No trips found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Trip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Add New Trip</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Trip Title *</label>
                  <input
                    type="text"
                    value={newTrip.title}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter trip title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={newTrip.category}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Nature">Nature</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Beach">Beach</option>
                    <option value="Religious">Religious</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration *</label>
                  <input
                    type="text"
                    value={newTrip.duration}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 4 hours, 2 days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price (LKR) *</label>
                  <input
                    type="number"
                    value={newTrip.price}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={newTrip.maxParticipants}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, maxParticipants: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Maximum number of people"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newTrip.location}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  value={newTrip.description}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the trip experience"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newTrip.image}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Highlights</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newTrip.highlights.map((highlight, index) => (
                    <span key={index} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {highlight}
                      <button
                        onClick={() => removeHighlight(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add highlight"
                  />
                  <button
                    onClick={addHighlight}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">What's Included</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newTrip.included.map((item, index) => (
                    <span key={index} className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {item}
                      <button
                        onClick={() => removeIncluded(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIncluded}
                    onChange={(e) => setNewIncluded(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIncluded()}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add included item"
                  />
                  <button
                    onClick={addIncluded}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                  <select
                    value={newTrip.difficulty}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={newTrip.status}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTrip}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Trip
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trip Modal */}
      {showEditModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Edit Trip</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Trip Title *</label>
                  <input
                    type="text"
                    value={selectedTrip.title}
                    onChange={(e) => setSelectedTrip(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={selectedTrip.category}
                    onChange={(e) => setSelectedTrip(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Nature">Nature</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Beach">Beach</option>
                    <option value="Religious">Religious</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration *</label>
                  <input
                    type="text"
                    value={selectedTrip.duration}
                    onChange={(e) => setSelectedTrip(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price (LKR) *</label>
                  <input
                    type="number"
                    value={selectedTrip.price}
                    onChange={(e) => setSelectedTrip(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={selectedTrip.maxParticipants}
                    onChange={(e) => setSelectedTrip(prev => ({ ...prev, maxParticipants: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={selectedTrip.location}
                    onChange={(e) => setSelectedTrip(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  value={selectedTrip.description}
                  onChange={(e) => setSelectedTrip(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={selectedTrip.image}
                  onChange={(e) => setSelectedTrip(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Highlights</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTrip.highlights.map((highlight, index) => (
                    <span key={index} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {highlight}
                      <button
                        onClick={() => removeHighlight(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add highlight"
                  />
                  <button
                    onClick={addHighlight}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">What's Included</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTrip.included.map((item, index) => (
                    <span key={index} className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {item}
                      <button
                        onClick={() => removeIncluded(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIncluded}
                    onChange={(e) => setNewIncluded(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIncluded()}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add included item"
                  />
                  <button
                    onClick={addIncluded}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                  <select
                    value={selectedTrip.difficulty}
                    onChange={(e) => setSelectedTrip(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={selectedTrip.status}
                    onChange={(e) => setSelectedTrip(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTrip}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Trip
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete Trip</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-6">
                Are you sure you want to delete <strong>"{selectedTrip.title}"</strong>? 
                This will permanently remove the trip and all associated data.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTrip}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Trip
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripManagement
