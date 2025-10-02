import React, { useState, useEffect } from 'react'
import {
  User,
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
  AlertTriangle,
  Award,
  BookOpen,
  Languages,
  Briefcase,
  Target,
  Zap,
  Activity,
  UserCheck,
  Crown,
  Sparkles,
  FileText,
  CreditCard,
  Map,
  Navigation,
  Compass
} from 'lucide-react'
import { guideService } from '../../../services/guideService'

const GuideManagement = () => {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalData, setApprovalData] = useState({ guideId: '', status: '', reason: '' })
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    specialty: '',
    language: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
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
    totalGuides: 0,
    activeGuides: 0,
    verifiedGuides: 0,
    totalTours: 0,
    totalBookings: 0,
    averageRating: 0
  })

  useEffect(() => {
    loadGuides()
    loadStats()
  }, [filters, pagination.current])

  const loadGuides = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        ...filters
      }
      
      const response = await guideService.getGuides(params)
      setGuides(response.data)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        pages: response.pages
      }))
    } catch (err) {
      setError('Failed to load guides')
      console.error('Error loading guides:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Calculate stats from loaded guides
      const totalGuides = guides.length
      const activeGuides = guides.filter(g => g.availability === 'Available').length
      const verifiedGuides = guides.filter(g => g.isVerified).length
      const totalTours = guides.reduce((sum, g) => sum + (g.completedTours || 0), 0)
      const totalBookings = guides.reduce((sum, g) => sum + (g.completedTours || 0), 0)
      const avgRating = guides.length > 0 
        ? guides.reduce((sum, g) => sum + (g.rating || 0), 0) / guides.length 
        : 0
      
      setStats({
        totalGuides,
        activeGuides,
        verifiedGuides,
        totalTours,
        totalBookings,
        averageRating: Math.round(avgRating * 10) / 10
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const handleApproval = async () => {
    try {
      // This would be a new API endpoint for guide approval
      // For now, we'll simulate the approval process
      const updatedGuides = guides.map(guide => 
        guide.id === approvalData.guideId 
          ? { ...guide, isVerified: approvalData.status === 'approved' }
          : guide
      )
      setGuides(updatedGuides)
      
      setSuccess(`Guide ${approvalData.status} successfully`)
      setShowApprovalModal(false)
      setApprovalData({ guideId: '', status: '', reason: '' })
      
      // Reload data
      loadGuides()
      loadStats()
    } catch (err) {
      setError(`Failed to ${approvalData.status} guide`)
      console.error('Error approving guide:', err)
    }
  }

  const openApprovalModal = (guideId, status) => {
    setApprovalData({ guideId, status, reason: '' })
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
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Unavailable': return 'bg-red-100 text-red-800'
      case 'Busy': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available': return <CheckCircle className="h-4 w-4" />
      case 'Unavailable': return <XCircle className="h-4 w-4" />
      case 'Busy': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const tabs = [
    { id: 'all', label: 'All Guides', count: stats.totalGuides },
    { id: 'active', label: 'Active', count: stats.activeGuides },
    { id: 'verified', label: 'Verified', count: stats.verifiedGuides },
    { id: 'unverified', label: 'Unverified', count: stats.totalGuides - stats.verifiedGuides }
  ]

  const filteredGuides = activeTab === 'all' 
    ? guides 
    : activeTab === 'active' 
    ? guides.filter(guide => guide.availability === 'Available')
    : activeTab === 'verified'
    ? guides.filter(guide => guide.isVerified)
    : guides.filter(guide => !guide.isVerified)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Guide Management</h2>
          <p className="text-slate-600">Manage guide profiles and approvals</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadGuides}
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
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalGuides}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Total Guides</h3>
          <p className="text-sm text-slate-600">Registered guides</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.activeGuides}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Active Guides</h3>
          <p className="text-sm text-slate-600">Currently available</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.verifiedGuides}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Verified</h3>
          <p className="text-sm text-slate-600">Verified guides</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.averageRating}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Avg Rating</h3>
          <p className="text-sm text-slate-600">Overall rating</p>
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
                placeholder="Search guides..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Negombo">Negombo</option>
              <option value="Bentota">Bentota</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Specialty</label>
            <select
              value={filters.specialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Specialties</option>
              <option value="Cultural">Cultural Tours</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Adventure">Adventure</option>
              <option value="Historical">Historical</option>
              <option value="Nature">Nature</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Sinhala">Sinhala</option>
              <option value="Tamil">Tamil</option>
              <option value="French">French</option>
              <option value="German">German</option>
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

        {/* Guides List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading guides...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{guide.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(guide.availability)}`}>
                            {getStatusIcon(guide.availability)}
                            <span className="ml-1">{guide.availability}</span>
                          </span>
                          {guide.isVerified && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {guide.location}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {guide.experience} years exp
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <div className="flex items-center mr-2">
                          {renderStars(guide.rating)}
                        </div>
                        {guide.rating} ({guide.reviewCount} reviews)
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        LKR {guide.price?.toLocaleString() || 'N/A'}/day
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {guide.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {guide.phone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(guide.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {guide.specialties && guide.specialties.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium text-slate-700">Specialties:</span>
                        <div className="flex flex-wrap gap-1">
                          {guide.specialties.slice(0, 3).map((specialty, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {specialty}
                            </span>
                          ))}
                          {guide.specialties.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                              +{guide.specialties.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {guide.languages && guide.languages.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium text-slate-700">Languages:</span>
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.slice(0, 3).map((language, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {language}
                            </span>
                          ))}
                          {guide.languages.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                              +{guide.languages.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {guide.bio && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {guide.bio}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedGuide(guide)
                        setShowDetails(true)
                      }}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {!guide.isVerified && (
                      <button
                        onClick={() => openApprovalModal(guide.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Verify Guide"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}

                    <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredGuides.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No guides found</h3>
                <p className="text-slate-500">No guides match your current filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {((pagination.current - 1) * pagination.limit) + 1} to {Math.min(pagination.current * pagination.limit, pagination.total)} of {pagination.total} guides
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
                {approvalData.status === 'approved' ? 'Verify Guide' : 'Reject Guide'}
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
                  ? 'Are you sure you want to verify this guide? They will be able to accept bookings.'
                  : 'Please provide a reason for rejecting this guide.'
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
                {approvalData.status === 'approved' ? 'Verify' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Details Modal */}
      {showDetails && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">{selectedGuide.name}</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guide Avatar and Basic Info */}
                <div>
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">{selectedGuide.name}</h4>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedGuide.availability)}`}>
                          {getStatusIcon(selectedGuide.availability)}
                          <span className="ml-1">{selectedGuide.availability}</span>
                        </span>
                        {selectedGuide.isVerified && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            <Shield className="h-4 w-4 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {renderStars(selectedGuide.rating)}
                        <span className="ml-2 text-sm text-slate-600">({selectedGuide.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{selectedGuide.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Briefcase className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{selectedGuide.experience} years experience</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-3 text-slate-400" />
                        <span>LKR {selectedGuide.price?.toLocaleString() || 'N/A'} per day</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{selectedGuide.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{selectedGuide.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide Details */}
                <div className="space-y-6">
                  {selectedGuide.bio && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">About</h4>
                      <p className="text-sm text-slate-600">{selectedGuide.bio}</p>
                    </div>
                  )}

                  {selectedGuide.specialties && selectedGuide.specialties.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGuide.specialties.map((specialty, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGuide.languages && selectedGuide.languages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGuide.languages.map((language, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGuide.certifications && selectedGuide.certifications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Certifications</h4>
                      <div className="space-y-2">
                        {selectedGuide.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center text-sm text-slate-600">
                            <Award className="h-4 w-4 mr-2 text-yellow-500" />
                            {cert}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">{selectedGuide.completedTours || 0}</div>
                        <div className="text-sm text-slate-600">Tours Completed</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">{selectedGuide.reviewCount || 0}</div>
                        <div className="text-sm text-slate-600">Reviews</div>
                      </div>
                    </div>
                  </div>
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
                {!selectedGuide.isVerified && (
                  <button
                    onClick={() => {
                      setShowDetails(false)
                      openApprovalModal(selectedGuide.id, 'approved')
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Verify Guide
                  </button>
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

export default GuideManagement
