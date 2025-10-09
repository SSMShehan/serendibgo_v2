const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
const getAllVehicles = async (req, res) => {
  try {
    const { 
      city, 
      vehicleType, 
      minCapacity, 
      maxPrice, 
      features,
      page = 1, 
      limit = 10,
      sortBy = 'ratings.overall',
      sortOrder = 'desc'
    } = req.query;

    const query = { status: 'available', isActive: true };

    // Apply filters
    if (city) {
      query['location.city'] = city;
    }

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    if (minCapacity) {
      query['capacity.passengers'] = { $gte: parseInt(minCapacity) };
    }

    if (maxPrice) {
      query['pricing.dailyRate'] = { $lte: parseInt(maxPrice) };
    }

    if (features) {
      const featureArray = Array.isArray(features) ? features : [features];
      featureArray.forEach(feature => {
        query[`features.${feature}`] = true;
      });
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const vehicles = await Vehicle.find(query)
      .populate('driver', 'firstName lastName email phone profile.driverLicense')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Vehicle.countDocuments(query);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('driver', 'firstName lastName email phone profile.driverLicense profile.vehicleTypes');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });

  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle',
      error: error.message
    });
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private (Driver/Staff/Admin)
const createVehicle = async (req, res) => {
  try {
    const {
      vehicleType,
      make,
      model,
      year,
      licensePlate,
      capacity,
      features,
      pricing,
      driver,
      location,
      images,
      insurance,
      registration,
      description,
      notes
    } = req.body;

    // Check if driver exists and has driver role
    const driverUser = await User.findById(driver);
    if (!driverUser || driverUser.role !== 'driver') {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver. Driver must exist and have driver role.'
      });
    }

    const vehicle = new Vehicle({
      vehicleType,
      make,
      model,
      year,
      licensePlate,
      capacity,
      features,
      pricing,
      driver,
      location,
      images,
      insurance,
      registration,
      description,
      notes
    });

    await vehicle.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle
    });

  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating vehicle',
      error: error.message
    });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Driver/Staff/Admin)
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user can update this vehicle
    const canUpdate = req.user.role === 'staff' || 
                     req.user.role === 'admin' || 
                     vehicle.driver.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('driver', 'firstName lastName email phone');

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle
    });

  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle',
      error: error.message
    });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Driver/Staff/Admin)
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user can delete this vehicle
    const canDelete = req.user.role === 'staff' || 
                     req.user.role === 'admin' || 
                     vehicle.driver.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
};

// @desc    Get vehicles by driver
// @route   GET /api/vehicles/driver/:driverId
// @access  Private
const getVehiclesByDriver = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ driver: req.params.driverId })
      .populate('driver', 'firstName lastName email phone');

    res.json({
      success: true,
      data: vehicles
    });

  } catch (error) {
    console.error('Error fetching driver vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching driver vehicles',
      error: error.message
    });
  }
};

// @desc    Check vehicle availability
// @route   POST /api/vehicles/:id/check-availability
// @access  Public
const checkVehicleAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    const isAvailable = vehicle.isAvailable(startDate, endDate);

    res.json({
      success: true,
      data: {
        available: isAvailable,
        vehicle: {
          id: vehicle._id,
          vehicleType: vehicle.vehicleType,
          make: vehicle.make,
          model: vehicle.model,
          capacity: vehicle.capacity,
          pricing: vehicle.pricing
        }
      }
    });

  } catch (error) {
    console.error('Error checking vehicle availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking vehicle availability',
      error: error.message
    });
  }
};

// @desc    Get vehicles near location
// @route   GET /api/vehicles/near/:lat/:lng
// @access  Public
const getVehiclesNearLocation = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50 } = req.params; // maxDistance in km

    const vehicles = await Vehicle.find({
      status: 'available',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(maxDistance) * 1000 // Convert km to meters
        }
      }
    })
    .populate('driver', 'firstName lastName email phone')
    .limit(20);

    res.json({
      success: true,
      data: vehicles
    });

  } catch (error) {
    console.error('Error fetching vehicles near location:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles near location',
      error: error.message
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByDriver,
  checkVehicleAvailability,
  getVehiclesNearLocation
};
