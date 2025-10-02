import React, { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  User,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckSquare,
  Square,
  Send,
  Star,
  Globe,
  Camera,
  Heart,
  Award,
  Filter,
  Search,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Archive,
  RefreshCw
} from 'lucide-react'

const CustomTripApproval = () => {
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState('')
  const [approvalComment, setApprovalComment] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Sample custom trip requests
  const [customTrips, setCustomTrips] = useState([
    {
      id: 1,
      title: '7-Day Cultural Heritage Tour',
      customer: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      duration: '7 days',
      participants: 4,
      budget: 150000,
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-20',
      requestedDate: '2024-02-15',
      description: 'We would like a comprehensive cultural tour covering Kandy, Anuradhapura, Polonnaruwa, and Sigiriya. We are interested in historical sites, temples, and local cultural experiences.',
      requirements: [
        'English-speaking guide',
        'Air-conditioned vehicle',
        '4-star accommodation',
        'All entrance fees included',
        'Traditional cultural shows',
        'Local cuisine experiences'
      ],
      itinerary: [
        { day: 1, location: 'Colombo', activities: 'Arrival, city tour, Gangaramaya Temple' },
        { day: 2, location: 'Kandy', activities: 'Temple of the Tooth, Cultural show, Kandy Lake' },
        { day: 3, location: 'Anuradhapura', activities: 'Ancient city tour, Sri Maha Bodhi, Ruwanwelisaya' },
        { day: 4, location: 'Polonnaruwa', activities: 'Ancient city, Gal Vihara, Parakrama Samudra' },
        { day: 5, location: 'Sigiriya', activities: 'Rock fortress, Dambulla cave temple' },
        { day: 6, location: 'Colombo', activities: 'Shopping, farewell dinner' },
        { day: 7, location: 'Departure', activities: 'Airport transfer' }
      ],
      specialRequests: 'Vegetarian meals preferred, wheelchair accessible vehicle needed for one participant',
      estimatedCost: 145000,
      guideRecommendations: ['Sarah Perera', 'Kamal Silva'],
      notes: 'High-value customer, repeat visitor to Sri Lanka'
    },
    {
      id: 2,
      title: '3-Day Wildlife Safari Adventure',
      customer: {
        name: 'Emily Johnson',
        email: 'emily.j@email.com',
        phone: '+44-20-7946-0958',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      duration: '3 days',
      participants: 2,
      budget: 80000,
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-19',
      requestedDate: '2024-02-20',
      description: 'Wildlife photography tour focusing on elephants, leopards, and birds. Early morning and evening game drives preferred.',
      requirements: [
        'Wildlife specialist guide',
        '4WD safari vehicle',
        'Camera equipment assistance',
        'Lodge accommodation in national parks',
        'All park entrance fees',
        'Meals included'
      ],
      itinerary: [
        { day: 1, location: 'Yala National Park', activities: 'Morning and evening game drives' },
        { day: 2, location: 'Udawalawe National Park', activities: 'Elephant watching, bird photography' },
        { day: 3, location: 'Colombo', activities: 'Return to Colombo, photo review session' }
      ],
      specialRequests: 'Photography guide with wildlife expertise, early morning departures',
      estimatedCost: 75000,
      guideRecommendations: ['Rajesh Fernando', 'Nimal Perera'],
      notes: 'Professional photographer, social media influencer'
    },
    {
      id: 3,
      title: '5-Day Beach & Relaxation Tour',
      customer: {
        name: 'Michael Brown',
        email: 'm.brown@email.com',
        phone: '+61-2-9374-4000',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      duration: '5 days',
      participants: 2,
      budget: 100000,
      status: 'approved',
      priority: 'low',
      createdAt: '2024-01-18',
      requestedDate: '2024-02-10',
      description: 'Relaxing beach holiday with some cultural experiences. Focus on beautiful beaches and spa treatments.',
      requirements: [
        'Beachfront accommodation',
        'Private vehicle',
        'Spa treatments included',
        'Seafood dining experiences',
        'Sunset viewing spots',
        'Water activities'
      ],
      itinerary: [
        { day: 1, location: 'Negombo', activities: 'Arrival, beach relaxation' },
        { day: 2, location: 'Bentota', activities: 'Beach activities, spa treatments' },
        { day: 3, location: 'Galle', activities: 'Fort tour, beach time' },
        { day: 4, location: 'Mirissa', activities: 'Whale watching, beach relaxation' },
        { day: 5, location: 'Colombo', activities: 'Shopping, departure' }
      ],
      specialRequests: 'Romantic dinner setup, couple spa treatments',
      estimatedCost: 95000,
      guideRecommendations: ['Priya Silva', 'David Fernando'],
      notes: 'Honeymoon couple, first-time visitors'
    },
    {
      id: 4,
      title: '10-Day Comprehensive Sri Lanka Tour',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '+1-555-0199',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      duration: '10 days',
      participants: 6,
      budget: 250000,
      status: 'rejected',
      priority: 'high',
      createdAt: '2024-01-17',
      requestedDate: '2024-03-01',
      description: 'Complete Sri Lanka experience covering all major attractions. Family-friendly activities preferred.',
      requirements: [
        'Family-friendly guide',
        'Large vehicle for 6 people',
        'Family rooms in hotels',
        'All major attractions included',
        'Flexible itinerary',
        'Child-friendly activities'
      ],
      itinerary: [
        { day: 1, location: 'Colombo', activities: 'Arrival, city tour' },
        { day: 2, location: 'Kandy', activities: 'Temple of the Tooth, cultural show' },
        { day: 3, location: 'Nuwara Eliya', activities: 'Tea plantations, train ride' },
        { day: 4, location: 'Ella', activities: 'Nine Arch Bridge, hiking' },
        { day: 5, location: 'Yala', activities: 'Wildlife safari' },
        { day: 6, location: 'Galle', activities: 'Fort tour, beach time' },
        { day: 7, location: 'Mirissa', activities: 'Whale watching' },
        { day: 8, location: 'Anuradhapura', activities: 'Ancient city tour' },
        { day: 9, location: 'Sigiriya', activities: 'Rock fortress' },
        { day: 10, location: 'Colombo', activities: 'Shopping, departure' }
      ],
      specialRequests: 'Children aged 8 and 12, need child-friendly activities and meals',
      estimatedCost: 280000,
      guideRecommendations: ['Kamal Silva', 'Nisha Perera'],
      notes: 'Budget exceeded by 30,000 LKR, needs negotiation'
    }
  ])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleApproval = async (tripId, action) => {
    setLoading(true)
    try {
      setCustomTrips(prev => prev.map(trip => 
        trip.id === tripId 
          ? { ...trip, status: action, approvedAt: new Date().toISOString(), approvalComment }
          : trip
      ))
      setShowApprovalModal(false)
      setSelectedTrip(null)
      setApprovalComment('')
      showMessage('success', `Trip ${action} successfully!`)
    } catch (error) {
      showMessage('error', `Failed to ${action} trip`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'in_review': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTrips = customTrips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Custom Trip Approval</h2>
          <p className="text-slate-600">Review and approve custom trip requests from customers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
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
                placeholder="Search custom trips..."
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
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Trips List */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <img
                  src={trip.customer.avatar}
                  alt={trip.customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{trip.title}</h3>
                  <p className="text-sm text-slate-600">by {trip.customer.name}</p>
                  <p className="text-xs text-slate-500">{trip.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(trip.priority)}`}>
                  {trip.priority} priority
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                  {trip.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-2" />
                {trip.duration}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Users className="h-4 w-4 mr-2" />
                {trip.participants} people
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <DollarSign className="h-4 w-4 mr-2" />
                LKR {trip.budget.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(trip.requestedDate).toLocaleDateString()}
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-4 line-clamp-2">{trip.description}</p>

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Requested on {new Date(trip.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedTrip(trip)
                    setShowDetailsModal(true)
                  }}
                  className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>
                {trip.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedTrip(trip)
                        setApprovalAction('approved')
                        setShowApprovalModal(true)
                      }}
                      className="flex items-center px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTrip(trip)
                        setApprovalAction('rejected')
                        setShowApprovalModal(true)
                      }}
                      className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No custom trips found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Trip Details Modal */}
      {showDetailsModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">{selectedTrip.title}</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Customer Information</h4>
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedTrip.customer.avatar}
                    alt={selectedTrip.customer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{selectedTrip.customer.name}</p>
                    <p className="text-sm text-slate-600">{selectedTrip.customer.email}</p>
                    <p className="text-sm text-slate-600">{selectedTrip.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Trip Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Trip Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Duration:</span>
                      <span className="font-medium">{selectedTrip.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Participants:</span>
                      <span className="font-medium">{selectedTrip.participants} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Budget:</span>
                      <span className="font-medium">LKR {selectedTrip.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Requested Date:</span>
                      <span className="font-medium">{new Date(selectedTrip.requestedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTrip.status)}`}>
                        {selectedTrip.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Cost Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Customer Budget:</span>
                      <span className="font-medium">LKR {selectedTrip.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Estimated Cost:</span>
                      <span className="font-medium">LKR {selectedTrip.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Difference:</span>
                      <span className={`font-medium ${selectedTrip.estimatedCost > selectedTrip.budget ? 'text-red-600' : 'text-green-600'}`}>
                        LKR {(selectedTrip.estimatedCost - selectedTrip.budget).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Description</h4>
                <p className="text-slate-700">{selectedTrip.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Requirements</h4>
                <ul className="space-y-1">
                  {selectedTrip.requirements.map((req, index) => (
                    <li key={index} className="flex items-center text-slate-700">
                      <CheckSquare className="h-4 w-4 text-green-600 mr-2" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Itinerary */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Proposed Itinerary</h4>
                <div className="space-y-3">
                  {selectedTrip.itinerary.map((day, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {day.day}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{day.location}</p>
                        <p className="text-sm text-slate-600">{day.activities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              {selectedTrip.specialRequests && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Special Requests</h4>
                  <p className="text-slate-700">{selectedTrip.specialRequests}</p>
                </div>
              )}

              {/* Guide Recommendations */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Recommended Guides</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTrip.guideRecommendations.map((guide, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {guide}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedTrip.notes && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Staff Notes</h4>
                  <p className="text-slate-700">{selectedTrip.notes}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              {selectedTrip.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      setApprovalAction('rejected')
                      setShowApprovalModal(true)
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      setApprovalAction('approved')
                      setShowApprovalModal(true)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  approvalAction === 'approved' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {approvalAction === 'approved' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {approvalAction === 'approved' ? 'Approve' : 'Reject'} Trip
                  </h3>
                  <p className="text-sm text-slate-600">{selectedTrip.title}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Add comments for ${approvalAction === 'approved' ? 'approval' : 'rejection'}...`}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproval(selectedTrip.id, approvalAction)}
                  disabled={loading}
                  className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center ${
                    approvalAction === 'approved' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {approvalAction === 'approved' ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      {approvalAction === 'approved' ? 'Approve' : 'Reject'} Trip
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

export default CustomTripApproval
