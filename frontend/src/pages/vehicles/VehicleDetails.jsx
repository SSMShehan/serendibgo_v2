import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import tripService from '../../services/vehicles/tripService';
import { 
  Car, 
  Edit, 
  Trash2, 
  ArrowLeft,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const VehicleDetails = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Determine the correct dashboard path based on user role
  const getDashboardPath = () => {
    if (user?.role === 'driver') {
      return '/driver/dashboard';
    } else if (user?.role === 'vehicle_owner') {
      return '/vehicle-owner/dashboard';
    }
    return '/vehicles'; // Default to vehicles list for public users
  };
  
  // Check if user can edit/delete this vehicle
  const canEditVehicle = () => {
    if (!user) return false;
    if (!vehicle) return false;
    
    // Get user ID - handle both _id and id fields
    const userId = user._id || user.id;
    if (!userId) return false;
    
    // Check if user is the owner of this specific vehicle
    // Handle both cases: owner as object with _id or owner as string ID
    let isOwner = false;
    
    if (vehicle.owner) {
      if (typeof vehicle.owner === 'object' && vehicle.owner._id) {
        // Owner is populated object
        isOwner = vehicle.owner._id.toString() === userId.toString();
      } else if (typeof vehicle.owner === 'string') {
        // Owner is just the ID string
        isOwner = vehicle.owner.toString() === userId.toString();
      }
    }
    
    console.log('=== OWNERSHIP CHECK DEBUG ===');
    console.log('Vehicle owner:', vehicle.owner);
    console.log('Vehicle owner type:', typeof vehicle.owner);
    console.log('Vehicle owner ID:', vehicle.owner?._id || vehicle.owner, 'Type:', typeof (vehicle.owner?._id || vehicle.owner));
    console.log('Current user:', user);
    console.log('Current user ID:', userId, 'Type:', typeof userId);
    console.log('Is owner:', isOwner);
    console.log('User role:', user.role);
    console.log('================================');
    
    // Allow editing if user is admin, staff, or the actual owner
    return user.role === 'admin' || user.role === 'staff' || isOwner;
  };
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);
  
  const fetchVehicle = async () => {
    try {
      setLoading(true);
      console.log('Fetching vehicle with ID:', vehicleId);
      const response = await tripService.vehicleService.getVehicleById(vehicleId);
      console.log('Vehicle API response:', response); // Debug log
      console.log('Response success:', response.success, typeof response.success);
      console.log('Response data:', response.data);
      
      if (response.success === true || response.success === 'success') {
        console.log('Setting vehicle data:', response.data);
        setVehicle(response.data); // Fixed: data contains the vehicle directly
      } else {
        console.log('Response success check failed:', response.success, typeof response.success);
        setError('Failed to load vehicle details');
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      console.error('Error details:', error.response?.data);
      setError('Failed to load vehicle details');
      toast.error('Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${vehicle.name}"? This action cannot be undone.`)) {
      try {
        await tripService.vehicleService.deleteVehicle(vehicleId);
        toast.success('Vehicle deleted successfully!');
        navigate(getDashboardPath());
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast.error('Failed to delete vehicle');
      }
    }
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      suspended: { color: 'bg-red-100 text-red-800', icon: XCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      maintenance: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  const formatPrice = (price, currency = 'LKR') => {
    if (price === undefined || price === null) {
      return `${currency} 0`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading vehicle</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'Vehicle not found'}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate(getDashboardPath())}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {user?.role === 'driver' || user?.role === 'vehicle_owner' ? 'Back to Dashboard' : 'Back to Vehicles'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(getDashboardPath())}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {user?.role === 'driver' || user?.role === 'vehicle_owner' ? 'Back to Dashboard' : 'Back to Vehicles'}
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
              <p className="mt-2 text-gray-600">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </p>
              <div className="mt-2">
                {getStatusBadge(vehicle.status)}
              </div>
            </div>
            
            <div className="flex space-x-3">
              {canEditVehicle() ? (
                <>
                  <button
                    onClick={() => {
                      if (user.role === 'admin' || user.role === 'staff') {
                        navigate(`/admin/vehicles/${vehicleId}/edit`);
                      } else if (user.role === 'driver') {
                        navigate(`/driver/vehicles/${vehicleId}/edit`);
                      } else if (user.role === 'vehicle_owner') {
                        navigate(`/vehicle-owner/vehicles/${vehicleId}/edit`);
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Vehicle
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Vehicle
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate(`/booking?vehicle=${vehicleId}`)}
                  className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Images</h2>
              
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`${vehicle.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No images uploaded</h3>
                  <p className="mt-1 text-sm text-gray-500">Add images to showcase your vehicle</p>
                </div>
              )}
            </div>
            
            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600">{vehicle.description}</p>
              </div>
            )}
            
            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              
              {vehicle.features ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(vehicle.features).map(([feature, available]) => (
                    <div key={feature} className="flex items-center">
                      {available ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                      )}
                      <span className={`text-sm capitalize ${
                        available ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No amenities information available</p>
              )}
            </div>
            
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Car className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Type</p>
                    <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Capacity</p>
                    <p className="text-sm text-gray-600">
                      {vehicle.capacity?.passengers || 0} passengers
                      {vehicle.capacity?.luggage > 0 && `, ${vehicle.capacity.luggage} luggage`}
                    </p>
                  </div>
                </div>
                
                {vehicle.color && (
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-400 rounded mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Color</p>
                      <p className="text-sm text-gray-600">{vehicle.color}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <div className="h-4 w-4 text-gray-400 mr-3">📋</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">License Plate</p>
                    <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base Price</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(vehicle.pricing?.basePrice, vehicle.pricing?.currency)}
                  </span>
                </div>
                
                {vehicle.pricing?.perKmRate > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Per KM</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(vehicle.pricing?.perKmRate, vehicle.pricing?.currency)}
                    </span>
                  </div>
                )}
                
                {vehicle.pricing?.hourlyRate > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hourly</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(vehicle.pricing?.hourlyRate, vehicle.pricing?.currency)}
                    </span>
                  </div>
                )}
                
                {vehicle.pricing?.dailyRate > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Daily</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(vehicle.pricing?.dailyRate, vehicle.pricing?.currency)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Working Hours</p>
                    <p className="text-sm text-gray-600">
                      {vehicle.availability?.workingHours?.start || 'N/A'} - {vehicle.availability?.workingHours?.end || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Working Days</p>
                    <p className="text-sm text-gray-600">
                      {vehicle.availability?.workingDays?.map(day => 
                        day.charAt(0).toUpperCase() + day.slice(1)
                      ).join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Minimum Notice</p>
                    <p className="text-sm text-gray-600">
                      {vehicle.availability?.minimumBookingNotice || 0} hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Trips</span>
                  <span className="text-sm font-medium text-gray-900">
                    {vehicle.stats?.totalTrips || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Earnings</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(vehicle.stats?.totalEarnings || 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {vehicle.stats?.averageRating || 0}/5
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="text-sm font-medium text-gray-900">
                    {vehicle.reviewCount || 0}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Approval Details */}
            {vehicle.approvalDetails && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Details</h3>
                
                <div className="space-y-3">
                  {vehicle.approvalDetails.approvedAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Approved On</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(vehicle.approvalDetails.approvedAt)}
                      </p>
                    </div>
                  )}
                  
                  {vehicle.approvalDetails.rejectionReason && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Rejection Reason</p>
                      <p className="text-sm text-gray-600">
                        {vehicle.approvalDetails.rejectionReason}
                      </p>
                    </div>
                  )}
                  
                  {vehicle.approvalDetails.adminNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Admin Notes</p>
                      <p className="text-sm text-gray-600">
                        {vehicle.approvalDetails.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
