import React, { useState, useEffect } from 'react'
import {
  Building,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash,
  RefreshCw,
  Download,
  Upload,
  Plus,
  BarChart3,
  TrendingUp,
  Clock,
  Shield,
  Globe,
  Camera,
  Settings,
  User,
  MessageSquare,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Archive,
  Ban,
  Unlock,
  Lock,
  EyeOff,
  Send,
  Reply,
  ExternalLink,
  Copy,
  Share,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertTriangle
} from 'lucide-react'
import { hotelAPI } from '../../../services/hotels/hotelService'

const HotelManagement = () => {
  const [hotels, setHotels] = useState([])
  const [pendingHotels, setPendingHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalData, setApprovalData] = useState({ hotelId: '', status: '', reason: '' })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    city: '',
    category: '',
    starRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pages: 0,
    limit: 10
  })

  // Statistics
  const [stats, setStats] = useState({
    totalHotels: 0,
    pendingHotels: 0,
    approvedHotels: 0,
    rejectedHotels: 0,
    totalRevenue: 0,
    averageRating: 0
  })

  useEffect(() => {
    loadHotels()
    loadPendingHotels()
    loadStats()
  }, [filters, pagination.current])

  const loadHotels = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        ...filters
      }
      
      const response = await hotelAPI.getHotels(params)
      setHotels(response.data.hotels)
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }))
    } catch (err) {
      setError('Failed to load hotels')
      console.error('Error loading hotels:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadPendingHotels = async () => {
    try {
      const response = await hotelAPI.getPendingHotels()
      setPendingHotels(response.data.hotels)
    } catch (err) {
      console.error('Error loading pending hotels:', err)
    }
  }

  const loadStats = async () => {
    try {
      // This would be a new API endpoint for staff hotel statistics
      // For now, we'll calculate from the loaded data
      const totalHotels = hotels.length + pendingHotels.length
      const pendingCount = pendingHotels.length
      const approvedCount = hotels.filter(h => h.status === 'approved').length
      const rejectedCount = hotels.filter(h => h.status === 'rejected').length
      
      setStats({
        totalHotels,
        pendingHotels: pendingCount,
        approvedHotels: approvedCount,
        rejectedHotels: rejectedCount,
        totalRevenue: 0, // Would come from API
        averageRating: 0 // Would come from API
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const handleApproval = async () => {
    try {
      await hotelAPI.approveHotel(
        approvalData.hotelId,
        approvalData.status,
        approvalData.reason
      )
      
      setSuccess(`Hotel ${approvalData.status} successfully`)
      setShowApprovalModal(false)
      setApprovalData({ hotelId: '', status: '', reason: '' })
      
      // Reload data
      loadHotels()
      loadPendingHotels()
      loadStats()
    } catch (err) {
      setError(`Failed to ${approvalData.status} hotel`)
      console.error('Error approving hotel:', err)
    }
  }

  const openApprovalModal = (hotelId, status) => {
    setApprovalData({ hotelId, status, reason: '' })
    setShowApprovalModal(true)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'suspended': return <Ban className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const tabs = [
    { id: 'all', label: 'All Hotels', count: stats.totalHotels },
    { id: 'pending', label: 'Pending', count: stats.pendingHotels },
    { id: 'approved', label: 'Approved', count: stats.approvedHotels },
    { id: 'rejected', label: 'Rejected', count: stats.rejectedHotels }
  ]

  const filteredHotels = activeTab === 'all' 
    ? hotels 
    : activeTab === 'pending' 
    ? pendingHotels 
    : hotels.filter(hotel => hotel.status === activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hotel Management</h2>
          <p className="text-slate-600">Manage hotel listings and approvals</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadHotels}
            className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalHotels}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Total Hotels</h3>
          <p className="text-sm text-slate-600">All registered hotels</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.pendingHotels}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Pending Approval</h3>
          <p className="text-sm text-slate-600">Awaiting review</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.approvedHotels}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Approved</h3>
          <p className="text-sm text-slate-600">Active listings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">LKR {stats.totalRevenue.toLocaleString()}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Total Revenue</h3>
          <p className="text-sm text-slate-600">Platform earnings</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search hotels..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Negombo">Negombo</option>
              <option value="Bentota">Bentota</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Beach Resort">Beach Resort</option>
              <option value="Hill Station Hotel">Hill Station Hotel</option>
              <option value="Heritage Hotel">Heritage Hotel</option>
              <option value="Wildlife Lodge">Wildlife Lodge</option>
              <option value="Luxury Hotel">Luxury Hotel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Star Rating</label>
            <select
              value={filters.starRating}
              onChange={(e) => handleFilterChange('starRating', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Hotels List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading hotels...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel._id}
                className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">{hotel.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hotel.status)}`}>
                        {getStatusIcon(hotel.status)}
                        <span className="ml-1 capitalize">{hotel.status}</span>
                      </span>
                      {hotel.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {hotel.location.city}, {hotel.location.district}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Building className="h-4 w-4 mr-2" />
                        {hotel.category}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <div className="flex items-center mr-2">
                          {renderStars(hotel.starRating)}
                        </div>
                        {hotel.starRating} Stars
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        LKR {hotel.averageRoomPrice?.toLocaleString() || 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {hotel.owner?.firstName} {hotel.owner?.lastName}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {hotel.contact.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {hotel.contact.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(hotel.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {hotel.description && (
                      <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                        {hotel.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedHotel(hotel)
                        setShowDetails(true)
                      }}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {hotel.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openApprovalModal(hotel._id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openApprovalModal(hotel._id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No hotels found</h3>
                <p className="text-slate-500">No hotels match your current filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {((pagination.current - 1) * pagination.limit) + 1} to {Math.min(pagination.current * pagination.limit, pagination.total)} of {pagination.total} hotels
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      pagination.current === page
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {approvalData.status === 'approved' ? 'Approve Hotel' : 'Reject Hotel'}
              </h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-slate-600 mb-4">
                {approvalData.status === 'approved' 
                  ? 'Are you sure you want to approve this hotel? It will be visible to users.'
                  : 'Please provide a reason for rejecting this hotel.'
                }
              </p>

              {approvalData.status === 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rejection Reason
                  </label>
                  <textarea
                    value={approvalData.reason}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Enter reason for rejection..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApproval}
                className={`px-4 py-2 text-white rounded-xl transition-colors ${
                  approvalData.status === 'approved'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {approvalData.status === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Details Modal */}
      {showDetails && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">{selectedHotel.name}</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hotel Images */}
                <div>
                  {selectedHotel.images && selectedHotel.images.length > 0 ? (
                    <div className="space-y-4">
                      <img
                        src={selectedHotel.images[0].url}
                        alt={selectedHotel.name}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      {selectedHotel.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {selectedHotel.images.slice(1, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image.url}
                              alt={`${selectedHotel.name} ${index + 2}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Camera className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Hotel Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{selectedHotel.location.address}, {selectedHotel.location.city}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{selectedHotel.category}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {renderStars(selectedHotel.starRating)}
                        </div>
                        <span>{selectedHotel.starRating} Stars</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{selectedHotel.owner?.firstName} {selectedHotel.owner?.lastName}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{selectedHotel.contact.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{selectedHotel.contact.email}</span>
                      </div>
                      {selectedHotel.contact.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-slate-400" />
                          <a href={selectedHotel.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedHotel.contact.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Description</h4>
                    <p className="text-sm text-slate-600">{selectedHotel.description}</p>
                  </div>

                  {selectedHotel.amenities && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Amenities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedHotel.amenities)
                          .filter(([key, value]) => value === true)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center text-sm text-slate-600">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
                >
                  Close
                </button>
                {selectedHotel.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetails(false)
                        openApprovalModal(selectedHotel._id, 'approved')
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setShowDetails(false)
                        openApprovalModal(selectedHotel._id, 'rejected')
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-lg z-50">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg z-50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default HotelManagement
