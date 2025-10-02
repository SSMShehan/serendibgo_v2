import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Clock,
  Award,
  Activity,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Target,
  Zap,
  Globe,
  Building,
  Car,
  UserCheck,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

const AnalyticsManagement = () => {
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']))
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 1250,
      totalBookings: 89,
      totalRevenue: 125000,
      averageRating: 4.2,
      activeTours: 45,
      activeGuides: 23,
      activeHotels: 67,
      activeVehicles: 34
    },
    revenue: {
      total: 125000,
      monthly: 45000,
      weekly: 12000,
      daily: 1800,
      growth: 12.5,
      breakdown: {
        tours: 85000,
        hotels: 25000,
        vehicles: 15000
      }
    },
    bookings: {
      total: 89,
      completed: 76,
      pending: 8,
      cancelled: 5,
      growth: 8.3,
      byType: {
        tours: 45,
        hotels: 28,
        vehicles: 16
      }
    },
    users: {
      total: 1250,
      new: 45,
      active: 234,
      inactive: 971,
      growth: 15.2,
      byRole: {
        customers: 1100,
        guides: 120,
        staff: 30
      }
    },
    performance: {
      averageResponseTime: 2.4,
      customerSatisfaction: 4.2,
      bookingCompletionRate: 85.4,
      guideRating: 4.6,
      hotelRating: 4.1,
      vehicleRating: 4.3
    }
  })

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ]

  const metrics = [
    { value: 'overview', label: 'Overview', icon: BarChart3 },
    { value: 'revenue', label: 'Revenue', icon: DollarSign },
    { value: 'bookings', label: 'Bookings', icon: Calendar },
    { value: 'users', label: 'Users', icon: Users },
    { value: 'performance', label: 'Performance', icon: Target }
  ]

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-slate-600'
  }

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4" />
    if (growth < 0) return <TrendingDown className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{analytics.overview.totalUsers.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center text-blue-100 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          +15.2% from last month
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="text-right">
            <p className="text-green-100 text-sm">Active Bookings</p>
            <p className="text-2xl font-bold">{analytics.overview.totalBookings}</p>
          </div>
        </div>
        <div className="flex items-center text-green-100 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          +8.3% from last month
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="text-right">
            <p className="text-purple-100 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">LKR {analytics.overview.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center text-purple-100 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          +12.5% from last month
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Star className="h-6 w-6" />
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-sm">Avg Rating</p>
            <p className="text-2xl font-bold">{analytics.overview.averageRating}</p>
          </div>
        </div>
        <div className="flex items-center text-orange-100 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          +0.2 from last month
        </div>
      </div>
    </div>
  )

  const renderRevenueAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Monthly Revenue</p>
              <p className="text-xl font-bold text-slate-900">LKR {analytics.revenue.monthly.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className={`flex items-center ${getGrowthColor(analytics.revenue.growth)}`}>
              {getGrowthIcon(analytics.revenue.growth)}
              <span className="ml-1">{analytics.revenue.growth}%</span>
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Weekly Revenue</p>
              <p className="text-xl font-bold text-slate-900">LKR {analytics.revenue.weekly.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className={`flex items-center ${getGrowthColor(8.2)}`}>
              {getGrowthIcon(8.2)}
              <span className="ml-1">+8.2%</span>
            </span>
            <span className="text-slate-500 ml-2">vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Daily Revenue</p>
              <p className="text-xl font-bold text-slate-900">LKR {analytics.revenue.daily.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className={`flex items-center ${getGrowthColor(5.1)}`}>
              {getGrowthIcon(5.1)}
              <span className="ml-1">+5.1%</span>
            </span>
            <span className="text-slate-500 ml-2">vs yesterday</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Breakdown by Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Tours</h4>
            <p className="text-2xl font-bold text-blue-600">LKR {analytics.revenue.breakdown.tours.toLocaleString()}</p>
            <p className="text-sm text-slate-600">68% of total revenue</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Hotels</h4>
            <p className="text-2xl font-bold text-green-600">LKR {analytics.revenue.breakdown.hotels.toLocaleString()}</p>
            <p className="text-sm text-slate-600">20% of total revenue</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Car className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Vehicles</h4>
            <p className="text-2xl font-bold text-purple-600">LKR {analytics.revenue.breakdown.vehicles.toLocaleString()}</p>
            <p className="text-sm text-slate-600">12% of total revenue</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBookingAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Total Bookings</p>
              <p className="text-xl font-bold text-slate-900">{analytics.bookings.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-xl font-bold text-green-600">{analytics.bookings.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{analytics.bookings.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Cancelled</p>
              <p className="text-xl font-bold text-red-600">{analytics.bookings.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Bookings by Service Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Tours</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.bookings.byType.tours}</p>
            <p className="text-sm text-slate-600">51% of bookings</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Hotels</h4>
            <p className="text-2xl font-bold text-green-600">{analytics.bookings.byType.hotels}</p>
            <p className="text-sm text-slate-600">31% of bookings</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Car className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Vehicles</h4>
            <p className="text-2xl font-bold text-purple-600">{analytics.bookings.byType.vehicles}</p>
            <p className="text-sm text-slate-600">18% of bookings</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUserAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-xl font-bold text-slate-900">{analytics.users.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Active Users</p>
              <p className="text-xl font-bold text-green-600">{analytics.users.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">New Users</p>
              <p className="text-xl font-bold text-purple-600">{analytics.users.new}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Inactive Users</p>
              <p className="text-xl font-bold text-gray-600">{analytics.users.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Users by Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Customers</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.users.byRole.customers.toLocaleString()}</p>
            <p className="text-sm text-slate-600">88% of total users</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Guides</h4>
            <p className="text-2xl font-bold text-green-600">{analytics.users.byRole.guides}</p>
            <p className="text-sm text-slate-600">10% of total users</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Staff</h4>
            <p className="text-2xl font-bold text-purple-600">{analytics.users.byRole.staff}</p>
            <p className="text-sm text-slate-600">2% of total users</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPerformanceAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Avg Response Time</p>
              <p className="text-xl font-bold text-slate-900">{analytics.performance.averageResponseTime}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Customer Satisfaction</p>
              <p className="text-xl font-bold text-green-600">{analytics.performance.customerSatisfaction}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Completion Rate</p>
              <p className="text-xl font-bold text-purple-600">{analytics.performance.bookingCompletionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Service Ratings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Guide Rating</h4>
            <p className="text-2xl font-bold text-green-600">{analytics.performance.guideRating}/5</p>
            <p className="text-sm text-slate-600">Excellent performance</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Hotel Rating</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.performance.hotelRating}/5</p>
            <p className="text-sm text-slate-600">Good performance</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Car className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Vehicle Rating</h4>
            <p className="text-2xl font-bold text-purple-600">{analytics.performance.vehicleRating}/5</p>
            <p className="text-sm text-slate-600">Good performance</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMetricContent = () => {
    switch (selectedMetric) {
      case 'overview':
        return renderOverviewCards()
      case 'revenue':
        return renderRevenueAnalytics()
      case 'bookings':
        return renderBookingAnalytics()
      case 'users':
        return renderUserAnalytics()
      case 'performance':
        return renderPerformanceAnalytics()
      default:
        return renderOverviewCards()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-600">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
          <button className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Metric Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <button
                key={metric.value}
                onClick={() => setSelectedMetric(metric.value)}
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedMetric === metric.value
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {metric.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Metric Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {renderMetricContent()}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Active Tours</p>
              <p className="text-xl font-bold text-slate-900">{analytics.overview.activeTours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Active Guides</p>
              <p className="text-xl font-bold text-slate-900">{analytics.overview.activeGuides}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Active Hotels</p>
              <p className="text-xl font-bold text-slate-900">{analytics.overview.activeHotels}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Active Vehicles</p>
              <p className="text-xl font-bold text-slate-900">{analytics.overview.activeVehicles}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsManagement
