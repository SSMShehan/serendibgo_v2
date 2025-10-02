import React, { useState, useEffect } from 'react'
import {
  Car,
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
  Compass,
  Fuel,
  Wrench,
  Gauge,
  Car as CarIcon,
  Truck,
  Bus,
  Bike
} from 'lucide-react'

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalData, setApprovalData] = useState({ vehicleId: '', status: '', reason: '' })
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    fuelType: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    status: '',
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
    totalVehicles: 0,
    activeVehicles: 0,
    availableVehicles: 0,
    totalDrivers: 0,
    totalBookings: 0,
    totalRevenue: 0
  })

  // Mock data for vehicles
  const mockVehicles = [
    {
      id: 1,
      name: 'Toyota Corolla',
      type: 'Sedan',
      capacity: 4,
      price: 8000,
      fuelType: 'Petrol',
      features: ['AC', 'GPS', 'Driver'],
      image: '/api/placeholder/300/200',
      description: 'Comfortable sedan perfect for city tours and short trips.',
      status: 'available',
      location: 'Colombo',
      driver: {
        id: 1,
        name: 'John Silva',
        phone: '+94 77 123 4567',
        license: 'DL-123456',
        rating: 4.5
      },
      isVerified: true,
      createdAt: '2024-01-15',
      bookings: 25,
      revenue: 200000
    },
    {
      id: 2,
      name: 'Toyota Hiace',
      type: 'Van',
      capacity: 12,
      price: 12000,
      fuelType: 'Diesel',
      features: ['AC', 'GPS', 'Driver', 'Luggage Space'],
      image: '/api/placeholder/300/200',
      description: 'Spacious van ideal for group tours and family trips.',
      status: 'available',
      location: 'Kandy',
      driver: {
        id: 2,
        name: 'Priya Fernando',
        phone: '+94 77 234 5678',
        license: 'DL-234567',
        rating: 4.8
      },
      isVerified: true,
      createdAt: '2024-01-10',
      bookings: 18,
      revenue: 216000
    },
    {
      id: 3,
      name: 'Nissan Sunny',
      type: 'Sedan',
      capacity: 4,
      price: 7000,
      fuelType: 'Petrol',
      features: ['AC', 'GPS'],
      image: '/api/placeholder/300/200',
      description: 'Economical sedan for budget-conscious travelers.',
      status: 'pending',
      location: 'Galle',
      driver: {
        id: 3,
        name: 'Ravi Perera',
        phone: '+94 77 345 6789',
        license: 'DL-345678',
        rating: 4.2
      },
      isVerified: false,
      createdAt: '2024-01-20',
      bookings: 0,
      revenue: 0
    },
    {
      id: 4,
      name: 'Toyota Coaster',
      type: 'Bus',
      capacity: 25,
      price: 20000,
      fuelType: 'Diesel',
      features: ['AC', 'GPS', 'Driver', 'Luggage Space', 'PA System'],
      image: '/api/placeholder/300/200',
      description: 'Large bus for group tours and events.',
      status: 'maintenance',
      location: 'Negombo',
      driver: {
        id: 4,
        name: 'Kumar Rajapaksa',
        phone: '+94 77 456 7890',
        license: 'DL-456789',
        rating: 4.7
      },
      isVerified: true,
      createdAt: '2024-01-05',
      bookings: 12,
      revenue: 240000
    }
  ]

  useEffect(() => {
    loadVehicles()
    loadStats()
  }, [filters, pagination.current])

  const loadVehicles = async () => {
    setLoading(true)
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        let filteredVehicles = [...mockVehicles]

        // Apply filters
        if (filters.search) {
          filteredVehicles = filteredVehicles.filter(vehicle =>
            vehicle.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            vehicle.type.toLowerCase().includes(filters.search.toLowerCase()) ||
            vehicle.location.toLowerCase().includes(filters.search.toLowerCase())
          )
        }

        if (filters.type) {
          filteredVehicles = filteredVehicles.filter(vehicle => vehicle.type === filters.type)
        }

        if (filters.fuelType) {
          filteredVehicles = filteredVehicles.filter(vehicle => vehicle.fuelType === filters.fuelType)
        }

        if (filters.location) {
          filteredVehicles = filteredVehicles.filter(vehicle => vehicle.location === filters.location)
        }

        if (filters.status) {
          filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status === filters.status)
        }

        setVehicles(filteredVehicles)
        setPagination(prev => ({
          ...prev,
          total: filteredVehicles.length,
          pages: Math.ceil(filteredVehicles.length / prev.limit)
        }))
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError('Failed to load vehicles')
      console.error('Error loading vehicles:', err)
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const totalVehicles = mockVehicles.length
      const activeVehicles = mockVehicles.filter(v => v.status === 'available').length
      const availableVehicles = mockVehicles.filter(v => v.status === 'available').length
      const totalDrivers = mockVehicles.length // Assuming one driver per vehicle
      const totalBookings = mockVehicles.reduce((sum, v) => sum + v.bookings, 0)
      const totalRevenue = mockVehicles.reduce((sum, v) => sum + v.revenue, 0)
      
      setStats({
        totalVehicles,
        activeVehicles,
        availableVehicles,
        totalDrivers,
        totalBookings,
        totalRevenue
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const handleApproval = async () => {
    try {
      // Simulate API call
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === approvalData.vehicleId 
          ? { ...vehicle, isVerified: approvalData.status === 'approved', status: approvalData.status === 'approved' ? 'available' : 'rejected' }
          : vehicle
      )
      setVehicles(updatedVehicles)
      
      setSuccess(`Vehicle ${approvalData.status} successfully`)
      setShowApprovalModal(false)
      setApprovalData({ vehicleId: '', status: '', reason: '' })
      
      // Reload data
      loadVehicles()
      loadStats()
    } catch (err) {
      setError(`Failed to ${approvalData.status} vehicle`)
      console.error('Error approving vehicle:', err)
    }
  }

  const openApprovalModal = (vehicleId, status) => {
    setApprovalData({ vehicleId, status, reason: '' })
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
      case 'available': return 'bg-green-100 text-green-800'
      case 'booked': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />
      case 'booked': return <Clock className="h-4 w-4" />
      case 'maintenance': return <Wrench className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getVehicleIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'sedan': return <Car className="h-6 w-6" />
      case 'van': return <Truck className="h-6 w-6" />
      case 'bus': return <Bus className="h-6 w-6" />
      case 'suv': return <Car className="h-6 w-6" />
      default: return <Car className="h-6 w-6" />
    }
  }

  const tabs = [
    { id: 'all', label: 'All Vehicles', count: stats.totalVehicles },
    { id: 'available', label: 'Available', count: stats.availableVehicles },
    { id: 'pending', label: 'Pending', count: vehicles.filter(v => v.status === 'pending').length },
    { id: 'maintenance', label: 'Maintenance', count: vehicles.filter(v => v.status === 'maintenance').length }
  ]

  const filteredVehicles = activeTab === 'all' 
    ? vehicles 
    : activeTab === 'available' 
    ? vehicles.filter(vehicle => vehicle.status === 'available')
    : vehicles.filter(vehicle => vehicle.status === activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vehicle Management</h2>
          <p className="text-slate-600">Manage vehicle listings and driver assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadVehicles}
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
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalVehicles}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Total Vehicles</h3>
          <p className="text-sm text-slate-600">Registered vehicles</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.availableVehicles}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Available</h3>
          <p className="text-sm text-slate-600">Ready for booking</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalDrivers}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Drivers</h3>
          <p className="text-sm text-slate-600">Active drivers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-yellow-600" />
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
                placeholder="Search vehicles..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
            <select
              value={filters.fuelType}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
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

        {/* Vehicles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading vehicles...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        {getVehicleIcon(vehicle.type)}
                        <span className="text-white text-xs ml-1">{vehicle.type}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{vehicle.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                            {getStatusIcon(vehicle.status)}
                            <span className="ml-1 capitalize">{vehicle.status}</span>
                          </span>
                          {vehicle.isVerified && (
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
                        {vehicle.location}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Users className="h-4 w-4 mr-2" />
                        {vehicle.capacity} passengers
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Fuel className="h-4 w-4 mr-2" />
                        {vehicle.fuelType}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        LKR {vehicle.price.toLocaleString()}/day
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-1" />
                        {vehicle.driver.name}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {vehicle.driver.phone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(vehicle.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium text-slate-700">Features:</span>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {feature}
                            </span>
                          ))}
                          {vehicle.features.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                              +{vehicle.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {vehicle.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {vehicle.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle)
                        setShowDetails(true)
                      }}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {vehicle.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openApprovalModal(vehicle.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openApprovalModal(vehicle.id, 'rejected')}
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

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No vehicles found</h3>
                <p className="text-slate-500">No vehicles match your current filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {((pagination.current - 1) * pagination.limit) + 1} to {Math.min(pagination.current * pagination.limit, pagination.total)} of {pagination.total} vehicles
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
                {approvalData.status === 'approved' ? 'Approve Vehicle' : 'Reject Vehicle'}
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
                  ? 'Are you sure you want to approve this vehicle? It will be available for booking.'
                  : 'Please provide a reason for rejecting this vehicle.'
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

      {/* Vehicle Details Modal */}
      {showDetails && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">{selectedVehicle.name}</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vehicle Image and Basic Info */}
                <div>
                  <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                    {getVehicleIcon(selectedVehicle.type)}
                    <span className="ml-2 text-slate-600">{selectedVehicle.name}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">{selectedVehicle.name}</h4>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedVehicle.status)}`}>
                          {getStatusIcon(selectedVehicle.status)}
                          <span className="ml-1 capitalize">{selectedVehicle.status}</span>
                        </span>
                        {selectedVehicle.isVerified && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            <Shield className="h-4 w-4 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{selectedVehicle.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{selectedVehicle.capacity} passengers</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Fuel className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{selectedVehicle.fuelType}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-3 text-slate-400" />
                        <span>LKR {selectedVehicle.price.toLocaleString()} per day</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-6">
                  {selectedVehicle.description && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Description</h4>
                      <p className="text-sm text-slate-600">{selectedVehicle.description}</p>
                    </div>
                  )}

                  {selectedVehicle.features && selectedVehicle.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVehicle.features.map((feature, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Driver Information</h4>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <UserCheck className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-medium">{selectedVehicle.driver.name}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{selectedVehicle.driver.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 mr-2 text-slate-400" />
                        <span>License: {selectedVehicle.driver.license}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 mr-2 text-slate-400" />
                        <span>Rating: {selectedVehicle.driver.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">{selectedVehicle.bookings}</div>
                        <div className="text-sm text-slate-600">Total Bookings</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">LKR {selectedVehicle.revenue.toLocaleString()}</div>
                        <div className="text-sm text-slate-600">Total Revenue</div>
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
                {selectedVehicle.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetails(false)
                        openApprovalModal(selectedVehicle.id, 'approved')
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setShowDetails(false)
                        openApprovalModal(selectedVehicle.id, 'rejected')
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

export default VehicleManagement
