import React, { useState, useEffect } from 'react'
import {
  Star,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Calendar,
  User,
  MapPin,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Edit3,
  Trash2,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRating, setFilterRating] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [expandedReviews, setExpandedReviews] = useState(new Set())
  const [stats, setStats] = useState({
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    averageRating: 0,
    recentReviews: 0
  })

  // Mock data for demonstration
  useEffect(() => {
    const mockReviews = [
      {
        _id: '1',
        user: {
          _id: 'u1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          avatar: null
        },
        tour: {
          _id: 't1',
          title: 'Cultural Heritage Tour of Kandy',
          location: 'Kandy, Central Province'
        },
        guide: {
          _id: 'g1',
          firstName: 'Priya',
          lastName: 'Fernando',
          email: 'priya.fernando@guide.com'
        },
        booking: {
          _id: 'b1',
          bookingDate: '2024-01-15',
          tourDate: '2024-01-20'
        },
        rating: 5,
        comment: 'Absolutely amazing tour! Priya was an excellent guide with deep knowledge of the cultural sites. The temple visits were particularly enlightening, and the local food recommendations were spot on. Highly recommend this tour to anyone visiting Kandy.',
        isVerified: true,
        isActive: true,
        status: 'approved',
        helpful: 12,
        notHelpful: 1,
        createdAt: '2024-01-22T10:30:00Z',
        updatedAt: '2024-01-22T10:30:00Z',
        flagged: false,
        flaggedReason: null
      },
      {
        _id: '2',
        user: {
          _id: 'u2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com',
          avatar: null
        },
        tour: {
          _id: 't2',
          title: 'Wildlife Safari in Yala National Park',
          location: 'Yala, Southern Province'
        },
        guide: {
          _id: 'g2',
          firstName: 'Kamal',
          lastName: 'Perera',
          email: 'kamal.perera@guide.com'
        },
        booking: {
          _id: 'b2',
          bookingDate: '2024-01-10',
          tourDate: '2024-01-18'
        },
        rating: 4,
        comment: 'Great safari experience! We saw elephants, leopards, and many other animals. Kamal was knowledgeable about the wildlife and made sure we had the best viewing opportunities. The only minor issue was the early start time, but it was worth it.',
        isVerified: true,
        isActive: true,
        status: 'approved',
        helpful: 8,
        notHelpful: 0,
        createdAt: '2024-01-19T14:20:00Z',
        updatedAt: '2024-01-19T14:20:00Z',
        flagged: false,
        flaggedReason: null
      },
      {
        _id: '3',
        user: {
          _id: 'u3',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.brown@email.com',
          avatar: null
        },
        tour: {
          _id: 't3',
          title: 'Beach Paradise in Mirissa',
          location: 'Mirissa, Southern Province'
        },
        guide: {
          _id: 'g3',
          firstName: 'Nimal',
          lastName: 'Silva',
          email: 'nimal.silva@guide.com'
        },
        booking: {
          _id: 'b3',
          bookingDate: '2024-01-08',
          tourDate: '2024-01-16'
        },
        rating: 2,
        comment: 'Disappointing experience. The tour was supposed to include whale watching but we didn\'t see any whales. The guide seemed inexperienced and didn\'t provide much information. The beach was nice but the overall experience was not worth the money.',
        isVerified: false,
        isActive: true,
        status: 'pending',
        helpful: 2,
        notHelpful: 5,
        createdAt: '2024-01-17T09:15:00Z',
        updatedAt: '2024-01-17T09:15:00Z',
        flagged: true,
        flaggedReason: 'Negative review with potential accuracy issues'
      },
      {
        _id: '4',
        user: {
          _id: 'u4',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@email.com',
          avatar: null
        },
        tour: {
          _id: 't4',
          title: 'Tea Plantation Tour in Nuwara Eliya',
          location: 'Nuwara Eliya, Central Province'
        },
        guide: {
          _id: 'g4',
          firstName: 'Ravi',
          lastName: 'Wickramasinghe',
          email: 'ravi.wickramasinghe@guide.com'
        },
        booking: {
          _id: 'b4',
          bookingDate: '2024-01-05',
          tourDate: '2024-01-14'
        },
        rating: 5,
        comment: 'Perfect tour! Ravi was incredibly knowledgeable about tea production and the history of the plantations. The scenery was breathtaking and the tea tasting experience was educational and enjoyable. Would definitely recommend!',
        isVerified: true,
        isActive: true,
        status: 'approved',
        helpful: 15,
        notHelpful: 0,
        createdAt: '2024-01-15T16:45:00Z',
        updatedAt: '2024-01-15T16:45:00Z',
        flagged: false,
        flaggedReason: null
      },
      {
        _id: '5',
        user: {
          _id: 'u5',
          firstName: 'David',
          lastName: 'Wilson',
          email: 'david.wilson@email.com',
          avatar: null
        },
        tour: {
          _id: 't5',
          title: 'Ancient City of Anuradhapura',
          location: 'Anuradhapura, North Central Province'
        },
        guide: {
          _id: 'g5',
          firstName: 'Sunil',
          lastName: 'Rajapakse',
          email: 'sunil.rajapakse@guide.com'
        },
        booking: {
          _id: 'b5',
          bookingDate: '2024-01-03',
          tourDate: '2024-01-12'
        },
        rating: 1,
        comment: 'Terrible experience. The guide was late, didn\'t speak good English, and seemed disinterested. The tour was rushed and we didn\'t get to see many of the promised sites. Waste of money and time.',
        isVerified: false,
        isActive: false,
        status: 'rejected',
        helpful: 1,
        notHelpful: 8,
        createdAt: '2024-01-13T11:30:00Z',
        updatedAt: '2024-01-13T11:30:00Z',
        flagged: true,
        flaggedReason: 'Inappropriate language and unverified claims'
      }
    ]

    setReviews(mockReviews)
    
    // Calculate stats
    const totalReviews = mockReviews.length
    const pendingReviews = mockReviews.filter(r => r.status === 'pending').length
    const approvedReviews = mockReviews.filter(r => r.status === 'approved').length
    const rejectedReviews = mockReviews.filter(r => r.status === 'rejected').length
    const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    const recentReviews = mockReviews.filter(r => {
      const reviewDate = new Date(r.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return reviewDate > weekAgo
    }).length

    setStats({
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      averageRating: averageRating.toFixed(1),
      recentReviews
    })
  }, [])

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      review.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating

    return matchesSearch && matchesStatus && matchesRating
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'rating-high':
        return b.rating - a.rating
      case 'rating-low':
        return a.rating - b.rating
      case 'helpful':
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const handleApproveReview = async (reviewId) => {
    setLoading(true)
    try {
      // API call would go here
      setReviews(prev => prev.map(review => 
        review._id === reviewId 
          ? { ...review, status: 'approved', isActive: true }
          : review
      ))
      setStats(prev => ({
        ...prev,
        pendingReviews: prev.pendingReviews - 1,
        approvedReviews: prev.approvedReviews + 1
      }))
    } catch (error) {
      console.error('Error approving review:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectReview = async (reviewId, reason) => {
    setLoading(true)
    try {
      // API call would go here
      setReviews(prev => prev.map(review => 
        review._id === reviewId 
          ? { ...review, status: 'rejected', isActive: false, rejectionReason: reason }
          : review
      ))
      setStats(prev => ({
        ...prev,
        pendingReviews: prev.pendingReviews - 1,
        rejectedReviews: prev.rejectedReviews + 1
      }))
    } catch (error) {
      console.error('Error rejecting review:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFlagReview = async (reviewId, reason) => {
    setLoading(true)
    try {
      // API call would go here
      setReviews(prev => prev.map(review => 
        review._id === reviewId 
          ? { ...review, flagged: true, flaggedReason: reason }
          : review
      ))
    } catch (error) {
      console.error('Error flagging review:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Review Management</h2>
          <p className="text-slate-600">Moderate and manage user reviews</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStatsModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Reviews</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalReviews}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedReviews}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejectedReviews}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Avg Rating</p>
              <p className="text-2xl font-bold text-slate-900">{stats.averageRating}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">This Week</p>
              <p className="text-2xl font-bold text-slate-900">{stats.recentReviews}</p>
            </div>
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reviews, users, tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Reviews ({filteredReviews.length})
          </h3>
        </div>
        
        <div className="divide-y divide-slate-200">
          {sortedReviews.map((review) => (
            <div key={review._id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {review.user.firstName} {review.user.lastName}
                      </h4>
                      <p className="text-sm text-slate-600">{review.user.email}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                      <span className="flex items-center">
                        {getStatusIcon(review.status)}
                        <span className="ml-1 capitalize">{review.status}</span>
                      </span>
                    </span>
                    {review.flagged && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <Flag className="h-3 w-3 inline mr-1" />
                        Flagged
                      </span>
                    )}
                    {review.isVerified && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <Shield className="h-3 w-3 inline mr-1" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <h5 className="font-medium text-slate-900 mb-1">{review.tour.title}</h5>
                    <p className="text-sm text-slate-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {review.tour.location}
                    </p>
                    <p className="text-sm text-slate-600">
                      Guide: {review.guide.firstName} {review.guide.lastName}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className={`text-slate-700 ${!expandedReviews.has(review._id) ? 'line-clamp-2' : ''}`}>
                      {review.comment}
                    </p>
                    {review.comment.length > 100 && (
                      <button
                        onClick={() => toggleReviewExpansion(review._id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
                      >
                        {expandedReviews.has(review._id) ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {review.helpful} helpful
                    </span>
                    <span className="flex items-center">
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {review.notHelpful} not helpful
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveReview(review._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve Review"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRejectReview(review._id, 'Inappropriate content')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject Review"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  
                  {!review.flagged && (
                    <button
                      onClick={() => handleFlagReview(review._id, 'Content review needed')}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Flag Review"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedReview(review)
                      setShowReviewModal(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No reviews found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Review Details</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {selectedReview.user.firstName} {selectedReview.user.lastName}
                  </h4>
                  <p className="text-sm text-slate-600">{selectedReview.user.email}</p>
                </div>
                <div className="flex items-center space-x-1 ml-auto">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h5 className="font-medium text-slate-900 mb-2">{selectedReview.tour.title}</h5>
                <p className="text-sm text-slate-600 mb-1">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {selectedReview.tour.location}
                </p>
                <p className="text-sm text-slate-600">
                  Guide: {selectedReview.guide.firstName} {selectedReview.guide.lastName}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-slate-900 mb-2">Review Comment</h5>
                <p className="text-slate-700 bg-slate-50 rounded-xl p-4">
                  {selectedReview.comment}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h5 className="font-medium text-slate-900 mb-2">Review Stats</h5>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between">
                      <span className="text-slate-600">Helpful:</span>
                      <span className="font-medium">{selectedReview.helpful}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-600">Not Helpful:</span>
                      <span className="font-medium">{selectedReview.notHelpful}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className={`font-medium capitalize ${getStatusColor(selectedReview.status)}`}>
                        {selectedReview.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h5 className="font-medium text-slate-900 mb-2">Booking Info</h5>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between">
                      <span className="text-slate-600">Booking Date:</span>
                      <span className="font-medium">{new Date(selectedReview.booking.bookingDate).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-600">Tour Date:</span>
                      <span className="font-medium">{new Date(selectedReview.booking.tourDate).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-600">Review Date:</span>
                      <span className="font-medium">{new Date(selectedReview.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedReview.flagged && selectedReview.flaggedReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h5 className="font-medium text-red-900 mb-2 flex items-center">
                    <Flag className="h-4 w-4 mr-2" />
                    Flagged Reason
                  </h5>
                  <p className="text-red-700">{selectedReview.flaggedReason}</p>
                </div>
              )}

              {selectedReview.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h5 className="font-medium text-red-900 mb-2">Rejection Reason</h5>
                  <p className="text-red-700">{selectedReview.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              {selectedReview.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApproveReview(selectedReview._id)
                      setShowReviewModal(false)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleRejectReview(selectedReview._id, 'Inappropriate content')
                      setShowReviewModal(false)
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Review Analytics</h3>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">Review Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>5 Stars</span>
                      <span className="font-bold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4 Stars</span>
                      <span className="font-bold">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3 Stars</span>
                      <span className="font-bold">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 Stars</span>
                      <span className="font-bold">7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 Star</span>
                      <span className="font-bold">3%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">Status Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Approved</span>
                      <span className="font-bold">{stats.approvedReviews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <span className="font-bold">{stats.pendingReviews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rejected</span>
                      <span className="font-bold">{stats.rejectedReviews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flagged</span>
                      <span className="font-bold">{reviews.filter(r => r.flagged).length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Recent Trends</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+12%</div>
                    <div className="text-sm text-slate-600">Reviews this month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4.2</div>
                    <div className="text-sm text-slate-600">Average rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <div className="text-sm text-slate-600">Approval rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowStatsModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewManagement
