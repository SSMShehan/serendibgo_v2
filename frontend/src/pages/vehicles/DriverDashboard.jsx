import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import tripService from '../../services/vehicles/tripService';
import {
  User,
  Car,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Settings,
  Eye,
  Navigation,
  Phone,
  Mail,
  BarChart3,
  Activity as ActivityIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const DriverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const hasFetched = useRef(false);
  
  useEffect(() => {
    if (!hasFetched.current && user?.id) {
      fetchDriverData();
    }
  }, [user?.id]);
  
  const fetchDriverData = async () => {
    try {
      if (hasFetched.current) return;
      hasFetched.current = true;
      setLoading(true);
      
      // Fetch driver profile
      console.log('Fetching driver profile for user ID:', user.id);
      const driverData = await tripService.driverService.getDriverByUserId(user.id);
      console.log('Driver profile response:', driverData);
      if (driverData.status === 'success') {
        setDriver(driverData.data.driver);
        
        // Fetch driver trips using the driver ID
        try {
          const tripsData = await tripService.driverService.getDriverTrips(driverData.data.driver._id);
          if (tripsData.status === 'success') {
            setTrips(tripsData.data.trips || []);
          }
        } catch (tripsError) {
          console.warn('No trips found for driver:', tripsError);
          setTrips([]);
        }
        
        // Also fetch vehicle bookings for this driver's vehicles
        try {
          const vehicleBookingsResponse = await fetch('/api/vehicle-bookings/my-bookings', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (vehicleBookingsResponse.ok) {
            const vehicleBookingsData = await vehicleBookingsResponse.json();
            console.log('Vehicle bookings for driver:', vehicleBookingsData);
            
            if (vehicleBookingsData.status === 'success') {
              // Convert vehicle bookings to trip format for display
              const vehicleTrips = vehicleBookingsData.data.bookings.map(booking => ({
                _id: booking._id,
                tripReference: booking.bookingReference,
                status: booking.bookingStatus,
                scheduledStartTime: booking.tripDetails.startDate,
                pickupLocation: booking.tripDetails.pickupLocation,
                dropoffLocation: booking.tripDetails.dropoffLocation,
                fare: booking.pricing?.totalPrice || 0,
                customer: {
                  name: `${booking.guestDetails.firstName} ${booking.guestDetails.lastName}`,
                  phone: booking.guestDetails.phone
                },
                vehicle: booking.vehicle,
                completedAt: booking.bookingStatus === 'completed' ? booking.updatedAt : null
              }));
              
              // Merge with existing trips, avoiding duplicates
              setTrips(prevTrips => {
                const allTrips = [...prevTrips, ...vehicleTrips];
                // Remove duplicates based on _id
                const uniqueTrips = allTrips.filter((trip, index, self) => 
                  index === self.findIndex(t => t._id === trip._id)
                );
                return uniqueTrips;
              });
            }
          }
        } catch (vehicleBookingsError) {
          console.warn('No vehicle bookings found for driver:', vehicleBookingsError);
        }
        
        // Fetch driver vehicles only if driver profile exists
        if (driverData.data.driver && driverData.data.driver._id) {
          console.log('Fetching vehicles for user ID:', user.id); // Use user ID instead of driver ID
          console.log('Current user ID:', user.id);
          try {
            const vehiclesData = await tripService.vehicleService.getDriverVehicles(user.id);
            console.log('Vehicles API response:', vehiclesData);
            if (vehiclesData.status === 'success') {
              console.log('Vehicles found:', vehiclesData.data.vehicles);
              setVehicles(vehiclesData.data.vehicles || []);
            } else if (vehiclesData.status === 'error' && vehiclesData.message.includes('Access denied')) {
              // User doesn't have driver role yet
              console.log('Access denied for vehicles');
              setVehicles([]);
            }
          } catch (vehiclesError) {
            // Only log unexpected errors (not 403s which are expected when no driver profile)
            console.error('Vehicles fetch error:', vehiclesError);
            if (vehiclesError.response?.status !== 403) {
              console.warn('No vehicles found for driver:', vehiclesError);
            }
            setVehicles([]);
          }
        } else {
          console.log('No driver profile found, skipping vehicle fetch');
          setVehicles([]);
        }
        
        // Fetch driver stats
        try {
          const statsData = await tripService.driverService.getDriverStats({ driverId: driverData.data.driver._id });
          if (statsData.status === 'success') {
            setStats(statsData.data);
          }
        } catch (statsError) {
          console.warn('No stats found for driver:', statsError);
          setStats({
            totalTrips: 0,
            completedTrips: 0,
            cancelledTrips: 0,
            averageRating: 0,
            totalEarnings: 0
          });
        }
      } else if (driverData.status === 'error' && driverData.data?.needsRegistration) {
        // Driver profile not found - user needs to register
        setDriver(null);
        setTrips([]);
        setVehicles([]);
        setStats({
          totalTrips: 0,
          completedTrips: 0,
          cancelledTrips: 0,
          averageRating: 0,
          totalEarnings: 0
        });
      }
      
    } catch (error) {
      // Only log unexpected errors (not 404s which are handled by the service)
      if (!error.suppressConsoleError && error.response?.status !== 404) {
        console.error('Error fetching driver data:', error);
        toast.error('Failed to load driver data');
      }
      setDriver(null);
      setTrips([]);
      setVehicles([]);
      setStats({
        totalTrips: 0,
        completedTrips: 0,
        cancelledTrips: 0,
        averageRating: 0,
        totalEarnings: 0
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusUpdate = async (tripId, status) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        toast.success(`Trip status updated to ${status}!`);
        hasFetched.current = false;
        fetchDriverData();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };
  
  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setShowTripModal(true);
  };
  
  const closeTripModal = () => {
    setShowTripModal(false);
    setSelectedTrip(null);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <ActivityIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading driver dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Driver Profile Not Found</h2>
          <p className="text-gray-600 mb-4">You need to complete your driver registration first.</p>
          <button
            onClick={() => window.location.href = '/driver/register'}
            className="btn btn-primary"
          >
            Complete Registration
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {driver.user?.name || 'Driver'}!
                </h1>
                <p className="text-gray-600">
                  Driver ID: {driver.driverId}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  hasFetched.current = false;
                  fetchDriverData();
                }}
                className="btn btn-outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrips || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTrips || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings || 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {driver.performance?.averageRating ? driver.performance.averageRating.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'trips', name: 'My Trips', icon: Car },
                { id: 'vehicles', name: 'My Vehicles', icon: Car },
                { id: 'earnings', name: 'Earnings', icon: DollarSign },
                { id: 'profile', name: 'Profile', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Vehicle Management Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Car className="w-5 h-5 mr-2 text-blue-600" />
                      Vehicle Management
                    </h3>
                    <a 
                      href="/driver/vehicle-registration"
                      className="btn btn-primary btn-sm"
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Add Vehicle
                    </a>
                  </div>
                  
                  {vehicles.length > 0 ? (
                    <div className="space-y-4">
                      {vehicles.map((vehicle) => (
                        <div key={vehicle._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Car className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{vehicle.name}</h4>
                              <p className="text-sm text-gray-500">
                                {vehicle.make} {vehicle.model} • {vehicle.licensePlate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                              vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {vehicle.status}
                            </span>
                            <button 
                              onClick={() => {
                                console.log('Dashboard view button clicked for vehicle:', vehicle._id);
                                navigate(`/driver/vehicles/${vehicle._id}`);
                              }}
                              className="btn btn-ghost btn-sm"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Car className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles registered</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Register your vehicle to start accepting bookings and earning money.
                      </p>
                      <div className="mt-4">
                        <a 
                          href="/driver/vehicle-registration"
                          className="btn btn-primary"
                        >
                          <Car className="w-4 h-4 mr-2" />
                          Register Your Vehicle
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                
                {trips.slice(0, 5).map((trip) => (
                  <div key={trip._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{trip.tripReference}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(trip.scheduledStartTime)} • {trip.pickupLocation?.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {getStatusIcon(trip.status)}
                        <span className="ml-1">{trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}</span>
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(trip.fare || 0)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {trips.length === 0 && (
                  <div className="text-center py-8">
                    <Car className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No trips yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Your trip history will appear here.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'trips' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">My Trips</h3>
                  <div className="flex space-x-2">
                    <select className="select select-bordered select-sm">
                      <option value="">All Status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                {trips.map((trip) => (
                  <div key={trip._id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Car className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {trip.tripReference}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                                {getStatusIcon(trip.status)}
                                <span className="ml-1">{trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}</span>
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(trip.scheduledStartTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium">Pickup</div>
                              <div className="text-gray-500">{trip.pickupLocation?.address}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium">Drop-off</div>
                              <div className="text-gray-500">{trip.dropoffLocation?.address}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium">Fare</div>
                              <div className="text-gray-500">{formatCurrency(trip.fare || 0)}</div>
                            </div>
                          </div>
                        </div>
                        
                        {trip.customer && (
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-400" />
                              <span className="font-medium">{trip.customer.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{trip.customer.phone}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex flex-col items-end space-y-2">
                        <button
                          onClick={() => handleViewTrip(trip)}
                          className="btn btn-sm btn-outline"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Action Buttons */}
                        {trip.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(trip._id, 'in_progress')}
                            className="btn btn-sm btn-primary"
                          >
                            Start Trip
                          </button>
                        )}
                        
                        {trip.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate(trip._id, 'completed')}
                            className="btn btn-sm btn-success"
                          >
                            Complete Trip
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {trips.length === 0 && (
                  <div className="text-center py-12">
                    <Car className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No trips yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Your assigned trips will appear here.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'vehicles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">My Vehicles</h3>
                  <a 
                    href="/driver/vehicle-registration"
                    className="btn btn-primary btn-sm"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </a>
                </div>
                
                {vehicles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Car className="w-6 h-6 text-blue-600" />
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                            vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {vehicle.status}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{vehicle.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {vehicle.make} {vehicle.model} • {vehicle.year}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          License: {vehicle.licensePlate}
                        </p>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              console.log('View button clicked for vehicle:', vehicle._id);
                              navigate(`/driver/vehicles/${vehicle._id}`);
                            }}
                            className="btn btn-ghost btn-sm flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => {
                              console.log('Manage button clicked for vehicle:', vehicle._id);
                              navigate(`/driver/vehicles/${vehicle._id}/edit`);
                            }}
                            className="btn btn-ghost btn-sm flex-1"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles registered</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Register your vehicle to start accepting bookings and earning money.
                    </p>
                    <div className="mt-4">
                      <a 
                        href="/driver/vehicle-registration"
                        className="btn btn-primary"
                      >
                        <Car className="w-4 h-4 mr-2" />
                        Register Your Vehicle
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">This Month</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(stats.monthlyEarnings || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">This Week</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatCurrency(stats.weeklyEarnings || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Average per Trip</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {formatCurrency(stats.averageEarningsPerTrip || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Earnings</h4>
                  <div className="space-y-3">
                    {trips.filter(trip => trip.status === 'completed').slice(0, 5).map((trip) => (
                      <div key={trip._id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900">{trip.tripReference}</p>
                          <p className="text-sm text-gray-500">{formatDate(trip.completedAt || trip.scheduledStartTime)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(trip.fare || 0)}</p>
                          <p className="text-sm text-gray-500">Completed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Driver Profile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Driver ID</label>
                      <p className="text-gray-900">{driver.driverId}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                      <p className="text-gray-900">{driver.license?.licenseNumber}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Class</label>
                      <p className="text-gray-900">{driver.license?.licenseClass}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Areas</label>
                      <div className="space-y-1">
                        {driver.serviceAreas?.map((area, index) => (
                          <p key={index} className="text-gray-900">
                            {area.city}, {area.district} ({area.radius}km)
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Types</label>
                      <div className="space-y-1">
                        {driver.vehicleTypes?.map((vehicle, index) => (
                          <p key={index} className="text-gray-900">
                            {vehicle.vehicleType} ({vehicle.experience} years)
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Base Rate</label>
                      <p className="text-gray-900">{formatCurrency(driver.financial?.baseRate || 0)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      console.log('Edit Profile button clicked');
                      navigate('/profile');
                    }}
                    className="btn btn-primary"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trip Details Modal */}
      {showTripModal && selectedTrip && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Car className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Trip Details</h3>
                </div>
                <button
                  onClick={closeTripModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTrip.status)}`}>
                  {getStatusIcon(selectedTrip.status)}
                  <span className="ml-2">{selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}</span>
                </span>
              </div>

              {/* Trip Details Content */}
              <div className="space-y-4">
                {/* Trip Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Trip Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-gray-500" />
                        <span><strong>Trip ID:</strong> {selectedTrip.tripReference}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span><strong>Date:</strong> {formatDate(selectedTrip.scheduledStartTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span><strong>Fare:</strong> {formatCurrency(selectedTrip.fare || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Locations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">Pickup</div>
                          <div className="text-gray-500">{selectedTrip.pickupLocation?.address || 'Not specified'}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">Drop-off</div>
                          <div className="text-gray-500">{selectedTrip.dropoffLocation?.address || 'Not specified'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                {selectedTrip.customer && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span><strong>Name:</strong> {selectedTrip.customer.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span><strong>Phone:</strong> {selectedTrip.customer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vehicle Information */}
                {selectedTrip.vehicle && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Vehicle Information</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="space-y-2 text-sm text-green-800">
                        <div><strong>Vehicle:</strong> {selectedTrip.vehicle.name || `${selectedTrip.vehicle.make} ${selectedTrip.vehicle.model}`}</div>
                        <div><strong>Type:</strong> {selectedTrip.vehicle.vehicleType}</div>
                        <div><strong>License Plate:</strong> {selectedTrip.vehicle.licensePlate}</div>
                        {selectedTrip.vehicle.capacity && (
                          <div><strong>Capacity:</strong> {selectedTrip.vehicle.capacity.passengers || selectedTrip.vehicle.seatingCapacity} passengers</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {selectedTrip.specialRequests && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">{selectedTrip.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeTripModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                {selectedTrip.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      closeTripModal();
                      handleStatusUpdate(selectedTrip._id, 'in_progress');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Start Trip
                  </button>
                )}
                {selectedTrip.status === 'in_progress' && (
                  <button
                    onClick={() => {
                      closeTripModal();
                      handleStatusUpdate(selectedTrip._id, 'completed');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Complete Trip
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
