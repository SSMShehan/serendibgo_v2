// Staff Trip Management Controller
const asyncHandler = require('express-async-handler');
const Tour = require('../../models/Tour');
const Booking = require('../../models/Booking');
const User = require('../../models/User');

// @desc    Get all trips with filtering and pagination
// @route   GET /api/staff/trips
// @access  Private (Staff)
const getTrips = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category = 'all',
      location = 'all',
      difficulty = 'all',
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category !== 'all') {
      filter.category = category;
    }
    
    if (location !== 'all') {
      filter['location.name'] = { $regex: location, $options: 'i' };
    }
    
    if (difficulty !== 'all') {
      filter.difficulty = difficulty;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get trips with pagination
    const trips = await Tour.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('guide', 'firstName lastName email phone')
      .populate('bookings', 'status createdAt');

    // Get total count for pagination
    const total = await Tour.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        trips,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching trips'
    });
  }
});

// @desc    Get trip statistics
// @route   GET /api/staff/trips/statistics
// @access  Private (Staff)
const getTripStatistics = asyncHandler(async (req, res) => {
  try {
    const [
      totalTrips,
      activeTrips,
      draftTrips,
      inactiveTrips,
      totalBookings,
      totalRevenue
    ] = await Promise.all([
      // Total trips
      Tour.countDocuments(),
      
      // Active trips
      Tour.countDocuments({ status: 'active' }),
      
      // Draft trips
      Tour.countDocuments({ status: 'draft' }),
      
      // Inactive trips
      Tour.countDocuments({ status: 'inactive' }),
      
      // Total bookings
      Booking.countDocuments(),
      
      // Total revenue (sum of all booking amounts)
      Booking.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalTrips,
        active: activeTrips,
        draft: draftTrips,
        inactive: inactiveTrips,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get trip statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching trip statistics'
    });
  }
});

// @desc    Create new trip
// @route   POST /api/staff/trips
// @access  Private (Staff)
const createTrip = asyncHandler(async (req, res) => {
  try {
    // Handle multiple locations - use the first location as primary for backward compatibility
    let tripData = { ...req.body };
    
    if (tripData.locations && Array.isArray(tripData.locations) && tripData.locations.length > 0) {
      // Use the first location as the primary location for the Tour model
      tripData.location = tripData.locations[0];
      
      // Store all locations in a custom field if needed
      tripData.allLocations = tripData.locations;
    }

    tripData.isActive = true; // Set as active by default for staff-created trips
    tripData.isFeatured = req.body.isFeatured || false;

    const trip = await Tour.create(tripData);

    res.status(201).json({
      success: true,
      data: trip,
      message: 'Trip created successfully'
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating trip',
      error: error.message
    });
  }
});

// @desc    Update trip
// @route   PUT /api/staff/trips/:id
// @access  Private (Staff)
const updateTrip = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const trip = await Tour.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('guide', 'firstName lastName email phone');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trip,
      message: 'Trip updated successfully'
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating trip'
    });
  }
});

// @desc    Delete trip
// @route   DELETE /api/staff/trips/:id
// @access  Private (Staff)
const deleteTrip = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Check if trip has active bookings
    const activeBookings = await Booking.countDocuments({
      tour: id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete trip with active bookings'
      });
    }

    const trip = await Tour.findByIdAndDelete(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting trip'
    });
  }
});

// @desc    Bulk trip actions
// @route   POST /api/staff/trips/bulk-action
// @access  Private (Staff)
const bulkTripAction = asyncHandler(async (req, res) => {
  try {
    const { tripIds, action } = req.body;

    if (!tripIds || !Array.isArray(tripIds) || tripIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Trip IDs are required'
      });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'activate':
        updateData = { status: 'active' };
        message = 'Trips activated successfully';
        break;
      case 'deactivate':
        updateData = { status: 'inactive' };
        message = 'Trips deactivated successfully';
        break;
      case 'delete':
        // Check for active bookings before deletion
        const activeBookings = await Booking.countDocuments({
          tour: { $in: tripIds },
          status: { $in: ['pending', 'confirmed'] }
        });

        if (activeBookings > 0) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete trips with active bookings'
          });
        }

        await Tour.deleteMany({ _id: { $in: tripIds } });
        return res.status(200).json({
          success: true,
          message: 'Trips deleted successfully'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    const result = await Tour.updateMany(
      { _id: { $in: tripIds } },
      updateData
    );

    res.status(200).json({
      success: true,
      data: { modifiedCount: result.modifiedCount },
      message
    });
  } catch (error) {
    console.error('Bulk trip action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error performing bulk action'
    });
  }
});

module.exports = {
  getTrips,
  getTripStatistics,
  createTrip,
  updateTrip,
  deleteTrip,
  bulkTripAction
};
