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

    // Build filter object for Vehicle model
    const filter = {};
    
    if (status !== 'all') {
      switch (status) {
        case 'active':
          filter.status = 'available';
          break;
        case 'inactive':
          filter.status = 'out-of-service';
          break;
        case 'pending':
          filter.status = 'pending';
          break;
        case 'needs-approval':
          filter['approvalDetails.needsApproval'] = true;
          break;
        case 'maintenance':
          filter.status = 'maintenance';
          break;
        case 'suspended':
          filter.status = 'out-of-service';
          break;
      }
    }
    
    if (type !== 'all') {
      filter.vehicleType = type;
    }
    
    if (location !== 'all') {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }
    
    if (fuelType !== 'all') {
      filter.fuelType = fuelType;
    }
    
    if (search) {
      filter.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { licensePlate: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get vehicles with pagination and populate owner
    const vehicles = await Vehicle.find(filter)
      .populate('owner', 'firstName lastName email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

        // Transform vehicles data for frontend
        const transformedVehicles = vehicles.map(vehicle => {
          console.log('Vehicle images in backend:', vehicle.images);
          return {
            _id: vehicle._id,
            name: vehicle.name || `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
            type: vehicle.vehicleType,
            capacity: vehicle.capacity?.passengers || 0,
            fuelType: vehicle.fuelType,
            pricePerDay: vehicle.pricing?.dailyRate || 0,
            location: vehicle.location?.city || 'Not specified',
            description: vehicle.description || 'No description available',
            features: vehicle.features || {},
            images: vehicle.images || [],
            status: vehicle.status,
            approvalDetails: vehicle.approvalDetails,
            ownerName: vehicle.owner ? `${vehicle.owner.firstName || ''} ${vehicle.owner.lastName || ''}`.trim() : 'Unknown',
            ownerEmail: vehicle.owner?.email || 'No email',
            ownerPhone: vehicle.owner?.phone || 'No phone',
            createdAt: vehicle.createdAt,
            updatedAt: vehicle.updatedAt
          };
        });

    // Get total count for pagination
    const total = await Vehicle.countDocuments(filter);

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
      Vehicle.countDocuments({}),
      
      // Active vehicles
      Vehicle.countDocuments({ status: 'available' }),
      
      // Pending vehicles
      Vehicle.countDocuments({ status: 'pending' }),
      
      // Maintenance vehicles
      Vehicle.countDocuments({ status: 'maintenance' }),
      
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
          status: 'available',
          'approvalDetails.approvedAt': new Date(),
          'approvalDetails.approvedBy': req.user._id,
          'approvalDetails.needsApproval': false
        };
        break;
      case 'reject':
        updateData = {
          status: 'out-of-service',
          'approvalDetails.rejectionReason': reason,
          'approvalDetails.rejectedAt': new Date(),
          'approvalDetails.rejectedBy': req.user._id,
          'approvalDetails.needsApproval': false
        };
        break;
      case 'suspend':
        updateData = {
          status: 'out-of-service',
          'approvalDetails.suspensionReason': reason,
          'approvalDetails.suspendedAt': new Date(),
          'approvalDetails.suspendedBy': req.user._id
        };
        break;
      case 'activate':
        updateData = {
          status: 'available',
          'approvalDetails.suspensionReason': null,
          'approvalDetails.suspendedAt': null,
          'approvalDetails.suspendedBy': null
        };
        break;
      case 'maintenance':
        updateData = {
          status: 'maintenance',
          'approvalDetails.maintenanceReason': reason,
          'approvalDetails.maintenanceStartedAt': new Date(),
          'approvalDetails.maintenanceStartedBy': req.user._id
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
