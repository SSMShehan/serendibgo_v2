// Staff Vehicle Management Controller
const asyncHandler = require('express-async-handler');
const User = require('../../models/User');
const Vehicle = require('../../models/Vehicle');
const Booking = require('../../models/Booking');

// @desc    Get all vehicles with filtering and pagination
// @route   GET /api/staff/vehicles
// @access  Private (Staff)
const getVehicles = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all',
      type = 'all',
      location = 'all',
      fuelType = 'all',
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { role: 'driver' };
    
    if (status !== 'all') {
      switch (status) {
        case 'active':
          filter.isActive = true;
          filter.isVerified = true;
          break;
        case 'inactive':
          filter.isActive = false;
          break;
        case 'pending':
          filter.isVerified = false;
          break;
        case 'maintenance':
          filter['profile.status'] = 'maintenance';
          break;
        case 'suspended':
          filter.isActive = false;
          filter.isVerified = true;
          break;
      }
    }
    
    if (type !== 'all') {
      filter['profile.vehicleType'] = type;
    }
    
    if (location !== 'all') {
      filter['profile.location'] = { $regex: location, $options: 'i' };
    }
    
    if (fuelType !== 'all') {
      filter['profile.fuelType'] = fuelType;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.vehicleModel': { $regex: search, $options: 'i' } },
        { 'profile.vehicleType': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get vehicles with pagination
    const vehicles = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');

    // Transform vehicles data for frontend
    const transformedVehicles = vehicles.map(vehicle => ({
      _id: vehicle._id,
      name: `${vehicle.profile?.vehicleModel || 'Vehicle'} - ${vehicle.firstName} ${vehicle.lastName}`,
      type: vehicle.profile?.vehicleType || 'unknown',
      capacity: vehicle.profile?.vehicleCapacity || 0,
      fuelType: vehicle.profile?.fuelType || 'unknown',
      pricePerDay: vehicle.profile?.pricePerDay || 0,
      location: vehicle.profile?.location || 'Not specified',
      description: vehicle.profile?.vehicleDescription || 'No description available',
      features: vehicle.profile?.vehicleFeatures || [],
      images: vehicle.profile?.vehicleImages || [],
      status: vehicle.profile?.status || (vehicle.isActive ? 'active' : 'inactive'),
      ownerName: `${vehicle.firstName} ${vehicle.lastName}`,
      ownerPhone: vehicle.phone,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    }));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        vehicles: transformedVehicles,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching vehicles'
    });
  }
});

// @desc    Get vehicle statistics
// @route   GET /api/staff/vehicles/statistics
// @access  Private (Staff)
const getVehicleStatistics = asyncHandler(async (req, res) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      pendingVehicles,
      maintenanceVehicles,
      totalBookings
    ] = await Promise.all([
      // Total vehicles
      User.countDocuments({ role: 'driver' }),
      
      // Active vehicles
      User.countDocuments({ role: 'driver', isActive: true, isVerified: true }),
      
      // Pending vehicles
      User.countDocuments({ role: 'driver', isVerified: false }),
      
      // Maintenance vehicles
      User.countDocuments({ role: 'driver', 'profile.status': 'maintenance' }),
      
      // Total vehicle bookings
      Booking.countDocuments({ type: 'vehicle' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalVehicles,
        active: activeVehicles,
        pending: pendingVehicles,
        maintenance: maintenanceVehicles,
        totalBookings
      }
    });
  } catch (error) {
    console.error('Get vehicle statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching vehicle statistics'
    });
  }
});

// @desc    Delete vehicle
// @route   DELETE /api/staff/vehicles/:id
// @access  Private (Staff)
const deleteVehicle = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle has active bookings
    const activeBookings = await Booking.countDocuments({
      vehicle: id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle with active bookings'
      });
    }

    const vehicle = await User.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting vehicle'
    });
  }
});

// @desc    Bulk vehicle actions
// @route   POST /api/staff/vehicles/bulk-action
// @access  Private (Staff)
const bulkVehicleAction = asyncHandler(async (req, res) => {
  try {
    const { vehicleIds, action } = req.body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle IDs are required'
      });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'activate':
        updateData = { isActive: true, isVerified: true };
        message = 'Vehicles activated successfully';
        break;
      case 'deactivate':
        updateData = { isActive: false };
        message = 'Vehicles deactivated successfully';
        break;
      case 'maintenance':
        updateData = { 'profile.status': 'maintenance' };
        message = 'Vehicles marked for maintenance successfully';
        break;
      case 'approve':
        updateData = { isVerified: true, isActive: true };
        message = 'Vehicles approved successfully';
        break;
      case 'reject':
        updateData = { isVerified: false, isActive: false };
        message = 'Vehicles rejected successfully';
        break;
      case 'delete':
        // Check for active bookings before deletion
        const activeBookings = await Booking.countDocuments({
          vehicle: { $in: vehicleIds },
          status: { $in: ['pending', 'confirmed'] }
        });

        if (activeBookings > 0) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete vehicles with active bookings'
          });
        }

        await User.deleteMany({ _id: { $in: vehicleIds } });
        
        return res.status(200).json({
          success: true,
          message: 'Vehicles deleted successfully'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    const result = await User.updateMany(
      { _id: { $in: vehicleIds } },
      updateData
    );

    res.status(200).json({
      success: true,
      data: { modifiedCount: result.modifiedCount },
      message
    });
  } catch (error) {
    console.error('Bulk vehicle action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error performing bulk action'
    });
  }
});

// @desc    Update vehicle status (approve/reject/suspend)
// @route   PUT /api/staff/vehicles/:id/status
// @access  Private (Staff)
const updateVehicleStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    // Check if user has permission to approve vehicles
    if (!req.user.profile?.permissions?.includes('vehicles:approve')) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions. Required: vehicles:approve'
      });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    let updateData = {};

    switch (action) {
      case 'approve':
        updateData = {
          status: 'approved',
          isAvailable: true,
          approvedAt: new Date(),
          approvedBy: req.user._id
        };
        break;
      case 'reject':
        updateData = {
          status: 'rejected',
          isAvailable: false,
          rejectionReason: reason,
          rejectedAt: new Date(),
          rejectedBy: req.user._id
        };
        break;
      case 'suspend':
        updateData = {
          status: 'inactive',
          isAvailable: false,
          suspensionReason: reason,
          suspendedAt: new Date(),
          suspendedBy: req.user._id
        };
        break;
      case 'activate':
        updateData = {
          status: 'approved',
          isAvailable: true,
          suspensionReason: null,
          suspendedAt: null,
          suspendedBy: null
        };
        break;
      case 'maintenance':
        updateData = {
          status: 'inactive',
          isAvailable: false,
          maintenanceReason: reason,
          maintenanceStartedAt: new Date(),
          maintenanceStartedBy: req.user._id
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email');

    res.json({
      success: true,
      message: `Vehicle ${action}d successfully`,
      data: {
        vehicle: updatedVehicle
      }
    });
  } catch (error) {
    console.error('Update vehicle status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating vehicle status'
    });
  }
});

module.exports = {
  getVehicles,
  getVehicleStatistics,
  deleteVehicle,
  bulkVehicleAction,
  updateVehicleStatus
};
