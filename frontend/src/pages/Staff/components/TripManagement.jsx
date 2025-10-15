// Staff Trip Management Component
import React, { useState, useEffect } from 'react';
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
  MoreHorizontal,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Zap,
  Target,
  Info,
  Edit3,
  Copy,
  Share,
  Archive,
  Ban,
  Unlock,
  Lock,
  EyeOff,
  Send,
  Reply,
  Phone,
  Mail,
  User,
  Building,
  Car,
  Compass,
  Navigation,
  Flag,
  Layers,
  Package,
  Tag,
  Hash,
  Percent,
  PieChart,
  LineChart,
  Monitor,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Signal,
  Battery,
  Thermometer,
  Gauge,
  CheckSquare,
  Square,
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
  Reply as ReplyIcon
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import staffService from '../../../services/staff/staffService';
import toast from 'react-hot-toast';

const TripManagement = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [trips, setTrips] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    location: 'all',
    difficulty: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [newTrip, setNewTrip] = useState({
    title: '',
    description: '',
    shortDescription: '',
    duration: 1,
    price: 0,
    maxParticipants: 1,
    minParticipants: 1,
    category: 'cultural',
    difficulty: 'easy',
    guide: '',
    locations: [
      {
        name: '',
        city: '',
        coordinates: [0, 0],
        address: ''
      }
    ],
    highlights: [],
    included: [],
    excluded: [],
    requirements: '',
    cancellationPolicy: 'moderate',
    images: [
      {
        url: '',
        alt: '',
        isPrimary: true
      }
    ],
    tags: [],
    isFeatured: false
  });

  const [availableGuides, setAvailableGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(false);

  // Fetch trips
  const fetchTrips = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        ...filters
      };
      if (searchTerm) params.search = searchTerm;
      
      console.log('Fetching trips with params:', params);
      const data = await staffService.getTrips(params);
      console.log('Trips data:', data);
      setTrips(data.data.trips);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Fetch trips error:', error);
      toast.error(error.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await staffService.getTripStatistics();
      setStatistics(data.data);
    } catch (error) {
      console.error('Fetch statistics error:', error);
    }
  };

  // Fetch available guides
  const fetchGuides = async () => {
    try {
      setLoadingGuides(true);
      const response = await fetch('/api/guides?limit=100', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailableGuides(data.data || []);
      } else {
        console.error('Failed to fetch guides');
        toast.error('Failed to load guides');
      }
    } catch (error) {
      console.error('Fetch guides error:', error);
      toast.error('Failed to load guides');
    } finally {
      setLoadingGuides(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchTrips();
      fetchStatistics();
      fetchGuides();
    }
  }, [isAuthenticated, isLoading]);

  // Filter changes
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchTrips();
    }
  }, [filters.status, filters.category, filters.location, filters.difficulty, searchTerm]);

  // Handle viewing details
  const handleViewDetails = async (trip) => {
    setSelectedTrip(trip);
    setShowDetailsModal(true);
  };

  // Handle edit trip
  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setNewTrip(trip);
    setShowEditModal(true);
  };

  // Handle delete trip
  const handleDeleteTrip = async (tripId) => {
    try {
      await staffService.deleteTrip(tripId);
      toast.success('Trip deleted successfully');
      fetchTrips();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Delete trip error:', error);
      toast.error(error.message || 'Failed to delete trip');
    }
  };

  // Handle create/update trip
  const handleSaveTrip = async () => {
    try {
      if (selectedTrip) {
        await staffService.updateTrip(selectedTrip._id, newTrip);
        toast.success('Trip updated successfully');
      } else {
        await staffService.createTrip(newTrip);
        toast.success('Trip created successfully');
      }
      fetchTrips();
      setShowCreateModal(false);
      setShowEditModal(false);
      setNewTrip({
        title: '',
        description: '',
        shortDescription: '',
        duration: 1,
        price: 0,
        maxParticipants: 1,
        minParticipants: 1,
        category: 'cultural',
        difficulty: 'easy',
        guide: '',
        locations: [
          {
            name: '',
            city: '',
            coordinates: [0, 0],
            address: ''
          }
        ],
        highlights: [],
        included: [],
        excluded: [],
        requirements: '',
        cancellationPolicy: 'moderate',
        images: [
          {
            url: '',
            alt: '',
            isPrimary: true
          }
        ],
        tags: [],
        isFeatured: false
      });
    } catch (error) {
      console.error('Save trip error:', error);
      toast.error(error.message || 'Failed to save trip');
    }
  };

  // Handle bulk operations
  const handleBulkAction = async (action) => {
    if (selectedTrips.length === 0) {
      toast.error('Please select trips first');
      return;
    }

    try {
      await staffService.bulkTripAction(selectedTrips, action);
      toast.success(`${action} completed successfully`);
      fetchTrips();
      setSelectedTrips([]);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error(error.message || `Failed to ${action} trips`);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedTrips.length === trips.length) {
      setSelectedTrips([]);
    } else {
      setSelectedTrips(trips.map(trip => trip._id));
    }
  };

  // Handle multiple locations
  const addLocation = () => {
    setNewTrip({
      ...newTrip,
      locations: [...newTrip.locations, {
        name: '',
        city: '',
        coordinates: [0, 0],
        address: ''
      }]
    });
  };

  const removeLocation = (index) => {
    if (newTrip.locations.length > 1) {
      const updatedLocations = newTrip.locations.filter((_, i) => i !== index);
      setNewTrip({
        ...newTrip,
        locations: updatedLocations
      });
    }
  };

  const updateLocation = (index, field, value) => {
    const updatedLocations = [...newTrip.locations];
    updatedLocations[index] = {
      ...updatedLocations[index],
      [field]: value
    };
    setNewTrip({
      ...newTrip,
      locations: updatedLocations
    });
  };

  // Handle image management
  const addImage = () => {
    const newImage = { url: '', alt: '', isPrimary: newTrip.images.length === 0 };
    setNewTrip({
      ...newTrip,
      images: [...newTrip.images, newImage]
    });
  };

  const removeImage = (index) => {
    const updatedImages = newTrip.images.filter((_, i) => i !== index);
    
    // If we removed the primary image and there are still images left, make the first one primary
    if (newTrip.images[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    setNewTrip({
      ...newTrip,
      images: updatedImages
    });
  };

  const updateImage = (index, field, value) => {
    const updatedImages = [...newTrip.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value
    };
    setNewTrip({
      ...newTrip,
      images: updatedImages
    });
  };

  const setPrimaryImage = (index) => {
    const updatedImages = newTrip.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setNewTrip({
      ...newTrip,
      images: updatedImages
    });
  };

  // Handle individual select
  const handleSelectTrip = (tripId) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips(selectedTrips.filter(id => id !== tripId));
    } else {
      setSelectedTrips([...selectedTrips, tripId]);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'draft': return Edit;
      case 'inactive': return X;
      case 'suspended': return Ban;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Trip Management</h2>
          <p className="text-slate-600">Manage all platform tours and experiences</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </button>
          <button
            onClick={fetchTrips}
            className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Trips</p>
              <p className="text-2xl font-bold text-slate-900">{statistics.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Trips</p>
              <p className="text-2xl font-bold text-green-600">{statistics.active || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Draft Trips</p>
              <p className="text-2xl font-bold text-yellow-600">{statistics.draft || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Edit className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Bookings</p>
              <p className="text-2xl font-bold text-purple-600">{statistics.totalBookings || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search trips..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Cultural">Cultural</option>
                <option value="Adventure">Adventure</option>
                <option value="Nature">Nature</option>
                <option value="Beach">Beach</option>
                <option value="Wildlife">Wildlife</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setFilters({ status: 'all', category: 'all', location: 'all', difficulty: 'all', sortBy: 'createdAt', sortOrder: 'desc' });
                setSearchTerm('');
              }}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedTrips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedTrips.length} trip(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trips List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Trips</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="flex items-center px-3 py-1 text-slate-600 hover:text-slate-900 transition-colors"
              >
                {selectedTrips.length === trips.length ? (
                  <CheckSquare className="h-4 w-4 mr-1" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                Select All
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="p-8 text-center">
            <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No trips found</h3>
            <p className="text-slate-500 mb-4">Get started by creating your first trip</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Trip
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {trips.map((trip) => {
              const StatusIcon = getStatusIcon(trip.status);
              return (
                <div key={trip._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedTrips.includes(trip._id)}
                        onChange={() => handleSelectTrip(trip._id)}
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                        {trip.images && trip.images.length > 0 ? (
                          <img
                            src={trip.images[0]}
                            alt={trip.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-slate-900">{trip.title}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {trip.status}
                          </span>
                        </div>
                        
                        <p className="text-slate-600 mb-3 line-clamp-2">{trip.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{trip.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{trip.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>LKR {trip.price?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{trip.maxParticipants} max</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>{trip.rating || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(trip)}
                        className="flex items-center px-3 py-1 text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditTrip(trip)}
                        className="flex items-center px-3 py-1 text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTrip(trip);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center px-3 py-1 text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trip Details Modal */}
      {showDetailsModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedTrip.title}</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Trip Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{selectedTrip.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium text-gray-900">{selectedTrip.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium text-gray-900">LKR {selectedTrip.price?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Max Participants</p>
                          <p className="font-medium text-gray-900">{selectedTrip.maxParticipants}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{selectedTrip.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrip.highlights?.map((highlight, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {highlight}
                        </span>
                      )) || <span className="text-gray-400">No highlights specified</span>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Included</h4>
                    <ul className="space-y-1">
                      {selectedTrip.included?.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </li>
                      )) || <span className="text-gray-400">No inclusions specified</span>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditTrip(selectedTrip);
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2 inline" />
                  Edit Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Trip Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {showEditModal ? 'Edit Trip' : 'Create New Trip'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedTrip(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveTrip(); }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title *</label>
                      <input
                        type="text"
                        value={newTrip.title}
                        onChange={(e) => setNewTrip({...newTrip, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter trip title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={newTrip.description}
                        onChange={(e) => setNewTrip({...newTrip, description: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter trip description"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                      <textarea
                        value={newTrip.shortDescription}
                        onChange={(e) => setNewTrip({...newTrip, shortDescription: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter short description (max 200 characters)"
                        maxLength={200}
                        required
                      />
                    </div>

                    {/* Multiple Locations */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Trip Locations *</label>
                        <button
                          type="button"
                          onClick={addLocation}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          + Add Location
                        </button>
                      </div>
                      {newTrip.locations.map((location, index) => (
                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium text-gray-700">Location {index + 1}</h5>
                            {newTrip.locations.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLocation(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Location Name *</label>
                              <input
                                type="text"
                                value={location.name}
                                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter location name"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                              <input
                                type="text"
                                value={location.city}
                                onChange={(e) => updateLocation(index, 'city', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter city"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                              <input
                                type="text"
                                value={location.address}
                                onChange={(e) => updateLocation(index, 'address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter full address"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days) *</label>
                        <input
                          type="number"
                          min="1"
                          value={newTrip.duration}
                          onChange={(e) => setNewTrip({...newTrip, duration: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants *</label>
                        <input
                          type="number"
                          min="1"
                          value={newTrip.maxParticipants}
                          onChange={(e) => setNewTrip({...newTrip, maxParticipants: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price (LKR) *</label>
                        <input
                          type="number"
                          min="0"
                          value={newTrip.price}
                          onChange={(e) => setNewTrip({...newTrip, price: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          value={newTrip.category}
                          onChange={(e) => setNewTrip({...newTrip, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="adventure">Adventure</option>
                          <option value="cultural">Cultural</option>
                          <option value="nature">Nature</option>
                          <option value="beach">Beach</option>
                          <option value="wildlife">Wildlife</option>
                          <option value="religious">Religious</option>
                          <option value="historical">Historical</option>
                          <option value="culinary">Culinary</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={newTrip.difficulty}
                        onChange={(e) => setNewTrip({...newTrip, difficulty: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="easy">Easy</option>
                        <option value="moderate">Moderate</option>
                        <option value="challenging">Challenging</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Guide *</label>
                      {loadingGuides ? (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span className="text-gray-500 text-sm">Loading guides...</span>
                        </div>
                      ) : (
                        <select
                          value={newTrip.guide || ''}
                          onChange={(e) => setNewTrip({...newTrip, guide: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select a guide</option>
                          {availableGuides.map((guide) => (
                            <option key={guide.id || guide._id} value={guide.id || guide._id}>
                              {guide.firstName} {guide.lastName} 
                              {guide.profile?.location && ` - ${guide.profile.location}`}
                              {guide.profile?.rating && ` (⭐ ${guide.profile.rating})`}
                            </option>
                          ))}
                        </select>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {availableGuides.length === 0 && !loadingGuides 
                          ? "No guides available. Please register guides first." 
                          : "Select a registered guide for this tour."}
                      </p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                      <textarea
                        value={newTrip.highlights.join(', ')}
                        onChange={(e) => setNewTrip({...newTrip, highlights: e.target.value.split(',').map(h => h.trim()).filter(h => h)})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter highlights separated by commas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Included</label>
                      <textarea
                        value={newTrip.included.join(', ')}
                        onChange={(e) => setNewTrip({...newTrip, included: e.target.value.split(',').map(i => i.trim()).filter(i => i)})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter what's included separated by commas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excluded</label>
                      <textarea
                        value={newTrip.excluded.join(', ')}
                        onChange={(e) => setNewTrip({...newTrip, excluded: e.target.value.split(',').map(e => e.trim()).filter(e => e)})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter what's excluded separated by commas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                      <textarea
                        value={newTrip.requirements}
                        onChange={(e) => setNewTrip({...newTrip, requirements: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter any requirements or restrictions"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                      <select
                        value={newTrip.cancellationPolicy}
                        onChange={(e) => setNewTrip({...newTrip, cancellationPolicy: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="flexible">Flexible</option>
                        <option value="moderate">Moderate</option>
                        <option value="strict">Strict</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Featured Trip</label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newTrip.isFeatured}
                          onChange={(e) => setNewTrip({...newTrip, isFeatured: e.target.checked})}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Mark as featured</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Trip Images</h4>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Trip Images</label>
                      <button
                        type="button"
                        onClick={addImage}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                      >
                        <Camera className="w-4 h-4" />
                        + Add Image
                      </button>
                    </div>
                    
                    {newTrip.images.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-gray-500 mb-2">No images added yet</div>
                        <button
                          type="button"
                          onClick={addImage}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
                        >
                          <Upload className="w-4 h-4" />
                          Add First Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {newTrip.images.map((image, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium text-gray-700">Image {index + 1}</h5>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPrimaryImage(index)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    image.isPrimary 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {image.isPrimary ? 'Primary' : 'Set Primary'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Image URL *</label>
                                <input
                                  type="url"
                                  value={image.url}
                                  onChange={(e) => updateImage(index, 'url', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="https://example.com/image.jpg"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Alt Text</label>
                                <input
                                  type="text"
                                  value={image.alt}
                                  onChange={(e) => updateImage(index, 'alt', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Describe the image"
                                />
                              </div>
                            </div>
                            
                            {/* Image Preview */}
                            {image.url && (
                              <div className="mt-3">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Preview</label>
                                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                                  <img
                                    src={image.url}
                                    alt={image.alt || `Trip image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                                    Invalid image URL
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Add high-quality images of your trip destinations. The first image will be used as the main display image.
                      <br />
                      <strong>Tip:</strong> Use image hosting services like Imgur, Cloudinary, or your own server for reliable image URLs.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedTrip(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    {showEditModal ? 'Update Trip' : 'Create Trip'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Trip</h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{selectedTrip.title}"? This will permanently remove the trip and all associated data.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTrip(selectedTrip._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;