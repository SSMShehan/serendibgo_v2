const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create new tour booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    tour,
    guide,
    startDate,
    endDate,
    duration,
    groupSize,
    specialRequests
  } = req.body;

  // Validate required fields
  if (!tour || !guide || !startDate || !endDate || !groupSize) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: tour, guide, startDate, endDate, groupSize'
    });
  }

  // Validate tour exists
  const tourExists = await Tour.findById(tour);
  if (!tourExists) {
    return res.status(404).json({
      status: 'error',
      message: 'Tour not found'
    });
  }

  // Validate guide exists and is a guide
  const guideExists = await User.findById(guide);
  if (!guideExists || guideExists.role !== 'guide') {
    return res.status(404).json({
      status: 'error',
      message: 'Guide not found or invalid'
    });
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start >= end) {
    return res.status(400).json({
      status: 'error',
      message: 'End date must be after start date'
    });
  }

  if (start < new Date()) {
    return res.status(400).json({
      status: 'error',
      message: 'Start date cannot be in the past'
    });
  }

  // Validate group size
  if (groupSize < 1 || groupSize > 50) {
    return res.status(400).json({
      status: 'error',
      message: 'Group size must be between 1 and 50'
    });
  }

  // Check for conflicting bookings with the same guide
  const conflictingBooking = await Booking.findOne({
    guide,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        startDate: { $lte: end },
        endDate: { $gte: start }
      }
    ]
  });

  if (conflictingBooking) {
    return res.status(400).json({
      status: 'error',
      message: 'Guide is not available for the selected dates'
    });
  }

  // Calculate total amount
  const totalAmount = tourExists.price * groupSize;

  // Create booking
  const booking = await Booking.create({
    user: req.user.id,
    tour,
    guide,
    bookingDate: new Date(),
    startDate: start,
    endDate: end,
    duration: duration || tourExists.duration,
    groupSize,
    totalAmount,
    specialRequests,
    status: 'pending',
    paymentStatus: 'pending'
  });

  // Populate references
  await booking.populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'tour', select: 'title duration price location' },
    { path: 'guide', select: 'firstName lastName email phone' }
  ]);

  res.status(201).json({
    status: 'success',
    message: 'Booking created successfully',
    data: {
      booking
    }
  });
});

// @desc    Get all bookings for user
// @route   GET /api/bookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { user: req.user.id };
  
  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get bookings with pagination
  const bookings = await Booking.find(query)
    .populate([
      { path: 'tour', select: 'title duration price location images' },
      { path: 'guide', select: 'firstName lastName email phone avatar' }
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Booking.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate([
      { path: 'user', select: 'firstName lastName email phone' },
      { path: 'tour', select: 'title description duration price location images' },
      { path: 'guide', select: 'firstName lastName email phone avatar' }
    ]);

  if (!booking) {
    return res.status(404).json({
      status: 'error',
      message: 'Booking not found'
    });
  }

  // Check if user can access this booking
  const isOwner = booking.user._id.toString() === req.user.id;
  const isGuide = booking.guide._id.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isGuide && !isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to view this booking'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus, cancellationReason } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      status: 'error',
      message: 'Booking not found'
    });
  }

  // Check authorization
  const isOwner = booking.user.toString() === req.user.id;
  const isGuide = booking.guide.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isGuide && !isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to update this booking'
    });
  }

  // Update booking
  const updateData = {};
  
  if (status) {
    updateData.status = status;
  }
  
  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus;
  }

  if (cancellationReason) {
    updateData.cancellationReason = cancellationReason;
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'tour', select: 'title duration price location' },
    { path: 'guide', select: 'firstName lastName email phone' }
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Booking status updated successfully',
    data: {
      booking: updatedBooking
    }
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const { cancellationReason, refundAmount } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      status: 'error',
      message: 'Booking not found'
    });
  }

  // Check if user can cancel this booking
  const isOwner = booking.user.toString() === req.user.id;
  const isGuide = booking.guide.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isGuide && !isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to cancel this booking'
    });
  }

  // Check if booking can be cancelled (at least 24 hours before start)
  const now = new Date();
  const startDate = new Date(booking.startDate);
  const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);

  if (hoursUntilStart < 24) {
    return res.status(400).json({
      status: 'error',
      message: 'Booking cannot be cancelled. Less than 24 hours until start date.'
    });
  }

  // Update booking
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      status: 'cancelled',
      cancellationReason,
      refundAmount: refundAmount || 0
    },
    { new: true, runValidators: true }
  ).populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'tour', select: 'title duration price location' },
    { path: 'guide', select: 'firstName lastName email phone' }
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Booking cancelled successfully',
    data: {
      booking: updatedBooking
    }
  });
});

// @desc    Get guide bookings
// @route   GET /api/bookings/guide
// @access  Private (Guide)
const getGuideBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { guide: req.user.id };
  
  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get bookings with pagination
  const bookings = await Booking.find(query)
    .populate([
      { path: 'user', select: 'firstName lastName email phone' },
      { path: 'tour', select: 'title duration price location images' }
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Booking.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getGuideBookings
};


