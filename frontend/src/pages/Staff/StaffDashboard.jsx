import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  User,
  MapPin,
  Star,
  Clock,
  Users,
  Award,
  Globe,
  Camera,
  Save,
  Edit3,
  Eye,
  Phone,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Languages,
  Briefcase,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Heart,
  Bell,
  Headphones,
  Home,
  TrendingUp,
  BookOpen,
  LogOut,
  ChevronDown,
  Car,
  Building,
  UserCheck,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Download,
  RefreshCw,
  Activity,
  Target,
  Zap,
  Package,
  ClipboardList,
  UserPlus,
  Building2,
  Car as CarIcon,
  Map,
  Navigation,
  Compass,
  Flag,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash,
  Copy,
  Share,
  Archive,
  Ban,
  Unlock,
  Lock,
  EyeOff,
  Send,
  Reply,
  Flag as FlagIcon,
  Star as StarIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  MessageSquare as MessageSquareIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Users as UsersIcon,
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  BarChart3 as BarChart3Icon,
  PieChart,
  LineChart,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Shield as ShieldIcon,
  Globe as GlobeIcon,
  Camera as CameraIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  X as XIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  ExternalLink as ExternalLinkIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Copy as CopyIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  Ban as BanIcon,
  Unlock as UnlockIcon,
  Lock as LockIcon,
  EyeOff as EyeOffIcon,
  Send as SendIcon,
  Reply as ReplyIcon,
  FlagIcon as FlagIconIcon,
  StarIcon as StarIconIcon,
  ThumbsUpIcon as ThumbsUpIconIcon,
  ThumbsDownIcon as ThumbsDownIconIcon,
  MessageSquareIcon as MessageSquareIconIcon,
  ClockIcon as ClockIconIcon,
  CalendarIcon as CalendarIconIcon,
  MapPinIcon as MapPinIconIcon,
  UsersIcon as UsersIconIcon,
  DollarSignIcon as DollarSignIconIcon,
  TrendingUpIcon as TrendingUpIconIcon,
  BarChart3Icon as BarChart3IconIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ActivityIcon as ActivityIconIcon,
  ZapIcon as ZapIconIcon,
  TargetIcon as TargetIconIcon,
  AwardIcon as AwardIconIcon,
  ShieldIcon as ShieldIconIcon,
  GlobeIcon as GlobeIconIcon,
  CameraIcon as CameraIconIcon,
  UploadIcon as UploadIconIcon,
  DownloadIcon as DownloadIconIcon,
  RefreshCwIcon as RefreshCwIconIcon,
  FilterIcon as FilterIconIcon,
  SearchIcon as SearchIconIcon,
  PlusIcon as PlusIconIcon,
  XIcon as XIconIcon,
  CheckCircleIcon as CheckCircleIconIcon,
  AlertCircleIcon as AlertCircleIconIcon,
  InfoIcon as InfoIconIcon,
  ExternalLinkIcon as ExternalLinkIconIcon,
  MoreHorizontalIcon as MoreHorizontalIconIcon,
  EditIcon as EditIconIcon,
  TrashIcon as TrashIconIcon,
  CopyIcon as CopyIconIcon,
  ShareIcon as ShareIconIcon,
  ArchiveIcon as ArchiveIconIcon,
  BanIcon as BanIconIcon,
  UnlockIcon as UnlockIconIcon,
  LockIcon as LockIconIcon,
  EyeOffIcon as EyeOffIconIcon,
  SendIcon as SendIconIcon,
  ReplyIcon as ReplyIconIcon
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import TripManagement from './components/TripManagement'
import CustomTripApproval from './components/CustomTripApproval'
import HotelManagement from './components/HotelManagement'
import GuideManagement from './components/GuideManagement'
import VehicleManagement from './components/VehicleManagement'
import SupportManagement from './components/SupportManagement'
import ReviewManagement from './components/ReviewManagement'
import AnalyticsManagement from './components/AnalyticsManagement'
import SettingsManagement from './components/SettingsManagement'

const StaffDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  
  // Staff stats
  const [staffStats, setStaffStats] = useState({
    pendingApprovals: 12,
    totalUsers: 1250,
    activeBookings: 89,
    totalRevenue: 125000,
    pendingReviews: 8,
    supportTickets: 15,
    newGuides: 5,
    newHotels: 3,
    newVehicles: 7
  })

  // Handle navigation state for activeTab
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab)
    }
  }, [location.state])

  // Get current user info
  useEffect(() => {
    if (isLoading) return
    
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }
    
    if (user.role !== 'staff' && user.role !== 'admin') {
      navigate('/dashboard')
      return
    }
  }, [isLoading, isAuthenticated, user, navigate])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'trips', label: 'Trip Management', icon: Map },
    { id: 'custom-trips', label: 'Custom Trips', icon: Compass },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'guides', label: 'Guides', icon: UserCheck },
    { id: 'hotels', label: 'Hotels', icon: Building },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Staff Dashboard</h1>
                <p className="text-slate-600">Manage and oversee platform operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 font-medium">Staff Member</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('settings')
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate('/')
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-3" />
                      View Site
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        Welcome back, {user?.firstName}!
                      </h2>
                      <p className="text-blue-100 text-lg">
                        Manage and oversee the SerendibGo platform operations
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{staffStats.pendingApprovals}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Pending Approvals</h3>
                    <p className="text-sm text-slate-600">Items awaiting review</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{staffStats.totalUsers}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Total Users</h3>
                    <p className="text-sm text-slate-600">Registered platform users</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{staffStats.activeBookings}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Active Bookings</h3>
                    <p className="text-sm text-slate-600">Current reservations</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">LKR {staffStats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Total Revenue</h3>
                    <p className="text-sm text-slate-600">Platform earnings</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <Zap className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                      onClick={() => setActiveTab('custom-trips')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                        <Compass className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Review Custom Trips</h3>
                      <p className="text-sm text-slate-600">Approve or reject custom trip requests</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('guides')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <UserCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Manage Guides</h3>
                      <p className="text-sm text-slate-600">Approve and manage guide applications</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('hotels')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Manage Hotels</h3>
                      <p className="text-sm text-slate-600">Approve and manage hotel listings</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('vehicles')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                        <Car className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Manage Vehicles</h3>
                      <p className="text-sm text-slate-600">Approve and manage vehicle listings</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('support')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                        <Headphones className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Support Tickets</h3>
                      <p className="text-sm text-slate-600">Handle customer support requests</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                        <Star className="h-6 w-6 text-cyan-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Review Moderation</h3>
                      <p className="text-sm text-slate-600">Moderate user reviews and ratings</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <Activity className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <Compass className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">New custom trip request</h3>
                        <p className="text-sm text-slate-600">7-day cultural tour of Kandy and Anuradhapura</p>
                      </div>
                      <span className="text-sm text-slate-500">2 hours ago</span>
                    </div>

                    <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <UserCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">Guide application approved</h3>
                        <p className="text-sm text-slate-600">Sarah Perera - Wildlife specialist</p>
                      </div>
                      <span className="text-sm text-slate-500">4 hours ago</span>
                    </div>

                    <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">Hotel listing updated</h3>
                        <p className="text-sm text-slate-600">Colombo Grand Hotel - New room types added</p>
                      </div>
                      <span className="text-sm text-slate-500">6 hours ago</span>
                    </div>

                    <div className="flex items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                        <Headphones className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">Support ticket resolved</h3>
                        <p className="text-sm text-slate-600">Booking cancellation issue - Ticket #ST-2024-001</p>
                      </div>
                      <span className="text-sm text-slate-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trip Management Tab */}
            {activeTab === 'trips' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <TripManagement />
              </div>
            )}

            {/* Custom Trip Approval Tab */}
            {activeTab === 'custom-trips' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <CustomTripApproval />
              </div>
            )}

            {/* Hotel Management Tab */}
            {activeTab === 'hotels' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <HotelManagement />
              </div>
            )}

            {/* Guide Management Tab */}
            {activeTab === 'guides' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <GuideManagement />
              </div>
            )}

            {/* Vehicle Management Tab */}
            {activeTab === 'vehicles' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <VehicleManagement />
              </div>
            )}

            {/* Support Management Tab */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <SupportManagement />
              </div>
            )}

            {/* Review Management Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <ReviewManagement />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <AnalyticsManagement />
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <SettingsManagement />
              </div>
            )}

            {/* Other tabs will be implemented in separate components */}
            {activeTab !== 'overview' && activeTab !== 'trips' && activeTab !== 'custom-trips' && activeTab !== 'hotels' && activeTab !== 'guides' && activeTab !== 'vehicles' && activeTab !== 'support' && activeTab !== 'reviews' && activeTab !== 'analytics' && activeTab !== 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    {tabs.find(tab => tab.id === activeTab)?.label} Management
                  </h3>
                  <p className="text-slate-500">
                    This section is under development. The {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} management interface will be available soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard
